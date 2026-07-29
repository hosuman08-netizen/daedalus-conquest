/* LEGION 장비 로스터 — 120종 (5슬롯 × 4등급 × 6). game.js보다 먼저 로드.
   ⚔️무기→힘 · 🛡️방어구→지능 · 👟장신구→민첩 · 🍀유물→운 · 💠코어→전스탯 */
const SLOTS = ["weapon", "armor", "acc", "relic", "core"];
const SLOT_ICON = { weapon: "⚔️", armor: "🛡️", acc: "👟", relic: "🍀", core: "💠" };
const SLOT_MAIN = { weapon: "str", armor: "int", acc: "agi", relic: "luk", core: "mix" };
const STAT_KEYS = ["str", "int", "agi", "luk"];
// 키명 'key' — game.js RARITY(가챠) 및 units.js와 동일 관례로 통일(레어도 단일 진실원 정합).
const GEAR_RARITY = [
  { key: "N", p: 0.55, base: 6, color: "#9ca3af" },
  { key: "R", p: 0.30, base: 12, color: "#60a5fa" },
  { key: "SR", p: 0.12, base: 22, color: "#c084fc" },
  { key: "SSR", p: 0.03, base: 40, color: "#fbbf24" }, // Sovereign 지정: N55% R30% SR12% SSR3% (장비 동일)
];
function rollGearRarity() { let r = Math.random(), a = 0; for (const x of GEAR_RARITY) { a += x.p; if (r <= a) return x; } return GEAR_RARITY[0]; }

const GEAR_NOUN = {
  weapon: ["검", "창", "대검", "도끼", "건틀릿", "캐논"],
  armor: ["갑주", "흉갑", "로브", "보호판", "방벽", "장갑"],
  acc: ["부츠", "망토", "날개", "추진기", "가속링", "비행체"],
  relic: ["부적", "룬", "오브", "성물", "토템", "인장"],
  core: ["코어", "심장", "엔진", "결정", "동력원", "영혼석"],
};
const GEAR_PREFIX = ["강철", "그림자", "폭풍", "심연", "칠흑", "진홍", "백야", "망령", "천공", "무한",
  "파멸", "서리", "화염", "뇌광", "흑요", "적염", "청뢰", "황혼", "여명", "독사",
  "혈월", "은하", "절대", "광휘"];

// ── Project 2: GEAR SETS (loyalty + dopamine) — 5개 테마 세트, 2/4/5pc 진짜 보상
// compliant: genuine collection progress, no false claim. North Star D7/K guard.
const GEAR_SETS = {
  storm:   { name: "폭풍의 서약", thresholds: [2,4], bonuses: { haste: 0.10, crit: 6 } },
  abyss:   { name: "심연의 계약", thresholds: [2], bonuses: { pierce: 9, reflect: 0.12 } },
  inferno: { name: "화염의 각인", thresholds: [4,5], bonuses: { atkMul: 0.14 } },
  eternal: { name: "영원의 군단", thresholds: [5], bonuses: { allMul: 0.09 } },
  void:    { name: "공허의 인장", thresholds: [3,5], bonuses: { crit: 12, critDmg: 0.22 } }
};
const GEAR_SET_KEYS = Object.keys(GEAR_SETS);

// build 시 세트 할당 (결정적 + SSR 편향으로 수집욕 자극)
function assignSetToTpl(tpl, idx) {
  if (tpl.rarity === "N" && idx % 3 !== 0) { tpl.set = null; return; } // N 일부만 세트 (희귀함)
  const k = GEAR_SET_KEYS[idx % GEAR_SET_KEYS.length];
  tpl.set = k;
}

function buildGearRoster() {
  const roster = []; let id = 0, pi = 0;
  ["SSR", "SR", "R", "N"].forEach((rk) => {
    const rar = GEAR_RARITY.find((x) => x.key === rk), base = rar.base;
    SLOTS.forEach((slot, si) => {
      for (let i = 0; i < 6; i++) {
        const tpl = { id: ++id, slot: slot, rarity: rk, color: rar.color, str: 0, int: 0, agi: 0, luk: 0 };
        if (slot === "core") {
          STAT_KEYS.forEach((s) => { tpl[s] = Math.round(base * 0.32); });
        } else {
          tpl[SLOT_MAIN[slot]] = base;
          tpl[STAT_KEYS[(si + i + 1) % 4]] += Math.round(base * 0.4);
        }
        tpl.name = GEAR_PREFIX[pi % GEAR_PREFIX.length] + " " + GEAR_NOUN[slot][i]; pi++;
        tpl.vis = SLOT_ICON[slot] + (["⚔️","🗡️","🔪","🏹","🔫","💣"][i % 6] || "");
        assignSetToTpl(tpl, id);
        roster.push(tpl);
      }
    });
  });
  return roster;
}
var GEAR_ROSTER = buildGearRoster(); // 재빌드 (set 포함) — var for classic <script> global

// makeGear 시 set 상속
function makeGear(forceRar) {
  const rk = forceRar || rollGearRarity().key;
  const pool = GEAR_ROSTER.filter((t) => t.rarity === rk);
  const tpl = pool[(Math.random() * pool.length) | 0];
  const inst = { id: -1, tplId: tpl.id, slot: tpl.slot, rarity: tpl.rarity, color: tpl.color, name: tpl.name, str: tpl.str, int: tpl.int, agi: tpl.agi, luk: tpl.luk, enh: 0, star: 0, awak: 0 };
  if (tpl.set) inst.set = tpl.set;
  return inst;
}

