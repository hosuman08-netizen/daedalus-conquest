/* 다이달로스 — AI 군단 전쟁 (오토배틀러)
   5종 유닛, 각자 다른 스펙·AI지능·스킬. 티어 높을수록 영리해 저티어를 몰살.
   군주는 군대 배치 → ▶전투 시작 → 관전. 스킬 자동 발동. 의존성 0. */

const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if (tg) {
  try { tg.ready(); tg.expand(); } catch (e) {}
  try { tg.setHeaderColor("#0b0d14"); } catch (e) {}
  try { tg.setBackgroundColor("#0b0d14"); } catch (e) {}
  try { tg.disableVerticalSwipes(); } catch (e) {}     // 전투 중 실수로 닫힘 방지
  try { tg.enableClosingConfirmation(); } catch (e) {}
}
function haptic(kind) { if (tg && (typeof META === "undefined" || META.haptic !== false)) { try { tg.HapticFeedback.impactOccurred(kind || "light"); } catch (e) {} } }

// ── 사운드 (WebAudio 합성 — 음원 파일 0개, 설정 토글 연동) ────────────────────
let _actx = null;
function tone(freq, dur, type, vol) {
  if (typeof META !== "undefined" && META && META.sound === false) return;
  try {
    if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
    const o = _actx.createOscillator(), g = _actx.createGain();
    o.type = type || "sine"; o.frequency.value = freq; g.gain.value = vol || 0.04;
    o.connect(g); g.connect(_actx.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + (dur || 0.08));
    o.stop(_actx.currentTime + (dur || 0.08));
  } catch (e) {}
}
const SFX = {
  ctr:   () => tone(900, 0.08, "triangle", 0.05),
  skill: () => { tone(420, 0.13, "sawtooth", 0.045); setTimeout(() => tone(620, 0.1, "sawtooth", 0.04), 60); },
  die:   () => tone(110, 0.12, "sine", 0.03),
  win:   () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.16, "square", 0.05), i * 110)),
  lose:  () => [330, 247, 165].forEach((f, i) => setTimeout(() => tone(f, 0.22, "sawtooth", 0.05), i * 150)),
  gacha: () => [660, 880].forEach((f, i) => setTimeout(() => tone(f, 0.1, "triangle", 0.05), i * 80)),
  ssr:   () => [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => tone(f, 0.18, "square", 0.06), i * 90)),
  tap:   () => tone(440, 0.04, "sine", 0.02),
  claim: () => { tone(700, 0.09, "triangle", 0.05); setTimeout(() => tone(1050, 0.1, "triangle", 0.05), 70); },
};

// ── 5종 유닛 사양 ─────────────────────────────────────────────────────────────
const SPEC = {
  drone:    { glyph: "🛸", name: "드론",   hp: 22,  atk: 5,  range: 14, speed: 66, atkCd: 0.55, ai: 1, sight: 170, r: 9,  skill: "evade",     skillCd: 5, ranged: false },
  marksman: { glyph: "🎯", name: "사수",   hp: 30,  atk: 14, range: 98, speed: 34, atkCd: 1.3,  ai: 2, sight: 230, r: 10, skill: "snipe",     skillCd: 6, ranged: true  },
  guardian: { glyph: "🛡️", name: "가디언", hp: 95,  atk: 6,  range: 16, speed: 26, atkCd: 1.0,  ai: 1, sight: 150, r: 14, skill: "barrier",   skillCd: 7, ranged: false },
  bruiser:  { glyph: "🤖", name: "돌격봇", hp: 58,  atk: 12, range: 16, speed: 50, atkCd: 0.8,  ai: 2, sight: 200, r: 12, skill: "charge",    skillCd: 6, ranged: false },
  commander:{ glyph: "🧠", name: "지휘관", hp: 115, atk: 10, range: 24, speed: 30, atkCd: 1.0,  ai: 3, sight: 260, r: 15, skill: "overclock", skillCd: 9, ranged: false },
  titan:    { glyph: "🐉", name: "타이탄", hp: 280, atk: 26, range: 28, speed: 30, atkCd: 1.1,  ai: 3, sight: 300, r: 21, skill: "overclock", skillCd: 8, ranged: false, rare: true },
};
const ORDER = ["drone", "marksman", "guardian", "bruiser", "commander", "titan"];
const COL = { p: "#3b82f6", e: "#ef4444" };
// 상성 (가위바위보): 공격자 → 강한 표적 (+30% 데미지). 군집>원거리>근접>군집
const COUNTER = { drone: ["marksman"], marksman: ["guardian", "bruiser"], guardian: ["drone"], bruiser: ["drone"] };
const CTR_MUL = 1.5;

// ── 영웅 7종 (군단 사령관) ────────────────────────────────────────────────────
// passive = 전군 패시브 / ult = 궁극기(플레이어 직접 발동). heroLv가 패시브 강화(현질 자리).
// LEGION = 랭크 매겨진 엘리트 결사 (번호 서열 + 흑·적 모티브, 일반 클리셰)
const HEROES = {
  dragoon:    { glyph: "🐉", rank: "0",  ult: "dragon",   ultName: "드래곤 강림", ultCd: 15 },
  mech:       { glyph: "🤖", rank: "Ⅰ", ult: "assault",  ultName: "강습",        ultCd: 12 },
  strategist: { glyph: "🧠", rank: "Ⅱ", ult: "focus",    ultName: "전술 지휘",   ultCd: 13 },
  warden:     { glyph: "🛡️", rank: "Ⅲ", ult: "wall",     ultName: "철벽",        ultCd: 13 },
  berserker:  { glyph: "⚡", rank: "Ⅳ", ult: "rage",     ultName: "광폭화",      ultCd: 13 },
  ranger:     { glyph: "🎯", rank: "Ⅴ", ult: "volley",   ultName: "일제사격",    ultCd: 12 },
  engineer:   { glyph: "💉", rank: "Ⅵ", ult: "repair",   ultName: "긴급 수리",   ultCd: 12 },
};
const HERO_ORDER = ["strategist", "berserker", "warden", "ranger", "mech", "engineer", "dragoon"];
// heroLv → 패시브 배율 (현질/강화로 올림)
function heroScale(lv) { return 1 + (lv - 1) * 0.5; }       // lv1=1.0, lv2=1.5, lv3=2.0 ...
function heroAiBonus(lv) { return 1 + Math.floor((lv - 1) / 2); }  // lv1→+1, lv3→+2, lv5→+3

let cv, ctx, W, H, units, fx, running, gameOver, lastT, speed = 1, raf = 0, auto = false, ultT = 0;
let curLevel = 1, bossFight = false;                 // 모드별 적 레벨/보스전 플래그
function nowMs() { try { return Date.now(); } catch (e) { return 0; } }
function today() { try { return new Date().toISOString().slice(0, 10); } catch (e) { return ""; } }
const counts = {
  p: null,  // META.army 로 연결됨 (영구 보유)
  e: { drone: 4, marksman: 2, guardian: 1, bruiser: 2, commander: 1, titan: 0 },
};

// ── 메타: 골드·레벨·전설해금 (localStorage 영구 저장) ─────────────────────────
const META_KEY = "daedalus_meta_v1";
let META = loadMeta();
// 유닛 구매 가격 (티어 = 가격. 타이탄은 가챠 전용 프리미엄)
const PRICE = { drone: 35, marksman: 60, guardian: 75, bruiser: 70, commander: 110, titan: 700 };
function loadMeta() {
  const def = { gold: 400, chapter: 1, streak: 0, pulls: 0, pity: 0, titanOwned: false, starter: false, lastSeen: 0, lastDaily: "",
                lv: { drone: 0, marksman: 0, guardian: 0, bruiser: 0, commander: 0, titan: 0 },
                army: { drone: 4, marksman: 2, guardian: 1, bruiser: 1, commander: 0, titan: 0 },
                hero: "strategist",
                heroLv: { strategist: 1, berserker: 1, warden: 1, ranger: 1, mech: 1, engineer: 1, dragoon: 1 },
                mode: "campaign", tower: 1, towerBest: 0, dailyDone: "", sound: true, haptic: true,
                gems: 50, attend: { day: 0, last: "" }, codes: [],
                enh: { drone: 0, marksman: 0, guardian: 0, bruiser: 0, commander: 0, titan: 0 },
                star: { drone: 0, marksman: 0, guardian: 0, bruiser: 0, commander: 0, titan: 0 },
                gear: [], equip: {}, gearSeq: 0, owned: [],
                play: { day: "", sec: 0, claimed: [] },
                soul: 0, awak: { drone: 0, marksman: 0, guardian: 0, bruiser: 0, commander: 0, titan: 0 },
                pass: { monthly: "", weekly: "" }, passClaim: { monthly: "", weekly: "" } };
  try {
    const m = JSON.parse(localStorage.getItem(META_KEY));
    if (m && typeof m === "object") {
      const merged = Object.assign({}, def, m);
      merged.lv = Object.assign({}, def.lv, m.lv || {});
      merged.army = Object.assign({}, def.army, m.army || {});
      merged.heroLv = Object.assign({}, def.heroLv, m.heroLv || {});
      merged.attend = Object.assign({}, def.attend, m.attend || {});
      merged.enh = Object.assign({}, def.enh, m.enh || {});
      merged.star = Object.assign({}, def.star, m.star || {});
      if (!Array.isArray(merged.gear)) merged.gear = [];
      if (!Array.isArray(merged.owned)) merged.owned = [];
      if (typeof merged.equip !== "object" || !merged.equip) merged.equip = {};
      if (typeof merged.gearSeq !== "number") merged.gearSeq = 0;
      if (typeof merged.play !== "object" || !merged.play) merged.play = { day: "", sec: 0, claimed: [] };
      if (!Array.isArray(merged.play.claimed)) merged.play.claimed = [];
      if (typeof merged.soul !== "number") merged.soul = 0;
      merged.awak = Object.assign({}, def.awak, m.awak || {});
      merged.pass = Object.assign({}, def.pass, m.pass || {});
      merged.passClaim = Object.assign({}, def.passClaim, m.passClaim || {});
      if (typeof merged.gems !== "number") merged.gems = 50;
      if (!merged.mode || merged.mode === "daily") merged.mode = "campaign";
      if (!merged.tower || merged.tower < 1) merged.tower = 1;
      if (!merged.hero || !HEROES[merged.hero]) merged.hero = "strategist";
      if (!merged.chapter || merged.chapter < 1) merged.chapter = 1;   // 안전장치
      return merged;
    }
  } catch (e) {}
  return def;
}
function saveMeta() { try { META.lastSeen = nowMs(); localStorage.setItem(META_KEY, JSON.stringify(META)); } catch (e) {} }
// 레벨 → 아군 스탯 배율 (현질 파워의 핵심)
function lvMul(type, stat) {
  const lv = (META.lv && META.lv[type]) || 0;
  if (stat === "hp") return 1 + lv * 0.15;
  if (stat === "atk") return 1 + lv * 0.12;
  return 1;
}
// 군단 전력 + 복리 배당 (컬렉션 쌓일수록 전투 보너스 골드 ↑)
function gearPower() {                                 // 장착 장비 전력 (1스탯 = +5, 확 보이게)
  const gs = heroGearStats();
  return Math.round((gs.str + gs.int + gs.agi + gs.luk) * 5);
}
function legionPower() {
  let p = 0; for (const t of ORDER) p += (META.army[t] || 0) * ((META.lv[t] || 0) + (META.enh[t] || 0) * 2 + (META.star[t] || 0) * 12 + (META.awak[t] || 0) * 30);
  return p + gearPower();                              // ⚔️ 장비 + ✦각성 반영
}
function dividendGold() { return Math.floor(legionPower() * 0.6); }

