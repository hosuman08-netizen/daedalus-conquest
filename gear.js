/* LEGION 장비 로스터 — 120종 (5슬롯 × 4등급 × 6). game.js보다 먼저 로드.
   ⚔️무기→힘 · 🛡️방어구→지능 · 👟장신구→민첩 · 🍀유물→운 · 💠코어→전스탯 */
const SLOTS = ["weapon", "armor", "acc", "relic", "core"];
const SLOT_ICON = { weapon: "⚔️", armor: "🛡️", acc: "👟", relic: "🍀", core: "💠" };
const SLOT_MAIN = { weapon: "str", armor: "int", acc: "agi", relic: "luk", core: "mix" };
const STAT_KEYS = ["str", "int", "agi", "luk"];
const GEAR_RARITY = [
  { k: "N", p: 0.60, base: 6, color: "#9ca3af" },
  { k: "R", p: 0.25, base: 12, color: "#60a5fa" },
  { k: "SR", p: 0.13, base: 22, color: "#c084fc" },
  { k: "SSR", p: 0.02, base: 40, color: "#fbbf24" }, // 장비 동일: N60% R25% SR13% SSR2% (base 2% + pity ramp gearGacha에서 적용)
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

function buildGearRoster() {
  const roster = []; let id = 0, pi = 0;
  ["SSR", "SR", "R", "N"].forEach((rk) => {
    const rar = GEAR_RARITY.find((x) => x.k === rk), base = rar.base;
    SLOTS.forEach((slot, si) => {
      for (let i = 0; i < 6; i++) {
        const tpl = { id: ++id, slot: slot, rarity: rk, color: rar.color, str: 0, int: 0, agi: 0, luk: 0 };
        if (slot === "core") {                       // 코어: 전스탯 균등
          STAT_KEYS.forEach((s) => { tpl[s] = Math.round(base * 0.32); });
        } else {
          tpl[SLOT_MAIN[slot]] = base;               // 주스탯
          tpl[STAT_KEYS[(si + i + 1) % 4]] += Math.round(base * 0.4);   // 보조스탯(결정적)
        }
        tpl.name = GEAR_PREFIX[pi % GEAR_PREFIX.length] + " " + GEAR_NOUN[slot][i]; pi++;
        // 장비 시각 차별화: 슬롯 아이콘 + rarity/변형으로 "다르게" (도감·슬롯·인벤)
        tpl.vis = SLOT_ICON[slot] + (["⚔️","🗡️","🔪","🏹","🔫","💣"][i % 6] || ""); // noun index로 미세 변형 (synthetic)
        roster.push(tpl);
      }
    });
  });
  return roster;
}
const GEAR_ROSTER = buildGearRoster();

// 인스턴스 생성 (카탈로그에서 1종 뽑아 보유 아이템 생성)
function makeGear(forceRar) {
  const rk = forceRar || rollGearRarity().k;
  const pool = GEAR_ROSTER.filter((t) => t.rarity === rk);
  const tpl = pool[(Math.random() * pool.length) | 0];
  return { id: -1, tplId: tpl.id, slot: tpl.slot, rarity: tpl.rarity, color: tpl.color, name: tpl.name, str: tpl.str, int: tpl.int, agi: tpl.agi, luk: tpl.luk, enh: 0, star: 0, awak: 0 };
}
function gearStat(g, key) {
  const base = (g[key] || 0);
  const e = (g.enh || 0);
  const s = (g.star || 0);
  const a = (g.awak || 0);
  // enh 10%/lv + star big spike 25%/lv + awak soul spike 40%/lv for dopamine (gear enh→★→✦ progression)
  return Math.round(base * (1 + e * 0.1) * (1 + s * 0.25) * (1 + a * 0.40));
}
