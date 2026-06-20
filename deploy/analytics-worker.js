/* LEGION analytics 백엔드 — Cloudflare Worker (출시후 측정)
   역할: 미니앱 logEvent → POST /ev 수신 → KV 저장. 오라클(CDO)이 GET /stats로 집계 조회.
   설계: Trinity(CPO) · 계측 배선(game.js logEvent): Morpheus(COO) · 분석: Oracle(CDO)
   ⚠️ fire-and-forget — 실패해도 게임 영향 0. 익명 anonId(개인정보 X).
   배포: KV namespace(EVENTS) 바인딩. BOT_TOKEN 불필요. */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json", ...CORS } });

// MVP 6종 이벤트 화이트리스트 (오라클 스키마와 일치)
const ALLOWED = new Set(["install", "battle_win", "gacha_pull", "ascend", "purchase", "growth_moment"]);
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
      return json({ ok: true });
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
      // D7 retention: u: 키 기반. 풀 스캔 비용/제한으로 proxy (dau + first/last). Oracle가 별도 집계 추천.
      // TODO: KV.list({prefix:'u:'}) 로 cohort D7 계산 (작은 유저수 시 MVP OK)
      out.d7_proxy = 0; // 상세는 Oracle side 또는 별도 엔드포인트
      return json({ ok: true, day, counts: out });
    }

    return json({ ok: true, service: "legion-analytics" });
  },
};
