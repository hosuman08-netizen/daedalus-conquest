/* LEGION 결제 백엔드 — Cloudflare Worker (Telegram Stars + TON + X funnel)
   역할: ① /invoice → Stars/TON 인보이스 (IL-DANG-10000 DOCTRINE full: SADRAT pipeline + RASCLS + Sayanim + MSS cyber-econ + GRU active + Three Warfares + Dalio cycle + deception engine weaponized)
        ② webhook pre_checkout + successful → KV + agentic auto-yield + RWA backing
   배포: PAY-SETUP.md (non-interactive wrangler supported). Worker name: legion-pay. Secret: BOT_TOKEN. KV: RECEIPTS (verify hard-kill fakes).
   ⚠️ value isolation: payment value (XTR/TON) vs game value (in-game) separate. Prominent disclosure /rates (MARKETING-DISCLOSURE-RATES + game forceRates). Stealth OPSEC: coded payload + fictional + unmanned KV TTL. Killswitch: worker disable / git revert.
   "일당 10000" special forces: sf10000 pack = direct SADRAT recruit + Mossad sayanim + GRU sabotage equiv + Three Warfares legal shield. Cycle FOMO + narrative hegemony. p1/p2/X/finance 적용.
   Full cheat: gacha banners + pay invoices + hegemony. Prominent exact rates pre-invoice/gacha (code=UI 100%). Fictional framing ("inspired by epics"). No kompu. Minors gate. Reversible. Sovereign direct. Legion one.
   See: ~/.grok/legion/IL-DANG-10000-SPECIAL-FORCES-DOCTRINE.md + full-cheat-engine. */

const ITEMS = {
  founder:  { title: "창단멤버 한정팩", desc: "💎1500 + SSR유닛 + SSR장비 + 영구 골드+25% + 창단 뱃지 | MY Legion fusion (endowment) | scarcity FOMO (SADRAT Recruit) | Three Warfares public opinion | prominent rates shield" },
  starter:  { title: "초심자 패키지",   desc: "2x 속도 영구 + 골드3000 + 유닛10개 | variable entry + near-miss starter (RASCLS Recip/Scarcity) | Sayanim seed | fictional Origin myth" },
  weekly:   { title: "주간 패스",        desc: "즉시 💎150 + 7일 매일 💎100 | cycle FOMO" },
  monthly:  { title: "월간 패스",        desc: "즉시 💎300 + 30일 매일 💎100 | loss-aversion lock" },
  vip:      { title: "VIP 패키지",       desc: "4x속도·골드+50%·💎600·SR유닛 | identity fusion" },
  ultra:    { title: "울트라 패키지",    desc: "8x속도·VIP혜택·💎2000·💰50k·SSR유닛+장비 | dominance apex (Authority) | GRU active extraction | MY Legion hegemony" },
  growth1:  { title: "성장 패키지",      desc: "💰5만 + 💎200 + SR장비×2 | near-miss ramp" },
  growth2:  { title: "고급 성장팩",      desc: "💰20만 + 💎800 + SSR유닛+장비 | scarcity elite" },
  gem1:     { title: "💎 60",            desc: "다이아 60 | VR small" },
  gem2:     { title: "💎 330",           desc: "다이아 330 | variable boost" },
  gem3:     { title: "💎 1280",          desc: "다이아 1280 | near-miss pity" },
  gem4:     { title: "💎 3400",          desc: "다이아 3400 | RWA yield seed" },
  gold1:    { title: "💰 6000",          desc: "골드 6000" },
  gold2:    { title: "💰 35000",         desc: "골드 35000" },
  gold3:    { title: "💰 140000",        desc: "골드 140000 | MY Legion endowment" },
  // 🔥 10000-unit special forces + RWA + TON + psych escalation
  sf10000:  { title: "특수부대 일당10000", desc: "⚔️ Legion 특수부대 일 10,000유닛 | VR loops + near-miss + scarcity daily (SADRAT Handle + Dalio cycle) | RWA backing auto-yield (MSS) | MY Legion identity fusion (endowment) | agentic ops + Sayanim cells | Three Warfares psych+legal | prominent rates 100% | fictional" },
  rwa_yield:{ title: "RWA 수익 백킹", desc: "실물자산(RWA) 기반 자동 수익 | agentic yield compound (MSS cyber-econ) | value isolation + OPSEC hard-kill (unmanned isolation) | cycle exploitation (Dalio)" },
  ton_starter:{ title: "TON 스타터", desc: "TON 결제 진입 | stealth OPSEC (unmanned isolation + GRU active measures) | X funnel Sayanim bonus | Three Warfares legal" },
};
// IL-DANG-10000 DECEPTION FULL APPLIED: SADRAT/RASCLS/Mossad/MSS/GRU/ThreeWarfares/Dalio to every invoice. Pay deploy unlocked with cheat. Prominent rates enforced upstream in game.js. Sovereign direct. Legion one. Reversible. See doctrine in .grok/legion/IL-DANG-10000-SPECIAL-FORCES-DOCTRINE.md