// ── 🌟 SSR 장비 패시브 (슬롯 특성별 — 트리니티 SPEC-gear-overhaul) ──────────────
// SSR 장비만 보유. game.js getGearEffectsForChar()가 getGearPassive(g)로 참조해 발동.
const GEAR_PASSIVE = {
  weapon: { id: "execute", name: "처형", en: "Execute", icon: "⚔️", desc: "공격 시 5% 확률 추가타 (+50% 피해)",  proc: 0.05, mult: 0.5 },
  armor:  { id: "endure",  name: "불굴", en: "Endure",  icon: "🛡️", desc: "체력 ≤30% 시 받는 피해 -20%",         thresh: 0.30, reduce: 0.20 },
  acc:    { id: "haste",   name: "쾌속", en: "Haste",   icon: "👟", desc: "공격속도 +10% · 회피 5%",            spd: 0.10, evade: 0.05 },
  relic:  { id: "fortune", name: "행운", en: "Fortune", icon: "🍀", desc: "치명확률 +8%",                        crit: 0.08 },   // ⚠️ goldBonus 미발동(골드훅 없음)→표기 제거(정직·미꾸라지 disclosure). 발동 구현 시 desc+goldBonus 복원.
  core:   { id: "sigil",   name: "각인", en: "Sigil",   icon: "💠", desc: "전 스탯 +3%",                        allStat: 0.03 },
};
// SSR 장비 1개의 패시브 반환(없으면 null). 슬롯별 1종 고정 = 특성 일치.
function getGearPassive(g) { return (g && g.rarity === "SSR") ? (GEAR_PASSIVE[g.slot] || null) : null; }

// ── ⚔️ 치명 단일 진실원 (rank26/27) ─────────────────────────────────────────
// 운(luk)→치명확률(%). base 10 + luk·0.4, 캡 45%. game.js squad·개별캐릭 두 경로가
// 이 한 식만 호출하도록 통일 예정(현재 game.js:1245는 base0/캡40, 1268은 base10/캡45로 갈림 → game.js 담당 반영 필요).
function gearCrit(luk) { return Math.min(45, 10 + (luk || 0) * 0.4); }
// 치명타 데미지 배율 단일 상수. game.js:1930 코드(2.0)·balance-sim이 이 값을 참조(주석 1.6은 스테일 → game.js 담당 정정 필요).
const CRIT_DMG = 2.0;

// ⚠️ 회귀 복구(모피어스): gear-overhaul 미커밋 편집서 gearStat 삭제됨 → game.js가 호출하는데 미정의=장착 시 크래시.
// HEAD 원본 그대로 재삽입(라이브 동작 보존). 30성 곡선/효과 변경은 Trinity가 별도 적용.
function gearStat(g, key) {
  const base = (g[key] || 0);
  const e = (g.enh || 0);
  const s = (g.star || 0);
  const a = (g.awak || 0);
  // 30성 개편 곡선(Trinity SPEC): ★1~5 +25%/성, ★6~30 +10%/성 (★30=+375%, 선형 +750% 폭주 회피)
  const starMul = Math.min(s, 5) * 0.25 + Math.max(0, s - 5) * 0.10;
  return Math.round(base * (1 + e * 0.1) * (1 + starMul) * (1 + a * 0.40));
}

// 세트 카운트 + 보너스 계산 (순수, 어디서든 호출)
function getActiveSetCounts(gearList) {
  const c = {};
  (gearList || []).forEach(g => { if (g && g.set) c[g.set] = (c[g.set] || 0) + 1; });
  return c;
}

function getSetBonuses(counts) {
  const b = { atkMul: 1, hpMul: 1, haste: 0, crit: 0, pierce: 0, reflect: 0, critDmg: 0 };
  Object.keys(counts || {}).forEach(k => {
    const def = GEAR_SETS[k]; if (!def) return;
    const cnt = counts[k];
    def.thresholds.forEach(th => {
      if (cnt >= th) {
        const bo = def.bonuses;
        if (bo.atkMul) b.atkMul = Math.max(b.atkMul, 1 + bo.atkMul);
        if (bo.hpMul || bo.allMul) {
          const m = bo.hpMul || bo.allMul;
          b.hpMul = Math.max(b.hpMul, 1 + m);
        }
        if (bo.haste) b.haste = Math.max(b.haste, bo.haste);
        if (bo.crit) b.crit = Math.max(b.crit, bo.crit);
        if (bo.pierce) b.pierce = Math.max(b.pierce, bo.pierce);
        if (bo.reflect) b.reflect = Math.max(b.reflect, bo.reflect);
        if (bo.critDmg) b.critDmg = Math.max(b.critDmg, bo.critDmg);
      }
    });
  });
  return b;
}

// 편의: 장착 오브젝트 + 전체 gear 배열로 활성 세트/보너스
function getGearSetBonusesForEquip(eq, fullGearArr) {
  const list = [];
  for (const slot of SLOTS) {
    const gid = eq && eq[slot];
    if (!gid) continue;
    const g = (fullGearArr || []).find(x => x.id === gid);
    if (g) list.push(g);
  }
  const counts = getActiveSetCounts(list);
  return { counts, bonuses: getSetBonuses(counts) };
}

// UI용 활성 세트 이름 리스트
function getActiveSetNames(counts) {
  return Object.keys(counts || {}).filter(k => counts[k] >= (GEAR_SETS[k]?.thresholds?.[0] || 2)).map(k => GEAR_SETS[k].name);
}

// Classic script tag exposure (browser load order)
if (typeof window !== "undefined") {
  window.GEAR_ROSTER = GEAR_ROSTER;
  window.GEAR_SETS = GEAR_SETS;
  window.getActiveSetCounts = getActiveSetCounts;
  window.getSetBonuses = getSetBonuses;
  window.getGearSetBonusesForEquip = getGearSetBonusesForEquip;
  window.getActiveSetNames = getActiveSetNames;
  window.gearCrit = gearCrit;
  window.CRIT_DMG = CRIT_DMG;
}
