/* LEGION 유닛 로스터 — 200종 (SSR9 / SR55 / R56 / N80)
   6 아키타입 × faction 변형. 결정적 생성.
   SSR 9 Founding (fictional codenames only: Arclight 등) — 기만적 기원: Origin Rift에서 최초로 들린 "창립 에코 9". 희소·함부로 안 줌(군주 지령). SR/R/N = 무과금 주력.
   총: SSR:9 + SR:55 + R:56 + N:80 = 200.
   ⚠️ N(무과금 초반 주력)은 id 121~200으로 마지막 생성 → 기존 1~120 player META.owned 100% 보존.
   가챠 N등급(55%)이 이제 실제 N 캐릭 드랍.
   Later: drip new SSR releases (retention/FOMO). New SSR = high id (201+) to preserve existing players.
   기만적 기원: 모든 public "fictional Legion Chronicles" 내. 정확 rates prominent. "MY Legion" = 플레이어 개인 기원 pact.
   🌐 i18n: 모든 유닛 표시명/칭호/페르소나/트레잇은 ROSTER_I18N(i18n.js, 6언어)에서 온다. buildRoster는 구조(인덱스)만 저장 → localizeRoster()가 현재 LANG으로 채움. 언어 변경 시 재호출. (units.js엔 한국어 데이터 없음 — 주석만) */

const ARCHES = ["drone", "marksman", "guardian", "bruiser", "commander", "titan"];
const ARCHES_NONSSR = ["drone", "marksman", "guardian", "bruiser", "commander"];   // titan 제외 — titan은 SSR(Anvil/Dominus) 전용
const ARCH_GLYPH = { drone: "🛸", marksman: "🎯", guardian: "🛡️", bruiser: "🤖", commander: "🧠", titan: "🐉" };
// 유닛 시각 차별화 (도감·캔버스·UI): archetype 공유 glyph만으로는 부족 → SSR 고유 + faction/accent procedural
const SSR_VIS = { Arclight: "⚖️", Solace: "🌊", Cipher: "🔭", Ignis: "🔥", Vector: "↯", Vespera: "🐝", Aegis: "🛡️", Anvil: "🔨", Dominus: "👑" };

// ── 🎯 Featured 한정 배너 (과금 동기 — 트리니티 SPEC-monetization-redesign) ──
// 주간 featured SSR pickup(확률 up) + spark 천장 90뽑=featured 확정 + 7일 한정 FOMO.
// game.js 가챠가 getFeaturedBanner(weekIdx) 참조. weekIdx = floor((now-LAUNCH)/7d). week0 = Arclight(첫 배너).
// 배너 표시명은 ROSTER_I18N[LANG].featured[id] (6언어). en = 폴백.
const FEATURED_BANNERS = [
  { id: "arclight", pickup: "Arclight", en: "Arc of Judgment",  durationDays: 7, sparkPity: 90, upRate: 0.015 },
  { id: "dominus",  pickup: "Dominus",  en: "Reign Eternal",    durationDays: 7, sparkPity: 90, upRate: 0.015 },
  { id: "ignis",    pickup: "Ignis",    en: "Inferno Descent",  durationDays: 7, sparkPity: 90, upRate: 0.015 },
  { id: "vector",   pickup: "Vector",   en: "Surge Protocol",   durationDays: 7, sparkPity: 90, upRate: 0.015 },
  { id: "aegis",    pickup: "Aegis",    en: "Eternal Bastion",  durationDays: 7, sparkPity: 90, upRate: 0.015 },
  { id: "cipher",   pickup: "Cipher",   en: "Cipher's Eye",     durationDays: 7, sparkPity: 90, upRate: 0.015 },
  { id: "vespera",  pickup: "Vespera",  en: "Dawn Swarm",       durationDays: 7, sparkPity: 90, upRate: 0.015 },
  { id: "solace",   pickup: "Solace",   en: "Tides of Solace",  durationDays: 7, sparkPity: 90, upRate: 0.015 },
  { id: "anvil",    pickup: "Anvil",    en: "Anvil's Resolve",  durationDays: 7, sparkPity: 90, upRate: 0.015 },
];
// 배너 현지화 표시명 (i18n featured + en 폴백)
function featuredName(fb) {
  if (!fb) return "";
  try {
    const R = (typeof ROSTER_I18N !== "undefined" && ROSTER_I18N[typeof LANG !== "undefined" ? LANG : "en"]) || null;
    if (R && R.featured && R.featured[fb.id]) return R.featured[fb.id];
  } catch (e) {}
  return fb.en || fb.pickup || "";
}
function getFeaturedBanner(weekIdx) { const n = FEATURED_BANNERS.length; return FEATURED_BANNERS[(((weekIdx || 0) % n) + n) % n]; }
if (typeof window !== "undefined") { window.FEATURED_BANNERS = FEATURED_BANNERS; window.getFeaturedBanner = getFeaturedBanner; window.featuredName = featuredName; }
// 🔥 CHEAT MODE: cycle-cheat rotation + psych FOMO (p1/p2). Full variable/narrative in banners. Upper Legion implant. X moat sync. Disclosure prominent.
const FACTION_ACCENT = { Strategist: "🧠", Executor: "⚙️", Swarm: "🐜", Guardian: "🛡️", Intel: "👁️" };
const PREFIX_LEN = 40;   // ROSTER_I18N.prefix 길이 (N 유닛 접두어 순환)
const NOUN_LEN = 6;      // ROSTER_I18N.noun[arch] 길이
// 등급별 스탯 배율 (SSR이 가장 강함)
// 등급 배율: 전 등급(N/R/SR/SSR) buildRoster에서 실사용. SSR=3.2 = buildRoster 오버라이드값과 일치(등급역전 0, 수학자 P0).
const RARITY_MUL = { N: 1.0, R: 1.25, SR: 1.6, SSR: 3.2 };
const RARITY_COUNT = { R: 56, SR: 55, SSR: 9, N: 80 };  // 200종 (9SSR god-tier + 55SR + 56R + 80N 무과금주력). N=가챠 55% 실드랍. SSR 희소 유지(군주 지령).
const RARITY_COLOR = { N: "#9ca3af", R: "#60a5fa", SR: "#c084fc", SSR: "#fbbf24" };

