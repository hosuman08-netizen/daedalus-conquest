/* LEGION 환생(Prestige) 루프 밸런스 sim — CPO 트리니티, 2026-06-16
   목적: PRD-prestige-loop의 "가장 위험한 가정" 검증 + 확정 수치 산출.
     ① 진입챕터(15/18/20) ② 에테르 획득 곡선 ③ 영구배율(에테르 노드) ④ 노드 비용
   검증 기준: (a) 첫 환생 전 충분히 논다(벽=진입챕터 근처)
             (b) 3회+ 환생이 매번 "눈에 띄게 더 멀리"(루프가 1~2회로 안 끝남)
             (c) 직전 벽 재돌파가 빠르다(도파민) — 영구배율이 초반을 빠르게 녹임
   ⚠️ game.js 난이도 공식 그대로 이식. 절대값 아닌 '루프가 도는가' 진단용.
   실행: node balance-sim-prestige.js */

// ── game.js 동기화: 유닛 전투력 (efficiency()와 동일 공식) ──
const SPEC = {
  drone:    { hp: 22, atk: 5,  atkCd: 0.55, range: 14 },
  marksman: { hp: 30, atk: 14, atkCd: 1.3,  range: 98 },
  guardian: { hp: 95, atk: 6,  atkCd: 1.0,  range: 16 },
  bruiser:  { hp: 58, atk: 12, atkCd: 0.8,  range: 16 },
  commander:{ hp: 115,atk: 10, atkCd: 1.0,  range: 24 },
  titan:    { hp: 280,atk: 26, atkCd: 1.1,  range: 28 },
};
const upow = (s) => Math.sqrt((s.atk / s.atkCd) * s.hp) * (1 + s.range / 200);
const UPOW = Object.fromEntries(Object.entries(SPEC).map(([k, s]) => [k, upow(s)]));

// ── game.js:592 enemyForChapter 그대로 ──
function enemyForChapter(ch) {
  ch = Math.max(1, ch | 0);
  if (ch <= 8) return { drone: 1 + ((ch - 1) >> 1), marksman: ch >= 5 ? 1 : 0, guardian: 0, bruiser: 0, commander: 0, titan: 0 };
  if (ch <= 20) return {
    drone: 2 + ((ch - 8) >> 1), marksman: 1 + Math.floor((ch - 9) / 5),
    guardian: ch >= 12 ? 1 + Math.floor((ch - 12) / 6) : 0, bruiser: ch >= 16 ? 1 : 0, commander: 0, titan: 0,
  };
  return {
    drone: 4 + ((ch - 20) >> 1), marksman: 3 + Math.floor((ch - 20) / 4),
    guardian: 2 + Math.floor((ch - 20) / 5), bruiser: 1 + Math.floor((ch - 20) / 4),
    commander: ch >= 30 ? 1 + Math.floor((ch - 30) / 8) : 0, titan: ch >= 50 ? 1 + Math.floor((ch - 50) / 30) : 0,
  };
}
// ── game.js:630 enemyPowerMul 그대로 (※루프 튜닝용 ch21 계수 RAMP 파라미터화) ──
function enemyPowerMul(ch, ramp) {
  ch = ch | 0;
  if (ch <= 8) return 0.7;
  if (ch <= 20) return 1.0;
  return 1 + Math.max(0, ch - 20) * ramp;
}
function enemyPower(ch, ramp) {
  const c = enemyForChapter(ch);
  let p = 0; for (const k in c) p += c[k] * UPOW[k];
  return p * enemyPowerMul(ch, ramp);
}

// ── 플레이어 단일런 모델 ──
// 한 번의 런에서 골드로 쌓을 수 있는 군대 전투력은 정체(plateau)한다 = 벽의 근본 원인.
// P_BASE를 "에테르 0일 때 벽 = 진입챕터"가 되도록 보정. 영구배율 M으로만 한계 돌파.
function wallChapter(M, ramp) {
  let last = 1;
  for (let ch = 1; ch <= 200; ch++) { if (enemyPower(ch, ramp) <= P_BASE * M) last = ch; else break; }
  return last;
}

// ── 튜닝 파라미터 ──
let P_BASE;
function calibrate(entry, ramp) { P_BASE = enemyPower(entry, ramp); }

const CFG = {
  entry: 18,
  ramp: 0.022,                    // game.js=0.028 → 루프용 소폭 완화
  etherDiv: 42,
  etherGain(wall, ramp) { return Math.max(1, Math.round(enemyPower(wall, ramp) / this.etherDiv)); },
  nodeMul: 1.08,                  // 레벨당 영구 power ×nodeMul (복리)
  costBase: 4,
  costRatio: 1.3,                 // 비용 누진율
  nodeCost(lv) { return Math.max(1, Math.round(this.costBase * Math.pow(this.costRatio, lv))); },
};

function spendEther(cfg, bank, lv) {
  let bought = 0;
  while (bank >= cfg.nodeCost(lv)) { bank -= cfg.nodeCost(lv); lv++; bought++; }
  return { lv, bank, bought };
}

