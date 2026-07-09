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
  "stuck_upsell", "first_purchase_2x", "purchase_unverified"
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
        // 리텐션 근사: 유저별 첫/최근 활동일. 키: u:anon → {first,last}
        const uk = "u:" + anon; let u = {}; try { u = JSON.parse((await env.EVENTS.get(uk)) || "{}"); } catch (e) {}
        if (!u.first) u.first = day; u.last = day;
        await env.EVENTS.put(uk, JSON.stringify(u), { expirationTtl: 30 * 86400 });
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
      // D7 retention: u: 키 기반. 풀 스캔 비용/제한으로 proxy (dau + first/last). Oracle가 별도 집계 추천.
      // TODO: KV.list({prefix:'u:'}) 로 cohort D7 계산 (작은 유저수 시 MVP OK)
      out.d7_proxy = 0; // 상세는 Oracle side 또는 별도 엔드포인트
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
        const c = coh[u.first] || (coh[u.first] = { n: 0, d1: 0, d7: 0, d30: 0 });
        c.n++;
        const span = (dnum(u.last || u.first) - dnum(u.first));   // 잔존 일수
        if (span >= 1) c.d1++; if (span >= 7) c.d7++; if (span >= 30) c.d30++;
      }
      // 전체 합산(성숙 보정은 Oracle 도구에서; 여기선 raw 코호트 제공)
      const rate = (a, b) => (b ? +(a / b).toFixed(4) : 0);
      let N = 0, R1 = 0, R7 = 0, R30 = 0;
      for (const k in coh) { N += coh[k].n; R1 += coh[k].d1; R7 += coh[k].d7; R30 += coh[k].d30; }
      return json({ ok: true, totalUsers: N, rolling: { d1: rate(R1, N), d7: rate(R7, N), d30: rate(R30, N) }, cohorts: coh, note: "rolling retention(span>=N). 성숙도 보정은 Oracle 도구에서." });
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
      try { const u = JSON.parse((await env.EVENTS.get(k.name)) || "{}"); if (u.first) out.push({ first: u.first, last: u.last || u.first }); } catch (e) {}
    }
    cursor = r.cursor; pages++;
    if (r.list_complete) break;
  } while (cursor && pages < 50);   // 최대 5만 유저까지(MVP 충분)
  return out;
}