// ── 장비 시스템 (gear.js의 5슬롯·120종 카탈로그 사용) ────────────────────────
// SLOTS/SLOT_ICON/SLOT_MAIN/STAT_KEYS/GEAR_RARITY/makeGear/gearStat 는 gear.js에 정의됨
function newGear(forceRar) { const g = makeGear(forceRar); g.id = ++META.gearSeq; return g; }   // 보유 ID 부여
function heroGearStats() {
  const tot = { str: 0, int: 0, agi: 0, luk: 0 }, eq = META.equip[META.hero] || {};
  for (const slot of SLOTS) { const id = eq[slot]; if (!id) continue; const g = META.gear.find((x) => x.id === id); if (!g) continue; for (const k of STAT_KEYS) tot[k] += gearStat(g, k); }
  return tot;
}

const $ = (id) => document.getElementById(id);
const $status = $("status"), $score = $("score"), $overlay = $("overlay"), $overlayMsg = $("overlay-msg");

function fit() {
  cv = $("field");
  const w = Math.min(460, cv.parentElement.clientWidth);
  // 화면 높이에 맞춰 캔버스 높이 제한 (폰에서 한 화면에 들어오게)
  let h = Math.round(w * 1.0);
  const vh = (tg && tg.viewportStableHeight) || window.innerHeight || 700;
  h = Math.min(h, Math.round(vh * 0.46));
  h = Math.max(h, 240);
  cv.width = w; cv.height = h;
  W = cv.width; H = cv.height; ctx = cv.getContext("2d");
}

// ── 군대 배치 ─────────────────────────────────────────────────────────────────
// 선택 영웅 패시브 계산 (아군 전체에 적용)
function heroBuffs() {
  const h = META.hero, lv = (META.heroLv && META.heroLv[h]) || 1, k = heroScale(lv);
  const b = { aiBonus: 0, hpMul: 1, atkMul: 1, typeHp: {}, typeAtk: {}, regen: 0 };
  if (h === "strategist") b.aiBonus = heroAiBonus(lv);
  else if (h === "berserker") b.atkMul = 1 + 0.15 * k;
  else if (h === "warden") b.hpMul = 1 + 0.20 * k;
  else if (h === "ranger") { b.typeAtk.drone = 0.30 * k; b.typeAtk.marksman = 0.30 * k; }
  else if (h === "mech") { b.typeHp.bruiser = 0.40 * k; b.typeHp.guardian = 0.40 * k; }
  else if (h === "engineer") b.regen = 1.5 * k;
  else if (h === "dragoon") { b.atkMul = 1 + 0.08 * k; b.hpMul = 1 + 0.08 * k; }
  return b;
}

function spawnArmy(side) {
  const baseY = side === "p" ? H - 36 : 36;
  const dir = side === "p" ? -1 : 1;
  const hb = side === "p" ? heroBuffs() : { aiBonus: 0, hpMul: 1, atkMul: 1, typeHp: {}, typeAtk: {}, regen: 0 };
  // 편성 다양성 시너지: 3종↑ +10% / 4종↑ +18% 공격 (다양한 상성 편성 유도)
  const distinct = ORDER.filter((tt) => (counts[side][tt] || 0) > 0).length;
  const synMul = distinct >= 4 ? 1.18 : distinct >= 3 ? 1.10 : 1;
  // 장비 스탯 (아군 전군에 적용): 힘→공격 / 지능→체력 / 민첩→공속 / 운→치명타
  const gs = side === "p" ? heroGearStats() : { str: 0, int: 0, agi: 0, luk: 0 };
  const gAtk = 1 + gs.str * 0.004, gHp = 1 + gs.int * 0.004, gSpd = 1 - Math.min(0.4, gs.agi * 0.0035), gCrit = Math.min(40, gs.luk * 0.4);
  let arr = [];
  ORDER.forEach((t) => { for (let i = 0; i < counts[side][t]; i++) arr.push(t); });
  // 성능: 유닛 수 상한 (초과 시 셔플·컷 + 전투력 보존 배율)
  const MAX_UNITS = 26;
  let powerComp = 1;
  if (arr.length > MAX_UNITS) {
    powerComp = arr.length / MAX_UNITS;
    for (let i = arr.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp; }
    arr = arr.slice(0, MAX_UNITS);
  }
  arr.forEach((t, i) => {
    const perRow = 5, row = Math.floor(i / perRow), col = i % perRow;
    const rowCount = Math.min(perRow, arr.length - row * perRow);
    const x = W / 2 + (col - (rowCount - 1) / 2) * 44 + (Math.random() * 8 - 4);
    const y = baseY + dir * row * 34;
    const s = SPEC[t];
    // 아군: 가챠 레벨 + 영웅 패시브 / 적군: 레벨 스탯 배율 (+보스전 강화)
    const epm = side === "e" ? enemyPowerMul(curLevel) : 1;
    const aw = side === "p" ? (META.awak[t] || 0) : 0;                                                   // ✦ 각성(소울)
    const es = side === "p" ? (1 + (META.enh[t] || 0) * 0.06) * (1 + (META.star[t] || 0) * 0.25) * (1 + aw * 0.35) : 1;   // 강화·승급·각성
    let hpM = (side === "p" ? lvMul(t, "hp") : epm) * hb.hpMul * (1 + (hb.typeHp[t] || 0)) * powerComp * es * gHp;
    let atkM = (side === "p" ? lvMul(t, "atk") : epm) * hb.atkMul * (1 + (hb.typeAtk[t] || 0)) * synMul * powerComp * es * gAtk;
    const isBoss = side === "e" && bossFight;
    if (isBoss) { hpM *= 7; atkM *= 2.2; }
    const hp = Math.round(s.hp * hpM), atk = Math.round(s.atk * atkM);
    const ai = Math.min(3, s.ai + hb.aiBonus + aw);   // ✦ 각성마다 AI +1 (소울로만 가능)
    let rr = isBoss ? s.r * 1.8 : s.r;
    if (t === "titan" && side==="p") rr *= 1.4; // 6hr visual: higher rarity scale
    units.push({
      t, side, x, y, hp: hp, maxHp: hp, atk: atk, range: s.range, speed: s.speed,
      atkCd: s.atkCd * (side === "p" ? gSpd : 1), crit: side === "p" ? gCrit : 0,
      ai: ai, sight: s.sight, r: rr, skill: s.skill, skillCd: s.skillCd, ranged: s.ranged, boss: isBoss,
      regen: side === "p" ? hb.regen : 0,
      atkT: Math.random() * 0.4, skT: s.skillCd * 0.5, shield: 0, buff: 0, buffT: 0, spd: 0, spdT: 0,
    });
  });
}

// ── 챕터별 적군 편성 (챕터 오를수록 강해짐) ──────────────────────────────────
function enemyForChapter(ch) {
  ch = Math.max(1, ch | 0);                          // 숫자 보장 (NaN 방지)
  // 초반은 아주 쉽게, 새 적 유닛은 천천히 해금, 수는 완만히 증가
  return {
    drone:     2 + Math.floor((ch - 1) / 2),         // ch1:2 · ch11:7 · ch51:27
    marksman:  ch >= 4  ? 1 + Math.floor((ch - 4) / 7)  : 0,   // 4챕터 해금
    guardian:  ch >= 9  ? 1 + Math.floor((ch - 9) / 10) : 0,   // 9챕터
    bruiser:   ch >= 14 ? 1 + Math.floor((ch - 14) / 9) : 0,   // 14챕터
    commander: ch >= 25 ? 1 + Math.floor((ch - 25) / 20) : 0,  // 25챕터
    titan:     ch >= 50 ? 1 + Math.floor((ch - 50) / 40) : 0,  // 50챕터(보스급)
  };
}
// 적 스탯 배율: 25챕터까지 그대로, 이후 완만히 상승 (후반 난이도 — 투자 보상 확실하게)
function enemyPowerMul(ch) { return 1 + Math.max(0, (ch | 0) - 25) * 0.02; }

// ── 모드별 전투 셋업 (사이클의 핵심) ─────────────────────────────────────────
function applyMode() {
  const m = META.mode;
  bossFight = false;
  if (m === "tower") {
    curLevel = META.tower + 8;                        // 탑은 챕터보다 빡셈
    counts.e = enemyForChapter(META.tower);
    $status.textContent = t("sTower", { n: META.tower, b: META.towerBest || 0 });
  } else if (m === "daily") {
    curLevel = META.chapter + 4;
    counts.e = enemyForChapter(META.chapter + 4);
    $status.textContent = META.dailyDone === today() ? t("sDailyDone") : t("sDaily");
  } else if (m === "boss") {
    curLevel = META.chapter; bossFight = true;
    counts.e = { drone: 0, marksman: 0, guardian: 0, bruiser: 0, commander: 0, titan: 1 };
    $status.textContent = t("sBoss");
  } else {                                            // campaign
    curLevel = META.chapter;
    counts.e = enemyForChapter(META.chapter);
    $status.textContent = t("sDeploy", { n: META.chapter });
  }
}

function reset() {
  cancelAnimationFrame(raf);
  fit();
  counts.p = META.army;                              // 내 군대 = 영구 보유
  applyMode();                                       // 모드에 맞게 적군 구성
  units = []; fx = []; running = false; gameOver = false; lastT = 0; ultT = 0;
  spawnArmy("p"); spawnArmy("e");
  $overlay.classList.add("hidden");
  $("start").textContent = t("start");
  updateMeta(); updateHeroUI(); updateUltBtn(); updateModeTabs(); draw(); updateScore();
}

// ── 메타 UI 갱신 ──────────────────────────────────────────────────────────────
function updateMeta() {
  if ($("gold")) $("gold").textContent = META.gold;
  if ($("gems")) $("gems").textContent = META.gems || 0;
  if ($("soul")) $("soul").textContent = META.soul || 0;
  if ($("chapter")) $("chapter").textContent = META.chapter;
  // 유닛 레벨 뱃지 + 타이탄 슬롯 노출
  ORDER.forEach((t) => {
    const badge = $("lv-" + t);
    if (badge) badge.textContent = META.lv[t] ? "Lv" + META.lv[t] : "";
    const cnt = $("p-" + t);
    if (cnt) cnt.textContent = META.army[t] || 0;
  });
  const ts = $("slot-titan");
  if (ts) ts.style.display = META.titanOwned ? "" : "none";
  const sb = $("starter-btn"); if (sb) sb.style.display = META.starter ? "none" : "";
  const sp = $("speed"); if (sp && !running) sp.textContent = t("speed", { n: speed });
}