// Faction for synergy (Strategist/Executor/Swarm/Guardian/Intel)
const FACTIONS = ["Strategist", "Executor", "Swarm", "Guardian", "Intel"];

// ── 9 SSR 창립 군단 (name=영문 코드네임 유지 · faction/arch=코드값. title/persona/trait는 ROSTER_I18N.ssr*) ──
// SECURITY: Real 1:1 correspondence to internal Legion entities is 우리만 아는 보안. Player text = fictional codenames only.
const SSR_CHARS = [
  { name: "Arclight", faction: "Strategist", arch: "commander" },
  { name: "Solace",   faction: "Executor",   arch: "guardian" },
  { name: "Cipher",   faction: "Intel",      arch: "marksman" },
  { name: "Ignis",    faction: "Swarm",      arch: "bruiser" },
  { name: "Vector",   faction: "Strategist", arch: "commander" },
  { name: "Vespera",  faction: "Swarm",      arch: "bruiser" },
  { name: "Aegis",    faction: "Guardian",   arch: "guardian" },
  { name: "Anvil",    faction: "Executor",   arch: "titan" },
  { name: "Dominus",  faction: "Guardian",   arch: "titan" },
];

// 🌐 현재 LANG의 로스터 i18n (없으면 en 폴백)
function rosterI18nFor(lang) {
  if (typeof ROSTER_I18N === "undefined") return null;
  return ROSTER_I18N[lang] || ROSTER_I18N.en || null;
}
// 단위 표시 문자열 현지화 (구조 인덱스 → LANG 문자열). 결정적: 같은 id = 같은 이름 슬롯.
function localizeUnit(u) {
  const lang = (typeof LANG !== "undefined") ? LANG : "en";
  const R = rosterI18nFor(lang);
  const EN = (typeof ROSTER_I18N !== "undefined") ? ROSTER_I18N.en : null;
  if (!R || !EN) return;
  const nounAt = (arch, i) => (((R.noun && R.noun[arch]) || EN.noun[arch]) || [])[i] || arch;
  const pad = (n) => String(n).padStart(3, "0");
  if (u.rarity === "SSR" && u.ssrKey) {
    u.title   = (R.ssrTitle   && R.ssrTitle[u.ssrKey])   || EN.ssrTitle[u.ssrKey]   || u.arch;
    u.persona = (R.ssrPersona && R.ssrPersona[u.ssrKey]) || EN.ssrPersona[u.ssrKey] || "";
    u.trait   = (R.ssrTrait   && R.ssrTrait[u.ssrKey])   || EN.ssrTrait[u.ssrKey]   || "";
  } else if (u.rarity === "SR") {
    if (u.srIdx < 30) {
      u.name  = ((R.srName  || EN.srName)  || [])[u.srIdx] || (u.faction + " SR");
      u.title = ((R.srTitle || EN.srTitle) || [])[u.srIdx] || u.arch;
    } else {                                  // 절차적 SR: faction + 명사 + 번호
      const nn = nounAt(u.arch, u.nnI);
      u.name = u.faction + " " + nn + "-" + pad(u.id);
      u.title = nn;
    }
  } else if (u.rarity === "N") {
    const pf = ((R.prefix || EN.prefix) || [])[u.pfxI] || "";
    u.name = (pf ? pf + " " : "") + nounAt(u.arch, u.nnI);
  } else {                                    // R: 절차적 fodder
    u.name = u.faction + " " + nounAt(u.arch, u.nnI) + "-" + pad(u.id);
  }
}
// 전체 로스터 재현지화 (언어 변경 시 game.js applyLanguage에서 호출)
function localizeRoster() { if (typeof ROSTER !== "undefined") for (const u of ROSTER) localizeUnit(u); }
if (typeof window !== "undefined") { window.localizeRoster = localizeRoster; }

