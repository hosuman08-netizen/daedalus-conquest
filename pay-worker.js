/* LEGION 결제 백엔드 — Cloudflare Worker (Telegram Stars)
   역할: ① 미니앱이 부르는 GET /invoice → 봇 API로 Stars 인보이스 링크 발급
        ② 봇 웹훅 POST / → pre_checkout_query 승인(이거 안 하면 결제가 실패함)
   배포: 아래 PAY-SETUP.md 참고. 봇 토큰은 코드에 넣지 말고 Worker Secret(BOT_TOKEN)으로.
   ⚠️ 게임 상태가 localStorage(서버 계정 없음)라 최종 지급은 클라가 함 = 현재 신뢰모델과 동일.
      실제 매출 보호가 중요해지면 서버 계정으로 승급(successful_payment에서 서버가 지급). */

const ITEMS = {
  starter:  { title: "초심자 패키지",   desc: "2x 속도 영구 + 골드3000 + 유닛10개" },
  weekly:   { title: "주간 패스",        desc: "즉시 💎150 + 7일 매일 💎100" },
  monthly:  { title: "월간 패스",        desc: "즉시 💎300 + 30일 매일 💎100" },
  vip:      { title: "VIP 패키지",       desc: "4x속도·골드+50%·💎600·SR유닛" },
  ultra:    { title: "울트라 패키지",    desc: "8x속도·VIP혜택·💎2000·💰50k·SSR유닛+장비" },
  growth1:  { title: "성장 패키지",      desc: "💰5만 + 💎200 + SR장비×2" },
  growth2:  { title: "고급 성장팩",      desc: "💰20만 + 💎800 + SSR유닛+장비" },
  gem1:     { title: "💎 60",            desc: "다이아 60" },
  gem2:     { title: "💎 330",           desc: "다이아 330" },
  gem3:     { title: "💎 1280",          desc: "다이아 1280" },
  gem4:     { title: "💎 3400",          desc: "다이아 3400" },
  gold1:    { title: "💰 6000",          desc: "골드 6000" },
  gold2:    { title: "💰 35000",         desc: "골드 35000" },
  gold3:    { title: "💰 140000",        desc: "골드 140000" },
};

// 🔒 서버 고정 가격(⭐ Stars) — game.js STARS와 일치. 클라가 보낸 stars 파라미터는 무시(금액 위조 차단: 1⭐로 비싼 팩 결제 방지).
const STARS = { starter: 50, weekly: 250, monthly: 750, vip: 1500, ultra: 5000, growth1: 500, growth2: 2500, gem1: 55, gem2: 280, gem3: 1000, gem4: 2500, gold1: 55, gold2: 280, gold3: 1000 };

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json", ...CORS } });

async function tg(token, method, body) {
  const r = await fetch("https://api.telegram.org/bot" + token + "/" + method, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  return r.json();
}

export default {
  async fetch(req, env) {
    const token = env.BOT_TOKEN;
    if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
    const url = new URL(req.url);

    // ① 인보이스 링크 발급
    if (req.method === "GET" && url.pathname === "/invoice") {
      if (!token) return json({ error: "BOT_TOKEN not set" }, 500);
      const item = url.searchParams.get("item");
      const uid = url.searchParams.get("uid") || "0";
      const meta = ITEMS[item];
      const stars = STARS[item];           // 🔒 서버 고정가 (클라 stars 파라미터 무시 — 1⭐로 울트라 결제 등 금액 위조 차단)
      if (!meta || !stars) return json({ error: "bad item" }, 400);
      const res = await tg(token, "createInvoiceLink", {
        title: meta.title,
        description: meta.desc,
        payload: item + ":" + uid,          // 결제 후 식별용
        currency: "XTR",                     // ⭐ Telegram Stars
        prices: [{ label: meta.title, amount: stars }],
      });
      if (!res.ok) return json({ error: res.description || "tg error" }, 502);
      return json({ link: res.result });
    }

    // ② 봇 웹훅 — pre_checkout 승인(필수) + 결제완료 로그
    if (req.method === "POST") {
      if (!token) return json({ ok: false });
      let u = {}; try { u = await req.json(); } catch (e) {}
      if (u.pre_checkout_query) {
        await tg(token, "answerPreCheckoutQuery", { pre_checkout_query_id: u.pre_checkout_query.id, ok: true });
      }
      // u.message?.successful_payment 여기서 서버지급/영수증저장 가능(현재는 클라지급이라 생략)
      return json({ ok: true });
    }

    return json({ ok: true, service: "legion-pay" });
  },
};