// ── 그리드 서치: 건강한 (etherDiv, nodeMul, costRatio) 조합 탐색 ──
function score(cfg) {
  const rows = runLoop(cfg);
  const adv = rows.slice(1, 7).map(r => r.adv);          // 루프2~7 전진
  const stall = adv.filter(a => a <= 0).length;
  const explode = adv.filter(a => a >= 12).length;
  const inBand = adv.filter(a => a >= 3 && a <= 8).length;
  const reclearOk = rows.slice(1).every(r => r.reclear === "즉시✓");
  const totalAdv = rows[rows.length - 1].wall - cfg.entry;
  return { rows, adv, stall, explode, inBand, reclearOk, totalAdv };
}
function search() {
  const cands = [];
  for (const etherDiv of [12, 18, 24, 30, 36])
    for (const nodeMul of [1.10, 1.14, 1.18, 1.22])
      for (const costRatio of [1.18, 1.25, 1.32])
        for (const costBase of [3, 5]) {
          const cfg = { ...CFG, entry: 18, etherDiv, nodeMul, costRatio, costBase };
          const s = score(cfg);
          if (s.reclearOk && s.stall === 0 && s.explode === 0 && s.inBand >= 5)
            cands.push({ cfg, s });
        }
  cands.sort((a, b) => (b.s.inBand - a.s.inBand) || (a.s.cfg ? 0 : 0) || (Math.abs(a.s.totalAdv - 35) - Math.abs(b.s.totalAdv - 35)));
  console.log(`\n──── 그리드 서치: 건강한 조합 ${cands.length}개 (진입ch18, 루프2~7 전진 +3~8) ────`);
  cands.slice(0, 8).forEach(({ cfg, s }) => {
    console.log(`  에테르=적파워/${String(cfg.etherDiv).padStart(2)} · 노드×${cfg.nodeMul} · 비용${cfg.costBase}×${cfg.costRatio}^lv  → 전진[${s.adv.join(",")}] 8루프총 ch${cfg.entry}→${s.rows[7].wall}`);
  });
  return cands[0];
}

function runLoop(cfg) {
  calibrate(cfg.entry, cfg.ramp);
  let nodeLv = 0, etherBank = 0, M = 1, prevWall = 0;
  const rows = [];
  for (let p = 1; p <= 8; p++) {
    const wall = wallChapter(M, cfg.ramp);
    const gain = cfg.etherGain(wall, cfg.ramp);
    etherBank += gain;
    const adv = wall - prevWall;
    const reclear = p === 1 ? "-" : (enemyPower(prevWall, cfg.ramp) <= P_BASE * M ? "즉시✓" : "느림⚠");
    const sp = spendEther(cfg, etherBank, nodeLv);
    rows.push({ p, wall, adv, gain, etherBank, M: M.toFixed(2), nodeLv, bought: sp.bought, reclear });
    nodeLv = sp.lv; etherBank = sp.bank;
    M = Math.pow(cfg.nodeMul, nodeLv);
    prevWall = wall;
  }
  return rows;
}

function printRun(label, cfg) {
  console.log(`\n════ ${label} (진입ch${cfg.entry} · ramp${cfg.ramp} · 노드×${cfg.nodeMul}/lv · 에테르=적파워/${cfg.etherDiv}) ════`);
  console.log(" 환생#  도달벽  전진  에테르획득  보유  영구배율  노드Lv(+구매)  직전벽재돌파");
  const rows = runLoop(cfg);
  for (const r of rows) {
    console.log(`  ${String(r.p).padStart(3)}  ${String(r.wall).padStart(6)}  ${String(r.adv >= 0 ? "+" + r.adv : r.adv).padStart(5)}  ${String(r.gain).padStart(8)}  ${String(r.etherBank).padStart(4)}  ${r.M.padStart(8)}  ${String(r.nodeLv).padStart(6)}(+${r.bought})    ${r.reclear}`);
  }
  const adv5 = rows.slice(1, 6).map(r => r.adv);
  const healthy = adv5.every(a => a >= 3 && a <= 9);
  console.log(`  → 루프2~6 전진: [${adv5.join(", ")}]  ${healthy ? "✅ 건강(매 환생 +3~9 꾸준)" : "⚠️ 점검(stall이거나 폭발)"}`);
}

console.log("════════ LEGION 환생 루프 sim v2 (복리 배율) ════════");
console.log("유닛 전투력:", Object.fromEntries(Object.entries(UPOW).map(([k, v]) => [k, +v.toFixed(1)])));
console.log("적 파워 곡선(ramp0.022):", [8, 15, 18, 20, 25, 30, 35, 40].map(c => `ch${c}=${enemyPower(c, 0.022).toFixed(0)}`).join("  "));

const best = search();
if (best) {
  console.log("\n★ 최적 조합 상세:");
  printRun("추천", best.cfg);
  // 진입챕터 민감도 (같은 상수로 15/20도)
  printRun("같은상수·진입ch15", { ...best.cfg, entry: 15 });
  printRun("같은상수·진입ch20", { ...best.cfg, entry: 20 });
} else {
  console.log("\n⚠️ 건강한 조합 없음 — 탐색 범위 확대 필요.");
}

console.log("\n→ 판정: 루프2~6 '전진'이 +3~8 꾸준 & 재돌파 '즉시✓' = 건강한 무한 루프.");