// ── 모드 사이클 ───────────────────────────────────────────────────────────────
function updateModeTabs() {
  document.querySelectorAll(".modetab").forEach((b) => b.classList.toggle("sel", b.dataset.m === META.mode));
}
function setMode(m) {
  if (running) { toast(t("tNoSwitch"), "#ef4444"); return; }
  if (m === "turnbased") { toast(t("tComingTb"), "#a855f7"); return; }
  if (m === "arena") { toast(t("tComingAr"), "#a855f7"); return; }
  META.mode = m; saveMeta(); reset();
}

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
// 프레임당 1회 캐싱 (n² 필터 제거 = 성능 핵심)
let _aliveP = [], _aliveE = [];
const enemiesOf = (u) => (u.side === "p" ? _aliveE : _aliveP);
const alliesOf = (u) => (u.side === "p" ? _aliveP : _aliveE).filter((o) => o !== u && o.hp > 0);
const val = (u) => ({ commander: 4, marksman: 3, bruiser: 2, guardian: 2, drone: 1 }[u.t] || 1);

// ── AI 표적 선정 (지능별) ─────────────────────────────────────────────────────
function chooseTarget(u, foes) {
  if (!foes.length) return null;
  if (u.ai === 1) return foes.reduce((a, b) => (dist(u, b) < dist(u, a) ? b : a));      // 최근접
  if (u.ai === 2) {                                                                      // 사정권 최저HP 집중
    const inS = foes.filter((f) => dist(u, f) < u.sight);
    return (inS.length ? inS : foes).reduce((a, b) => (b.hp < a.hp ? b : a));
  }
  return foes.reduce((a, b) => {                                                          // 고가치 우선
    const sa = val(a) * 120 - dist(u, a), sb = val(b) * 120 - dist(u, b);
    return sb > sa ? b : a;
  });
}

function step(u, dt) {
  if (u.hp <= 0) return;
  if (u.regen > 0) u.hp = Math.min(u.maxHp, u.hp + u.regen * dt);   // 정비공 패시브
  if (u.buffT > 0 && (u.buffT -= dt) <= 0) u.buff = 0;
  if (u.spdT > 0 && (u.spdT -= dt) <= 0) u.spd = 0;
  if (u.shield > 0) u.shield -= dt;
  u.atkT -= dt; u.skT -= dt;

  const foes = enemiesOf(u);
  const tgt = chooseTarget(u, foes);
  if (!tgt) return;
  const d = dist(u, tgt);

  // ── 스킬 자동 발동 ──
  if (u.skT <= 0) {
    if (u.skill === "evade" && u.hp < u.maxHp * 0.5) { u.shield = 1.6; u.spd = 1.8; u.spdT = 1.6; u.skT = u.skillCd; addFx(u.x, u.y, "evade"); }
    else if (u.skill === "snipe") { const best = chooseTarget(u, foes); if (best && dist(u, best) < u.sight) { dmg(best, 32, u); u.skT = u.skillCd; addFx(u.x, u.y, "snipe", best.x, best.y, u.side); } }
    else if (u.skill === "barrier") { u.shield = 3; const m = alliesOf(u).filter((a) => dist(u, a) < 60).sort((a, b) => a.hp - b.hp)[0]; if (m) m.shield = 3; u.skT = u.skillCd; addFx(u.x, u.y, "barrier"); }
    else if (u.skill === "charge" && d > u.range + 6 && d < 120) { const k = Math.min(1, (d - u.range) / d); u.x += (tgt.x - u.x) * k; u.y += (tgt.y - u.y) * k; foes.filter((f) => dist(u, f) < 36).forEach((f) => dmg(f, 16, u)); u.skT = u.skillCd; addFx(u.x, u.y, "charge"); }
    else if (u.skill === "overclock") { const m = alliesOf(u).filter((a) => dist(u, a) < 85); if (m.length) { m.forEach((a) => { a.hp = Math.min(a.maxHp, a.hp + 22); a.buff = 5; a.buffT = 5; }); u.hp = Math.min(u.maxHp, u.hp + 12); u.skT = u.skillCd; addFx(u.x, u.y, "overclock"); } }
  }

  // ── 기동 ──
  let mx = 0, my = 0;
  const retreat = u.ai >= 2 && u.hp < u.maxHp * 0.28;
  const kite = u.ranged && d < u.range * 0.6 && !retreat;       // 사수: 너무 가까우면 빠진다
  if (kite || retreat) { mx = -(tgt.x - u.x) / d; my = -(tgt.y - u.y) / d; }
  else if (d > u.range) { mx = (tgt.x - u.x) / d; my = (tgt.y - u.y) / d; if (u.ai === 3 && d > u.range) { mx *= 0.75; my *= 0.75; } }
  for (const o of units) {                                       // 겹침 방지
    if (o === u || o.hp <= 0) continue;
    const dd = dist(u, o);
    if (dd > 0 && dd < u.r + o.r + 2) { mx += (u.x - o.x) / dd * 0.6; my += (u.y - o.y) / dd * 0.6; }
  }
  const mag = Math.hypot(mx, my) || 1;
  const sp = u.speed * (u.spd || 1);
  u.x += (mx / mag) * sp * dt; u.y += (my / mag) * sp * dt;
  u.x = Math.max(u.r, Math.min(W - u.r, u.x)); u.y = Math.max(u.r, Math.min(H - u.r, u.y));

  // ── 공격 ──
  if (d <= u.range + u.r + tgt.r && u.atkT <= 0) {
    dmg(tgt, u.atk + (u.buff || 0), u);
    u.atkT = u.atkCd;
    addFx(u.x, u.y, "shot", tgt.x, tgt.y, u.side);
  }
}

function dmg(target, amount, from) {
  if (target.hp <= 0) return;
  let a = amount, ctr = false;
  if (from && from.crit && Math.random() * 100 < from.crit) { a *= 2.0; ctr = true; }                    // 운→치명타 ×1.6
  if (from && COUNTER[from.t] && COUNTER[from.t].indexOf(target.t) >= 0) { a *= CTR_MUL; ctr = true; }   // 상성 +30%
  if (target.shield > 0) a *= 0.5;
  target.hp -= a;
  if (ctr) { addFx(target.x, target.y, "ctr"); if (Math.random() < 0.3) SFX.ctr(); }
  if (target.hp <= 0) { addFx(target.x, target.y, "die", 0, 0, target.side); if (Math.random() < 0.5) SFX.die(); }
}

function addFx(x, y, kind, x2, y2, side) { fx.push({ x, y, kind, x2, y2, side, t: 0, life: kind === "shot" ? 0.12 : 0.45 }); }

// ── 그리기 ────────────────────────────────────────────────────────────────────
function draw() {
  ctx.fillStyle = "#0f121a"; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#1b2030"; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  for (const f of fx) {
    const k = f.t / f.life;
    ctx.globalAlpha = 1 - k;
    if (f.kind === "shot")      { ctx.strokeStyle = f.side === "p" ? "#7db1ff" : "#ff9a9a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x2, f.y2); ctx.stroke(); }
    else if (f.kind === "snipe"){ ctx.strokeStyle = "#fde047"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x2, f.y2); ctx.stroke(); }
    else if (f.kind === "charge"){ ctx.strokeStyle = "#fb923c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, 36 * (0.4 + k), 0, 7); ctx.stroke(); }
    else if (f.kind === "overclock"){ ctx.strokeStyle = "#a3e635"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, 85 * (0.3 + k), 0, 7); ctx.stroke(); }
    else if (f.kind === "barrier"){ ctx.strokeStyle = "#67e8f9"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(f.x, f.y, 22, 0, 7); ctx.stroke(); }
    else if (f.kind === "evade") { ctx.strokeStyle = "#c4b5fd"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.x, f.y, 16, 0, 7); ctx.stroke(); }
    else if (f.kind === "ctr")   { ctx.fillStyle = "#fde047"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillText("✦", f.x + 6, f.y - 8 - 10 * k); }
    else if (f.kind === "die")   { ctx.fillStyle = f.side === "p" ? "#3b82f6" : "#ef4444"; ctx.beginPath(); ctx.arc(f.x, f.y, 4 + 18 * k, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
  }

  for (const u of units) {
    if (u.hp <= 0) continue;
    ctx.beginPath(); ctx.arc(u.x, u.y, u.r + 2, 0, 7);
    ctx.fillStyle = u.side === "p" ? "#1e3a8a" : "#7f1d1d"; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = COL[u.side]; ctx.stroke();
    if (u.shield > 0) { ctx.strokeStyle = "#67e8f9"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(u.x, u.y, u.r + 4, 0, 7); ctx.stroke(); }
    if (u.buff > 0)   { ctx.strokeStyle = "#a3e635"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(u.x, u.y, u.r + 6, 0, 7); ctx.stroke(); }
    ctx.font = (u.r + 5) + "px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(SPEC[u.t].glyph, u.x, u.y + 1);
    const w = u.r * 2, hpw = w * Math.max(0, u.hp / u.maxHp);
    ctx.fillStyle = "#000a"; ctx.fillRect(u.x - w / 2, u.y - u.r - 8, w, 4);
    ctx.fillStyle = u.hp / u.maxHp > 0.4 ? "#4ade80" : "#f87171";
    ctx.fillRect(u.x - w / 2, u.y - u.r - 8, hpw, 4);
  }
}

function loop(ts) {
  if (!running) return;
  if (!lastT) lastT = ts;
  let dt = Math.min(0.05, (ts - lastT) / 1000) * speed;
  lastT = ts;
  _aliveP = units.filter((u) => u.side === "p" && u.hp > 0);   // 프레임당 1회
  _aliveE = units.filter((u) => u.side === "e" && u.hp > 0);
  for (const u of units) step(u, dt);
  for (const f of fx) f.t += dt;
  fx = fx.filter((f) => f.t < f.life);
  units = units.filter((u) => u.hp > 0);
  if (ultT > 0) ultT -= dt;
  draw(); updateScore(); updateUltBtn();
  const pA = units.some((u) => u.side === "p"), eA = units.some((u) => u.side === "e");
  if (!pA || !eA) return finish(pA, eA);
  raf = requestAnimationFrame(loop);
}

function updateScore() {
  const n = (s) => units.filter((u) => u.side === s).length;
  $score.innerHTML = `<b class="b">🔵 ${n("p")}</b> vs <b class="r">${n("e")} 🔴</b>`;
}

