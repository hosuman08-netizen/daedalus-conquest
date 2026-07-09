/* LEGION RAID + LEADERBOARD 백엔드 — Cloudflare Worker (WAVE2 스캐폴드, Trinity 2026-07-10)
   역할: 비동기 군단 습격(Coin Master식) + 읽기전용 주간 리더보드.
   저인구 대응: 실유저 방어 스냅샷 풀 + 부족분은 AI 방어군(정직 표기, 가짜 실유저 위장 금지=FTC).
   KV: RAID (raid:snap:{uid}=방어스냅샷 · raid:shield:{uid} · raid:rev:{uid}=복수큐 · raid:log:{uid})
       RANK (rank:{week}:{metric} zset-유사 상위N · rank:my:{uid})
   법: PvP+in-game 재화(실화폐 스테이크 없음). 약탈=상한+회복가능(영구손실X). age-gate는 클라.
   배포: wrangler-raid.toml (KV 네임스페이스 생성 필요 — neo). 인증: Telegram initData 서명검증 권장(TODO).
*/
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json", "access-control-allow-origin": "*" } });
const wk = () => { const d = Math.floor(Date.now() / 86400000); return "w" + Math.floor((d - 3) / 7); }; // 주 단위(목요일 기준 대략)

// AI 방어군 생성 — 유저 파워 근처로 스케일. 정직하게 "AI 방어군"으로 표기.
function aiTarget(power, i) {
  const scale = 0.85 + (i * 0.12);                 // 3타겟: 약간 약함~약간 강함
  const p = Math.max(100, Math.round(power * scale));
  const names = ["Echo 방어군", "Rift 수비대", "Sentinel 잔당"]; // AI 명시(가짜 유저 아님)
  return { id: "ai_" + i, name: names[i % 3], power: p, isAI: true, gold: Math.round(p * 12) };
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const P = url.pathname;
    const uid = (url.searchParams.get("uid") || "").replace(/[^0-9]/g, "");
    if (req.method === "OPTIONS") return json({ ok: true });

    try {
      // ── 방어 스냅샷 제출 (전투력·간이 로스터) ──
      if (P === "/raid/snapshot" && req.method === "POST") {
        if (!uid || !env.RAID) return json({ ok: false }, 400);
        const b = await req.json().catch(() => ({}));
        const snap = { uid, power: Number(b.power) || 0, name: (b.name || "군단").slice(0, 24), t: Date.now() };
        await env.RAID.put("raid:snap:" + uid, JSON.stringify(snap), { expirationTtl: 30 * 86400 });
        return json({ ok: true });
      }

      // ── 습격 타겟 3개 (실유저 스냅샷 근처 + AI 채움) ──
      if (P === "/raid/targets") {
        const power = Number(url.searchParams.get("power")) || 100;
        const targets = [];
        // 실유저 스냅샷 샘플(간이: list 접두어). 저인구면 대부분 AI.
        if (env.RAID) {
          const list = await env.RAID.list({ prefix: "raid:snap:", limit: 30 });
          const cand = [];
          for (const k of list.keys) {
            if (k.name === "raid:snap:" + uid) continue;
            const s = JSON.parse((await env.RAID.get(k.name)) || "null");
            if (s && Math.abs(s.power - power) < power * 0.6) cand.push({ id: s.uid, name: s.name, power: s.power, isAI: false, gold: Math.round(s.power * 12) });
          }
          cand.sort((a, c) => Math.abs(a.power - power) - Math.abs(c.power - power));
          targets.push(...cand.slice(0, 2));
        }
        while (targets.length < 3) targets.push(aiTarget(power, targets.length));
        return json({ ok: true, targets, note: "AI 방어군은 표기됨(isAI). 약탈은 상한·회복가능." });
      }

      // ── 습격 결과 기록 (승리 시 골드 약탈 상한, 피습자 복수큐) ──
      if (P === "/raid/result" && req.method === "POST") {
        if (!uid || !env.RAID) return json({ ok: false }, 400);
        const b = await req.json().catch(() => ({}));
        const win = !!b.win, tgt = String(b.target || ""), steal = Math.max(0, Math.min(Number(b.steal) || 0, 5000)); // 상한
        await env.RAID.put("raid:log:" + uid + ":" + Date.now(), JSON.stringify({ tgt, win, steal }), { expirationTtl: 14 * 86400 });
        if (win && tgt && !tgt.startsWith("ai_")) {                       // 실유저 피습 → 복수큐
          const rev = JSON.parse((await env.RAID.get("raid:rev:" + tgt)) || "[]");
          rev.push({ by: uid, steal, t: Date.now() });
          await env.RAID.put("raid:rev:" + tgt, JSON.stringify(rev.slice(-20)), { expirationTtl: 7 * 86400 });
        }
        return json({ ok: true, stolen: win ? steal : 0 });
      }

      // ── 복수큐 조회 (로그인 시 "누가 널 습격") ──
      if (P === "/raid/revenge") {
        if (!uid || !env.RAID) return json({ ok: true, revenge: [] });
        const rev = JSON.parse((await env.RAID.get("raid:rev:" + uid)) || "[]");
        return json({ ok: true, revenge: rev });
      }

      // ── 주간 리더보드: 제출 ──
      if (P === "/leaderboard/submit" && req.method === "POST" && env.RANK) {
        if (!uid) return json({ ok: false }, 400);
        const b = await req.json().catch(() => ({}));
        const metric = ["power", "carried", "tower"].includes(b.metric) ? b.metric : "power";
        const key = "rank:" + wk() + ":" + metric;
        const board = JSON.parse((await env.RANK.get(key)) || "[]");
        const me = { uid, name: (b.name || "군단").slice(0, 24), v: Number(b.value) || 0 };
        const idx = board.findIndex((x) => x.uid === uid);
        if (idx >= 0) board[idx] = me; else board.push(me);
        board.sort((a, c) => c.v - a.v);
        await env.RANK.put(key, JSON.stringify(board.slice(0, 100)), { expirationTtl: 21 * 86400 });
        return json({ ok: true, rank: board.findIndex((x) => x.uid === uid) + 1 });
      }

      // ── 주간 리더보드: 조회(읽기전용 상위 N + 내 순위) ──
      if (P === "/leaderboard") {
        const metric = ["power", "carried", "tower"].includes(url.searchParams.get("metric")) ? url.searchParams.get("metric") : "power";
        const key = "rank:" + wk() + ":" + metric;
        const board = env.RANK ? JSON.parse((await env.RANK.get(key)) || "[]") : [];
        const myRank = uid ? board.findIndex((x) => x.uid === uid) + 1 : 0;
        // 주 마감까지 남은 시간(FOMO)
        const weekEndMs = (Math.floor(Date.now() / 86400000 / 7) + 1) * 7 * 86400000;
        return json({ ok: true, top: board.slice(0, 50), myRank, endsInSec: Math.max(0, Math.round((weekEndMs - Date.now()) / 1000)), metric });
      }

      return json({ ok: true, service: "legion-raid", scaffold: "WAVE2 — KV 생성+배포 필요(neo)" });
    } catch (e) { return json({ ok: false, error: String(e) }, 500); }
  },
};
