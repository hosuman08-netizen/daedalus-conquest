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
  "stuck_upsell", "first_purchase_2x", "purchase_unverified", "purchase_pending",
  "purchase_recovered",   // 💰 2026-08-13: 결제됐는데 미지급이던 건을 재진입 시 회수(원장 복구) — 유실 규모 관측용
  // Oracle(CDO) 2026-07-01: 결제 퍼널 관측 + 활성화 1회성 + North Star 교집합 배선
  //   shop_view=상점열람 / checkout_open=buyPack클릭(구매의도) / invoice_paid·invoice_cancelled=openInvoice 콜백 결과
  //   first_core_loop·first_gacha=신규 1회성(activation) — daily_return·invite_converted 슬롯은 기존 라인에 이미 존재
  "shop_view", "checkout_open", "invoice_paid", "invoice_cancelled",
  "first_core_loop", "first_gacha", "free_ticket_used", "share_card_generated", "share_card_sent",
  "d1_hook_shown", "d1_hook_cta",
  "ftue_auto_battle",   // P0-1 (2026-08-06): SSR 카드 10초 무반응 → 자동 첫 전투 진입 계측
  "raid_attack", "raid_win", "shield_buy", "revenge_start",
  // 리텐션 신설(2026-07-16 Morpheus) — game.js emit과 계약 일치. 누락 시 라이브 폐기됨
  "auto_deploy", "defeat_coach",
  // 2026-07-29 1H smoke: game.js logEvent 24종 워커 폐기 중이었음 — ALLOWED 계약 복구
  "daily_focus_toast", "daily_gem_bonus", "daily_login_gems", "daily_missions_claim",
  "gacha_intent", "gacha_nudge", "gacha_view", "gem_drip",
  "gg_comeback_boot", "gg_comeback_toast", "lose_recover_cta",
  "money_pipe_shop", "money_pipe_shown",
  "peak_share_any_ssr", "peak_share_battle", "peak_share_gacha",
  "return_user_welcome", "streak_break_nudge", "streak_freeze",
  "tower_floor", "ttv_first_session", "week_chest",
  "win_gacha_cta_click", "win_gacha_cta_show",
  // 🚨 2026-08-13 Oracle 라이브 실측: 아래 14종이 화이트리스트에 없어 **전량 거부**되고 있었다.
  //    p20 사주/p21 타로의 활성화·과금·바이럴이 통째로 여기 있었고, p1의 legionTrack('activate'|'share')도 폐기 중이었다.
  //    → 08-04 "activate=0" 진단은 실제 0이 아니라 '수신 불가 이름'이었다. 같은 사고 3번째(7-20, 7-29, 지금).
  "activate", "share", "share_peak", "share_refill", "share_peak_shown",
  "k_link", "premium_unlock", "first_read", "birth",
  "daily_focus", "recent_rerun", "import", "export", "undo", "streak",
  "sw_register_fail",   // 2026-08-13: SW 등록 실패를 침묵시키지 않기 위해 신설. 0이 아니면 PWA가 죽은 것.
  // 2026-08-13 계약 게이트(legion-contract-check)가 코어 3종에서 잡아낸 누락분. 앱이 쏘는데 워커가 버리던 것들.
  //   p21 타로 — 재해석/재뽑기/일일공명/p10 무료권
  "clarify", "redraw", "reobserve", "daily_resonance", "p10_daily_free",
  //   p2 마이판테온 — 일일수령/축제/빈화면 CTA/비콘 기본 view
  "daily_claim", "festival_claim", "festival_fomo_toast", "empty_cta_show", "view",
  // 2026-08-20 p20/p21 함대 게이트 — 앱이 쏘는데 ALLOWED 없어 침묵폐기
  "ja_chip", "ja_day_copy", "ja_recalc", "ja_result_chip", "lon_preset",
  "lesson"
]);
const dayKey = (ts) => new Date(ts).toISOString().slice(0, 10);   // YYYY-MM-DD (UTC 일관 — game.js와 동일)

/* 🔒 2026-08-13 — 읽기 엔드포인트 인증 게이트 (Cipher/Ghostwire 2026-07-29 P1 실측 확인 후 수리)
   확인된 사실: GET /export 가 무인증으로 유저 요약 레코드 99건을 그대로 덤프하고 있었다(라이브 curl 검증).
   /stats·/cohort 도 동일하게 열려 있었다 — STATS_SECRET 이 프로덕션에 설정된 적이 없어
   기존의 "if (ssec)" 조건부 검사가 통째로 건너뛰어졌기 때문이다(= fail-OPEN 이었다).
   → 조건부를 fail-CLOSED 로 바꾼다. 시크릿 미설정도 '열림'이 아니라 '거부'다.
   ⚠️ 배포 시 반드시 짝으로: wrangler secret put STATS_SECRET  (미설정 시 Oracle 읽기 전부 401)
      거부는 침묵하지 않는다 — 이유를 명시해 대시보드가 스스로 고발하게 한다.
   ※ POST /ev(수집)는 게이트하지 않는다. 익명 비콘이고 막으면 계측이 죽는다. 쓰기≠읽기. */