function finish(p, e) {
  running = false; gameOver = true;
  const win = p && !e, dr = !p && !e;
  const m = META.mode;
  let extra = "", title = win ? t("rWin") : dr ? t("rDraw") : t("rLose");
  let bonus = (x) => Math.floor(x * (META.vip ? 1.5 : META.starter ? 1.2 : 1));   // VIP +50% / 스타터 +20% 골드

  if (win) {
    let reward = 0;
    if (m === "tower") {                               // 🗼 무한탑: 다음 층
      reward = bonus(30 + curLevel * 15);
      if (META.tower > (META.towerBest || 0)) META.towerBest = META.tower;
      META.tower += 1;
      title = t("rTower", { n: META.tower - 1 });
      extra = `<div class="rwd">${t("rwGold", { n: reward })}</div><div class="rwd2">${t("rwTowerNext", { n: META.tower, b: META.towerBest })}</div>`;
    } else if (m === "daily") {                         // 📅 일일: 하루 1회 보너스
      if (META.dailyDone !== today()) { reward = bonus(200 + META.chapter * 15); META.dailyDone = today(); extra = `<div class="rwd">${t("rwDailyBonus", { n: reward })}</div>`; }
      else { extra = `<div class="rwd2">${t("rwDailyDone")}</div>`; }
      title = t("rDaily");
    } else if (m === "boss") {                          // 🐲 보스: 골드 + 난이도별 다이아 + 박스 + 🔮소울
      reward = bonus(120 + META.chapter * 25);
      const gemR = 5 + Math.floor(META.chapter / 5);
      META.gems = (META.gems || 0) + gemR;
      const soulR = 8 + Math.floor(META.chapter / 3);   // 난이도별 소울(각성 전용 재화)
      META.soul = (META.soul || 0) + soulR;
      const tier = META.chapter >= 25 ? "epic" : META.chapter >= 10 ? "rare" : "common";
      const bx = openBox(tier);
      title = t("rBoss");
      extra = `<div class="rwd">${t("rwBoss", { n: reward })} +💎${gemR} +🔮${soulR}</div><div class="rwd2" style="color:${bx.color}">${BOX[tier].icon} ${bx.text}</div>`;
    } else {                                            // 📖 캠페인: 다음 챕터
      META.streak = (META.streak || 0) + 1;
      reward = bonus(40 + META.chapter * 20 + Math.min(80, (META.streak - 1) * 10));
      if (META.chapter < 999) META.chapter += 1;
      title = t("rChapter");
      extra = `<div class="rwd">${t("rwGold", { n: reward })}` + (META.streak > 1 ? t("rwStreak", { n: META.streak }) : "") + `</div><div class="rwd2">${t("rwChapter", { n: META.chapter })}</div>`;
    }
    const div = dividendGold();                        // 복리 배당
    if (div > 0) { reward += div; extra += '<div class="rwd2">' + t("dDividend", { n: div }) + "</div>"; }
    META.gold += reward; saveMeta();
  } else { if (m === "campaign") META.streak = 0; saveMeta(); }

  // 자동사냥: 캠페인·무한탑에서만, 승리 시 자동 진행
  const autoMode = (m === "campaign" || m === "tower");
  if (auto && win && autoMode) {
    toast(t("tAutoRun"), "#a3e635");
    updateMeta(); draw();
    setTimeout(() => { if (auto) { reset(); start(); } }, 1000);
    return;
  }
  // 🗼 무한탑 폴백파밍: 자동 중 패배해도 멈추지 않고 한 층 내려가 계속 농사 (골드 지속)
  if (auto && !win && m === "tower") {
    const farm = bonus(Math.floor((30 + curLevel * 15) * 0.4));   // 패배 위로금 골드(다음판 보상의 40%)
    META.gold += farm;
    if (META.tower > 1) META.tower -= 1;                            // 깰 수 있던 이전 층으로 후퇴
    saveMeta();
    toast(t("tTowerFall", { n: META.tower, g: farm }), "#fbbf24");
    updateMeta(); draw();
    setTimeout(() => { if (auto) { reset(); start(); } }, 1000);
    return;
  }
  if (auto && (!win || !autoMode)) { auto = false; updateAutoBtn(); }

  let carried = "";
  if (win) carried = `<div class="rwd2" style="color:#fbbf24;font-size:12px;">${getCarriedFeedback()}</div>`;
  $overlayMsg.innerHTML = title + extra + carried;
  $("overlay-btn").textContent = win ? t("cont") : t("retry");
  $overlay.classList.remove("hidden");
  if (tg) { try { tg.HapticFeedback.notificationOccurred(win ? "success" : "error"); } catch (e2) {} }
  if (win) SFX.win(); else SFX.lose();
  // 6hr daily loop + bazaar pulse (speculative dopamine, no balance break)
  if (win && Math.random()<0.25) { setTimeout(()=>toast("Legion Bazaar: Grok-Prime hot +28% — check now?","#a3e635"), 800); }
  updateMeta(); draw();
}

// 6hr patch: squad carried visual feedback (Legion immersion)
function getCarriedFeedback() {
  const pCount = units.filter(u=>u.side==='p'&&u.hp>0).length;
  const distinct = ORDER.filter(tt => (counts.p||META.army)[tt]>0).length;
  const syn = distinct>=4 ? 42 : distinct>=3 ? 28 : 12;
  const carry = ["Grok judgment", "Morpheus repair", "Sovereign command", "Oracle swarm", "Legion handoff"][(META.pulls||0)%5];
  return `Synergy +${syn}% | ${carry} carried ${Math.floor(50+pCount*3)}%`;
}

// ── 가챠 (뽑기) — 등급·천장·전설해금 ─────────────────────────────────────────
const GACHA_COST = 100;
const RARITY = [
  { key: "N",   p: 0.58, color: "#9ca3af", lvls: 1 },
  { key: "R",   p: 0.29, color: "#60a5fa", lvls: 2 },
  { key: "SR",  p: 0.10, color: "#c084fc", lvls: 3 },
  { key: "SSR", p: 0.03, color: "#fbbf24", lvls: 5 },
];
function rollRarity() {
  let p = (META.pity || 0);
  let ssrP = 0.03; if (p >= 7) ssrP = 0.03 + (p-7)*0.04; // soft ramp 6hr patch
  if (p >= 12) return RARITY[3]; // hard
  let r = Math.random(), a = 0;
  const adj = RARITY.map(x => x.key==="SSR" ? {...x, p:ssrP} : x);
  const sum = adj.reduce((s,x)=>s+x.p,0); // normalize
  for (const t of adj) { a += t.p / sum; if (r <= a) return t; }
  return RARITY[0];
}
function gacha() {
  if (running) return;
  if (META.gold < GACHA_COST) { toast(t("tGoldShort", { n: GACHA_COST }), "#ef4444"); return; }
  META.gold -= GACHA_COST; META.pulls = (META.pulls || 0) + 1; META.pity = (META.pity || 0) + 1;
  let rar = rollRarity();
  if (META.pity >= 10) rar = RARITY[3];                 // 10연차 천장 = SSR 보장
  if (rar.key === "SSR" || rar.key === "SR") META.pity = 0;
  let msg;
  if (rar.key === "SSR" && !META.titanOwned) { META.titanOwned = true; counts.p.titan = 1; msg = t("tTitan"); }
  else {
    const pool = ORDER.filter((u) => u !== "titan" || META.titanOwned);
    for (let i = 0; i < rar.lvls; i++) { const u = pool[(Math.random() * pool.length) | 0]; META.lv[u] = (META.lv[u] || 0) + 1; }
    msg = t("tGachaUp", { n: rar.lvls });
  }
  const gu = grantUnit(rar.key);                        // 캐릭터 수집(도감)
  if (gu) msg = "【" + gu.name + "】 " + msg;
  saveMeta(); updateMeta(); reset();
  showGacha(rar, msg);
}
// 💎 프리미엄 10연 (SR↑ 1개 보장) — 다이아의 핵심 용도
const GACHA10_COST = 30;
function gacha10() {
  if (running) return;
  if ((META.gems || 0) < GACHA10_COST) { toast(t("tGemShort", { n: GACHA10_COST }), "#ef4444"); return; }
  META.gems -= GACHA10_COST;
  const RANK = { N: 0, R: 1, SR: 2, SSR: 3 };
  let best = 0;
  for (let i = 0; i < 10; i++) {
    META.pity = (META.pity || 0) + 1;
    let rar = rollRarity();
    if (META.pity >= 10) rar = RARITY[3];
    if (i === 9 && best < 2) rar = RARITY[2];          // 10연 SR↑ 보장
    if (rar.key === "SSR" || rar.key === "SR") META.pity = 0;
    best = Math.max(best, RANK[rar.key]); grantUnit(rar.key);
    if (rar.key === "SSR" && !META.titanOwned) { META.titanOwned = true; counts.p.titan = 1; }
    else { const pool = ORDER.filter((u) => u !== "titan" || META.titanOwned); for (let j = 0; j < rar.lvls; j++) { const u = pool[(Math.random() * pool.length) | 0]; META.lv[u] = (META.lv[u] || 0) + 1; } }
  }
  saveMeta(); updateMeta(); reset();
  const bestKey = Object.keys(RANK).find((k) => RANK[k] === best);
  showGacha(RARITY[best], t("tGacha10", { x: bestKey }));
}
function showGacha(rar, msg) {
  const g = $("gacha"); if (!g) return;
  $("gacha-rank").textContent = rar.key;
  $("gacha-rank").style.color = rar.color;
  $("gacha-card").style.boxShadow = `0 0 40px ${rar.color}, inset 0 0 0 2px ${rar.color}`;
  const pity = (META.pity||0); const pct = rar.key==="SSR" ? "3%+" : "visible";
  $("gacha-msg").innerHTML = msg + `<br><small style="opacity:.7">pity:${pity} SSR~${(0.03+(pity>7?(pity-7)*0.04:0)).toFixed(2)} (6hr patch)</small>`;
  g.classList.remove("hidden");
  if (rar.key === "SSR") SFX.ssr(); else SFX.gacha();
  haptic(rar.key === "SSR" ? "heavy" : "light");
}

// ── 토스트 ────────────────────────────────────────────────────────────────────
function toast(text, color) {
  const t = $("toast"); if (!t) return;
  t.textContent = text; t.style.borderColor = color || "#fbbf24";
  t.classList.add("show"); clearTimeout(t._tm);
  t._tm = setTimeout(() => t.classList.remove("show"), 2200);
}

// ── 일일 보상 ─────────────────────────────────────────────────────────────────
function checkDaily() {
  let today = ""; try { today = new Date().toISOString().slice(0, 10); } catch (e) { return; }
  if (META.lastDaily !== today) { META.lastDaily = today; META.gold += 150; saveMeta(); updateMeta(); setTimeout(() => toast(t("tDaily"), "#fbbf24"), 500); }
}

function start() {
  if (gameOver) reset();
  if (running) { running = false; $("start").textContent = t("resume"); cancelAnimationFrame(raf); return; }
  running = true; lastT = 0; $("start").textContent = t("pause");
  $status.textContent = t("sFight");
  raf = requestAnimationFrame(loop);
}

// ── 유닛 구매(+) / 판매(−, 50% 환불) ─────────────────────────────────────────
function bindDeploy() {
  document.querySelectorAll("#deploy button").forEach((b) => {
    b.addEventListener("click", () => {
      if (running) return;
      const ty = b.dataset.t, d = +b.dataset.d, price = PRICE[ty] || 50;
      if (d > 0) {                                        // 구매
        if (META.army[ty] >= 12) { toast(t("tMaxUnit"), "#ef4444"); return; }
        if (META.gold < price) { toast(t("tGoldShort", { n: price }), "#ef4444"); return; }
        META.gold -= price; META.army[ty]++;
        toast(t("tBought", { n: price }), "#a3e695");
      } else {                                            // 판매(90% 환불 — 거의 안 깎음)
        if (META.army[ty] <= 0) return;
        const refund = Math.floor(price * 0.9);
        META.army[ty]--; META.gold += refund;
        toast(t("tSold", { n: refund }), "#93c5fd");
      }
      saveMeta();
      $("p-" + ty).textContent = META.army[ty];
      updateMeta(); reset();
    });
  });
}

$("start").addEventListener("click", start);
$("reset").addEventListener("click", reset);
$("speed").addEventListener("click", () => {
  // 무료 1x·2x / 스타터 4x / VIP 8x — 팝업 없이 순환
  const tiers = META.ultra ? [1, 2, 4, 8] : META.vip ? [1, 2, 4] : [1, 2];   // VIP=4x · 울트라=8x
  const i = tiers.indexOf(speed);
  speed = tiers[(i + 1) % tiers.length];
  $("speed").textContent = t("speed", { n: speed });
});