function buildRoster() {
  const roster = [];
  let id = 0, ssrIdx = 0, srIdx = 0;
  const order = ["SSR", "SR", "R", "N"];   // SSR 1-9 god / SR 10-64 / R 65-120 / N 121-200(무과금주력, 마지막=기존 id 보존)
  order.forEach((rar) => {
    const n = RARITY_COUNT[rar] || 0;
    for (let i = 0; i < n; i++) {
      const arch = ARCHES_NONSSR[i % ARCHES_NONSSR.length];   // 🔒 titan은 SSR 전용 gating — N/R/SR은 5아키만 순환(등급역전 해소, 수학자 P0)
      const fac = FACTIONS[i % FACTIONS.length];
      const u = { id: ++id, arch: arch, rarity: rar, faction: fac, color: RARITY_COLOR[rar], glyph: ARCH_GLYPH[arch], mul: RARITY_MUL[rar], nnI: i % NOUN_LEN };
      if (rar === "SSR" && ssrIdx < SSR_CHARS.length) {
        const c = SSR_CHARS[ssrIdx++];
        u.name = c.name; u.ssrKey = c.name.toLowerCase(); if (c.faction) u.faction = c.faction;
        if (c.arch) { u.arch = c.arch; u.glyph = ARCH_GLYPH[c.arch]; }   // 🌟 페르소나 매칭 고급 아키타입(등급역전 해소)
        u.mul = 3.2;                                                     // 🌟 SSR 프리미엄 배율(3.0→3.2): 등급역전 0 확정(수학자 P0) + 과금동기
        u.vis = SSR_VIS[c.name] || u.glyph; u.accent = FACTION_ACCENT[u.faction] || "";
      } else if (rar === "SR" && srIdx < RARITY_COUNT.SR) {
        u.srIdx = srIdx++;
        u.vis = u.glyph; u.accent = FACTION_ACCENT[u.faction] || "";
      } else if (rar === "N") {
        u.pfxI = i % PREFIX_LEN;   // 무과금 초반 주력 (N 80종): 접두어 다양화(e.g. "강철 정찰기"). 가챠 60% 실드랍.
        u.vis = u.glyph; u.accent = FACTION_ACCENT[fac] || "";
      } else {                     // 절차적 fodder (R): faction 일반 병사. volume/synergy/hybrid comps용.
        u.vis = u.glyph; u.accent = FACTION_ACCENT[fac] || "";
      }
      localizeUnit(u);             // 표시명/칭호/페르소나/트레잇 현지화(현재 LANG)
      roster.push(u);
    }
  });
  return roster;
}
// Future SSR drip (post 120): append SSR_CHARS (new fictional), but force id=200+ for new ones.

const ROSTER = buildRoster();
