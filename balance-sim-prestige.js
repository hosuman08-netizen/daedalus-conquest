/* LEGION 환생(Prestige) 루프 밸런스 sim v3 — 밸런스팀, 2026-07-10
   목적: PRD-prestige-loop의 "가장 위험한 가정" 검증 — game.js 실제 상수를 그대로 시뮬레이션한다.
     ① 진입챕터(15/18/20) ② 에테르 획득 곡선 ③ 영구배율(선형 노드) ④ 노드 비용
   검증 기준: (a) 첫 환생 전 충분히 논다(벽=진입챕터 근처)
             (b) 3회+ 환생이 매번 stall 없이 전진(루프가 1~2회로 안 끝남)
             (c) 직전 벽 재돌파가 빠르다(도파민) — 영구배율이 초반을 빠르게 녹임
   ⚠️ game.js 난이도·환생 공식 그대로 이식(v2의 임의 그리드서치/복리모델 제거 — 그건 game.js와 다른 식이라 '확정 수치'가 거짓이었음).
      절대값은 game.js 상수의 실제 결과이므로 '루프가 도는가'와 함께 라이브 출력에서 읽을 것.
   실행: node balance-sim-prestige.js */

// ── game.js 동기화: 유닛 전투력 (balance-sim.js efficiency()와 동일: hp*0.5 + dps*3) ──
const SPEC = {
  drone:    { hp: 22, atk: 5,  atkCd: 0.55, range: 14 },
  marksman: { hp: 30, atk: 14, atkCd: 1.3,  range: 98 },
  guardian: { hp: 95, atk: 6,  atkCd: 1.0,  range: 16 },
  bruiser:  { hp: 58, atk: 12, atkCd: 0.8,  range: 16 },
  commander:{ hp: 115,atk: 10, atkCd: 1.0,  range: 24 },
  titan:    { hp: 280,atk: 26, atkCd: 1.1,  range: 28 },
};
// game.js:1218 legionPower base = hp*0.5 + dps*3 (v2의 √(dps×hp)×사거리가중은 game.js에 없어 제거).
const upow = (s) => s.hp * 0.5 + (s.atk / s.atkCd) * 3;
const UPOW = Object.fromEntries(Object.entries(SPEC).map(([k, s]) => [k, upow(s)]));

// ── game.js:1465 enemyForChapter 그대로 (21+ drone base 8, 수학자 P0 가짜벽 제거 반영) ──
function enemyForChapter(ch) {
  ch = Math.max(1, ch | 0);
  if (ch <= 8) return { drone: 1 + ((ch - 1) >> 1), marksman: ch >= 5 ? 1 : 0, guardian: 0, bruiser: 0, commander: 0, titan: 0 };
  if (ch <= 20) return {
    drone: 2 + ((ch - 8) >> 1), marksman: 1 + Math.floor((ch - 9) / 5),
    guardian: ch >= 12 ? 1 + Math.floor((ch - 12) / 6) : 0, bruiser: ch >= 16 ? 1 : 0, commander: 0, titan: 0,
  };
  return {
    drone: 8 + ((ch - 20) >> 1), marksman: 3 + Math.floor((ch - 20) / 4),
    guardian: 2 + Math.floor((ch - 20) / 5), bruiser: 1 + Math.floor((ch - 20) / 4),
    commander: ch >= 30 ? 1 + Math.floor((ch - 30) / 8) : 0, titan: ch >= 50 ? 1 + Math.floor((ch - 50) / 30) : 0,
  };
}
// ── game.js:1503 enemyPowerMul 그대로 (ch>20 램프 0.022 고정) ──
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

// ── game.js 실제 환생 상수 (동기화, 절대 튜닝하지 말 것 — game.js가 진실원) ──
//   ascPowerMul = 1 + might*0.02 + bulwark*0.02 + ascCount*0.02   (선형·복리금지, game.js:1528)
//   ascNodeCost(lv) = round(5 * 1.25^lv)                           (game.js:1529)
//   etherGain(ch)   = ch<18 ? 0 : round(20 * 1.18^((ch-18)/2))     (game.js:1520)
const ASCEND_GATE = 18;                                    // game.js:1518
const NODE_POWER  = 0.02;                                  // 노드 1레벨당 +2% 파워(선형)
const ASC_POWER   = 0.02;                                  // 환생 1회당 +2% 파워(선형)
function etherGain(ch) { ch = ch | 0; return ch < ASCEND_GATE ? 0 : Math.round(20 * Math.pow(1.18, (ch - ASCEND_GATE) / 2)); }
function nodeCost(lv) { return Math.round(5 * Math.pow(1.25, lv)); }