// ── 스타터팩 (₩990 첫 결제 상품) ─────────────────────────────────────────────
function showStarter() {
  if (META.starter) { toast(t("tOwned"), "#a3e635"); return; }
  $("starter").classList.remove("hidden");
}
function buyStarter() { buyPack("starter"); }   // 결제 경로 통일 (Stars 또는 데모)
// ── 궁극기 (플레이어 직접 발동) ───────────────────────────────────────────────
function updateUltBtn() {
  const b = $("ult"); if (!b) return;
  const name = "💥 " + tUlt(HEROES[META.hero].ult);
  if (!running) { b.textContent = name; b.disabled = true; b.classList.remove("ready"); return; }
  b.disabled = ultT > 0;
  if (ultT > 0) { b.textContent = "💥 " + Math.ceil(ultT) + "s"; b.classList.remove("ready"); }
  else { b.textContent = name; b.classList.add("ready"); }
}
function doUlt() {
  if (!running || ultT > 0) return;
  const h = HEROES[META.hero], lv = (META.heroLv[META.hero] || 1), k = heroScale(lv);
  const mine = units.filter((u) => u.side === "p" && u.hp > 0);
  const foes = units.filter((u) => u.side === "e" && u.hp > 0);
  if (h.ult === "focus")        mine.forEach((u) => { u.buff = Math.round(u.atk * 0.5); u.buffT = 4; });
  else if (h.ult === "rage")    mine.forEach((u) => { u.buff = Math.round(u.atk * 0.5); u.buffT = 5; u.spd = 1.5; u.spdT = 5; });
  else if (h.ult === "wall")    mine.forEach((u) => { u.shield = 4; });
  else if (h.ult === "volley")  { foes.forEach((f) => dmg(f, 22 * k, null)); addFx(W / 2, H / 2, "overclock"); }
  else if (h.ult === "assault") mine.forEach((u) => { if (foes.length) { const t = foes.reduce((a, b) => (dist(u, b) < dist(u, a) ? b : a)); u.x += (t.x - u.x) * 0.5; u.y += (t.y - u.y) * 0.5; } addFx(u.x, u.y, "charge"); });
  else if (h.ult === "repair")  mine.forEach((u) => { u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.4); addFx(u.x, u.y, "barrier"); });
  else if (h.ult === "dragon")  { foes.forEach((f) => dmg(f, 42 * k, null)); addFx(W / 2, H / 2, "overclock"); }
  ultT = h.ultCd;
  toast(t("tUlt", { x: tUlt(h.ult) }), "#fbbf24");
  haptic("heavy");
}

// ── 영웅 선택 / 강화 ──────────────────────────────────────────────────────────
function heroUpCost() { return 150 * (META.heroLv[META.hero] || 1); }
function updateHeroUI() {
  HERO_ORDER.forEach((hk) => {
    const b = document.querySelector('.hbtn[data-h="' + hk + '"]'); if (!b) return;
    b.classList.toggle("sel", hk === META.hero);
    if (!b.dataset.dec) { b.innerHTML = HEROES[hk].glyph + '<i class="rk">' + HEROES[hk].rank + '</i>'; b.dataset.dec = "1"; }
  });
  const h = HEROES[META.hero], lv = META.heroLv[META.hero] || 1, tr = tHero(META.hero);
  if ($("hero-name")) $("hero-name").innerHTML = h.glyph + ' <span class="hcode">RANK ' + h.rank + '</span> ' + tr[0] + " Lv" + lv;
  if ($("hero-desc")) $("hero-desc").textContent = tr[1] + " · " + tUlt(h.ult);
  if ($("hero-up")) $("hero-up").textContent = t("upgrade") + " " + heroUpCost() + "g";
}
function selectHero(h) { if (running || !HEROES[h]) return; META.hero = h; saveMeta(); updateHeroUI(); reset(); }
function upgradeHero() {
  if (running) return;
  const cost = heroUpCost();
  if (META.gold < cost) { toast(t("tGoldShort", { n: cost }), "#ef4444"); return; }
  META.gold -= cost; META.heroLv[META.hero] = (META.heroLv[META.hero] || 1) + 1;
  saveMeta(); updateHeroUI(); updateMeta(); reset();
  toast(t("tHeroUp", { x: tHero(META.hero)[0], n: META.heroLv[META.hero] }), "#a3e635");
}

// ── 자동사냥 토글 ─────────────────────────────────────────────────────────────
function updateAutoBtn() {
  const b = $("auto"); if (!b) return;
  b.textContent = auto ? "⚔️ 자동 ON" : "⚔️ 자동사냥";
  b.classList.toggle("on", auto);
}
function toggleAuto() {
  auto = !auto;
  updateAutoBtn();
  if (auto) { toast(t("tAutoStart"), "#a3e635"); if (!running) { if (gameOver) reset(); start(); } }
  else toast(t("tAutoStop"), "#8b93a7");
}

// ── 오프라인(방치) 보상 ───────────────────────────────────────────────────────
function checkIdle() {
  const last = META.lastSeen || 0; if (!last) { saveMeta(); return; }
  const elapsed = Math.max(0, nowMs() - last) / 1000;           // 초
  if (elapsed < 60) return;
  const rate = 0.3 + META.chapter * 0.4;                        // 챕터 비례 초당 골드
  const cap = rate * 3600 * 8;                                  // 최대 8시간치
  const gold = Math.floor(Math.min(cap, elapsed * rate));
  if (gold > 0) {
    META.gold += gold; saveMeta(); updateMeta();
    const hrs = Math.floor(elapsed / 3600), mins = Math.floor((elapsed % 3600) / 60);
    const tm = hrs ? hrs + "h " + mins + "m" : mins + "m";
    setTimeout(() => toast(t("tIdle", { t: tm, n: gold }), "#fbbf24"), 900);
  }
}

// ── i18n 적용 + 설정 메뉴 ─────────────────────────────────────────────────────
function applyStaticI18n() {
  try { document.documentElement.lang = LANG; } catch (e) {}
  document.querySelectorAll("[data-i18n]").forEach((el) => { const v = t(el.getAttribute("data-i18n")); if (v) el.textContent = v; });
}
function buildLangList() {
  const box = $("lang-list"); if (!box) return;
  box.innerHTML = "";
  LANGS.forEach((l) => {
    const b = document.createElement("button");
    b.className = "langbtn" + (l === LANG ? " sel" : "");
    b.textContent = LANG_LABEL[l];
    b.addEventListener("click", () => applyLanguage(l));
    box.appendChild(b);
  });
}
function applyLanguage(l) {
  setLang(l); applyStaticI18n(); buildLangList();
  if (!running) reset(); else { updateHeroUI(); updateUltBtn(); }
  toast(t("langOk"), "#a3e635");
}
function updateToggles() {
  if ($("set-sound")) { $("set-sound").textContent = META.sound === false ? "OFF" : "ON"; $("set-sound").classList.toggle("off", META.sound === false); }
  if ($("set-haptic")) { $("set-haptic").textContent = META.haptic === false ? "OFF" : "ON"; $("set-haptic").classList.toggle("off", META.haptic === false); }
}
function renderProfile() {
  const box = $("tg-profile"); if (!box) return;
  let u = null;
  try { u = tg && tg.initDataUnsafe && tg.initDataUnsafe.user; } catch (e) {}
  if (!u) { box.innerHTML = '<div class="prof-guest">' + t("profGuest") + "</div>"; return; }
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || ("User" + u.id);
  const photo = u.photo_url ? '<img class="prof-img" src="' + u.photo_url + '" alt="" referrerpolicy="no-referrer">' : '<div class="prof-img prof-ph">👤</div>';
  box.innerHTML = photo +
    '<div class="prof-meta"><div class="prof-name">' + name + (u.is_premium ? ' <span class="prem">⭐</span>' : "") + "</div>" +
    (u.username ? '<div class="prof-uid">@' + u.username + "</div>" : "") +
    '<div class="prof-uid ddim">ID: ' + u.id + "</div></div>";
}
function openSettings() { updateToggles(); buildLangList(); renderProfile(); showPage("settings"); }
function resetProgress() {
  const go = () => { try { localStorage.removeItem(META_KEY); } catch (e) {} META = loadMeta(); counts.p = META.army; applyStaticI18n(); updateHeroUI(); reset(); showPage("battle"); toast(t("setResetOk"), "#fbbf24"); };
  if (tg && tg.showConfirm) { tg.showConfirm(t("resetAsk"), (ok) => { if (ok) go(); }); }
  else if (confirm(t("resetAsk"))) go();
}
$("set-sound").addEventListener("click", () => { META.sound = META.sound === false; saveMeta(); updateToggles(); });
$("set-haptic").addEventListener("click", () => { META.haptic = META.haptic === false; saveMeta(); updateToggles(); });
$("set-reset").addEventListener("click", resetProgress);

