/* LEGION analytics 백엔드 — Cloudflare Worker (출시후 측정)
   역할: 미니앱 logEvent → POST /ev 수신 → KV 저장. 오라클(CDO)이 GET /stats로 집계 조회.
   설계: Trinity(CPO) · 계측 배선(game.js logEvent): Morpheus(COO) · 분석: Oracle(CDO)
   ⚠️ fire-and-forget — 실패해도 게임 영향 0. 익명 anonId(개인정보 X).
   배포: KV namespace(EVENTS) 바인딩. BOT_TOKEN 불필요.
   Oracle(CDO) 확장: AARRR full + K virality proxy + ch5/share. 2026-06-20.
   Project 2 (Phase 2: gear/items/prestige) 확장: Phase2 이벤트 + A/B + D7/conv/virality impact proxy. Oracle(CDO) 2026-06-20. */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json", ...CORS } });

// MVP 6종 이벤트 화이트리스트 (오라클 스키마와 일치)
const ALLOWED = new Set([
  "install", "battle_win", "gacha_pull", "ascend", "purchase", "growth_moment",
  // Oracle expansion for AARRR + virality + activation (fire-and-forget, MVP)
  "session_start", "app_open", "signup", "ch5_reached", "share_clicked",
  "daily_return", "push_click", "invite_converted", "referral_bonus_granted",
  // Project 2 (Phase 2 gear/items/prestige) + A/B support — Oracle(CDO)
  "gear_obtained", "gear_equipped", "gear_enhanced", "set_activated",
  "phase2_unlock", "prestige_trigger", "ab_test",
  // age gate (미성년 보호 funnel — COPPA 증적) — Oracle(CDO)
  "age_confirmed", "age_blocked",
  // Trinity P0 activation + funnel — game.js 실제 emit과 일치 (2026-07-02 Morpheus)
  "core_loop_complete", "tutorial_start", "tutorial_done",
  "stuck_upsell", "first_purchase_2x", "purchase_unverified",
  // Oracle(CDO) 2026-07-01: 결제 퍼널 관측 + 활성화 1회성 + North Star 교집합 배선
  //   shop_view=상점열람 / checkout_open=buyPack클릭(구매의도) / invoice_paid·invoice_cancelled=openInvoice 콜백 결과
  //   first_core_loop·first_gacha=신규 1회성(activation) — daily_return·invite_converted 슬롯은 기존 라인에 이미 존재
  "shop_view", "checkout_open", "invoice_paid", "invoice_cancelled",
  "first_core_loop", "first_gacha", "free_ticket_used", "share_card_generated", "share_card_sent"
]);
const dayKey = (ts) => new Date(ts).toISOString().slice(0, 10);   // YYYY-MM-DD (UTC 일관 — game.js와 동일)

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(req.url);

    // ① 이벤트 수신 — game.js logEvent가 POST
    if (req.method === "POST" && (url.pathname === "/ev" || url.pathname === "/event")) {
      if (!env.EVENTS) return json({ ok: false, reason: "kv-not-set" });   // graceful
      let b = {}; try { b = await req.json(); } catch (e) {}
      const type = b.type || b.n, anon = (b.anonId || b.a || "anon").slice(0, 40), ts = b.ts || 0;
      if (!ALLOWED.has(type) || !ts) return json({ ok: false, reason: "bad-event" });
      // ⚠️ fire-and-forget: KV 쓰기 실패해도 절대 500 금지(게임 영향0). 예외는 잡아 진단 노출.
      try {
        // 일별 카운트 집계 (KV는 단순 카운터 — D1로 승급 가능). 키: cnt:YYYY-MM-DD:type
        const day = dayKey(ts), ck = "cnt:" + day + ":" + type;
        const cur = parseInt((await env.EVENTS.get(ck)) || "0", 10);
        await env.EVENTS.put(ck, String(cur + 1), { expirationTtl: 60 * 86400 });   // 60일 보존
        // DAU 근사: 일별 유니크 anonId 마킹 (set 키). 키: dau:YYYY-MM-DD:anon
        await env.EVENTS.put("dau:" + day + ":" + anon, "1", { expirationTtl: 14 * 86400 });
        // 리텐션 + North Star 교집합: 유저별 레코드. 키: u:anon → {first,last,eng,pay,fc,fg,streak,ch}
        //  ⚠️ 설계결정(Oracle): 새 usr: prefix 대신 기존 u: 레코드를 확장 — /cohort·/export·listUsers가 즉시 join.
        //  eng=engaged(코어루프 완주 경험), pay=payer(결제 경험) → 이 둘의 교집합이 North Star(D7 Engaged-Payer).
        const uk = "u:" + anon; let u = {}; try { u = JSON.parse((await env.EVENTS.get(uk)) || "{}"); } catch (e) {}
        if (!u.first) u.first = day; u.last = day;
        // engaged 플래그: 코어루프 완주(반복 포함) 또는 첫 완주 또는 전투승
        if (type === "core_loop_complete" || type === "first_core_loop" || type === "battle_win") u.eng = 1;
        // payer 플래그: 결제 확정(지급) / 인보이스 결제콜백 / 첫결제2배
        if (type === "purchase" || type === "invoice_paid" || type === "first_purchase_2x") u.pay = 1;
        // activation 1회성 최초일(신규 유저 첫 코어루프·첫 가챠 도달일)
        if (type === "first_core_loop" && !u.fc) u.fc = day;
        if (type === "first_gacha" && !u.fg) u.fg = day;
        // 복귀 스트릭(daily_return.d.streak 최대치 보존) — 리텐션 훅 강도
        if (type === "daily_return") { const s = (b.d && +b.d.streak) || 0; if (s > (u.streak || 0)) u.streak = s; }
        // 획득채널 최초 1회 고정(install.d.channel) — CMO 채널 ROI 슬라이싱
        if (type === "install" && !u.ch) u.ch = String((b.d && b.d.channel) || "direct").slice(0, 20);
        await env.EVENTS.put(uk, JSON.stringify(u), { expirationTtl: 45 * 86400 });   // D30 코호트 성숙 대비 45일
        // 채널별 install 일별 집계. 키: chan:YYYY-MM-DD:channel
        if (type === "install") {
          const ch = String((b.d && b.d.channel) || "direct").slice(0, 20);
          const chk = "chan:" + day + ":" + ch;
          const chcur = parseInt((await env.EVENTS.get(chk)) || "0", 10);
          await env.EVENTS.put(chk, String(chcur + 1), { expirationTtl: 60 * 86400 });
        }
        // ch18 reach 특수: ascend 시 fromCh>=18 데이터 반영 (d.fromCh)
        if (type === "ascend" && b.d && (b.d.fromCh || 0) >= 18) {
          const c18k = "c18:" + day; const ccur = parseInt((await env.EVENTS.get(c18k)) || "0", 10);
          await env.EVENTS.put(c18k, String(ccur + 1), { expirationTtl: 60 * 86400 });
        }
        // Project 2: phase2_unlock / prestige special (ascend proxy + ether)
        if (type === "phase2_unlock" || type === "prestige_trigger" || type === "ascend") {
          const p2k = "p2:" + day; const pcur = parseInt((await env.EVENTS.get(p2k)) || "0", 10);
          await env.EVENTS.put(p2k, String(pcur + 1), { expirationTtl: 60 * 86400 });
        }
        // A/B support: ab_test or variant in data (e.g. {ab:"fomo_gear", variant:"limited"})
        const ab = b.ab || b.variant || (b.d && b.d.ab);
        if (ab) {
          const abk = "ab:" + day + ":" + String(ab).slice(0,30);
          const abcur = parseInt((await env.EVENTS.get(abk)) || "0", 10);
          await env.EVENTS.put(abk, String(abcur + 1), { expirationTtl: 60 * 86400 });
        }
        return json({ ok: true });
      } catch (e) {
        return json({ ok: false, reason: "write-fail", err: String(e && e.message || e).slice(0, 200) });
      }
    }

    // ② 집계 조회 — 오라클(CDO) 대시보드용. GET /stats?day=YYYY-MM-DD
    if (req.method === "GET" && url.pathname === "/stats") {
      if (!env.EVENTS) return json({ ok: false, reason: "kv-not-set" });
      const day = url.searchParams.get("day") || dayKey(Date.parse(new Date().toISOString()));
      const out = {};
      for (const t of ALLOWED) out[t] = parseInt((await env.EVENTS.get("cnt:" + day + ":" + t)) || "0", 10);
      out.ch18_ascend = parseInt((await env.EVENTS.get("c18:" + day)) || "0", 10);
      // 전환율 근사(설치 대비 결제 / 가챠)
      out.purchase_rate = out.install ? +(out.purchase / out.install).toFixed(4) : 0;
      out.gacha_conv = out.install ? +(out.gacha_pull / out.install).toFixed(4) : 0;
      // ch18 reach 근사 (ascend 중 ch18+ / install) — 일일 proxy, 전체 코호트는 /cohort 또는 multi-day 조회
      out.ch18_reach_rate = out.install ? +(out.ch18_ascend / out.install).toFixed(4) : 0;
      // Activation proxy (ch5 / install) — game emit ch5_reached 시 추적
      out.ch5_rate = out.install ? +( (out.ch5_reached || 0) / out.install ).toFixed(4) : 0;
      // Virality proxy (share rate)
      out.share_rate = out.install ? +( (out.share_clicked || 0) / out.install ).toFixed(4) : 0;
      // Project 2 (Phase2 gear/prestige/items) proxies — Oracle metrics for D7/conv/virality impact
      out.p2_unlock = parseInt((await env.EVENTS.get("p2:" + day)) || "0", 10);
      out.phase2_rate = out.install ? +(out.p2_unlock / out.install).toFixed(4) : 0;
      out.gear_obtained = parseInt((await env.EVENTS.get("cnt:" + day + ":gear_obtained")) || "0", 10);
      out.gear_equipped = parseInt((await env.EVENTS.get("cnt:" + day + ":gear_equipped")) || "0", 10);
      out.gear_rate = out.install ? +(out.gear_obtained / out.install).toFixed(4) : 0;
      out.set_activated = parseInt((await env.EVENTS.get("cnt:" + day + ":set_activated")) || "0", 10);
      // A/B exposure proxy (ab_test events) — out.ab_test populated by ALLOWED loop
      out.ab_exposure = parseInt((await env.EVENTS.get("cnt:" + day + ":ab_test")) || "0", 10);
      // ── 결제 퍼널 전환 proxy (Oracle 2026-07-01) — 이제 완료뿐 아니라 의도·이탈까지 관측 ──
      //  shop_view→checkout_open→invoice_paid 단계별. cancelled로 이탈 지점 가시화.
      out.shop_to_checkout = (out.shop_view || 0) ? +((out.checkout_open || 0) / out.shop_view).toFixed(4) : 0;
      out.checkout_conv = (out.checkout_open || 0) ? +((out.invoice_paid || 0) / out.checkout_open).toFixed(4) : 0;
      out.checkout_abandon = (out.checkout_open || 0) ? +((out.invoice_cancelled || 0) / out.checkout_open).toFixed(4) : 0;
      out.activation_rate = out.install ? +((out.first_core_loop || 0) / out.install).toFixed(4) : 0;
      // ── 채널별 install 슬라이싱 (CMO ROI) — chan:day:* 스캔 ──
      out.channels = {};
      try {
        const cr = await env.EVENTS.list({ prefix: "chan:" + day + ":", limit: 100 });
        for (const k of cr.keys) { const ch = k.name.split(":").slice(2).join(":"); out.channels[ch] = parseInt((await env.EVENTS.get(k.name)) || "0", 10); }
      } catch (e) {}
      // ── North Star proxy: D7 Engaged-Payer (전체 유저 스캔, rolling span≥7 ∧ eng ∧ pay) ──
      //  정직: 일별 코호트 아닌 누적 rolling 근사(성숙도 미보정). 정밀 코호트는 /cohort 확장 예정.
      try {
        const us = await listUsers(env);
        const dn = (d) => Date.parse(d + "T00:00:00Z") / 86400000;
        let ep = 0, engN = 0, payN = 0;
        for (const uu of us) { if (uu.eng) engN++; if (uu.pay) payN++; if (uu.eng && uu.pay && (dn(uu.last || uu.first) - dn(uu.first)) >= 7) ep++; }
        out.d7_engaged_payer = ep; out.engaged_total = engN; out.payer_total = payN;
      } catch (e) { out.d7_engaged_payer = 0; }
      // Phase2 impact note: post-rollout use /cohort + p2 first-date filter for D7/conv/virality lift (hype vs sustain)
      return json({ ok: true, day, counts: out });
    }

    // ③ 코호트 리텐션 — 오라클(CDO). GET /cohort
    //    u:anon {first,last} 기반 rolling retention(설치코호트별 Dn까지 잔존).
    //    정직: first/last만 있어 "정확히 N일째 활동"이 아닌 "N일 이상 잔존(rolling)" 근사.
    if (req.method === "GET" && url.pathname === "/cohort") {
      if (!env.EVENTS) return json({ ok: false, reason: "kv-not-set" });
      const users = await listUsers(env);              // [{first,last}]
      const coh = {};                                  // first일 -> {n, d1, d7, d30}
      const dnum = (d) => Date.parse(d + "T00:00:00Z") / 86400000;
      for (const u of users) {
        if (!u.first) continue;
        const c = coh[u.first] || (coh[u.first] = { n: 0, d1: 0, d7: 0, d30: 0, d7ep: 0 });
        c.n++;
        const span = (dnum(u.last || u.first) - dnum(u.first));   // 잔존 일수
        if (span >= 1) c.d1++; if (span >= 7) c.d7++; if (span >= 30) c.d30++;
        if (span >= 7 && u.eng && u.pay) c.d7ep++;   // North Star: 코호트별 D7 Engaged-Payer
      }
      // 전체 합산(성숙 보정은 Oracle 도구에서; 여기선 raw 코호트 제공)
      const rate = (a, b) => (b ? +(a / b).toFixed(4) : 0);
      let N = 0, R1 = 0, R7 = 0, R30 = 0, REP = 0;
      for (const k in coh) { N += coh[k].n; R1 += coh[k].d1; R7 += coh[k].d7; R30 += coh[k].d30; REP += coh[k].d7ep; }
      return json({ ok: true, totalUsers: N, d7_engaged_payer: REP, rolling: { d1: rate(R1, N), d7: rate(R7, N), d30: rate(R30, N), d7_engaged_payer: rate(REP, N) }, cohorts: coh, note: "rolling retention(span>=N) + North Star(D7 Engaged-Payer=span≥7∧eng∧pay). 성숙도 보정은 Oracle 도구에서." });
    }

    // ④ raw export — 오라클 오프라인 분석용. GET /export (u: 요약 레코드, 익명)
    if (req.method === "GET" && url.pathname === "/export") {
      if (!env.EVENTS) return json({ ok: false, reason: "kv-not-set" });
      const users = await listUsers(env);
      return json({ ok: true, count: users.length, users });
    }

    return json({ ok: true, service: "legion-analytics" });
  },
};

// KV.list 페이지네이션으로 u: 유저 요약 전부 수집(상한 안전망)
async function listUsers(env) {
  const out = []; let cursor; let pages = 0;
  do {
    const r = await env.EVENTS.list({ prefix: "u:", cursor, limit: 1000 });
    for (const k of r.keys) {
      try { const u = JSON.parse((await env.EVENTS.get(k.name)) || "{}"); if (u.first) out.push({ first: u.first, last: u.last || u.first, eng: u.eng ? 1 : 0, pay: u.pay ? 1 : 0, streak: u.streak || 0, ch: u.ch || "" }); } catch (e) {}
    }
    cursor = r.cursor; pages++;
    if (r.list_complete) break;
  } while (cursor && pages < 50);   // 최대 5만 유저까지(MVP 충분)
  return out;
}