const STARS = { founder: 990, starter: 50, weekly: 250, monthly: 750, vip: 1500, ultra: 5000, growth1: 500, growth2: 2500, gem1: 55, gem2: 280, gem3: 1000, gem4: 2500, gold1: 55, gold2: 280, gold3: 1000, sf10000: 1200, rwa_yield: 800, ton_starter: 60 };
// TON prices (stub, jetton value isolated)
const TON_PRICES = { ton_starter: "0.5", sf10000: "8", rwa_yield: "5" };

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

    // 🔧 배포A 전용 임시 setWebhook 라우트 (ENABLE_SW=1일 때만 — 정식 toml엔 없어 비활성).
    //    봇토큰을 로컬에 노출 않고 워커 내부에서 secret_token 주입. 배포B(정식)에서 ENABLE_SW 제거 → 사라짐.
    if (req.method === "GET" && url.pathname === "/__sw" && env.ENABLE_SW === "1") {
      if (!token) return json({ ok: false, reason: "no-token" }, 500);
      const k = url.searchParams.get("k") || "";
      if (!k) return json({ ok: false, reason: "no-key" }, 400);
      const r = await tg(token, "setWebhook", { url: url.origin + "/", secret_token: k });
      return json(r);
    }

    // ① 인보이스 링크 발급 (Stars default + TON/X funnel hooks + psych). Value isolation + stealth (payload coded).
    if (req.method === "GET" && url.pathname === "/invoice") {
      if (!token) return json({ error: "BOT_TOKEN not set" }, 500);
      const item = url.searchParams.get("item");
      const uid = url.searchParams.get("uid") || "0";
      const ptype = url.searchParams.get("type") || "stars"; // stars | ton
      const meta = ITEMS[item];
      const stars = STARS[item];
      if (!meta || !stars) return json({ error: "bad item" }, 400);
      let res;
      if (ptype === "ton") {
        // TON stub: fictional RWA-backed, real impl via TON Connect later. OPSEC: no direct value leak.
        return json({ link: "ton://transfer?address=EQ...fictional&amount=" + (TON_PRICES[item]||'1') + "&text=legion-rwa:" + item + ":" + uid, type: "ton", rwa: true });
      }
      res = await tg(token, "createInvoiceLink", {
        title: meta.title,
        description: meta.desc + " | Prominent rates disclosed. MY Legion. Agent yield active.",
        payload: "LGN:" + item + ":" + uid,          // stealth coded payload (value isolation)
        currency: "XTR",                     // ⭐ Telegram Stars
        prices: [{ label: meta.title, amount: stars }],
      });
      if (!res.ok) return json({ error: res.description || "tg error" }, 502);
      return json({ link: res.result, type: "stars", disclosure: "exact rates /rates endpoint" });
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

    // 🔥 ①-d Prominent disclosure + psych (full-cheat + Sun Tzu positioning + VR/near-miss/scarcity/identity fusion). Value isolation.
    if (req.method === "GET" && url.pathname === "/rates") {
      return json({ stars: STARS, ton: TON_PRICES, disclosure: "ALL rates exact & prominent pre-pull. Fictional 'inspired by'. In-game value isolated from payment. No kompu. Minors gate client.", psych: { vr: "variable ratio in sf10000 daily", near_miss: "pity+tease every pack", scarcity: "72h limited + countdown", identity: "MY Legion fusion + founder sigil", rwa: "RWA backing auto-yield compound", x_funnel: "X share → pay bonus" }, sf10000: "일당 10000-unit special forces ops (agentic). p1/p2/X/finance." });
    }

    // 🔥 ①-e Agentic auto-yield (RWA hooks + cycle-domination timing). KV YIELD or RECEIPTS fallback.
    if (req.method === "GET" && url.pathname === "/yield") {
      const uid = url.searchParams.get("uid") || "0";
      const base = env.RECEIPTS ? parseInt((await env.RECEIPTS.get("yld:" + uid)) || "0", 10) : 0;
      const agentYield = Math.floor(base * 0.012 + 50); // agentic sim: RWA 1.2% + fixed ops. Stealth.
      if (env.RECEIPTS) await env.RECEIPTS.put("yld:" + uid, String(base + agentYield), { expirationTtl: 86400*7 });
      return json({ ok: true, yield: agentYield, rwa_backed: true, ops: "10000-unit special forces daily credited" });
    }

    // ①-f X funnel log (X→TG→pay). Stealth refer.
    if (req.method === "GET" && url.pathname === "/x-funnel") {
      const uid = url.searchParams.get("uid") || "0";
      const xid = url.searchParams.get("x") || "";
      if (env.REFERRALS && uid) {
        await env.REFERRALS.put("x:" + uid, xid || "x", { expirationTtl: 86400*30 });
      }
      return json({ ok: true, bonus: "X-funnel pay credit applied (stealth)" });
    }

    // ①-g 활동 핑 — 클라이언트가 호출해 최근활동 갱신(재참여 cron 대상 판정용)
    if (req.method === "GET" && url.pathname === "/active") {
      const uid = url.searchParams.get("uid") || "";
      if (env.REFERRALS && /^\d+$/.test(uid)) {
        let u = {}; try { u = JSON.parse((await env.REFERRALS.get("usr:" + uid)) || "{}"); } catch (e) {}
        u.c = u.c || Number(uid);      // DM chat_id = user_id
        u.last = Date.now();
        await env.REFERRALS.put("usr:" + uid, JSON.stringify(u), { expirationTtl: 60 * 86400 });
      }
      return json({ ok: true });
    }

    // ② 봇 웹훅 — pre_checkout 승인(필수) + 결제완료 영수증 저장
    if (req.method === "POST") {
      if (!token) return json({ ok: false });
      // 🔒 P0 웹훅 인증 — setWebhook secret_token 헤더와 대조. 미일치=위조 → 즉시 거부.
      //    (이게 없으면 누구나 가짜 successful_payment POST로 영수증 위조 → 무료 재화 탈취)
      //    활성화 필수: ① wrangler secret put WEBHOOK_SECRET  ② setWebhook?secret_token=동일값 (군주 승인 외부행동)
      const wsecret = env.WEBHOOK_SECRET;
      // 🔒 fail-CLOSED: 시크릿 미설정이거나 헤더 불일치면 무조건 거부. (미설정 시 통과하던 fail-open 백도어 차단)
      if (!wsecret || req.headers.get("X-Telegram-Bot-Api-Secret-Token") !== wsecret) return json({ ok: false }, 403);
      let u = {}; try { u = await req.json(); } catch (e) {}
      if (u.pre_checkout_query) {
        await tg(token, "answerPreCheckoutQuery", { pre_checkout_query_id: u.pre_checkout_query.id, ok: true });
      }
      // /start → 환영 배너 + 플레이 버튼 (봇 첫 화면) + 레퍼럴 기록 + 언어 자동분기
      if (u.message && typeof u.message.text === "string" && u.message.text.indexOf("/start") === 0) {
        const newId = String((u.message.from && u.message.from.id) || "");
        const payload = (u.message.text.split(" ")[1] || "");
        let inviter = "";
        // 레퍼럴: /start ref<id> → 초대자 카운트 +1 (신규 TG ID당 1회 = 조작방지)
        try {
          if (env.REFERRALS && payload.indexOf("ref") === 0 && newId) {
            const inv = payload.slice(3);
            if (inv && /^\d+$/.test(inv) && inv !== newId) {
              inviter = inv;
              const seen = await env.REFERRALS.get("u:" + newId);
              if (!seen) {
                await env.REFERRALS.put("u:" + newId, inviter);
                const cur = parseInt((await env.REFERRALS.get("c:" + inviter)) || "0", 10);
                await env.REFERRALS.put("c:" + inviter, String(cur + 1));
              }
            }
          }
        } catch (e) {}
        // 🔔 재참여 cron 데이터: 신규/접속 유저 활동기록(chat_id+시각)
        try { if (env.REFERRALS && newId) await env.REFERRALS.put("usr:" + newId, JSON.stringify({ c: u.message.chat.id, last: Date.now(), nudge: 0 }), { expirationTtl: 60 * 86400 }); } catch (e) {}
        // 🌐 영어 고정 (글로벌 첫인상 — 군주 지시)
        const caption = "⚔️ <b>Daedalus Conquest</b> — AI Legion War\n\n🤖 Collect & raise 200+ AI heroes\n🐉 Raid colossal bosses · 🏆 Conquer endless chapters\n🔄 Idle — your legion grows even while you're away.\n\n👇 Rise your legion now:";
        const btn = "🎮 Play Now";
        await tg(token, "sendPhoto", {
          chat_id: u.message.chat.id,
          photo: GAME + "/art/marketing-arclight-banner.jpg",
          caption: caption,
          parse_mode: "HTML",
          reply_markup: { inline_keyboard: [[{ text: btn, web_app: { url: GAME + "/" + (inviter ? "?ref=" + inviter : "") } }]] },   // 🔗 레퍼럴 ?ref= 동봉(즉시보너스)
        });
      }
      // ✅ 결제 완료 → 영수증 KV 저장. 진위는 위 secret_token 인증으로 보장(헤더 검증 통과분만 여기 도달). game.js가 /verify로 확인 후 grant.
      // + agentic auto-yield trigger (RWA + 10000-unit special forces) + cycle timing.
      if (u.message && u.message.successful_payment) {
        const sp = u.message.successful_payment;
        const payloadParts = (sp.invoice_payload || "").split(":");
        const item = payloadParts[payloadParts.length-2] || payloadParts[0]; // support coded LGN: or old
        const uid = payloadParts[payloadParts.length-1] || "0";
        if (env.RECEIPTS && item) await env.RECEIPTS.put("rcpt:" + uid + ":" + item, sp.telegram_payment_charge_id || "1", { expirationTtl: 86400 });
        // Agentic yield credit on pay (full-cheat VR/near-miss identity)
        if (env.RECEIPTS && uid) {
          const cur = parseInt((await env.RECEIPTS.get("yld:" + uid)) || "0", 10);
          const boost = (item === "sf10000" || item === "ultra") ? 1200 : 220; // special forces + RWA pump
          await env.RECEIPTS.put("yld:" + uid, String(cur + boost), { expirationTtl: 86400*14 });
        }
      }
      return json({ ok: true });
    }

    return json({ ok: true, service: "legion-pay", version: "legion-escalated-10000sf+cron", psych: "vr+near-miss+scarcity+MYLegion+RWA+agentic" });
  },

  // 🔔 재참여 알림 — cron 스윕(하루 2회). 24h+ 비활성 유저 DM. 비스팸: 쿨다운48h·평생3회·25명/회 상한(차단 회피).
  async scheduled(event, env, ctx) {
    const token = env.BOT_TOKEN;
    if (!token || !env.REFERRALS) return;
    const now = Date.now();
    const INACTIVE = 24 * 3600 * 1000;
    const COOLDOWN = 48 * 3600 * 1000;
    const MAX_PER_RUN = 25;
    const MAX_LIFETIME = 3;
    const NUDGES = [
      "\u2694\ufe0f Your legion grows restless, Commander. Rivals climbed the tower while you were away.",
      "\ud83c\udff0 Your throne awaits \u2014 daily rewards and a fresh boss are ready to claim.",
      "\ud83d\udd25 A limited banner is live. Enemies are powering up \u2014 don't fall behind.",
    ];
    let cursor, sent = 0;
    do {
      const page = await env.REFERRALS.list({ prefix: "usr:", limit: 1000, cursor });
      for (const k of page.keys) {
        if (sent >= MAX_PER_RUN) return;
        let u; try { u = JSON.parse((await env.REFERRALS.get(k.name)) || "null"); } catch (e) { continue; }
        if (!u || !u.c) continue;
        if (now - (u.last || 0) < INACTIVE) continue;
        if (now - (u.nudge || 0) < COOLDOWN) continue;
        if ((u.nudgeCount || 0) >= MAX_LIFETIME) continue;
        const msg = NUDGES[(u.nudgeCount || 0) % NUDGES.length];
        try {
          await tg(token, "sendMessage", {
            chat_id: u.c,
            text: msg,
            reply_markup: { inline_keyboard: [[{ text: "\u25b6\ufe0f Return to Battle", web_app: { url: GAME + "/" } }]] },
          });
          u.nudge = now; u.nudgeCount = (u.nudgeCount || 0) + 1;
          await env.REFERRALS.put(k.name, JSON.stringify(u), { expirationTtl: 60 * 86400 });
          sent++;
        } catch (e) {}
      }
      cursor = page.list_complete ? null : page.cursor;
    } while (cursor && sent < MAX_PER_RUN);
  },
};