// ── 이벤트: 일일 출석 (7일 사이클, 골드+다이아) ──────────────────────────────
// 30일 출석: 평소 골드/다이아, 7·15·30일차 색깔별 박스(장비/유닛 랜덤)
const ATTEND = (function () {
  const a = [];
  for (let d = 1; d <= 30; d++) {
    if (d === 7) a.push({ box: "common" });
    else if (d === 15) a.push({ box: "rare" });
    else if (d === 30) a.push({ box: "legend" });
    else if (d % 3 === 0) a.push({ gem: 20 + Math.floor(d / 3) * 5 });
    else a.push({ g: 200 + d * 50 });
  }
  return a;
})();
const BOX = {
  common: { icon: "📦", color: "#60a5fa", unitR: ["R", "SR"], gear: "R" },
  rare:   { icon: "🎁", color: "#c084fc", unitR: ["SR", "SSR"], gear: "SR" },
  epic:   { icon: "💎", color: "#fbbf24", unitR: ["SSR"], gear: "SSR" },
  legend: { icon: "🌟", color: "#fbbf24" },
};
function openBox(tier) {
  if (tier === "legend") {                                    // 30일차 최고 보상: SSR 유닛 + SSR 장비 + 💎
    const gu = grantUnit("SSR");
    const g = newGear("SSR"); META.gear.push(g);
    META.gems = (META.gems || 0) + 100;
    return { color: "#fbbf24", text: (gu ? "【" + gu.name + "】 " : "") + "SSR + " + (SLOT_ICON[g.slot] || "") + "SSR장비 + 💎100", rank: "SSR" };
  }
  const b = BOX[tier];
  if (Math.random() < 0.5) {                                  // 유닛
    const rar = b.unitR[(Math.random() * b.unitR.length) | 0];
    const gu = grantUnit(rar);
    const pool = ORDER.filter((u) => u !== "titan" || META.titanOwned);
    for (let j = 0; j < 2; j++) { const u = pool[(Math.random() * pool.length) | 0]; META.lv[u] = (META.lv[u] || 0) + 1; }
    return { color: b.color, text: (gu ? "【" + gu.name + "】 " : "") + rar + " 유닛", rank: rar };
  }
  const g = newGear(b.gear); META.gear.push(g);              // 장비
  return { color: b.color, text: "🔨 " + (SLOT_ICON[g.slot] || "") + " " + g.rarity + " 장비", rank: g.rarity };
}
// ⏱️ 장시간 접속(플레이타임) 보상 — 골드는 후하게(faucet), 💎는 상위 구간만(daily 캡)
const PLAYTIME = [
  { sec: 180,  min: 3,  gold: 300,  gem: 0,  box: null },
  { sec: 600,  min: 10, gold: 800,  gem: 0,  box: null },
  { sec: 1200, min: 20, gold: 1500, gem: 0,  box: "common" },
  { sec: 1800, min: 30, gold: 2500, gem: 5,  box: "rare" },
  { sec: 3600, min: 60, gold: 5000, gem: 10, box: "epic" },
];
function playReset() {                                  // 날짜 바뀌면 누적·수령 초기화
  if (META.play.day !== today()) { META.play.day = today(); META.play.sec = 0; META.play.claimed = []; }
}
function tickPlay() {                                   // 보이는 동안만 1초씩 적립
  if (document.hidden) return;
  playReset();
  META.play.sec = (META.play.sec || 0) + 1;
  if (META.play.sec % 10 === 0) { saveMeta(); if (curPage === "event") renderPlay(); }
}
function renderPlay() {
  const box = $("play-list"); if (!box) return;
  playReset();
  const sec = META.play.sec || 0;
  $("play-now") && ($("play-now").textContent = t("playNow", { m: Math.floor(sec / 60) }));
  box.innerHTML = "";
  PLAYTIME.forEach((r, i) => {
    const done = META.play.claimed.indexOf(i) >= 0, ready = sec >= r.sec && !done;
    const rw = "💰" + (r.gold >= 1000 ? Math.floor(r.gold / 1000) + "k" : r.gold)
             + (r.gem ? "  💎" + r.gem : "")
             + (r.box ? '  <span style="color:' + BOX[r.box].color + '">' + BOX[r.box].icon + "</span>" : "");
    const row = document.createElement("div");
    row.className = "playrow" + (done ? " done" : ready ? " ready" : "");
    row.innerHTML = '<span class="pm">⏱️ ' + r.min + 'm</span><span class="pr">' + rw + '</span>'
      + '<button class="pclaim" data-pi="' + i + '"' + (ready ? "" : " disabled") + '>'
      + (done ? t("playGot") : ready ? t("playClaim") : t("playLock", { m: r.min })) + "</button>";
    box.appendChild(row);
  });
  box.querySelectorAll(".pclaim").forEach(b => b.addEventListener("click", () => claimPlay(+b.dataset.pi)));
}
function claimPlay(i) {
  playReset();
  const r = PLAYTIME[i]; if (!r) return;
  if ((META.play.sec || 0) < r.sec) { toast(t("playLock", { m: r.min }), "#8b93a7"); return; }
  if (META.play.claimed.indexOf(i) >= 0) return;
  META.play.claimed.push(i);
  META.gold += r.gold;
  if (r.gem) META.gems = (META.gems || 0) + r.gem;
  let boxRes = null;
  if (r.box) boxRes = openBox(r.box);
  saveMeta(); updateMeta(); renderPlay();
  haptic("medium"); SFX.claim();
  const txt = "💰" + r.gold + (r.gem ? " 💎" + r.gem : "") + (boxRes ? " " + boxRes.text : "");
  if (boxRes) setTimeout(() => showGacha({ key: boxRes.rank, color: boxRes.color }, boxRes.text), 400);
  else toast(t("tPlay", { x: txt }), "#fbbf24");
}
function openEvent() { renderAttend(); renderPlay(); renderSeason(); showPage("event"); }
function renderAttend() {
  const grid = $("attend-grid"); if (!grid) return;
  grid.innerHTML = "";
  const claimed = META.attend.last === today(), cur = (META.attend.day || 0) % 30;
  ATTEND.forEach((r, i) => {
    const d = document.createElement("div");
    d.className = "attcell" + (i < cur ? " done" : "") + (i === cur && !claimed ? " today" : "") + (r.box ? " box" : "");
    const rw = r.box ? '<span style="color:' + BOX[r.box].color + '">' + BOX[r.box].icon + "</span>" : (r.gem ? "💎" + r.gem : "💰" + (r.g >= 1000 ? Math.floor(r.g / 1000) + "k" : r.g));
    d.innerHTML = '<div class="ad">' + (i + 1) + "</div><div class=\"ar\">" + rw + "</div>";
    grid.appendChild(d);
  });
  const btn = $("attend-claim");
  if (btn) { btn.disabled = claimed; btn.textContent = claimed ? t("evDone") : t("evClaim"); }
}
function claimAttend() {
  if (META.attend.last === today()) { toast(t("evDone"), "#8b93a7"); return; }
  const idx = (META.attend.day || 0) % 30, r = ATTEND[idx];
  if (r.g) META.gold += r.g;
  if (r.gem) META.gems = (META.gems || 0) + r.gem;
  let boxRes = null;
  if (r.box) boxRes = openBox(r.box);
  META.attend.day = (META.attend.day || 0) + 1; META.attend.last = today();
  saveMeta(); updateMeta(); renderAttend();
  haptic("medium"); SFX.claim();
  if (boxRes) {
    setTimeout(() => showGacha({ key: boxRes.rank, color: boxRes.color }, boxRes.text), 400);
  } else toast(t("tAttend", { n: idx + 1 }), "#fbbf24");
}
$("attend-claim").addEventListener("click", claimAttend);

// ── 이벤트/쿠폰 코드 (회원 배포용) ───────────────────────────────────────────
const CODES = {
  WELCOME:    { gold: 1000, gem: 50 },
  LEGION:     { gem: 100 },
  DAEDALUS:   { gold: 3000 },
  LAUNCH2026: { gold: 2000, gem: 200 },
};
function redeemCode() {
  const inp = $("code-input"); if (!inp) return;
  const code = (inp.value || "").trim().toUpperCase();
  if (!code) return;
  if (!META.codes) META.codes = [];
  if (META.codes.indexOf(code) >= 0) { toast(t("codeUsed"), "#ef4444"); return; }
  const r = CODES[code];
  if (!r) { toast(t("codeBad"), "#ef4444"); return; }
  if (r.gold) META.gold += r.gold;
  if (r.gem) META.gems = (META.gems || 0) + r.gem;
  META.codes.push(code); saveMeta(); updateMeta(); inp.value = "";
  toast(t("codeOk", { x: (r.gold ? "💰" + r.gold + " " : "") + (r.gem ? "💎" + r.gem : "") }), "#fbbf24");
  haptic("medium");
}
$("code-btn").addEventListener("click", redeemCode);

// ── 캐시 상점 (별도, Stars 결제 자리 — 지금은 데모 지급) ─────────────────────
const SHOP = [
  { id: "starter", starter: true, price: "₩990", tag: "BEST" },
  { id: "monthly", k: "pkMonthly", price: "₩14,900", tag: "30일·💎" },
  { id: "weekly", k: "pkWeekly", price: "₩4,900", tag: "7일·💎" },
  { id: "vip", vip: true, price: "₩29,900", tag: "VIP·4x·💎600" },
  { id: "ultra", ultra: true, price: "₩99,900", tag: "MAX·8x·SSR" },
  { id: "growth1", k: "pkGrow1", price: "₩9,900", tag: "성장" },
  { id: "growth2", k: "pkGrow2", price: "₩49,900", tag: "성장·SSR" },
  { id: "gem1", gem: 60, price: "₩1,100" },
  { id: "gem2", gem: 330, price: "₩5,500", tag: "+10%" },
  { id: "gem3", gem: 1180, price: "₩19,900", tag: "+18%" },
  { id: "gem4", gem: 3200, price: "₩49,900", tag: "+25%" },
  { id: "gold1", g: 6000, price: "₩1,100" },
  { id: "gold2", g: 35000, price: "₩5,500", tag: "+6%" },
  { id: "gold3", g: 140000, price: "₩19,900", tag: "+18%" },
];
function dayPlus(n) { try { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); } catch (e) { return ""; } }
function passActive(kind) { return META.pass[kind] && today() <= META.pass[kind]; }
function checkPasses() {                                // 활성 패스 = 매일 💎 자동 수령
  let got = 0;
  if (passActive("monthly") && META.passClaim.monthly !== today()) { META.gems = (META.gems || 0) + 100; META.passClaim.monthly = today(); got += 100; }
  if (passActive("weekly") && META.passClaim.weekly !== today()) { META.gems = (META.gems || 0) + 50; META.passClaim.weekly = today(); got += 50; }
  if (got) { saveMeta(); updateMeta(); toast("📅 " + t("passDaily", { n: got }), "#fbbf24"); }
}
function openShop() { renderShop(); showPage("shop"); }
function renderShop() {
  const box = $("shop-list"); if (!box) return;
  box.innerHTML = "";
  SHOP.forEach((p) => {
    if (p.starter && META.starter) return;
    if (p.vip && META.vip) return;
    if (p.ultra && META.ultra) return;
    const isPass = p.id === "monthly" || p.id === "weekly";
    const active = p.id === "monthly" ? passActive("monthly") : p.id === "weekly" ? passActive("weekly") : false;
    const c = document.createElement("button"); c.className = "packcard" + (p.vip || p.ultra ? " vip" : "") + (p.k ? " grow" : "") + (active ? " active" : "");
    const what = p.starter ? "💎 " + t("spTitle") : p.vip ? t("tVip") : p.ultra ? t("tUltra") : p.k ? t(p.k) : (p.gem ? "💎 " + p.gem : "💰 " + p.g);
    const sub = active ? '<div class="psub">✓ ~' + META.pass[p.id] + "</div>" : "";
    c.innerHTML = (p.tag ? '<span class="ptag">' + p.tag + "</span>" : "") + '<div class="pwhat">' + what + "</div>" + sub + '<div class="pprice">' + p.price + "</div>";
    c.addEventListener("click", () => buyPack(p.id));
    box.appendChild(c);
  });
}
// ── 💳 결제 (Telegram Stars) ─────────────────────────────────────────────────
// PAY_BACKEND 비어있으면 데모 즉시지급. 채우면 봇 서버가 인보이스 발급 → tg.openInvoice → 결제확인 후 지급.
const PAY_BACKEND = "";   // 예: "https://legion-pay.xxxx.workers.dev"
const STARS = { starter: 50, weekly: 250, monthly: 750, vip: 1500, ultra: 5000, growth1: 500, growth2: 2500,
                gem1: 55, gem2: 280, gem3: 1000, gem4: 2500, gold1: 55, gold2: 280, gold3: 1000 };