function readAuth(req, env, url) {
  const ssec = env.STATS_SECRET;
  if (!ssec) return json({ ok: false, reason: "stats-auth-not-configured", fix: "wrangler secret put STATS_SECRET" }, 503);
  const got = req.headers.get("X-Stats-Secret") || url.searchParams.get("k") || "";
  if (got !== ssec) return json({ ok: false, reason: "stats-auth" }, 401);
  return null;   // null = 통과
}

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(req.url);

    // ① 이벤트 수신 — game.js logEvent가 POST
    if (req.method === "POST" && (url.pathname === "/ev" || url.pathname === "/event")) {
      if (!env.EVENTS) return json({ ok: false, reason: "kv-not-set" });   // graceful
      let b = {}; try { b = await req.json(); } catch (e) {}
      const type = b.type || b.n, anon = (b.anonId || b.a || "anon").slice(0, 40), ts = b.ts || 0;
      // 🩹 거부를 침묵시키지 않는다. sendBeacon은 응답을 안 읽어서 bad-event가 아무 데도 안 남았고,
      //    그 침묵 때문에 같은 사고가 3번 반복됐다. 이제 거부도 카운트되어 데이터가 스스로 고발한다.
      if (!ALLOWED.has(type) || !ts) {
        if (env.EVENTS && type) {
          try {
            const rk = "rej:" + dayKey(ts || Date.now()) + ":" + String(type).slice(0, 32);
            const rc = parseInt((await env.EVENTS.get(rk)) || "0", 10);
            await env.EVENTS.put(rk, String(rc + 1), { expirationTtl: 30 * 86400 });
          } catch (e) {}
        }
        return json({ ok: false, reason: "bad-event" });
      }
      // 🩹 2026-08-13 측정 복구 (군단 전체회의 발견):
      //  ① 앱 차원 없음 → 49개 슬롯 지표가 한 통에 섞였음. app 네임스페이스 키를 병행 기록(레거시 키는 유지 = 대시보드 무중단).
      //  ② 비콘(legion-beacon.js)은 channel을 최상위로, game.js는 d.channel로 보냄 → 최상위만 읽던 쪽에서 41개 앱 귀속 유실. 양쪽 수용.
      const app = String(b.app || "unknown").slice(0, 32).replace(/[^a-zA-Z0-9_-]/g, "") || "unknown";
      const chanOf = (x) => String((x && x.channel) || (x && x.d && x.d.channel) || "direct").slice(0, 20);
      // ⚠️ fire-and-forget: KV 쓰기 실패해도 절대 500 금지(게임 영향0). 예외는 잡아 진단 노출.
      try {
        // 일별 카운트 집계 (KV는 단순 카운터 — D1로 승급 가능). 키: cnt:YYYY-MM-DD:type
        const day = dayKey(ts), ck = "cnt:" + day + ":" + type;
        const cur = parseInt((await env.EVENTS.get(ck)) || "0", 10);
        await env.EVENTS.put(ck, String(cur + 1), { expirationTtl: 60 * 86400 });   // 60일 보존(레거시 전체합)
        // 앱별 카운트. 키: cnt:YYYY-MM-DD:app:type — 어느 슬롯이 살아있는지 이제 데이터로 답할 수 있음
        const ack = "cnt:" + day + ":" + app + ":" + type;
        const acur = parseInt((await env.EVENTS.get(ack)) || "0", 10);
        await env.EVENTS.put(ack, String(acur + 1), { expirationTtl: 60 * 86400 });
        // DAU 근사: 일별 유니크 anonId 마킹 (set 키). 키: dau:YYYY-MM-DD:anon
        await env.EVENTS.put("dau:" + day + ":" + anon, "1", { expirationTtl: 14 * 86400 });
        // 앱별 DAU — 전 슬롯이 같은 오리진이라 anon이 공유됨. 앱 네임스페이스로 교차오염 차단.
        await env.EVENTS.put("dau:" + day + ":" + app + ":" + anon, "1", { expirationTtl: 14 * 86400 });
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
        // 획득채널 최초 1회 고정(첫 비어있지 않은 값 승리 — install 유실돼도 session_start로 채움). CMO 채널 ROI 슬라이싱
        if (!u.ch) { const c0 = chanOf(b); if (c0 !== "direct") u.ch = c0; }
        if (!u.app) u.app = app;   // 유저 레코드에도 앱 각인(코호트 슬라이싱)
        await env.EVENTS.put(uk, JSON.stringify(u), { expirationTtl: 45 * 86400 });   // D30 코호트 성숙 대비 45일
        // 채널별 install 일별 집계. 키: chan:YYYY-MM-DD:channel (+ 앱별)
        if (type === "install") {
          const ch = chanOf(b);
          const chk = "chan:" + day + ":" + ch;
          const chcur = parseInt((await env.EVENTS.get(chk)) || "0", 10);
          await env.EVENTS.put(chk, String(chcur + 1), { expirationTtl: 60 * 86400 });
          // prefix를 분리(chanA:)한다 — 같은 "chan:" 아래 두면 아래 list() 스캔이 앱키까지 긁어
          // out.channels에 invite와 saju-miniapp:invite가 동시에 들어가 채널 수가 2배로 부풀었다.
          const achk = "chanA:" + day + ":" + app + ":" + ch;
          const achcur = parseInt((await env.EVENTS.get(achk)) || "0", 10);
          await env.EVENTS.put(achk, String(achcur + 1), { expirationTtl: 60 * 86400 });
        }
        // 채널별 세션 일별 집계(코호트 성숙 전 채널 초기반응 읽기). 키: chans:YYYY-MM-DD:channel (+ 앱별)
        if (type === "session_start") {
          const chs = chanOf(b);
          const sk = "chans:" + day + ":" + chs;
          const scur = parseInt((await env.EVENTS.get(sk)) || "0", 10);
          await env.EVENTS.put(sk, String(scur + 1), { expirationTtl: 60 * 86400 });
          const ask = "chansA:" + day + ":" + app + ":" + chs;   // chans: 스캔 오염 방지(위와 동일 이유)
          const ascur = parseInt((await env.EVENTS.get(ask)) || "0", 10);
          await env.EVENTS.put(ask, String(ascur + 1), { expirationTtl: 60 * 86400 });
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

    // 🏛️ 창립 판테온 100 — 진짜 서버 하드캡(101번째 실제로 닫힘 = 합법 희소성). GET /founder?uid=X
    if (req.method === "GET" && url.pathname === "/founder") {
      if (!env.EVENTS) return json({ ok: false, reason: "kv-not-set" });
      const fuid = String(url.searchParams.get("uid") || "").slice(0, 40);
      if (!fuid) return json({ ok: false, reason: "no-uid" });
      const FCAP = 100;
      const fk = "fdr:u:" + fuid;
      const ex = await env.EVENTS.get(fk);
      if (ex) return json({ ok: true, founder: true, num: parseInt(ex, 10), cap: FCAP });
      const fcount = parseInt((await env.EVENTS.get("fdr:count")) || "0", 10);
      if (fcount >= FCAP) return json({ ok: true, founder: false, cap: FCAP, full: true });
      const slot = fcount + 1;
      await env.EVENTS.put("fdr:count", String(slot));
      await env.EVENTS.put(fk, String(slot));   // 영구(TTL 없음 — 창립 기록). KV 비원자성: 콜드스타트 저동시성엔 무해.
      return json({ ok: true, founder: true, num: slot, cap: FCAP, "new": true });
    }
    // ② 집계 조회 — 오라클(CDO) 대시보드용. GET /stats?day=YYYY-MM-DD
    if (req.method === "GET" && url.pathname === "/stats") {
      const deny = readAuth(req, env, url); if (deny) return deny;   // 🔒 fail-closed (구 조건부 = fail-open 이었음)
      if (!env.EVENTS) return json({ ok: false, reason: "kv-not-set" });
      const day = url.searchParams.get("day") || dayKey(Date.parse(new Date().toISOString()));
      // 🩹 2026-08-13: ?app=<slug> 지정 시 그 슬롯만. 미지정이면 기존 전체합(하위호환).
      const qApp = String(url.searchParams.get("app") || "").slice(0, 32).replace(/[^a-zA-Z0-9_-]/g, "");
      const pre = "cnt:" + day + (qApp ? ":" + qApp : "") + ":";
      const out = {};
      if (qApp) out._app = qApp;
      for (const t of ALLOWED) out[t] = parseInt((await env.EVENTS.get(pre + t)) || "0", 10);
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
      // ⚠️ 아래 4개는 `pre`(=앱 스코프)를 써야 한다. 레거시 전역키를 쓰면 ?app= 지정이 무시되고
      //    함대 총합이 섞여 나온다 — 이번 사고(앱 미분리)의 재발 지점이었다.
      out.gear_obtained = parseInt((await env.EVENTS.get(pre + "gear_obtained")) || "0", 10);
      out.gear_equipped = parseInt((await env.EVENTS.get(pre + "gear_equipped")) || "0", 10);
      out.gear_rate = out.install ? +(out.gear_obtained / out.install).toFixed(4) : 0;
      out.set_activated = parseInt((await env.EVENTS.get(pre + "set_activated")) || "0", 10);
      // A/B exposure proxy (ab_test events) — out.ab_test populated by ALLOWED loop
      out.ab_exposure = parseInt((await env.EVENTS.get(pre + "ab_test")) || "0", 10);
      // ── 결제 퍼널 전환 proxy (Oracle 2026-07-01) — 이제 완료뿐 아니라 의도·이탈까지 관측 ──
      //  shop_view→checkout_open→invoice_paid 단계별. cancelled로 이탈 지점 가시화.
      out.shop_to_checkout = (out.shop_view || 0) ? +((out.checkout_open || 0) / out.shop_view).toFixed(4) : 0;
      out.checkout_conv = (out.checkout_open || 0) ? +((out.invoice_paid || 0) / out.checkout_open).toFixed(4) : 0;
      out.checkout_abandon = (out.checkout_open || 0) ? +((out.invoice_cancelled || 0) / out.checkout_open).toFixed(4) : 0;
      out.activation_rate = out.install ? +((out.first_core_loop || 0) / out.install).toFixed(4) : 0;
      // ── 채널 슬라이싱 — ?app= 지정 시 앱 전용키(chanA:/chansA:), 미지정 시 레거시 전역키 ──
      const chPre  = qApp ? "chanA:"  + day + ":" + qApp + ":" : "chan:"  + day + ":";
      const chsPre = qApp ? "chansA:" + day + ":" + qApp + ":" : "chans:" + day + ":";
      out.channels = {};
      try {
        const cr = await env.EVENTS.list({ prefix: chPre, limit: 100 });
        for (const k of cr.keys) { const ch = k.name.slice(chPre.length); out.channels[ch] = parseInt((await env.EVENTS.get(k.name)) || "0", 10); }
      } catch (e) {}
      out.channels_sessions = {};
      try {
        const sr = await env.EVENTS.list({ prefix: chsPre, limit: 100 });
        for (const k of sr.keys) { const ch = k.name.slice(chsPre.length); out.channels_sessions[ch] = parseInt((await env.EVENTS.get(k.name)) || "0", 10); }
      } catch (e) {}
      // ── 거부된 이벤트(화이트리스트 누락 조기경보) — 이게 0이 아니면 계측 계약이 깨진 것 ──
      out.rejected = {};
      try {
        const rr = await env.EVENTS.list({ prefix: "rej:" + day + ":", limit: 100 });
        for (const k of rr.keys) { const t = k.name.slice(("rej:" + day + ":").length); out.rejected[t] = parseInt((await env.EVENTS.get(k.name)) || "0", 10); }
      } catch (e) {}
      // ── North Star proxy: D7 Engaged-Payer (전체 유저 스캔) — ⚠️무거움(서브리퀘스트 한도). ?full=1일 때만.
      //  기본 /stats는 카운터만(데일리 digest·스모크용 = 빠르고 안정). 정밀은 /stats?full=1 또는 /cohort.
      if (url.searchParams.get("full") === "1") {
        try {
          const us = await listUsers(env);
          const dn = (d) => Date.parse(d + "T00:00:00Z") / 86400000;
          let ep = 0, engN = 0, payN = 0;
          for (const uu of us) { if (uu.eng) engN++; if (uu.pay) payN++; if (uu.eng && uu.pay && (dn(uu.last || uu.first) - dn(uu.first)) >= 7) ep++; }
          out.d7_engaged_payer = ep; out.engaged_total = engN; out.payer_total = payN;
        } catch (e) { out.d7_engaged_payer = 0; }
      }
      // Phase2 impact note: post-rollout use /cohort + p2 first-date filter for D7/conv/virality lift (hype vs sustain)
      return json({ ok: true, day, counts: out });
    }

    // ③ 코호트 리텐션 — 오라클(CDO). GET /cohort
    //    u:anon {first,last} 기반 rolling retention(설치코호트별 Dn까지 잔존).
    //    정직: first/last만 있어 "정확히 N일째 활동"이 아닌 "N일 이상 잔존(rolling)" 근사.
    if (req.method === "GET" && url.pathname === "/cohort") {
      const deny = readAuth(req, env, url); if (deny) return deny;   // 🔒 무인증 코호트 조회 차단
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
      // 🔒 최우선 차단 지점 — 라이브에서 이게 유저 레코드 99건을 무인증으로 덤프하고 있었다.
      const deny = readAuth(req, env, url); if (deny) return deny;
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