const CFG = { entry: 18, ramp: 0.022 };                   // game.js: 진입ch18, 램프0.022 고정

// ── 플레이어 단일런 모델 ──
// 한 번의 런에서 골드로 쌓을 수 있는 군대 전투력은 정체(plateau)한다 = 벽의 근본 원인.
// P_BASE를 "에테르 0일 때 벽 = 진입챕터"가 되도록 보정. 영구배율 M(선형)으로만 한계 돌파.
let P_BASE;
function calibrate(entry, ramp) { P_BASE = enemyPower(entry, ramp); }
function wallChapter(M, ramp) {
  let last = 1;
  for (let ch = 1; ch <= 300; ch++) { if (enemyPower(ch, ramp) <= P_BASE * M) last = ch; else break; }
  return last;
}

// 남은 에테르로 노드 최대 구매 (선형 파워, 비용 5·1.25^lv 누진)
function spendEther(bank, lv) {
  let bought = 0;
  while (bank >= nodeCost(lv)) { bank -= nodeCost(lv); lv++; bought++; }
  return { lv, bank, bought };
}

function runLoop(cfg) {
  calibrate(cfg.entry, cfg.ramp);
  let nodeLv = 0, etherBank = 0, ascCount = 0, prevWall = 0;
  const rows = [];
  for (let p = 1; p <= 8; p++) {
    const M = 1 + nodeLv * NODE_POWER + ascCount * ASC_POWER;      // 선형 배율(game.js와 동일)
    const wall = wallChapter(M, cfg.ramp);
    const gain = etherGain(wall);                                  // 깊이비례(game.js 실제식)
    etherBank += gain;
    const adv = wall - prevWall;
    const reclear = p === 1 ? "-" : (enemyPower(prevWall, cfg.ramp) <= P_BASE * M ? "즉시✓" : "느림⚠");
    const sp = spendEther(etherBank, nodeLv);
    rows.push({ p, wall, adv, gain, etherBank, M: M.toFixed(2), nodeLv, bought: sp.bought, reclear });
    nodeLv = sp.lv; etherBank = sp.bank; ascCount++; prevWall = wall;
  }
  return rows;
}

function printRun(label, cfg) {
  console.log(`\n════ ${label} (진입ch${cfg.entry} · ramp${cfg.ramp} · 노드+${NODE_POWER * 100}%/lv 선형 · 비용 5·1.25^lv · 에테르 20·1.18^((ch-18)/2)) ════`);
  console.log(" 환생#  도달벽  전진  에테르획득  보유  영구배율  노드Lv(+구매)  직전벽재돌파");
  const rows = runLoop(cfg);
  for (const r of rows) {
    console.log(`  ${String(r.p).padStart(3)}  ${String(r.wall).padStart(6)}  ${String(r.adv >= 0 ? "+" + r.adv : r.adv).padStart(5)}  ${String(r.gain).padStart(8)}  ${String(r.etherBank).padStart(4)}  ${r.M.padStart(8)}  ${String(r.nodeLv).padStart(6)}(+${r.bought})    ${r.reclear}`);
  }
  const adv5 = rows.slice(1, 6).map(r => r.adv);
  const noStall = adv5.every(a => a >= 1);
  console.log(`  → 루프2~6 전진: [${adv5.join(", ")}]  ${noStall ? "✅ stall 없이 매 환생 전진" : "⚠️ stall(≤0) 발생 — game.js 노드/에테르 상수 재검토"}`);
}

console.log("════════ LEGION 환생 루프 sim v3 (game.js 실상수 동기화 · 선형배율) ════════");
console.log("유닛 전투력(hp*0.5+dps*3):", Object.fromEntries(Object.entries(UPOW).map(([k, v]) => [k, +v.toFixed(1)])));
console.log("적 파워 곡선(ramp0.022):", [8, 15, 18, 20, 25, 30, 35, 40].map(c => `ch${c}=${enemyPower(c, 0.022).toFixed(0)}`).join("  "));

printRun("실상수·진입ch18", CFG);
printRun("실상수·진입ch15", { ...CFG, entry: 15 });
printRun("실상수·진입ch20", { ...CFG, entry: 20 });

console.log("\n→ 판정: 루프2~6 전진이 stall 없이 +면 무한 루프 성립. 전진폭은 game.js 선형 상수의 실제 결과이므로 라이브 출력에서 읽을 것(주석 하드코딩 금지).");