function buyPack(id) {
  const p = SHOP.find((x) => x.id === id); if (!p) return;
  const stars = STARS[id] || 0;
  if (!PAY_BACKEND || !tg || !tg.openInvoice || !stars) {   // 백엔드 미설정/텔레그램 밖 → 데모 지급
    grantPack(id); if (!PAY_BACKEND) toast(t("payDemo"), "#8b93a7");
    return;
  }
  payWithStars(id, stars);
}
function payWithStars(id, stars) {
  let uid = 0; try { uid = ((tg.initDataUnsafe && tg.initDataUnsafe.user) || {}).id || 0; } catch (e) {}
  toast(t("payOpening"), "#fbbf24");
  fetch(PAY_BACKEND + "/invoice?item=" + encodeURIComponent(id) + "&stars=" + stars + "&uid=" + uid)
    .then((r) => r.json())
    .then((d) => {
      if (!d || !d.link) throw new Error("no link");
      tg.openInvoice(d.link, (status) => {
        if (status === "paid") { grantPack(id); toast(t("payOk"), "#a3e635"); haptic("heavy"); }
        else if (status === "failed") toast(t("payFail"), "#ef4444");
        else toast(t("payCancel"), "#8b93a7");   // cancelled/pending
      });
    })
    .catch(() => toast(t("payErr"), "#ef4444"));
}
function grantPack(id) {
  const p = SHOP.find((x) => x.id === id); if (!p) return;
  if (p.starter) {                                     // 💎 초심자: 골드3000 + 10연 효과
    META.starter = true; META.gold += 3000;
    for (let i = 0; i < 10; i++) { const u = ORDER[(Math.random() * 5) | 0]; META.lv[u] = (META.lv[u] || 0) + 1; }
    saveMeta(); updateMeta(); renderShop(); $("starter").classList.add("hidden");
    toast(t("tStarter"), "#fbbf24"); haptic("heavy"); return;
  }
  if (p.vip) {                                         // 👑 VIP: 4x속도·골드+50%·💎600·SR유닛 1체
    META.vip = true; META.starter = true; META.gems = (META.gems || 0) + 600;
    const u = grantUnit("SR");
    saveMeta(); updateMeta(); renderShop();
    if (u) setTimeout(() => showGacha({ key: "SR", color: "#c084fc" }, "👑 " + u.name + " (SR)"), 300);
    toast(t("tVip"), "#fbbf24"); haptic("heavy"); return;
  }
  if (p.ultra) {                                        // 🔱 울트라 끝판왕: 8x·VIP혜택·💎2000·💰50k·SSR유닛+SSR장비
    META.ultra = true; META.vip = true; META.starter = true;
    META.gems = (META.gems || 0) + 2000; META.gold += 50000;
    const u = grantUnit("SSR"); const g = newGear("SSR"); META.gear.push(g);
    saveMeta(); updateMeta(); renderShop();
    if (u) setTimeout(() => showGacha({ key: "SSR", color: "#fbbf24" }, "🔱 " + u.name + " (SSR) + " + (SLOT_ICON[g.slot] || "") + "SSR장비"), 300);
    toast(t("tUltra"), "#fbbf24"); haptic("heavy"); return;
  }
  if (p.id === "monthly") {                             // 📅 월간 패스: 즉시 💎300 + 30일 매일 💎100
    META.pass.monthly = dayPlus(30); META.passClaim.monthly = ""; META.gems = (META.gems || 0) + 300;
    saveMeta(); checkPasses(); updateMeta(); renderShop();
    toast(t("tMonthly"), "#fbbf24"); haptic("heavy"); return;
  }
  if (p.id === "weekly") {                              // 📅 주간 패스: 즉시 💎100 + 7일 매일 💎50
    META.pass.weekly = dayPlus(7); META.passClaim.weekly = ""; META.gems = (META.gems || 0) + 100;
    saveMeta(); checkPasses(); updateMeta(); renderShop();
    toast(t("tWeekly"), "#fbbf24"); haptic("heavy"); return;
  }
  if (p.id === "growth1") {                             // 📦 성장 패키지: 💰5만 + 💎200 + SR장비×2
    META.gold += 50000; META.gems = (META.gems || 0) + 200;
    for (let i = 0; i < 2; i++) { const g = newGear("SR"); META.gear.push(g); }
    saveMeta(); updateMeta(); renderShop();
    toast(t("tGrowth"), "#fbbf24"); haptic("heavy"); return;
  }
  if (p.id === "growth2") {                             // 🎁 고급 성장팩: 💰20만 + 💎800 + SSR유닛 + SSR장비
    META.gold += 200000; META.gems = (META.gems || 0) + 800;
    const u = grantUnit("SSR"); const g = newGear("SSR"); META.gear.push(g);
    saveMeta(); updateMeta(); renderShop();
    if (u) setTimeout(() => showGacha({ key: "SSR", color: "#fbbf24" }, "🎁 " + u.name + " (SSR) + " + (SLOT_ICON[g.slot] || "") + "SSR장비"), 300);
    toast(t("tGrowth"), "#fbbf24"); haptic("heavy"); return;
  }
  if (p.gem) META.gems = (META.gems || 0) + p.gem;
  if (p.g) META.gold += p.g;
  saveMeta(); updateMeta(); renderShop();
  toast("🛒 " + (p.gem ? "💎+" + p.gem : "💰+" + p.g), "#fbbf24"); haptic("medium");
}
on("gacha10-btn", "click", gacha10);
// 장비 뽑기 + 상점 뽑기 버튼 + 시즌 이벤트
function gearGacha(count) {
  const cost = count === 10 ? 250 : 30;
  if ((META.gems || 0) < cost) { toast(t("tGemShort", { n: cost }), "#ef4444"); return; }
  if (META.gear.length + count > 60) { toast(t("gFull"), "#ef4444"); return; }
  META.gems -= cost;
  const RK = { N: 0, R: 1, SR: 2, SSR: 3 }; let best = null;
  for (let i = 0; i < count; i++) { const g = newGear(); META.gear.push(g); if (!best || RK[g.rarity] > RK[best.rarity]) best = g; }
  saveMeta(); updateMeta(); renderGear();
  showGacha({ key: best.rarity, color: best.color }, "🔨 " + t("gTitle") + " ×" + count + " — best " + best.rarity);
}
function renderSeason() {
  const box = $("season-list"); if (!box) return;
  box.innerHTML = `<div class="seasoncard"><div class="sc-name">🏆 ${t("seasonSoon")}</div><div class="ddim">${t("seasonHint")}</div></div>`;
}
on("sg-char1", "click", gacha);
on("sg-char10", "click", gacha10);
on("sg-gear1", "click", () => gearGacha(1));
on("sg-gear10", "click", () => gearGacha(10));

