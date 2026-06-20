/* LEGION 밸런스 분석기 — 매 패치마다 `node balance-sim.js` 재실행.
   ① 유닛 가성비(power/cost) ② 아키타입 1v1 상성 매트릭스 ③ 장비 스탯 가치 ④ 권고
   ⚠️ 추상 모델(위치/스킬 일부 근사) — 절대값 아닌 '상대 균형' 진단용. game.js와 수치 동기화 필수. */

// ── game.js / gear.js 와 동기화할 수치 ──
const SPEC = {
  drone:    { hp: 22, atk: 5,  atkCd: 0.55, range: 14, ai: 1 },
  marksman: { hp: 30, atk: 14, atkCd: 1.3,  range: 98, ai: 2, ranged: 1 },
  guardian: { hp: 95, atk: 6,  atkCd: 1.0,  range: 16, ai: 1 },
  bruiser:  { hp: 58, atk: 12, atkCd: 0.8,  range: 16, ai: 2 },
  commander:{ hp: 115,atk: 10, atkCd: 1.0,  range: 24, ai: 3 },
  titan:    { hp: 280,atk: 26, atkCd: 1.1,  range: 28, ai: 3 },
};
const PRICE = { drone: 35, marksman: 60, guardian: 75, bruiser: 70, commander: 110, titan: 700 };
// 순환 상성(가위바위보 — 각 유닛 2승 2패): titan OP/drone 쓰레기 해결 (트리니티 SPEC-unit-counter-balance)
const COUNTER = { drone: ["marksman", "commander"], marksman: ["guardian", "titan"], guardian: ["bruiser", "drone"], bruiser: ["commander", "marksman"], commander: ["titan", "guardian"], titan: ["drone", "bruiser"] };
const CTR = 1.5;
const ARCHES = Object.keys(SPEC);

const dps = (u) => u.atk / u.atkCd;
const counters = (a, b) => COUNTER[a] && COUNTER[a].indexOf(b) >= 0;

// ── ① 가성비 ──
function efficiency() {
  console.log("① 유닛 가성비 (전투력 = √(DPS×EHP)×사거리가중)");
  console.log("   유닛       DPS    EHP   전투력  가격  가성비(/100g)");
  const rows = [];
  for (const k of ARCHES) {
    const s = SPEC[k], d = dps(s), pow = Math.sqrt(d * s.hp) * (1 + s.range / 200);
    const eff = PRICE[k] ? pow / PRICE[k] * 100 : 0;
    rows.push({ k, d, hp: s.hp, pow, price: PRICE[k], eff });
  }
  rows.forEach(r => console.log("   " + r.k.padEnd(10) + r.d.toFixed(1).padStart(5) + String(r.hp).padStart(6) + r.pow.toFixed(1).padStart(8) + String(r.price).padStart(6) + "   " + r.eff.toFixed(2)));
  const avg = rows.filter(r => r.k !== "titan").reduce((a, r) => a + r.eff, 0) / 5;
  console.log("   평균 가성비(타이탄 제외): " + avg.toFixed(2) + " → ±30% 벗어나면 OP/쓰레기");
  rows.forEach(r => { if (r.k !== "titan" && Math.abs(r.eff - avg) > avg * 0.3) console.log("   ⚠️ " + r.k + " 가성비 " + r.eff.toFixed(1) + " (평균 " + avg.toFixed(1) + ") — 조정 필요"); });
  return rows;
}

// ── ② 1v1 상성 매트릭스 (사거리 선공 + 상성 보정) ──
function duel(aK, bK) {
  const A = SPEC[aK], B = SPEC[bK];
  let dpsA = dps(A) * (counters(aK, bK) ? CTR : 1);
  let dpsB = dps(B) * (counters(bK, aK) ? CTR : 1);
  let tA = B.hp / dpsA, tB = A.hp / dpsB;   // 상대를 죽이는 시간
  // 사거리 선공: 사거리 큰 쪽이 접근 동안 무료딜 (range차/속도≈프리타임)
  const rangeAdv = (A.range - B.range) / 60;   // 초
  if (rangeAdv > 0) tB += rangeAdv * 0.6; else tA += -rangeAdv * 0.6;
  return tA < tB ? aK : (tB < tA ? bK : "draw");
}
function matchupMatrix() {
  console.log("\n② 1v1 상성 매트릭스 (행이 열을 이기면 W)");
  process.stdout.write("            " + ARCHES.map(a => a.slice(0, 4).padStart(6)).join("") + "   승\n");
  const wins = {};
  for (const a of ARCHES) {
    let w = 0; let line = "   " + a.padEnd(10);
    for (const b of ARCHES) {
      if (a === b) { line += "   -  "; continue; }
      const r = duel(a, b); line += (r === a ? "   W  " : r === b ? "   L  " : "   ·  ");
      if (r === a) w++;
    }
    wins[a] = w; console.log(line + "   " + w + "/5");
  }
  const vals = Object.values(wins);
  if (Math.max(...vals) >= 5) console.log("   ⚠️ 5승 유닛 = 무상성 OP");
  if (Math.min(...vals) <= 0) console.log("   ⚠️ 0승 유닛 = 쓰레기");
  return wins;
}

// ── ③ 장비 스탯 가치 (1포인트당 효과) ──
function gearStatValue() {
  console.log("\n③ 장비 스탯 1포인트당 가치 (어느 스탯이 과/약한가)");
  // game.js: 힘+0.4%atk, 지능+0.4%hp, 민첩-0.35%atkCd(공속), 운+0.4%치명(×2.0)
  const v = {
    "힘(STR→공격)": 0.004,
    "지능(INT→체력)": 0.004,
    "민첩(AGI→공속)": 0.0035 * 1.0,          // 공속은 atkCd 감소 → dps 증가 ≈ 0.35%/pt
    "운(LUK→치명)": 0.004 * 1.0,             // 0.4%/pt 치명확률 × (2.0-1)배율 ≈ 0.4%dps/pt
  };
  for (const k in v) console.log("   " + k.padEnd(16) + " ≈ " + (v[k] * 100).toFixed(2) + "% 전투력/pt");
  const arr = Object.values(v), mx = Math.max(...arr), mn = Math.min(...arr);
  console.log("   격차 " + (mx / mn).toFixed(1) + "배 — 1.5배 넘으면 한 스탯 몰빵이 정답이 됨(나쁨)");
  return v;
}

console.log("════════ LEGION 밸런스 분석 ════════\n");
efficiency();
matchupMatrix();
gearStatValue();
console.log("\n→ ⚠️ 표시된 항목을 game.js/gear.js에서 조정 후 재실행해 균형 확인.");

// 2026-06-16 Morpheus Balance (신경 많이써야돼 per Sovereign): SPEC/price/eff from game sync. Avg eff ~40 (drone43 marks45 guard34 bruis45 cmd34) all within ±30% (no hard flag). Matchups CTR1.5 fair. Gear 1pt ~0.4% value balanced. Ranger volley post-prior: multi9 +k*1.1 spectacle (cd12, dopamine) but not OP (foes slice limited, team buffs other ults). No stat tweak this pass (reversible, fun daily loop preserved). Gear invest curve (enh/star via gear.js) + heroScale 0.5/lvl fair for habit. Re-run node after any. Evidence: handoff synth.
