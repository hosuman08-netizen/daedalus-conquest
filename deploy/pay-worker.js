/* LEGION 결제 백엔드 — Cloudflare Worker (Telegram Stars + TON + X funnel)
   역할: ① /invoice → Stars/TON 인보이스 (full-cheat-engine + history-conquest + cycle-domination weaponized)
        ② webhook pre_checkout + successful → KV + agentic auto-yield + RWA backing
   배포: PAY-SETUP.md (non-interactive wrangler supported: wrangler deploy --yes + secret bulk)
   ⚠️ value isolation: payment value (XTR/TON) vs game value (in-game) separate. Prominent disclosure /rates. Stealth OPSEC: coded payload + fictional.
   "일당 10000" special forces escalation: sf10000 pack funds daily 10k-unit Legion ops (agentic yield + identity fusion).
   p1/p2/X/finance 적용. Prominent rates + "inspired by" shield. Sovereign direct. Legion one. */

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
const GAME = "https://hosuman08-netizen.github.io/daedalus-conquest";   // 게임 URL (배너·플레이 버튼)

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

    // ①-b 레퍼럴 카운트 조회 (초대한 친구 수 — 인게임 클레임용)
    if (req.method === "GET" && url.pathname === "/referrals") {
      const uid = url.searchParams.get("uid") || "0";
      const cnt = env.REFERRALS ? parseInt((await env.REFERRALS.get("c:" + uid)) || "0", 10) : 0;
      return json({ count: cnt });
    }

    // ①-c 결제 영수증 검증 — game.js가 grant 직전 호출. 진짜 결제(successful_payment)만 KV에 기록 → 콜백위조 차단.
    if (req.method === "GET" && url.pathname === "/verify") {
      const item = url.searchParams.get("item");
      const uid = url.searchParams.get("uid") || "0";
      if (!env.RECEIPTS) return json({ ok: false, reason: "kv-not-set" });  // KV 미설정 시 graceful
      const key = "rcpt:" + uid + ":" + item;
      const rec = await env.RECEIPTS.get(key);
      if (!rec) return json({ ok: false });          // 영수증 없음 = 결제 안 함 → grant 거부
      await env.RECEIPTS.delete(key);                // 멱등 1회용 소비
      return json({ ok: true, charge: rec });
    }

    // ② 봇 웹훅 — pre_checkout 승인(필수) + 결제완료 영수증 저장
    if (req.method === "POST") {
      if (!token) return json({ ok: false });
      // 🔒 P0 웹훅 인증 — setWebhook secret_token 헤더 대조. 미일치=위조 → 거부 (영수증 위조 무료탈취 차단).
      //    활성화: ① wrangler secret put WEBHOOK_SECRET  ② setWebhook?secret_token=동일값 (군주 승인 외부행동)
      const wsecret = env.WEBHOOK_SECRET;
      if (wsecret && req.headers.get("X-Telegram-Bot-Api-Secret-Token") !== wsecret) return json({ ok: false }, 403);
      let u = {}; try { u = await req.json(); } catch (e) {}
      if (u.pre_checkout_query) {
        await tg(token, "answerPreCheckoutQuery", { pre_checkout_query_id: u.pre_checkout_query.id, ok: true });
      }
      // /start → 환영 배너 + 플레이 버튼 (봇 첫 화면) + 레퍼럴 기록
      if (u.message && typeof u.message.text === "string" && u.message.text.indexOf("/start") === 0) {
        // 레퍼럴: /start refNNN → 초대자 카운트 +1 (신규 TG ID당 1회만 = 조작방지)
        try {
          const payload = (u.message.text.split(" ")[1] || "");
          const newId = String(u.message.from && u.message.from.id || "");
          if (env.REFERRALS && payload.indexOf("ref") === 0 && newId) {
            const inviter = payload.slice(3);
            if (inviter && inviter !== newId) {
              const seen = await env.REFERRALS.get("u:" + newId);
              if (!seen) {
                await env.REFERRALS.put("u:" + newId, inviter);
                const cur = parseInt((await env.REFERRALS.get("c:" + inviter)) || "0", 10);
                await env.REFERRALS.put("c:" + inviter, String(cur + 1));
              }
            }
          }
        } catch (e) {}
        await tg(token, "sendPhoto", {
          chat_id: u.message.chat.id,
          photo: GAME + "/art/marketing-arclight-banner.jpg",
          caption: "⚔️ <b>Daedalus Conquest</b> — AI 군단 전쟁\n\n🤖 200+ AI 영웅을 모아 키우고\n🐉 거대 보스를 격파하며\n🏆 끝없이 정복하라.\n\n👇 지금 군단을 일으켜라:",
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: [[{ text: "🎮 플레이 시작", web_app: { url: GAME + "/" } }]] },
        });
      }
      // ✅ 결제 완료 → 영수증 KV 저장 (서버 진실원천, 텔레그램→워커 직통이라 위조불가). game.js가 /verify로 확인 후 grant.
      if (u.message && u.message.successful_payment) {
        const sp = u.message.successful_payment;
        const item = (sp.invoice_payload || "").split(":")[0];
        const uid = (sp.invoice_payload || "").split(":")[1] || "0";
        if (env.RECEIPTS && item) await env.RECEIPTS.put("rcpt:" + uid + ":" + item, sp.telegram_payment_charge_id || "1", { expirationTtl: 86400 });
      }
      return json({ ok: true });
    }

    return json({ ok: true, service: "legion-pay" });
  },
};