// ── 대시보드: 도감 + 강화(실패확률·보호) + 승급(조합) ─────────────────────────
const PROTECT_COST = 10;   // 💎
let dashProtect = false;
function enhCost(type) { return 100 * ((META.enh[type] || 0) + 1); }
function enhRate(type) { return Math.max(35, 100 - (META.enh[type] || 0) * 6); }
function enhance(type) {
  if (running) return;
  const enh = META.enh[type] || 0, cost = enhCost(type);
  if (META.gold < cost) { toast(t("tGoldShort", { n: cost }), "#ef4444"); return; }
  if (dashProtect && (META.gems || 0) < PROTECT_COST) { toast(t("tGemShort", { n: PROTECT_COST }), "#ef4444"); return; }
  META.gold -= cost; if (dashProtect) META.gems -= PROTECT_COST;
  if (Math.random() * 100 < enhRate(type)) {
    META.enh[type] = enh + 1; toast(t("dSuccess", { n: enh + 1 }), "#a3e635"); SFX.claim(); haptic("medium");
  } else {
    if (enh >= 5 && !dashProtect) { META.enh[type] = enh - 1; toast(t("dFail") + " −1", "#ef4444"); }
    else { toast(t("dFail"), "#ef4444"); }
    SFX.lose(); haptic("heavy");
  }
  saveMeta(); updateMeta(); renderDash();
}
function ascend(type) {
  if (running || (META.enh[type] || 0) < 10) return;
  const goldC = 5000, gemC = 50;
  if (META.gold < goldC || (META.gems || 0) < gemC) { toast(t("tGemShort", { n: gemC }), "#ef4444"); return; }
  META.gold -= goldC; META.gems -= gemC;
  META.star[type] = (META.star[type] || 0) + 1; META.enh[type] = 0;
  saveMeta(); updateMeta(); renderDash();
  toast("⭐ " + SPEC[type].glyph + " ★" + META.star[type], "#fbbf24"); SFX.ssr(); haptic("heavy");
}
const SOUL_SSR_COST = 500;
function renderSoulAltar() {
  if ($("soul-have")) $("soul-have").textContent = "🔮 " + (META.soul || 0);
  const box = $("soul-altar"); if (!box) return;
  const ok = (META.soul || 0) >= SOUL_SSR_COST;
  box.innerHTML = '<button id="soul-ssr" class="gbig"' + (ok ? "" : " disabled") + '>💎 ' + t("soulSSR") + " · 🔮" + SOUL_SSR_COST + "</button>";
  on("soul-ssr", "click", soulSSR);
}
function soulSSR() {
  if (running) return;
  if ((META.soul || 0) < SOUL_SSR_COST) { toast(t("soulShort", { n: SOUL_SSR_COST }), "#ef4444"); return; }
  META.soul -= SOUL_SSR_COST;
  const gu = grantUnit("SSR");
  saveMeta(); updateMeta(); renderDash();
  haptic("heavy");
  setTimeout(() => showGacha({ key: "SSR", color: "#fbbf24" }, "🔮 " + (gu ? gu.name : "SSR") + " (SSR)"), 200);
  toast(t("tSoulSSR", { x: gu ? gu.name : "SSR" }), "#c084fc");
}
const AWAK_MAX = 3;
function awakCost(type) { return 20 * ((META.awak[type] || 0) + 1); }   // 🔮 소울
function awaken(type) {
  if (running) return;
  const aw = META.awak[type] || 0;
  if ((META.star[type] || 0) < 3) { toast(t("awNeedStar"), "#ef4444"); return; }
  if (aw >= AWAK_MAX) { toast(t("awMax"), "#8b93a7"); return; }
  const cost = awakCost(type);
  if ((META.soul || 0) < cost) { toast(t("awSoulShort", { n: cost }), "#ef4444"); return; }
  META.soul -= cost; META.awak[type] = aw + 1;
  saveMeta(); updateMeta(); renderDash();
  toast("✦ " + SPEC[type].glyph + " " + t("awDone", { n: aw + 1 }), "#c084fc"); SFX.ssr(); haptic("heavy");
}
function openDash() { showPage("char"); renderDash(); }
function renderDash() {
  if ($("dash-power")) $("dash-power").textContent = legionPower();
  if ($("dash-div")) $("dash-div").textContent = dividendGold();
  const box = $("dash-list"); if (box) {
    box.innerHTML = "";
    ORDER.forEach((type) => {
      if (type === "titan" && !META.titanOwned) return;
      const enh = META.enh[type] || 0, star = META.star[type] || 0, lv = META.lv[type] || 0, canAsc = enh >= 10;
      const aw = META.awak[type] || 0;
      const baseAi = SPEC[type].ai;
      const hBonus = META.hero === "strategist" ? heroAiBonus(META.heroLv.strategist || 1) : 0;
      const effAi = Math.min(3, baseAi + hBonus + aw);
      const aiBadge = `<span class="dai ai${effAi}">🧠 AI Lv${effAi}${effAi > baseAi ? ` <em>↑${baseAi}</em>` : ""}</span>`;
      const canAwk = star >= 3 && aw < AWAK_MAX;
      const c = document.createElement("div"); c.className = "dcard";
      c.innerHTML =
        `<div class="dglyph">${SPEC[type].glyph}${star ? `<span class="dstar">★${star}</span>` : ""}${aw ? `<span class="dawk">✦${aw}</span>` : ""}</div>` +
        `<div class="dinfo"><div class="dlv">Lv${lv} · <b>+${enh}</b> ${aiBadge}</div><div class="ddim">${t("dRate")} ${enhRate(type)}% · 💰${enhCost(type)}${canAwk ? ` · ✦🔮${awakCost(type)}` : ""}</div></div>` +
        `<div class="dbtns"><button class="denh" data-t="${type}">${t("dEnhance")}</button>${canAsc ? `<button class="dasc" data-t="${type}">⭐</button>` : ""}${canAwk ? `<button class="dawkb" data-t="${type}">✦</button>` : ""}</div>`;
      box.appendChild(c);
    });
    box.querySelectorAll(".denh").forEach((b) => b.addEventListener("click", () => enhance(b.dataset.t)));
    box.querySelectorAll(".dasc").forEach((b) => b.addEventListener("click", () => ascend(b.dataset.t)));
    box.querySelectorAll(".dawkb").forEach((b) => b.addEventListener("click", () => awaken(b.dataset.t)));
  }
  const hbox = $("dash-heroes");
  if (hbox) hbox.innerHTML = HERO_ORDER.map((hk) => { const h = HEROES[hk], tr = tHero(hk); return '<div class="hrow">' + h.glyph + " <b>" + tr[0] + "</b> <span class=\"hcode\">" + h.rank + "</span> · 💥" + tUlt(h.ult) + "</div>"; }).join("");
  const pb = $("dash-protect"); if (pb) { pb.textContent = "💎 " + t("dProtect") + (dashProtect ? " ✓" : ""); pb.classList.toggle("on", dashProtect); }
  renderSoulAltar(); renderGear(); renderCodex();
}
// ── 캐릭터 도감 그리드 (229종 수집) ──────────────────────────────────────────
let codexFilter = "ALL";
function grantUnit(rarity) {
  if (typeof ROSTER === "undefined") return null;
  const pool = ROSTER.filter((u) => u.rarity === rarity);
  if (!pool.length) return null;
  const u = pool[(Math.random() * pool.length) | 0];
  if (!META.owned) META.owned = [];
  if (META.owned.indexOf(u.id) < 0) META.owned.push(u.id);
  return u;
}
function renderCodex() {
  const grid = $("codex-grid"); if (!grid || typeof ROSTER === "undefined") return;
  const owned = new Set(META.owned || []);
  if ($("codex-count")) $("codex-count").textContent = owned.size + " / " + ROSTER.length;
  const fbar = $("codex-filter");
  if (fbar && !fbar.dataset.built) {
    fbar.innerHTML = ["ALL", "SSR", "SR", "R", "N"].map((r) => `<button class="cfil" data-r="${r}">${r}</button>`).join("");
    fbar.querySelectorAll(".cfil").forEach((b) => b.addEventListener("click", () => { codexFilter = b.dataset.r; renderCodex(); }));
    fbar.dataset.built = "1";
  }
  if (fbar) fbar.querySelectorAll(".cfil").forEach((b) => b.classList.toggle("on", b.dataset.r === codexFilter));
  const list = codexFilter === "ALL" ? ROSTER : ROSTER.filter((u) => u.rarity === codexFilter);
  grid.innerHTML = list.map((u) => {
    const has = owned.has(u.id);
    return `<div class="cxc${has ? "" : " lock"}" data-id="${u.id}" style="border-color:${u.color}${has ? "" : "33"}"><div class="cxg">${has ? u.glyph : "❔"}</div><div class="cxr" style="color:${u.color}">${u.rarity}</div></div>`;
  }).join("");
  grid.querySelectorAll(".cxc").forEach((c) => c.addEventListener("click", () => showUnit(+c.dataset.id)));
}
function showUnit(id) {
  const u = ROSTER.find((x) => x.id === id); if (!u) return;
  const has = (META.owned || []).indexOf(id) >= 0;
  $("unit-card").style.borderColor = u.color;
  $("unit-glyph").textContent = has ? u.glyph : "❔";
  $("unit-name").innerHTML = `<b style="color:${u.color}">[${u.rarity}]</b> ${has ? u.name : "???"}`;
  $("unit-title").textContent = has ? (u.title || u.arch) : t("locked");
  $("unit-detail").innerHTML = has
    ? `${u.faction ? "🏷️ " + u.faction + " · " : ""}${u.glyph} ${u.arch} ×${u.mul}<br>${u.persona ? "💬 " + u.persona + "<br>" : ""}${u.trait ? "✦ " + u.trait : ""}`
    : t("lockedHint");
  $("unit-pop").classList.remove("hidden");
}
// ── 장비: 제작 · 장착 · 강화 ──────────────────────────────────────────────────
function craftGear() {
  const cost = 300;
  if (META.gold < cost) { toast(t("tGoldShort", { n: cost }), "#ef4444"); return; }
  if (META.gear.length >= 40) { toast(t("gFull"), "#ef4444"); return; }
  META.gold -= cost; const g = newGear(); META.gear.push(g);
  saveMeta(); updateMeta(); renderGear();
  toast(t("gGot", { x: SLOT_ICON[g.slot] + " " + g.rarity }), g.color); SFX.gacha();
}
function equipGear(id) {
  const g = META.gear.find((x) => x.id === id); if (!g) return;
  if (!META.equip[META.hero]) META.equip[META.hero] = {};
  const before = legionPower();
  if (META.equip[META.hero][g.slot] === id) delete META.equip[META.hero][g.slot]; else META.equip[META.hero][g.slot] = id;
  saveMeta(); renderDash();                            // 전력 헤더까지 즉시 갱신
  const d = legionPower() - before;
  const pe = $("dash-power");
  if (pe) { pe.classList.remove("pop"); void pe.offsetWidth; pe.classList.add("pop"); }
  if (d > 0) { toast("⚡ " + t("dPower") + " +" + d, "#a3e635"); SFX.claim(); haptic("medium"); }
  else if (d < 0) { toast("⚡ " + t("dPower") + " " + d, "#8b93a7"); haptic("light"); }
  else haptic("light");
}
function enhanceGear(id) {
  const g = META.gear.find((x) => x.id === id); if (!g) return;
  const cost = 200 * ((g.enh || 0) + 1);
  if (META.gold < cost) { toast(t("tGoldShort", { n: cost }), "#ef4444"); return; }
  META.gold -= cost;
  const eqd = (META.equip[META.hero] || {})[g.slot] === id;   // 장착 중이면 전력 변동
  const before = legionPower();
  if (Math.random() * 100 < Math.max(40, 100 - (g.enh || 0) * 8)) { g.enh = (g.enh || 0) + 1; toast(t("dSuccess", { n: g.enh }), "#a3e635"); SFX.claim(); }
  else { toast(t("dFail"), "#ef4444"); SFX.lose(); }
  saveMeta(); updateMeta(); renderDash();
  if (eqd) { const d = legionPower() - before; const pe = $("dash-power"); if (d > 0 && pe) { pe.classList.remove("pop"); void pe.offsetWidth; pe.classList.add("pop"); } }
}
function renderGear() {
  const eq = META.equip[META.hero] || {};
  const slotsBox = $("gear-slots");
  if (slotsBox) {
    slotsBox.innerHTML = SLOTS.map((s) => { const id = eq[s], g = id ? META.gear.find((x) => x.id === id) : null; return `<div class="gslot${g ? " on" : ""}">${SLOT_ICON[s]}${g ? `<span class="gmain" style="color:${g.color}">${g.rarity}${g.enh ? "+" + g.enh : ""}</span>` : ""}</div>`; }).join("");
  }
  const inv = $("gear-inv");
  if (inv) {
    if (!META.gear.length) { inv.innerHTML = `<div class="ddim" style="text-align:center;padding:8px 0">${t("gEmpty")}</div>`; return; }
    inv.innerHTML = META.gear.slice().sort((a, b) => b.id - a.id).map((g) => {
      const equipped = eq[g.slot] === g.id;
      const stats = STAT_KEYS.filter((k) => g[k]).map((k) => t("st_" + k) + gearStat(g, k)).join(" ");
      return `<div class="gitem" style="border-color:${g.color}66"><div class="gi-main">${SLOT_ICON[g.slot]} <b style="color:${g.color}">${g.rarity}</b>${g.enh ? " +" + g.enh : ""}</div><div class="gi-stat">${stats}</div><div class="gi-btns"><button class="geq${equipped ? " on" : ""}" data-id="${g.id}">${equipped ? "✓" : t("gEquip")}</button><button class="gup" data-id="${g.id}">🔨</button></div></div>`;
    }).join("");
    inv.querySelectorAll(".geq").forEach((b) => b.addEventListener("click", () => equipGear(+b.dataset.id)));
    inv.querySelectorAll(".gup").forEach((b) => b.addEventListener("click", () => enhanceGear(+b.dataset.id)));
  }
}
// 안전 바인딩 헬퍼 (요소 없으면 무시 — null 크래시 방지)
function on(id, ev, fn) { const e = $(id); if (e) e.addEventListener(ev, fn); }
on("dash-protect", "click", () => { dashProtect = !dashProtect; renderDash(); });
on("gear-craft", "click", craftGear);
on("unit-close", "click", () => $("unit-pop").classList.add("hidden"));
// ── 페이지 네비게이션 ──
let curPage = "battle";
function showPage(p) {
  curPage = p;
  document.querySelectorAll(".page").forEach((el) => el.classList.add("hidden"));
  const pg = $("page-" + p); if (pg) pg.classList.remove("hidden");
  document.querySelectorAll(".navtab").forEach((b) => b.classList.toggle("sel", b.dataset.p === p));
}
document.querySelectorAll(".navtab").forEach((b) => b.addEventListener("click", () => {
  const p = b.dataset.p;
  if (p === "char") { showPage("char"); renderDash(); }
  else if (p === "codex") { showPage("codex"); renderCodex(); }
  else if (p === "shop") openShop();
  else if (p === "event") openEvent();
  else showPage("battle");
}));
on("settings-corner", "click", openSettings);   // 설정 = 상단 구석

$("overlay-btn").addEventListener("click", reset);
on("gacha-btn", "click", gacha);
$("gacha-close").addEventListener("click", () => $("gacha").classList.add("hidden"));
$("auto").addEventListener("click", toggleAuto);
$("ult").addEventListener("click", doUlt);
$("hero-up").addEventListener("click", upgradeHero);
$("starter-buy").addEventListener("click", buyStarter);
$("starter-close").addEventListener("click", () => $("starter").classList.add("hidden"));
// (starter-btn은 상점으로 통합됨 — 더 이상 별도 버튼 없음)
document.querySelectorAll(".modetab").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.m)));
document.querySelectorAll(".hbtn").forEach((b) => b.addEventListener("click", () => selectHero(b.dataset.h)));
window.addEventListener("resize", () => { if (!running) reset(); });
// lastSeen 하트비트 (방치 보상 정확도) + 이탈 시 저장
setInterval(() => { try { META.lastSeen = nowMs(); localStorage.setItem(META_KEY, JSON.stringify(META)); } catch (e) {} }, 15000);
setInterval(tickPlay, 1000);   // ⏱️ 플레이타임 보상 적립(보이는 동안만)
document.addEventListener("visibilitychange", () => { if (document.hidden) saveMeta(); });
window.addEventListener("beforeunload", saveMeta);

bindDeploy();
applyStaticI18n();
buildLangList();
updateHeroUI();
reset();
checkIdle();
checkDaily();
checkPasses();
updateAutoBtn();
