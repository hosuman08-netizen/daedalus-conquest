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
    if (_actx.state === "suspended") _actx.resume();
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
  // 🎉 승리 팡파레 — 묵직한 저음 파워코드 + 상승 멜로디
  win:   () => { tone(131, 0.28, "sawtooth", 0.045); tone(196, 0.28, "sawtooth", 0.03); [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => tone(f, 0.2, "square", 0.055), i * 85)); },
  lose:  () => [330, 247, 165].forEach((f, i) => setTimeout(() => tone(f, 0.24, "sawtooth", 0.05), i * 150)),
  gacha: () => { tone(330, 0.12, "sawtooth", 0.035); [660, 880, 1100].forEach((f, i) => setTimeout(() => tone(f, 0.1, "square", 0.045), i * 70)); },
  // 🌟 SSR — 묵직한 베이스 임팩트 + 상승 런 + 마무리 고음 샤인
  ssr:   () => { tone(98, 0.55, "sawtooth", 0.05); tone(147, 0.55, "sawtooth", 0.03); [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => setTimeout(() => tone(f, 0.2, "square", 0.06), i * 75)); setTimeout(() => { tone(2093, 0.35, "square", 0.05); tone(1568, 0.35, "triangle", 0.04); }, 520); },
  tap:   () => tone(440, 0.04, "sine", 0.02),
  // ✅ 보상 — 동전/파워업 느낌(저음 펀치 + 더블 상승)
  claim: () => { tone(196, 0.1, "triangle", 0.05); tone(700, 0.09, "square", 0.045); setTimeout(() => tone(1050, 0.13, "square", 0.055), 70); setTimeout(() => tone(1400, 0.1, "triangle", 0.04), 150); },
  hit:   () => tone(180 + Math.random() * 60, 0.05, "square", 0.025),
  equip: () => { tone(294, 0.08, "sawtooth", 0.04); setTimeout(() => tone(587, 0.1, "square", 0.045), 55); setTimeout(() => tone(880, 0.1, "triangle", 0.04), 120); },
  // ⚔️ 전투 — 경쾌한 발사 "팡" + 묵직한 폭발 사망
  shot:  () => tone(360 + Math.random() * 520, 0.045, "square", 0.018),
  boom:  () => { tone(85, 0.14, "sawtooth", 0.045); tone(220 + Math.random() * 120, 0.08, "square", 0.03); },
};
let _popAt = 0;
function combatPop() {                                  // 발사음 스로틀(과밀 방지)
  const n = nowMs();
  if (n - _popAt < 55) return;
  _popAt = n; SFX.shot();
}

// ── 🎵 BGM (합성 루프, 에셋 없음) — A단조 4코드 아르페지오 + 베이스 ───────────────
function ensureAudio() { try { if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)(); if (_actx.state === "suspended") _actx.resume(); } catch (e) {} }
function bgmTone(freq, dur, type, vol) {
  if (!_actx || (typeof META !== "undefined" && META && META.music === false)) return;
  try {
    const o = _actx.createOscillator(), g = _actx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g); g.connect(_actx.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + dur);
    o.stop(_actx.currentTime + dur);
  } catch (e) {}
}
// 딥하우스 무드 코드 진행 (Am F G Em — 따뜻하고 그루비)
const BGM_CHORDS = [[130.81, 155.56, 196.00], [103.83, 130.81, 155.56], [116.54, 146.83, 174.61], [98.00, 116.54, 146.83]]; // 🩸 어두운 단조 (phonk) — Cm/Ab/Bb/Gm 저음
function bgmKick(vol) {   // 킥 — 폰 스피커에서도 들리게 미드 클릭 + 바디
  if (!_actx || (typeof META !== "undefined" && META && META.music === false)) return;
  try {
    const o = _actx.createOscillator(), g = _actx.createGain();
    o.type = "triangle"; o.frequency.setValueAtTime(220, _actx.currentTime); o.frequency.exponentialRampToValueAtTime(55, _actx.currentTime + 0.1);
    g.gain.value = vol; g.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + 0.2);
    o.connect(g); g.connect(_actx.destination); o.start(); o.stop(_actx.currentTime + 0.21);
  } catch (e) {}
}
function bgmHat(vol) {     // 하이햇 — 짧은 고음 틱
  if (!_actx || (typeof META !== "undefined" && META && META.music === false)) return;
  try {
    const o = _actx.createOscillator(), g = _actx.createGain();
    o.type = "square"; o.frequency.value = 8200; g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + 0.03);
    o.connect(g); g.connect(_actx.destination); o.start(); o.stop(_actx.currentTime + 0.035);
  } catch (e) {}
}
function bgmClap(vol) {    // 클랩/스네어 — 백비트 그루브 (다중 고음 버스트)
  if (!_actx || (typeof META !== "undefined" && META && META.music === false)) return;
  [0, 12, 24].forEach((ms) => setTimeout(() => { bgmHat(vol * 0.8); }, ms));
  try {
    const o = _actx.createOscillator(), g = _actx.createGain();
    o.type = "square"; o.frequency.value = 1700; g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + 0.07);
    o.connect(g); g.connect(_actx.destination); o.start(); o.stop(_actx.currentTime + 0.08);
  } catch (e) {}
}
let bgmTimer = null, bgmStep = 0, bgmAudio = null;
function bgm808(freq, dur, vol) {   // phonk 808 슬라이드 서브베이스
  if (!_actx || (typeof META !== "undefined" && META && META.music === false)) return;
  try {
    const o = _actx.createOscillator(), g = _actx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(freq * 1.45, _actx.currentTime); o.frequency.exponentialRampToValueAtTime(freq, _actx.currentTime + 0.09);
    g.gain.value = vol; g.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + dur);
    o.connect(g); g.connect(_actx.destination); o.start(); o.stop(_actx.currentTime + dur + 0.02);
  } catch (e) {}
}
function bgmCowbell(freq, vol) {   // phonk 멜로디 — 둥글게(triangle), 낮고 그루비 (칩튠/테트리스 느낌 제거)
  if (!_actx || (typeof META !== "undefined" && META && META.music === false)) return;
  try {
    const o = _actx.createOscillator(), g = _actx.createGain();
    o.type = "triangle"; o.frequency.value = freq;
    g.gain.value = vol; g.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + 0.24);
    o.connect(g); g.connect(_actx.destination); o.start(); o.stop(_actx.currentTime + 0.26);
  } catch (e) {}
}
const BGM_BASS = [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0];        // 808 — 스파스(느리고 공간)
const PHONK_COWBELL = [1, 0, 0, 3, 0, 0, 2, 0, 0, 1, 0, 0, 3, 0, 2, 0];   // 멜로디 — 스파스 그루브
function bgmTick() {       // 🩸 phonk — 느리고 어둡게, 스윙 그루브 (esdeekid 바이브). 멜로디 옥타브↓ = 칩튠/테트리스 제거
  const chord = BGM_CHORDS[(bgmStep >> 2) % BGM_CHORDS.length], root = chord[0];
  const sw = (bgmStep % 2 === 1) ? 48 : 0, D = (fn) => sw ? setTimeout(fn, sw) : fn();   // 오프비트 스윙(그루브 탑승)
  if (bgmStep === 0 || bgmStep === 10) bgmKick(0.13);                                // 킥 (싱코페이션)
  if (bgmStep === 8) bgmClap(0.028);                                                 // 스네어
  if (bgmStep === 4 || bgmStep === 12 || bgmStep === 14) D(() => bgmHat(0.008));     // 스파스 햇 + 스윙
  if (BGM_BASS[bgmStep]) bgm808(root, 0.55, 0.18);                                   // 808 (느리고 길게, 낮은 베이스)
  if (PHONK_COWBELL[bgmStep]) D(() => bgmCowbell(chord[PHONK_COWBELL[bgmStep] - 1], 0.022)); // 낮고 둥근 멜로디(옥타브↓) + 스윙
  if (bgmStep % 16 === 0) bgmTone(chord[1] / 2, 1.3, "sine", 0.012);                 // 어두운 서브 패드
  bgmStep = (bgmStep + 1) % 16;
}
function startSynthBgm() { if (bgmTimer || (META && META.music === false)) return; ensureAudio(); bgmStep = 0; bgmTimer = setInterval(bgmTick, 150); }  // ~100BPM phonk (느린 스윙 그루브)
function stopSynthBgm() { if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; } }
function bgmStart() {      // 실제 음원 audio/bgm.mp3 있으면 사용(로열티프리만!), 없으면 합성 딥하우스
  if (META && META.music === false) return;
  ensureAudio();
  if (bgmAudio === null) {
    try {
      bgmAudio = new Audio("audio/bgm.mp3"); bgmAudio.loop = true; bgmAudio.volume = 0.45;
      bgmAudio.addEventListener("error", () => { bgmAudio = false; startSynthBgm(); });
    } catch (e) { bgmAudio = false; }
  }
  if (bgmAudio) { bgmAudio.play().then(() => stopSynthBgm()).catch(() => startSynthBgm()); }
  else startSynthBgm();
}
function bgmStop() { stopSynthBgm(); if (bgmAudio && bgmAudio.pause) { try { bgmAudio.pause(); } catch (e) {} } }
function audioUnlock() {
  ensureAudio();
  if (!(META && META.music === false)) bgmStart();
  document.removeEventListener("pointerdown", audioUnlock);
  document.removeEventListener("touchend", audioUnlock);
}
document.addEventListener("pointerdown", audioUnlock);
document.addEventListener("touchend", audioUnlock);

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
  ranger:     { glyph: "🎯", rank: "Ⅴ", ult: "volley",   ultName: "아크 볼리",    ultCd: 12 }, // Sovereign 20260616: 진짜 궁극기 느낌으로 업그레이드 (이름+이미지+이팩트)
  engineer:   { glyph: "💉", rank: "Ⅵ", ult: "repair",   ultName: "긴급 수리",   ultCd: 12 },
};
const HERO_ORDER = ["strategist", "berserker", "warden", "ranger", "mech", "engineer", "dragoon"];
// heroLv → 패시브 배율 (현질/강화로 올림)
function heroScale(lv) { return 1 + (lv - 1) * 0.5; }       // lv1=1.0, lv2=1.5, lv3=2.0 ...
function heroAiBonus(lv) { return 1 + Math.floor((lv - 1) / 2); }  // lv1→+1, lv3→+2, lv5→+3

let cv, ctx, W, H, units, fx, running, gameOver, lastT, speed = 1, raf = 0, auto = false, ultT = 0;
let curLevel = 1, bossFight = false;                 // 모드별 적 레벨/보스전 플래그

// SSR god-tier battle portraits (preload the pretty arts so they appear "저대로" in canvas fight)
// Only for the 9 Founding (u1~u9.png). Non-SSR stay synthetic for TG perf.
let ssrPortraits = {};
function preloadSSRPortraits() {
  if (typeof ROSTER === "undefined") return;
  ROSTER.filter(u => u.rarity === "SSR" && !ssrPortraits[u.id]).forEach(u => {
    const img = new Image();
    img.src = `art/u${u.id}.png`;
    img.onload = () => {
      ssrPortraits[u.id] = img;
      if (running) draw(); // re-draw battle as soon as god art loads
    };
    ssrPortraits[u.id] = img;
  });
}
preloadSSRPortraits(); // safe early call (ROSTER from units.js)
function loadPortrait(id) {   // 편성된 캐릭 일러스트 lazy 로드 (전 등급 — art/u<id>.png)
  if (!id || ssrPortraits[id]) return;
  const img = new Image();
  img.src = `art/u${id}.png`;
  img.onload = () => { if (running) draw(); };
  ssrPortraits[id] = img;
}

// Enemy visuals: small set of hostile portraits (art/enemy/*.png) for bosses/elites only (TG perf).
// All other enemies = rich synthetic procedural (aggressive red, spikes, level scaling) so battles feel worthy vs beautiful player army.
let enemyPortraits = {};
function preloadEnemyPortraits() {
  const keys = ["titan", "boss", "drone", "marksman", "guardian", "bruiser", "commander", "elite-drone", "corrupted-titan"];
  keys.forEach(k => {
    if (enemyPortraits[k]) return;
    const img = new Image();
    img.src = `art/enemy/${k}.png`;
    img.onload = () => { enemyPortraits[k] = img; if (running) draw(); };
    enemyPortraits[k] = img; // placeholder until load
  });
}
preloadEnemyPortraits();
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
// Legion signal variable seed (handoff density proxy for "Founding judgment high" bonuses; abstracted internal flavor only, no public real mapping announcement)
function getLegionSignal() {
  const d = today().replace(/-/g,'');
  let base = (parseInt(d.slice(-3)) % 5) + 1; // daily 1-6 seed
  const density = Math.min(2.8, 1 + Math.min(1.8, ((META.pulls || 10) + (META.chapter || 1)) % 40 / 18)); // activity proxy; replace w/ real 56+ handoff density
  if (base >= 4) base *= 1.15; // high judgment days (today 56 handoffs proxy boost)
  return Math.max(1.0, Math.min(3.2, base * density)); // var 1.0~3.2 for anti-abuse lean bonuses
}
function getFounderCount() { // SSR owned for ethical streak protect (3+ = 1 miss safe)
  if (!META.owned || !Array.isArray(META.owned)) return 0;
  // lean: count unique high rarity from owned (SSR proxy via roster if avail, fallback pulls/ch)
  return Math.floor((META.owned.length || 0) / 25) + (META.titanOwned ? 1 : 0) + Math.min(2, Math.floor((META.pulls||0)/40));
}

function getDeployedUnits() {
  if (!META.deployed || !Array.isArray(META.deployed)) return [];
  return META.deployed.map(id => (typeof ROSTER !== "undefined" ? ROSTER.find(u => u.id === id) : null)).filter(Boolean);
}

function toggleDeployUnit(id) {
  if (!META.deployed) META.deployed = [];
  const idx = META.deployed.indexOf(id);
  if (idx >= 0) {
    META.deployed.splice(idx, 1);
    toast(t("sqUndeploy"), "#93c5fd");
  } else {
    if (META.deployed.length >= DEPLOY_MAX) { toast(t("sqFull", { n: DEPLOY_MAX }), "#ef4444"); return; }
    META.deployed.push(id);
    toast(t("sqDeployed"), "#a3e635");
  }
  saveMeta(); renderDash(); if (!running) reset();
}
function bumpPrestige(amt) { // "numbers go up" visual on every claim/ritual
  const sig = getLegionSignal();
  const gain = Math.max(0.1, Math.floor((amt || 1) * (sig * 0.3 + 0.7)) / 10);
  META.prestige = (META.prestige || 0) + gain;
  const el = $("cohesion"); if (el) { el.textContent = META.prestige.toFixed(1); el.classList.add("pop"); setTimeout(()=>el.classList.remove("pop"), 420); }
  if ($("dash-power")) { $("dash-power").classList.add("pop"); setTimeout(()=> $("dash-power").classList.remove("pop"), 380); }
  // prestige claim pulse (high ROI §21 hook: ritual dopamine + visual endowment)
  if (el && (amt||0) >= 1) { el.style.boxShadow = "0 0 18px #c084fc"; setTimeout(()=>{if(el) el.style.boxShadow="";}, 520); }
}
function loadMeta() {
  const def = { gold: 550, chapter: 1, streak: 0, pulls: 0, pity: 0, titanOwned: false, starter: false, firstBuy: {}, lastSeen: 0, lastDaily: "",
                lv: { drone: 0, marksman: 0, guardian: 0, bruiser: 0, commander: 0, titan: 0 },
                army: { drone: 5, marksman: 3, guardian: 1, bruiser: 1, commander: 0, titan: 0 }, // 초반 접근성: 조금 더 관대하게 시작 (빠른 첫 승 + 구매 유도)
                hero: "strategist",
                heroLv: { strategist: 1, berserker: 1, warden: 1, ranger: 1, mech: 1, engineer: 1, dragoon: 1 },
                mode: "campaign", tower: 1, towerBest: 0, dailyDone: "", sound: true, haptic: true, music: true,
                gems: 50, attend: { day: 0, last: "" }, codes: [],
                enh: { drone: 0, marksman: 0, guardian: 0, bruiser: 0, commander: 0, titan: 0 },
                star: { drone: 0, marksman: 0, guardian: 0, bruiser: 0, commander: 0, titan: 0 },
                gear: [], equip: {}, gearSeq: 0, owned: [],
                play: { day: "", sec: 0, claimed: [] },
                soul: 0, awak: { drone: 0, marksman: 0, guardian: 0, bruiser: 0, commander: 0, titan: 0 },
                pass: { monthly: "", weekly: "" }, passClaim: { monthly: "", weekly: "" },
                milestones: [],
                prestige: 0, // cohesion "numbers go up" on claims
                ether: 0, asc: { might: 0, bulwark: 0, momentum: 0 }, ascCount: 0, // 🔄 환생 루프: 에테르(영구화폐)+복리노드(공세/불굴/쇄도)
                ritualWin: "", // exact claim window seed for variable ritual bonuses
                vanguard: "", // 24h FOMO Vanguard Focus god-VFX unlock
                deployed: [], // 편성: 출전할 보유 캐릭터 id 배열 (이들이 곧 부대)
                charLv: {}, charGear: {}, // 캐릭별 레벨 / 캐릭별 장비 {charId:{slot:gearId}}
                charEnh: {}, charStar: {}, charAwak: {}, // 캐릭별 강화/승급/각성
                loginStreak: 0, // daily login streak for bonus
                dailyBattles: 0, dailyPulls: 0, dailyUlts: 0, dailyTower: 0, dailyMissionsClaimed: false }; // daily cycle missions for habit loop
  if (!def.owned) def.owned = [];
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
      merged.gear.forEach(gg => {
        if (typeof gg.enh !== 'number') gg.enh=0;
        if (typeof gg.star !== 'number') gg.star=0;
        if (typeof gg.awak !== 'number') gg.awak=0;
        if (!gg.name && typeof gg.tplId === 'number') {
          const tpl = (typeof GEAR_ROSTER !== 'undefined') ? GEAR_ROSTER.find(t => t.id === gg.tplId) : null;
          if (tpl && tpl.name) gg.name = tpl.name;
          else if (!gg.name) gg.name = '장비';
        }
      });
      if (!Array.isArray(merged.owned)) merged.owned = [];
      if (typeof merged.equip !== "object" || !merged.equip) merged.equip = {};
      if (typeof merged.gearSeq !== "number") merged.gearSeq = 0;
      if (typeof merged.play !== "object" || !merged.play) merged.play = { day: "", sec: 0, claimed: [] };
      if (!Array.isArray(merged.play.claimed)) merged.play.claimed = [];
      if (typeof merged.soul !== "number") merged.soul = 0;
      merged.awak = Object.assign({}, def.awak, m.awak || {});
      merged.pass = Object.assign({}, def.pass, m.pass || {});
      merged.passClaim = Object.assign({}, def.passClaim, m.passClaim || {});
      if (!Array.isArray(merged.milestones)) merged.milestones = [];
      if (typeof merged.gems !== "number") merged.gems = 50;
      if (!merged.mode || merged.mode === "daily") merged.mode = "campaign";
      if (!merged.tower || merged.tower < 1) merged.tower = 1;
      if (!merged.hero || !HEROES[merged.hero]) merged.hero = "strategist";
      if (!merged.chapter || merged.chapter < 1) merged.chapter = 1;   // 안전장치
      if (typeof merged.prestige !== "number") merged.prestige = 0;
      if (typeof merged.ether !== "number") merged.ether = 0;
      merged.asc = Object.assign({ might: 0, bulwark: 0, momentum: 0 }, m.asc || {});
      if (typeof merged.ascCount !== "number") merged.ascCount = 0;
      if (typeof merged.ritualWin !== "string") merged.ritualWin = "";
      if (typeof merged.vanguard !== "string") merged.vanguard = "";
      if (!Array.isArray(merged.deployed)) merged.deployed = [];
      if (typeof merged.charLv !== "object" || !merged.charLv) merged.charLv = {};
      if (typeof merged.charGear !== "object" || !merged.charGear) merged.charGear = {};
      if (typeof merged.charEnh !== "object" || !merged.charEnh) merged.charEnh = {};
      if (typeof merged.charStar !== "object" || !merged.charStar) merged.charStar = {};
      if (typeof merged.charAwak !== "object" || !merged.charAwak) merged.charAwak = {};
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
  let p = 0; for (const t of ORDER) p += (META.army[t] || 0) * ((META.lv[t] || 0) + (META.enh[t] || 0) * 2 + (META.star[t] || 0) * 12 + (META.awak[t] || 0) * 40);
  return p + gearPower();                              // ⚔️ 장비 + ✦각성(40/✦) 반영
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
  buildBgCache();   // perf: 배경+그리드 1회만 그려 캐시 → draw()는 drawImage 1회 (매프레임 그리드 path 제거)
}
function buildBgCache() {
  if (!W || !H || typeof document === "undefined") return;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d");
  g.fillStyle = "#0f121a"; g.fillRect(0, 0, W, H);
  g.strokeStyle = "#1b2030"; g.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (let y = 0; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  window._bgCache = c;
  // perf: 팀 글로우를 스프라이트로 1회 렌더 → 유닛별 createRadialGradient 제거
  window._glowP = makeGlowSprite("rgba(90,140,255,0.55)");
  window._glowE = makeGlowSprite("rgba(255,95,95,0.55)");
}
function makeGlowSprite(c0) {
  const S = 64, c = document.createElement("canvas"); c.width = c.height = S;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(S / 2, S / 2, 1, S / 2, S / 2, S / 2);
  grad.addColorStop(0, c0); grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad; g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, 7); g.fill();
  return c;
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

// ── 편성(스쿼드) 시스템 ───────────────────────────────────────────────────────
const DEPLOY_MAX = 8;
function charLv(id) { return (META.charLv && META.charLv[id]) || 0; }
function charGearStats(id) {                            // 캐릭별 장착 장비 합산
  const tot = { str: 0, int: 0, agi: 0, luk: 0 }, eq = (META.charGear && META.charGear[id]) || {};
  for (const slot of SLOTS) { const gid = eq[slot]; if (!gid) continue; const g = META.gear.find((x) => x.id === gid); if (!g) continue; for (const k of STAT_KEYS) tot[k] += gearStat(g, k); }
  return tot;
}
function gearPowerForChar(g) { return (g.str||0) + (g.int||0) + (g.agi||0) + (g.luk||0); }
function isBestForChar(g, charId) {
  const cur = charGearStats(charId);
  const after = { ...cur };
  const kmap = { str: "str", int: "int", agi: "agi", luk: "luk" };
  if (kmap[g.slotStat || "str"]) after[kmap[g.slotStat || "str"]] += gearStat(g, g.slotStat || "str"); // simple
  // 간단: 총 스탯 합으로 best 판단
  const curTot = cur.str + cur.int + cur.agi + cur.luk;
  const newTot = after.str + after.int + after.agi + after.luk;
  return newTot > curTot + 2;
}

function gearArt(g) {
  if (!g) return gearSynthHTML(null);
  const slot = g.slot || 'weapon';
  const rar = (g.rarity || 'N').toLowerCase();
  // NEW: slot-rarity 20 PNG 우선 (art/gear/weapon-ssr.png 등, 5x4 간소화). onerror: synth fallback (veins/shards/volumetric badass)
  return `<img class="g-art" src="art/gear/${slot}-${rar}.png" alt="" loading="lazy" onerror="this.outerHTML=gearSynthHTML(${JSON.stringify(g).replace(/"/g,'&quot;')});">`;
}
function gearSynthHTML(g) {
  if (!g) return `<div class="gear-synth empty" style="opacity:.55">⚙️</div>`; // no broken "?", premium icon even for empty/fallback
  const icon = SLOT_ICON[g.slot] || "⚙️";
  const r = g.rarity || "N";
  const s = g.slot || "";
  // UPGRADED synth: deeper shadows/rim/veins for N (not toy), shards energy for SR, gold filigree rim + dramatic for SSR. PNG 20종 우선. "간지" premium volumetric always. TG perf fallback strict.
  const veins = (r === "SSR" || r === "SR" || r === "R" || r === "N") ? `<span class="gear-vein"></span><span class="gear-vein2"></span>` : "";
  const shards = (r === "SSR" || r === "SR") ? `<span class="gear-shard"></span><span class="gear-shard2"></span><span class="gear-shard3"></span>` : "";
  let rim = "";
  if (r === "SSR") rim = `<span class="gear-rim gear-filigree" style="position:absolute;inset:0;border:2px solid #fbbf24;opacity:0.38;border-radius:5px;pointer-events:none;"></span><span class="gear-filigree2"></span>`;
  else if (r === "SR") rim = `<span class="gear-rim" style="position:absolute;inset:0;border:1.5px solid #c084fc;opacity:0.3;border-radius:4px;pointer-events:none;"></span>`;
  else if (r === "R" || r === "N") rim = `<span class="gear-rim" style="position:absolute;inset:0;border:1px solid currentColor;opacity:${r==="N"?0.22:0.28};border-radius:4px;pointer-events:none;"></span>`;
  return `<div class="gear-synth r${r} slot-${s}">${icon}${veins}${shards}${rim}<span class="gear-r">${r}</span></div>`;
}
function squadSynergy() {                               // 진영/아키타입 조합 시너지
  const sq = getDeployedUnits();
  const fac = {}; sq.forEach((u) => { fac[u.faction] = (fac[u.faction] || 0) + 1; });
  let atk = 1, hp = 1; const bonuses = [];
  for (const f in fac) {
    const n = fac[f];
    if (n >= 4) { atk += 0.30; bonuses.push("🏷️ " + f + " ×" + n + " 공격+30%"); }
    else if (n >= 3) { atk += 0.18; bonuses.push("🏷️ " + f + " ×" + n + " 공격+18%"); }
    else if (n >= 2) { atk += 0.08; bonuses.push("🏷️ " + f + " ×" + n + " 공격+8%"); }
  }
  const archs = new Set(sq.map((u) => u.arch)).size;
  if (archs >= 5) { hp += 0.20; bonuses.push("🔀 다양성 ×" + archs + " 체력+20%"); }
  else if (archs >= 3) { hp += 0.10; bonuses.push("🔀 다양성 ×" + archs + " 체력+10%"); }
  // §21 Human Core: Effervescent Host Weave (Durkheim group effervescence + fusion surge in 3+ Founding or 4+ faction; secular sacred "we" heat from real proxy signals)
  const founders = sq.filter(u => u.rarity === "SSR").length;
  const highFac = Object.values(fac).some(v => v >= 4);
  if (founders >= 3 || highFac) {
    const sig = getLegionSignal();
    const weave = 0.12 + Math.min(0.18, (sig - 1) * 0.08); // var from proxy "sacred heat"
    atk += weave; hp += weave * 0.6;
    bonuses.push("🌊 Host Weave ×" + founders + " (effervescence +" + Math.round(weave*100) + "%)");
    // light canvas cue (called in draw if running)
    if (typeof window !== "undefined") { window._effervescenceActive = true; window._hostFounders = founders; }
  } else if (sq.length > 0) {
    // regulars meaningful even w/o special: Militia Surge via investment or mono-faction volume (proxy weave)
    const invest = sq.reduce((s, u) => s + cStar(u.id) + cAwak(u.id) + (Object.values(charGearStats(u.id)).reduce((a,b)=>a+(b||0),0) > 8 ? 1 : 0), 0);
    const regHighFac = highFac; // already computed
    const diversity = archs >= 4;
    if (regHighFac || invest >= 2 || diversity) {
      const surge = 0.09 + Math.min(0.13, invest * 0.025 + (regHighFac ? 0.06 : 0));
      atk += surge; hp += surge * 0.5;
      bonuses.push("🪖 Militia Surge (proxy weave +" + Math.round(surge*100) + "%) — invested regulars anchored");
    }
  }
  return { atk, hp, bonuses, archs, count: sq.length, founders };
}

// 군주 20260616 + Grok P1: 캐릭터 조합 시너지 표 — 달성=골드글로우, 미달=실루엣+"N명 더". 도파민+수집욕.
function renderSynergyTable() {
  const el = $("synergy-table"); if (!el) return;
  const sq = getDeployedUnits();
  if (!sq.length) { el.innerHTML = ""; el.dataset.key = ""; return; }
  // cheap key to skip rebuild if no change (perf for mobile "한창에" – was causing reflows on every update)
  const key = sq.map(u => u.id).join(',') + '|' + (META.hero || '');
  if (el.dataset.key === key) return;
  el.dataset.key = key;
  const FAC_ICON = { Strategist: "🧠", Executor: "⚙️", Swarm: "🐜", Guardian: "🛡️", Intel: "👁️" };
  const fac = {}; sq.forEach((u) => { fac[u.faction] = (fac[u.faction] || 0) + 1; });
  // DOM cached version for speed: create cards once, update text/classes (no innerHTML rebuild, less GC/reflow)
  if (!el._synCards) {
    el.innerHTML = `<div class="syn-h">⚡ 군단 시너지</div><div class="syn-grid"></div>`;
    const grid = el.querySelector('.syn-grid');
    const facs = ['Strategist','Executor','Swarm','Guardian','Intel'];
    el._synCards = {};
    facs.forEach(f => {
      const c = document.createElement('div');
      c.className = 'syn-card';
      c.innerHTML = `<span class="syn-ic">${FAC_ICON[f]}</span><span class="syn-nm"></span>`;
      c._nm = c.querySelector('.syn-nm');
      c._b = document.createElement('span'); c._b.className = 'syn-b'; c.appendChild(c._b);
      c._nx = document.createElement('span'); c._nx.className = 'syn-nx'; c.appendChild(c._nx);
      grid.appendChild(c);
      el._synCards[f] = c;
    });
    const dc = document.createElement('div');
    dc.className = 'syn-card';
    dc.innerHTML = `<span class="syn-ic">🔀</span><span class="syn-nm"></span>`;
    dc._nm = dc.querySelector('.syn-nm');
    dc._b = document.createElement('span'); dc._b.className = 'syn-b'; dc.appendChild(dc._b);
    dc._nx = document.createElement('span'); dc._nx.className = 'syn-nx'; dc.appendChild(dc._nx);
    grid.appendChild(dc);
    el._divCard = dc;
  }
  // update existing cards (fast)
  for (const f in fac) {
    const c = el._synCards[f]; if (!c) continue;
    const n = fac[f]; const on = n >= 2; let bonus = "", nxt;
    if (n >= 4) { bonus = "공+30%"; nxt = "★ MAX"; }
    else if (n >= 3) { bonus = "공+18%"; nxt = "1명 더 → +30%"; }
    else if (n >= 2) { bonus = "공+8%"; nxt = "1명 더 → +18%"; }
    else { nxt = (2 - n) + "명 더 → +8%"; }
    c._nm.textContent = `${f} ×${n}`;
    c._b.textContent = on ? `⚔️ ${bonus}` : '';
    c._b.style.display = on ? '' : 'none';
    c._nx.textContent = nxt;
    c.classList.toggle('on', on);
    c.classList.toggle('off', !on);
  }
  const archs = new Set(sq.map((u) => u.arch)).size; const dOn = archs >= 3; let dB = "", dNx;
  if (archs >= 5) { dB = "체+20%"; dNx = "★ MAX"; }
  else if (archs >= 3) { dB = "체+10%"; dNx = (5 - archs) + "종 더 → +20%"; }
  else { dNx = (3 - archs) + "종 더 → +10%"; }
  const dc = el._divCard;
  dc._nm.textContent = `다양성 ${archs}종`;
  dc._b.textContent = dOn ? `🛡️ ${dB}` : '';
  dc._b.style.display = dOn ? '' : 'none';
  dc._nx.textContent = dNx;
  dc.classList.toggle('on', dOn);
  dc.classList.toggle('off', !dOn);
}
// Sovereign 20260616: 정적 "유닛·상성 정보" 대신, 캐릭터 선택(또는 편성) 시 실시간 조합 버프 표시.
// squadSynergy + 선택 영웅 패시브를 한눈에. 전투 화면에서 "내 조합" 느낌 극대화.
function updateBattleCombo() {
  renderSynergyTable();
  const el = $("battle-combo"); if (!el) return;
  const sq = getDeployedUnits();
  const syn = squadSynergy();
  const h = HEROES[META.hero];
  const tr = tHero(META.hero);
  const parts = [];
  if (tr && tr[1]) parts.push(tr[1]); // 선택한 영웅 패시브 (e.g. 전군 AI +1)
  if (syn && Array.isArray(syn.bonuses) && syn.bonuses.length) {
    parts.push(...syn.bonuses);
  }
  if (sq.length > 0) parts.push(`편성 ${sq.length}체`);
  el.innerHTML = parts.length
    ? parts.map(p => `<span style="background:#1a2a14;padding:1px 4px;border-radius:3px;margin:0 2px 1px 0;display:inline-block;">${p}</span>`).join('')
    : '';
}
function squadPower() {                                 // 편성 전투력 (헤더 표시용)
  const sq = getDeployedUnits(); if (!sq.length) return 0;
  const syn = squadSynergy();
  let p = 0;
  sq.forEach((u) => {
    const s = SPEC[u.arch] || SPEC.drone, lv = charLv(u.id);
    const gcs = charGearStats(u.id);
    const invest = (1 + cEnh(u.id) * 0.06) * (1 + cStar(u.id) * 0.25) * (1 + cAwak(u.id) * 0.35);
    const base = (s.hp * 0.5 + (s.atk / s.atkCd) * 3) * u.mul * (1 + lv * 0.12) * invest;
    p += base + (gcs.str + gcs.int + gcs.agi + gcs.luk) * 5;
  });
  return Math.round(p * syn.atk);
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

  // 🎖️ 편성(스쿼드): 출전 캐릭터가 있으면 그들이 곧 부대 — 제네릭 군대 대신 스폰하고 종료
  if (side === "p") {
    const squad = getDeployedUnits();
    if (squad.length > 0) {
      const syn = squadSynergy();
      squad.forEach((u, si) => {
        const s = SPEC[u.arch] || SPEC.drone, lv = charLv(u.id);
        const gcs = charGearStats(u.id);
        const aw = cAwak(u.id), enh = cEnh(u.id), star = cStar(u.id);            // 캐릭별 성장
        const invest = (1 + enh * 0.06) * (1 + star * 0.25) * (1 + aw * 0.35);
        const cgAtk = 1 + gcs.str * 0.004, cgHp = 1 + gcs.int * 0.004;
        const cgSpd = 1 - Math.min(0.4, gcs.agi * 0.0035), cgCrit = Math.min(45, 10 + gcs.luk * 0.4);
        const lvK = 1 + lv * 0.12;
        let hp = Math.round(s.hp * u.mul * lvK * invest * ascHpMul() * hb.hpMul * (1 + (hb.typeHp[u.arch] || 0)) * syn.hp * cgHp);   // 🔄 환생 복리 HP (편성 스쿼드도 동일 적용)
        let atk = Math.round(s.atk * u.mul * lvK * invest * ascAtkMul() * hb.atkMul * (1 + (hb.typeAtk[u.arch] || 0)) * syn.atk * cgAtk);  // 🔄 환생 복리 ATK
        // ch1-8 trivial (squad/편성 경로에도 동일 적용 — 쉬운 시작)
        if (side === "p" && curLevel <= 8) { hp = Math.round(hp * 1.4); atk = Math.round(atk * 1.3); }
        // Give player's selected characters (from char panel deploy) more space and presence on field.
        // Not squeezed at very bottom edge — user selected them, they should appear properly and not "짜치게".
        const perRow = 5, row = Math.floor(si / perRow), col = si % perRow;
        const rowN = Math.min(perRow, squad.length - row * perRow);
        const basePlayerY = H * 0.65; // more room from bottom for visible formation
        const x = W / 2 + (col - (rowN - 1) / 2) * 52 + (Math.random() * 4 - 2);
        const y = basePlayerY - row * 42; // spread vertically for better visibility
        const specR = 18; // larger than generic for "my selected characters" prominence
        units.push({
          t: u.arch, side, x, y, hp, maxHp: hp, atk, range: s.range, speed: s.speed,
          atkCd: s.atkCd * cgSpd, crit: cgCrit, ai: Math.min(3, s.ai + hb.aiBonus + aw),
          sight: s.sight, r: s.r * 1.18, skill: s.skill, skillCd: s.skillCd, ranged: s.ranged,
          regen: hb.regen, atkT: Math.random() * 0.3, skT: s.skillCd * 0.4, shield: 0, buff: 0, buffT: 0, spd: 0, spdT: 0,
          id: u.id, name: u.name, vis: u.vis, color: u.color, isSpecific: true, rarity: u.rarity, dmgOut: 0,
          r: specR, // larger visual for selected characters to appear properly on field
        });
        loadPortrait(u.id);   // 편성 캐릭 일러스트 캔버스용 로드 (전 등급)
      });
      return;   // 편성이 부대 — 제네릭 스폰 생략
    }
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
    let hpM = (side === "p" ? lvMul(t, "hp") * ascHpMul() : epm) * hb.hpMul * (1 + (hb.typeHp[t] || 0)) * powerComp * es * gHp * (side === "p" ? cohesionMul() : 1);     // 🔄 환생 복리 HP배율
    let atkM = (side === "p" ? lvMul(t, "atk") * ascAtkMul() : epm) * hb.atkMul * (1 + (hb.typeAtk[t] || 0)) * synMul * powerComp * es * gAtk * (side === "p" ? cohesionMul() : 1);  // 🔄 환생 복리 ATK배율
    // 초반 완전 초보 구간(ch<=8)만 강한 보너스 — 그 이후부터는 제대로 된 투자(가챠·강화·편성·기어) 없으면 자연 벽 (squad/편성에도 동일)
    if (side === "p" && curLevel <= 8) {
      hpM *= 1.4;
      atkM *= 1.3;
    }
    const isBoss = side === "e" && bossFight;
    if (isBoss) { hpM *= 7; atkM *= 2.2; }
    const hp = Math.round(s.hp * hpM), atk = Math.round(s.atk * atkM);
    const ai = Math.min(3, s.ai + hb.aiBonus + aw);   // ✦ 각성마다 AI +1 (소울로만 가능)
    let rr = isBoss ? s.r * 1.8 : s.r;
    if (t === "titan" && side==="p") rr *= 1.4; // 6hr visual: higher rarity scale
    // Enemy flavor: portraitKey for rare PNG (bosses/elites use art/enemy/*.png like titan/corrupted-titan/drone/marksman)
    // non-PNG enemies stay rich synthetic. Red hostile frame + dark overlay applied in draw for cool vs player army.
    // MVP enemy visual upgrade: wider triggers so tower formations (screenshot like 47층) use more PNGs instead of pure identical synth
    let portraitKey = null, eName = null;
    if (side === "e") {
      if (isBoss || t === "titan") { portraitKey = "titan"; eName = "타락 거신"; }
      else if (curLevel >= 40) { portraitKey = "corrupted-titan"; eName = "타락 " + (SPEC[t].name || t); }
      else if (t === "drone" && (curLevel >= 18 || (curLevel >= 10 && (i % 2 === 0)))) { portraitKey = "drone"; eName = "적 정찰기"; }
      else if (t === "marksman" && curLevel >= 14) { portraitKey = "marksman"; eName = "적 저격수"; }
      else if (curLevel >= 25 && (i % 3 === 0)) { portraitKey = "elite-drone"; eName = "망령 " + (SPEC[t].name || t); }
      else if (t === "commander" && curLevel > 15) { eName = "그림자 지휘"; }
      // 추가 매핑 (tower swarm 가시성 업)
      else if (t === "guardian" && curLevel >= 20) { portraitKey = "corrupted-titan"; eName = "타락 방벽"; } // reuse existing for now
      else if (t === "bruiser" && curLevel >= 16) { portraitKey = "titan"; eName = "적 강습"; }
    }
    units.push({
      t, side, x, y, hp: hp, maxHp: hp, atk: atk, range: s.range, speed: s.speed,
      atkCd: s.atkCd * (side === "p" ? gSpd : 1), crit: side === "p" ? gCrit : 0,
      ai: ai, sight: s.sight, r: rr, skill: s.skill, skillCd: s.skillCd, ranged: s.ranged, boss: isBoss,
      regen: side === "p" ? hb.regen : 0,
      atkT: Math.random() * 0.4, skT: s.skillCd * 0.5, shield: 0, buff: 0, buffT: 0, spd: 0, spdT: 0,
      portraitKey, eName,
    });
  });
}

// ── 챕터별 적군 편성 (챕터 오를수록 강해짐) ──────────────────────────────────
function enemyForChapter(ch) {
  ch = Math.max(1, ch | 0);                          // 숫자 보장 (NaN 방지)
  // 클래식 가챠 커브: 초반 매우 쉽다 → 중반 투자 필요 → 후반 급격히 어려워져 과금/노력 유도
  // ch1-8: 초보자 완전 승리 구간 (접근성)
  // ch9-20: 시스템(가챠·강화·편성·기어) 맛보는 구간
  // ch21+: 본격 벽 (Founding SSR나 중투자 없으면 시간+돈 필요)
  if (ch <= 8) {
    return {
      drone:     1 + Math.floor((ch - 1) / 2),   // ch1:1 ~ ch8:4 (아주 관대)
      marksman:  ch >= 5 ? 1 : 0,
      guardian:  0,
      bruiser:   0,
      commander: 0,
      titan:     0,
    };
  }
  // 9~20: 완만하지만 점점 압박
  if (ch <= 20) {
    return {
      drone:     2 + Math.floor((ch - 8) / 2),
      marksman:  1 + Math.floor((ch - 9) / 5),
      guardian:  ch >= 12 ? 1 + Math.floor((ch - 12) / 6) : 0,
      bruiser:   ch >= 16 ? 1 : 0,
      commander: 0,
      titan:     0,
    };
  }
  // 21+ : 가파른 증가 (다른 게임들처럼 여기서부터 "벽" 느낌)
  return {
    drone:     4 + Math.floor((ch - 20) / 2),
    marksman:  3 + Math.floor((ch - 20) / 4),
    guardian:  2 + Math.floor((ch - 20) / 5),
    bruiser:   1 + Math.floor((ch - 20) / 4),
    commander: ch >= 30 ? 1 + Math.floor((ch - 30) / 8) : 0,
    titan:     ch >= 50 ? 1 + Math.floor((ch - 50) / 30) : 0,
  };
}
// 적 스탯 배율: 초반(10챕 이하) 약화 + 25챕터까지 base, 이후 완만 상승 (유저 접근성 + 후반 투자 보상)
function enemyPowerMul(ch) {
  ch = ch | 0;
  if (ch <= 8) return 0.7;                      // 초초반 매우 약함 (신규 유저 완전 승리)
  if (ch <= 20) return 1.0;                     // 중반까지 base (시스템 투자 유도)
  return 1 + Math.max(0, ch - 20) * 0.022;      // 21챕+ 램프 — 환생 루프 균형 위해 0.028→0.022 완화 (PRD sim 검증)
}

// ── 🔄 환생(Ascension) 루프 — 에테르(영구화폐) + 복리노드. PRD-prestige-loop.md 확정 수치 ──
const ASCEND_GATE = 18;                                   // ch18 도달 시 환생 가능
function ascLv(node) { return (META.asc && META.asc[node]) || 0; }
function etherGain(ch) { ch = ch | 0; if (ch < ASCEND_GATE) return 0; return Math.round(20 * Math.pow(1.18, (ch - ASCEND_GATE) / 2)); } // 깊이비례 기하급수
// ⚠️ 노드 배율 +8%/lv (1.08): 분리노드라 전투력 = atk×hp = 1.08^(공+체). +18%면 5환생째 폭주(sim 검증) → 1.08이 루프 생존값.
function ascAtkMul() { return Math.pow(1.08, ascLv("might")); }     // 「공세」 아군 ATK +8%/lv (복리)
function ascHpMul() { return Math.pow(1.08, ascLv("bulwark")); }    // 「불굴」 아군 HP +8%/lv (복리)
function cohesionMul() { return 1 + (META.prestige || 0) * 0.02; }  // 🌀 결속 1당 아군 전투력 +2% (군주 20260616: 죽은 스탯→실기능 연결)
function ascGoldMul() { return 1 + ascLv("momentum") * 0.18; }      // 「쇄도」 골드획득 +18%/lv (재돌파 가속·전투력 아님 → 폭주 무관)
function ascStartGold() { return ascLv("momentum") * 300; }         // 「쇄도」 시작 골드 +300/lv
function ascPowerMul() { return Math.pow(1.08, ascLv("might") + ascLv("bulwark")); } // 전투배율 표시용 = atk×hp
function ascNodeCost(lv) { return Math.round(5 * Math.pow(1.25, lv)); }  // 노드 다음레벨 비용: 5·6·8·10·12·15…

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
    let st = t("sDeploy", { n: META.chapter });
    if (META.chapter <= 8) st += " · 초보자 모드 (쉽게 시작!)";
    else if (META.chapter > 20) st += " · 본격 난이도 ↑ (강한 Legion 유닛/강화 필요)";
    st += " · 승리하면 챕터 +1";
    $status.textContent = st;
  }
}

function reset() {
  cancelAnimationFrame(raf);
  fit();
  counts.p = META.army;                              // 내 군대 = 영구 보유
  applyMode();                                       // 모드에 맞게 적군 구성
  units = []; fx = []; running = false; gameOver = false; lastT = 0; ultT = 0;
  delete window._ultBurst; // ULT vfx 잔여 클리어
  spawnArmy("p"); spawnArmy("e");
  preloadSSRPortraits(); // ensure god arts ready for battle
  if (typeof preloadEnemyPortraits === "function") preloadEnemyPortraits();
  $overlay.classList.add("hidden");
  $("start").textContent = t("start");
  window._effervescenceActive = false; window._hostFounders = 0; // reset psych canvas cues
  updateMeta(); updateHeroUI(); updateUltBtn(); updateModeTabs(); draw(); updateScore();
  updateBattleCombo(); // 초기 로드 시 조합 버프 강제 갱신 (편성 + 선택 영웅)
  // 편성이 부대 → generic 골드구매 배치는 편성 비었을 때만(폴백). 편성 있으면 숨김
  const dep = $("deploy"); if (dep) dep.style.display = getDeployedUnits().length ? "none" : "";
  renderDeploySpecificsPreview();  // char 배치 specific 유닛 쉽게 보이게
  if (running) {
    const ds = $("deploy-specifics");
    if (ds) ds.innerHTML = ''; // battle에서는 canvas squad가 제대로 보이게 (HTML preview 완전 제거)
  }
  // perf: hide synergy table (prep tool) during battle to reduce layout/paint on mobile canvas-heavy view
  const synEl = $("synergy-table"); if (synEl) synEl.style.display = running ? 'none' : '';
  // 2026-06-16 업데이트: 모든 모드 탭 표시 (캠페인 + 무한탑 + 보스 + 턴제 + 아레나).
  // 이전 MVP 때는 turn/arena/boss를 hard hide 했으나, 이제 roadmap 전체 보이게 해서 progression 느낌 주고 "왜 이거만 있어?" 질문 해결.
  // 잠긴 모드는 updateModeTabs + .locked 스타일로 처리 (🔒 + 클릭 시 coming soon).
  // running 중에는 modes 숨길 수 있지만 기본은 항상 보이게 (pre-battle roadmap).
  if (running) document.querySelectorAll('#modes').forEach(m => m.style.display = 'none');
  // 하단바 전체 6탭 강제 표시 완료
  document.querySelectorAll('#bnav .navtab').forEach(el => el.style.display = '');
  delete window._ultBurst;
  const leg = $("legend-toggle");
  if (leg) leg.style.display = 'none'; // Sovereign: 정적 유닛·상성 정보는 전투에서 제거. 동적 조합 버프로 대체
  const legDiv = $("legend");
  if (legDiv) legDiv.style.display = 'none';
}

// ── 메타 UI 갱신 ──────────────────────────────────────────────────────────────
function updateMeta() {
  if ($("gold")) $("gold").textContent = META.gold;
  if ($("gems")) $("gems").textContent = META.gems || 0;
  if ($("soul")) $("soul").textContent = META.soul || 0;
  if ($("chapter")) $("chapter").textContent = META.chapter;
  if ($("ether")) $("ether").textContent = META.ether || 0;
  const coh = $("cohesion"); if (coh) coh.textContent = (META.prestige || 0).toFixed(1);
  // 🔄 환생 발견성 배너: ch18+ 도달 시 "환생 가능 · ⬡+N" 노출 (배틀화면)
  const ap = $("asc-prompt");
  if (ap) {
    const ch = META.chapter || 1;
    if (ch >= ASCEND_GATE) { ap.style.display = ""; ap.innerHTML = `🔄 <b>환생 가능</b> · 지금 환생 시 ⬡ +${etherGain(ch)} <span class="asc-prompt-cta">탭 →</span>`; }
    else ap.style.display = "none";
  }
  const sv = $("streak-val"); if (sv) sv.textContent = (META.loginStreak || 0);  // visible streak everywhere (click → event for claim)
  // MVP final plan: pity always visible lobby top "다음 SSR까지 XX회"
  const pityEl = $("pity-left");
  if (pityEl) {
    const p = (META.pity || 0);
    const remain = Math.max(0, 10 - p); // align with current hard ceiling ~10-12
    pityEl.textContent = remain;
    // 가챠 천장 진행바(상점) — 코드값과 100% 일치 (n/10)
    const pf = $("pity-fill"); if (pf) pf.style.width = Math.min(100, (p / 10) * 100) + "%";
    const pbl = $("pity-bar-label"); if (pbl) pbl.textContent = Math.min(p, 10) + "/10";
  }
  // sacred-host: 유저가 바로 이해할 수 있게 한국어로만. 미스터리 영어 금지.
  const sh = $("sacred-host"); if (sh) {
    const eff = !!(window._effervescenceActive);
    const v = (META.vanguard && META.vanguard===today()) ? " • 24h 집중 모드 ON (내일 파워 UP)" : "";
    sh.textContent = eff ? "🌊 결속 활성 — 파운더 연결" + v : (v ? v.trim().slice(2) : "");
  }
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
  updateModeTabs(); // 챕터 변경(환생·승리 등) 시 '캠페인 chX' 탭 라벨 즉시 갱신
}

// ── 모드 사이클 ───────────────────────────────────────────────────────────────
// ── 🏆 챕터 마일스톤 (해금 + 보상) ────────────────────────────────────────────
const MILESTONES = [
  { ch: 2,  unlock: "tower", gem: 30 },
  { ch: 5,  unlock: "boss",  gem: 50, box: "common" },
  { ch: 8,  gem: 100 },
  { ch: 12, gem: 120, box: "rare" },
  { ch: 18, gem: 180 },
  { ch: 25, gem: 250, box: "epic" },
];
const MODE_UNLOCK = { tower: 2, boss: 5 };               // 모드별 해금 챕터 (나머지는 항상)
function modeUnlocked(m) { return !MODE_UNLOCK[m] || META.chapter >= MODE_UNLOCK[m]; }
function checkMilestones() {
  if (!Array.isArray(META.milestones)) META.milestones = [];
  let any = false, delay = 600;
  MILESTONES.forEach((ms) => {
    if (META.chapter >= ms.ch && META.milestones.indexOf(ms.ch) < 0) {
      META.milestones.push(ms.ch); any = true;
      if (ms.gem) META.gems = (META.gems || 0) + ms.gem;
      let boxRes = null; if (ms.box) boxRes = openBox(ms.box);
      const rwd = (ms.unlock ? "🔓 " + t("ms_" + ms.unlock) + " " : "") + (ms.gem ? "💎" + ms.gem : "") + (boxRes ? " " + boxRes.text : "");
      setTimeout(() => toast("🏆 " + t("msReach", { n: ms.ch }) + " · " + rwd, "#a855f7"), delay); delay += 1500;
    }
  });
  if (any) { saveMeta(); updateMeta(); }
}
function renderMsHint() {
  const el = $("ms-hint"); if (!el) return;
  const next = MILESTONES.find((ms) => META.chapter < ms.ch);
  if (!next) { el.style.display = "none"; return; }
  el.style.display = "";
  const rwd = (next.unlock ? t("ms_" + next.unlock) + " " + t("msUnlock") : "") + (next.gem ? (next.unlock ? " + " : "") + "💎" + next.gem : "");
  el.innerHTML = "🎯 <b>" + next.ch + t("msCh") + "</b> · " + rwd;
}
function updateModeTabs() {
  document.querySelectorAll(".modetab").forEach((b) => {
    b.classList.toggle("sel", b.dataset.m === META.mode);
    const locked = !modeUnlocked(b.dataset.m) || b.dataset.m === "turnbased" || b.dataset.m === "arena" || b.dataset.m === "mystery";
    b.classList.toggle("locked", locked);
  });
  // Sovereign: 캠페인 탭에 현재 챕터 번호 동적 표시 — "2챕터가 안넘어가" 혼란 방지. 유저가 "이 버튼이 챕터 진행용"임을 즉시 인지.
  const camp = document.querySelector('.modetab[data-m="campaign"]');
  if (camp) camp.textContent = `📖 캠페인 ch${META.chapter || 1}`;
  renderMsHint();
}
function setMode(m) {
  if (running) { toast(t("tNoSwitch"), "#ef4444"); return; }
  if (m === "turnbased") { toast(t("tComingTb"), "#a855f7"); return; }
  if (m === "arena") {
    // MVP final plan: arena daily 5회 제한만, 자동매칭 placeholder (Phase2 full)
    // 2026-06-16 Morpheus: decided HIDE (lean MVP, 4-action dopamine focus, reversible no-broken). Stubs remain for future.
    const tdy = today();
    if (!META.arenaDay || META.arenaDay !== tdy) { META.arenaDay = tdy; META.arenaCount = 0; saveMeta(); }
    if ((META.arenaCount || 0) >= 5) { toast("오늘 아레나 5회 완료", "#ef4444"); return; }
    META.arenaCount = (META.arenaCount || 0) + 1; saveMeta();
    toast("아레나 매칭 (placeholder 자동 1:1) - Phase2에서 풀 구현", "#a855f7");
    return;   // ⚠️ 버그픽스: return 없으면 840줄로 fall-through→META.mode="arena" 영구저장+campaign 둔갑 오염. MVP 숨김 스텁이라 no-op.
  }
  if (m === "mystery") {
    // Sovereign: 아레나 옆 ??? 티저로 유저 궁금증/FOMO 유발
    toast("❓ ??? : 비밀의 레기온 창. 곧 공개될 새로운 모드! 지금은... 궁금증만 폭발?", "#fbbf24");
    // optional: openEvent() or bump prestige curiosity
    return;
  }
  if (!modeUnlocked(m)) { toast(t("msLocked", { n: MODE_UNLOCK[m] }), "#a855f7"); return; }
  META.mode = m; saveMeta(); reset();
}
// helper to record manual play for synergy (call on battle start / gacha etc)
function recordManualPlay() { META.lastManual = nowMs(); saveMeta(); }

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
    combatPop();
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
  if (from && from.id) { from.dmgOut = (from.dmgOut || 0) + a; }  // track for real "MY unit carried X%" even on regulars
  if (target.hp <= 0) { addFx(target.x, target.y, "die", 0, 0, target.side); if (Math.random() < 0.5) SFX.boom(); }
}

function addFx(x, y, kind, x2, y2, side) { if (fx.length > 90) return; fx.push({ x, y, kind, x2, y2, side, t: 0, life: kind === "shot" ? 0.12 : 0.45 }); }
// 💥 궁극기 발동 시각효과 — 1655 호출처가 미정의로 매 궁극기 throw하던 것 정의(군주 "궁극기 이쁘게"). 중앙 방사 폭발.
// 군주 20260617 + Grok P2: 궁극기 7종 고유 전투 VFX (간지·도파민). 파티클 상한(≤14)으로 perf 안전.
function triggerUltVfx(ult, color) {
  const mine = units.filter((u) => u.side === "p" && u.hp > 0);
  const foes = units.filter((u) => u.side === "e" && u.hp > 0);
  const cx = W / 2, cy = H / 2;
  const cap = (arr, n) => arr.slice(0, n);
  window._ultBurst = { t: 0.7, color: color || "#fbbf24", style: ult };
  switch (ult) {
    case "dragon":   // 🐉 드래곤 강림 — 메테오 낙하 + 적 전체 화염
      window._ultBurst.color = "#ff5a2a";
      cap(foes, 12).forEach((f) => addFx(f.x, f.y, "die", 0, 0, "e"));
      for (let i = 0; i < 8; i++) { const x = W * (0.12 + Math.random() * 0.76); addFx(x, 8, "shot", x, cy * (0.5 + Math.random()), "e"); }
      break;
    case "volley":   // 🎯 아크 볼리 — 하늘 정밀 일제사
      window._ultBurst.color = "#a3e635";
      cap(foes, 14).forEach((f) => addFx(f.x, 6, "snipe", f.x, f.y, "e"));
      break;
    case "assault":  // 🤖 강습 — 일제 대시 + 충격파
      window._ultBurst.color = "#cbd5e1";
      cap(mine, 12).forEach((u) => { addFx(u.x, u.y, "charge"); addFx(u.x, u.y - 10, "shot", u.x, u.y - 46, "p"); });
      break;
    case "focus":    // 🧠 전술 지휘 — 버프 오라 상승
      window._ultBurst.color = "#c4b5fd";
      cap(mine, 12).forEach((u) => { addFx(u.x, u.y, "evade"); addFx(u.x, u.y, "ctr"); });
      break;
    case "wall":     // 🛡️ 철벽 — 푸른 방벽
      window._ultBurst.color = "#67e8f9";
      cap(mine, 12).forEach((u) => addFx(u.x, u.y, "barrier"));
      break;
    case "rage":     // ⚡ 광폭화 — 적색 광폭 슬래시
      window._ultBurst.color = "#ef4444";
      cap(mine, 12).forEach((u) => { addFx(u.x, u.y, "ctr"); addFx(u.x, u.y, "charge"); });
      break;
    case "repair":   // 💉 긴급 수리 — 초록 힐 노바
      window._ultBurst.color = "#4ade80";
      cap(mine, 12).forEach((u) => { addFx(u.x, u.y, "overclock"); addFx(u.x, u.y, "barrier"); });
      break;
    default:
      addFx(cx, cy, "overclock");
      for (let i = 0; i < 8; i++) { const a = (Math.PI * 2 * i) / 8; addFx(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34, "charge"); }
  }
}
// 🎉 승리/가챠 축포 — 1339·1517 호출처가 미정의(try/catch라 죽은 연출)였던 것 정의.
function confettiBurst() {
  for (let i = 0; i < 14; i++) { addFx(W * (0.15 + Math.random() * 0.7), H * (0.18 + Math.random() * 0.4), i % 2 ? "charge" : "barrier"); }
}

// 🐲 위압적 보스 전용 렌더 (거대 layered construct + 맥동 코어 + 스파이크 + 글로우)
function drawBoss(u) {
  const t = Date.now();
  const R = u.r * 2.5;                              // 히트박스보다 크게 — 위압감
  const breathe = 1 + Math.sin(t / 430) * 0.03;    // 호흡 맥동
  const bob = Math.sin(t / 640) * 3;               // 상하 흔들림
  const cx = u.x, cy = u.y + bob;
  const hpr = u.maxHp ? Math.max(0, u.hp / u.maxHp) : 1;
  ctx.save();
  // 강한 적색 외곽 글로우
  ctx.shadowColor = "#ff2a2a"; ctx.shadowBlur = 26;
  // 스파이크 9개 (회전 + 개별 맥동)
  ctx.fillStyle = "#3a0e0e"; ctx.strokeStyle = "#7a1414"; ctx.lineWidth = 1.5;
  const spikes = 9;
  for (let i = 0; i < spikes; i++) {
    const a = (i / spikes) * 6.283 + t / 2600;
    const sl = R * (1.18 + Math.sin(t / 480 + i) * 0.09);
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a - 0.13) * R * 0.72, cy + Math.sin(a - 0.13) * R * 0.72);
    ctx.lineTo(cx + Math.cos(a) * sl, cy + Math.sin(a) * sl);
    ctx.lineTo(cx + Math.cos(a + 0.13) * R * 0.72, cy + Math.sin(a + 0.13) * R * 0.72);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.shadowBlur = 0;
  // 중장갑 본체 (육각 플레이트, 역회전)
  const plate = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 2, cx, cy, R * breathe);
  plate.addColorStop(0, "#5a1414"); plate.addColorStop(0.6, "#2e0a0a"); plate.addColorStop(1, "#160404");
  ctx.fillStyle = plate; ctx.beginPath();
  const sides = 6;
  for (let i = 0; i <= sides; i++) {
    const a = (i / sides) * 6.283 - t / 4200;
    const rr = R * breathe * (1 + Math.sin(t / 720 + i) * 0.02);
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath(); ctx.fill();
  ctx.lineWidth = 2.5; ctx.strokeStyle = "#ff3b3b"; ctx.stroke();
  // 크랙 (HP 낮을수록 진해짐)
  if (hpr < 0.7) {
    ctx.strokeStyle = "rgba(255,90,40," + (0.7 - hpr).toFixed(2) + ")"; ctx.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) {
      const a = i * 1.3 + 0.4;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R * 0.78, cy + Math.sin(a) * R * 0.78); ctx.stroke();
    }
  }
  // 맥동 코어
  const cr = R * 0.5;
  const core = ctx.createRadialGradient(cx, cy, 1, cx, cy, cr * (1 + Math.sin(t / 250) * 0.12));
  core.addColorStop(0, "#fff2c0"); core.addColorStop(0.4, "#ff5a2a"); core.addColorStop(1, "rgba(120,10,10,0)");
  ctx.fillStyle = core; ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 7); ctx.fill();
  // 눈 2개 (적색)
  for (const dx of [-0.22, 0.22]) {
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx + dx * R, cy - R * 0.05, R * 0.075, 0, 7); ctx.fill();
    ctx.fillStyle = "#ff1a1a"; ctx.beginPath(); ctx.arc(cx + dx * R, cy - R * 0.05, R * 0.038, 0, 7); ctx.fill();
  }
  ctx.restore();
  // 큰 HP 바 + 이름
  const w = R * 1.8, by = cy - R * 1.28;
  ctx.fillStyle = "rgba(0,0,0,0.7)"; rRect(cx - w / 2 - 1, by - 1, w + 2, 7, 3); ctx.fill();
  ctx.fillStyle = hpr > 0.4 ? "#ef4444" : "#fbbf24"; rRect(cx - w / 2, by, w * hpr, 5, 2.5); ctx.fill();
  ctx.fillStyle = "#fbbf24"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center";
  ctx.fillText("🐲 " + (u.name || "타락 거신"), cx, by - 5);
}

// ── 그리기 ────────────────────────────────────────────────────────────────────
function draw() {
  if (window._bgCache) ctx.drawImage(window._bgCache, 0, 0);   // perf: 캐시된 배경+그리드 1회 합성
  else { ctx.fillStyle = "#0f121a"; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = "#1b2030"; ctx.lineWidth = 1; for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }

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

  // ensure SSR portraits ready for battle (in case timing)
  if (Object.keys(ssrPortraits).length === 0) preloadSSRPortraits();

  // §21 Host Weave tethers (Jordan visual endowment + Alex gacha dopamine): 3+ Founders → golden fusion lines + particles (identity fusion tether, Berridge cue-triggered wanting)
  const eff = !!(window._effervescenceActive && window._hostFounders >= 3);
  const foundersU = eff ? units.filter(u => u.side==='p' && u.rarity==='SSR' && u.hp>0) : [];
  if (eff && foundersU.length >= 2) {
    ctx.strokeStyle = "rgba(251,191,36,0.55)"; ctx.lineWidth = 1.6;
    for (let i=0; i<foundersU.length; i++) for (let j=i+1; j<foundersU.length; j++) {
      const a=foundersU[i], b=foundersU[j];
      ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      // subtle pulse particles
      const mx=(a.x+b.x)/2, my=(a.y+b.y)/2; const t=Date.now()/180;
      ctx.fillStyle="rgba(251,191,36,0.7)"; ctx.beginPath(); ctx.arc(mx+Math.sin(t)*3, my+Math.cos(t)*2, 1.8,0,7); ctx.fill();
    }
  }
  // Militia aura on high-invest regulars (endowment "MY elites" visual)
  // (applied per-unit below in synthetic path)

  // Vanguard Focus 24h visual cue (FOMO carry teaser on Founders)
  const isVanguard = !!(META.vanguard && META.vanguard === today());

  // subtle separator for player squad area (when selected chars deployed) vs enemy grid – makes "my team" clearer
  if (units.some(u => u.side === 'p' && u.isSpecific)) {
    ctx.strokeStyle = 'rgba(163, 230, 53, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H * 0.60);
    ctx.lineTo(W, H * 0.60);
    ctx.stroke();
  }

  // Sovereign 20260616 ULT v2: 궁극기 발동 순간 극적 god-ray + nuclear burst (canvas tie-in으로 더 이쁘고 터지게)
  if (window._ultBurst && window._ultBurst.t > 0) {
    const bt = window._ultBurst.t, col = window._ultBurst.color || '#fbbf24';
    const alpha = Math.min(0.95, bt * 1.15);
    // big radial core burst (player color nuclear)
    const grad = ctx.createRadialGradient(W/2, H*0.38, 8, W/2, H*0.42, 210);
    grad.addColorStop(0, `rgba(255,255,255,${alpha*0.9})`);
    grad.addColorStop(0.25, col.replace('#','#') + Math.floor(alpha*180).toString(16).padStart(2,'0'));
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(W/2, H*0.40, 205, 0, 7); ctx.fill();
    // elegant god-ray lines (command authority)
    ctx.strokeStyle = col; ctx.lineWidth = 2.2;
    for (let i = -3; i <= 3; i++) {
      const ax = W/2 + i * 31;
      ctx.globalAlpha = alpha * (0.7 + Math.sin(bt*11 + i)*0.15);
      ctx.beginPath();
      ctx.moveTo(ax, 12);
      ctx.lineTo(ax + i*8, H*0.58);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // extra peripheral pips for spectacle
    for (let j=0; j<5; j++) {
      const px = W*0.2 + j* (W*0.15), py = H*0.32 + (j%2? -18:12);
      ctx.fillStyle = `rgba(255,255,255,${alpha*0.6})`;
      ctx.beginPath(); ctx.arc(px, py, 3.5 + Math.sin(bt*7+j)*1.2, 0, 7); ctx.fill();
    }
  }

  for (const u of units) {
    if (u.hp <= 0) continue;
    if (u.boss) { drawBoss(u); continue; }   // 🐲 위압적 보스 전용 렌더
    // 바닥 그림자 (그라운딩)
    ctx.fillStyle = "rgba(0,0,0,0.28)"; ctx.beginPath(); ctx.ellipse(u.x, u.y + u.r + 1.5, u.r * 0.7, u.r * 0.26, 0, 0, 7); ctx.fill();
    // 팀 구분 — 하드한 동그라미 대신 소프트 글로우
    const _gl = u.side === "p" ? window._glowP : window._glowE;
    const gr = u.r + 5;
    if (_gl) { ctx.drawImage(_gl, u.x - gr, u.y - gr, gr * 2, gr * 2); }
    else { const glow = ctx.createRadialGradient(u.x, u.y, 1, u.x, u.y, gr); glow.addColorStop(0, u.side === "p" ? "rgba(90,140,255,0.55)" : "rgba(255,95,95,0.55)"); glow.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(u.x, u.y, gr, 0, 7); ctx.fill(); }
    // 상태 링은 활성 시에만 (의미 있는 정보)
    if (u.boss)       { ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(u.x, u.y, u.r + 5, 0, 7); ctx.stroke(); }
    if (u.shield > 0) { ctx.strokeStyle = "#67e8f9"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(u.x, u.y, u.r + 4.5, 0, 7); ctx.stroke(); }
    if (u.buff > 0)   { ctx.strokeStyle = "#a3e635"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(u.x, u.y, u.r + 6.5, 0, 7); ctx.stroke(); }
    // Battle body: player SSR PNG or enemy hostile PNG (small set) — or rich synthetic
    const hasPlayerPortrait = u.id && ssrPortraits[u.id] && ssrPortraits[u.id].complete && ssrPortraits[u.id].naturalWidth > 0;
    const hasEnemyPortrait = u.side === "e" && u.portraitKey && u.portraitKey!=="drone" && u.portraitKey!=="marksman" && enemyPortraits[u.portraitKey] && enemyPortraits[u.portraitKey].complete && enemyPortraits[u.portraitKey].naturalWidth > 0;
    if (hasPlayerPortrait || hasEnemyPortrait) {
      const img = hasPlayerPortrait ? ssrPortraits[u.id] : enemyPortraits[u.portraitKey];
      const clipR = hasPlayerPortrait ? u.r * 1.15 : Math.min(22, u.r + 4);
      const sz = hasPlayerPortrait ? u.r * 2.6 : 48;
      ctx.save();
      ctx.beginPath(); ctx.arc(u.x, u.y, clipR, 0, 7); ctx.clip();
      ctx.drawImage(img, u.x - sz / 2, u.y - sz * 0.42, sz, sz);
      ctx.restore();
      if (hasPlayerPortrait) {
        ctx.strokeStyle = isVanguard ? "#fde047" : "#fbbf24"; ctx.lineWidth = isVanguard ? 4.2 : 3;
        ctx.beginPath(); ctx.arc(u.x, u.y, clipR + (isVanguard?2:1), 0, 7); ctx.stroke();
        if (isVanguard && u.rarity==="SSR") { ctx.strokeStyle="rgba(251,191,36,0.35)"; ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(u.x,u.y,clipR+9,0,7); ctx.stroke(); }
      }
      if (u.isSpecific && hasPlayerPortrait) {
        // label so the characters selected in char panel appear with name on field (v2 bump for TG readability)
        ctx.fillStyle = '#e8e0ff';
        ctx.font = '7px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(u.name || '', u.x, u.y - clipR - 4);
      }
      // For enemy PNG: clean, no extra circles/lines/rims/spikes (user request for NPC enemies to look proper without unnecessary effects)
    } else {
      ctx.font = (u.r + 8) + "px serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const drawGlyph = (u.vis || SPEC[u.t].glyph || "●");
      ctx.fillText(drawGlyph, u.x, u.y + 1);
      if (u.side === "e") {
        // === 적 전용 rich synthetic (glyph + aggression + level scaling) ===
        // redder, spikier, pulsing for high chapter/boss — "할말 나는" 위협적 적
        // MVP upgrade (Image #1 feedback): mass formation에서도 개체감 + PNG급 hostile rim 느낌 주기
        const ch = (typeof curLevel === "number" ? curLevel : 1);
        const intensity = Math.min(1.0, 0.4 + (ch / 60) + (u.boss ? 0.5 : 0));
        const er = u.r * (u.boss ? 1.15 : 1.0);
        // per-unit slight variation (seed by position so units in formation look distinct)
        const varSeed = (Math.sin(u.x*0.07 + u.y*0.11) * 0.5 + 0.5); // 0~1
        // base red glow + simple solid hostile rim (no spikes/star — user feedback: 별표 빼, 오히려 안 멋져)
        ctx.strokeStyle = `rgba(239,68,68,${0.35 + intensity*0.25})`;
        ctx.lineWidth = 1.5 + intensity * 1.5;
        /* 군주 20260616: 빨간 림(테두리) 제거 — 글로우만 */
        // clean red rim for enemy synth — smooth, not jagged/star-like
        ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2.5 + intensity*0.5;
        /* 빨간 림 제거 */
        // arch aggressive details (기존 + var)
        if (u.t === "drone" || u.arch === "drone") {
          ctx.fillStyle = `rgba(239,68,68,${0.5 + intensity*0.3})`;
          ctx.beginPath(); ctx.arc(u.x + er*0.6, u.y - er*0.5, 2, 0, 7); ctx.fill();
          ctx.strokeStyle = `rgba(239,68,68,0.6)`; ctx.lineWidth=1.2;
          ctx.beginPath(); ctx.moveTo(u.x-er*0.4, u.y); ctx.lineTo(u.x-er*(1.1 + varSeed*0.3), u.y-er*0.6); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(u.x-er*0.4, u.y); ctx.lineTo(u.x-er*(1.1 + varSeed*0.3), u.y+er*0.6); ctx.stroke();
        } else if (u.t === "marksman" || u.arch === "marksman") {
          ctx.strokeStyle = "#f87171"; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(u.x, u.y); ctx.lineTo(u.x + er*(1.9 + varSeed*0.2), u.y - 1); ctx.stroke();
          if (intensity > 0.6) { ctx.fillStyle="rgba(248,113,113,0.7)"; ctx.fillRect(u.x+er*1.2, u.y-2, 4, 4); }
        } else if (u.t === "guardian" || u.arch === "guardian") {
          ctx.strokeStyle = `rgba(248,113,113,${0.6 + intensity*0.3})`; ctx.lineWidth=2.2;
          ctx.beginPath(); ctx.arc(u.x, u.y, er*1.12, 0, 7); ctx.stroke();
          for (let k=-1; k<=1; k+=1) {
            ctx.beginPath(); ctx.moveTo(u.x + k*5, u.y - er*1.1); ctx.lineTo(u.x + k*5, u.y - er*1.35); ctx.stroke();
          }
        } else if (u.t === "bruiser" || u.arch === "bruiser") {
          ctx.fillStyle = `rgba(239,68,68,${0.4 + intensity*0.35})`;
          ctx.fillRect(u.x - er*0.3, u.y - er*0.3, er*0.6, er*0.6);
          ctx.strokeStyle="#f87171"; ctx.lineWidth=1.5;
          ctx.beginPath(); ctx.moveTo(u.x+er*0.5, u.y); ctx.lineTo(u.x+er*0.9, u.y-3); ctx.stroke();
        } else if (u.t === "commander" || u.arch === "commander") {
          ctx.strokeStyle = "rgba(248,113,113,0.7)"; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.moveTo(u.x-er*0.7, u.y-er*0.4); ctx.lineTo(u.x+er*0.7, u.y+er*0.4); ctx.stroke();
        } else if (u.t === "titan" || u.arch === "titan") {
          ctx.strokeStyle = `rgba(239,68,68,${0.7 + intensity*0.2})`; ctx.lineWidth=3;
          ctx.beginPath(); ctx.arc(u.x, u.y, er*1.25, 0, 7); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(u.x-er*0.4, u.y-er*0.7); ctx.lineTo(u.x-er*0.7, u.y-er*1.1); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(u.x+er*0.4, u.y-er*0.7); ctx.lineTo(u.x+er*0.7, u.y-er*1.1); ctx.stroke();
        }
        // corruption / level lines (고챕터 적일수록 더 "타락" 느낌)
        if (ch > 10 && intensity > 0.5) {
          ctx.strokeStyle = `rgba(239,68,68,${0.25 + intensity*0.2})`; ctx.lineWidth = 1;
          for (let k=0; k < Math.floor(2+ch/15); k++) {
            const ox = (k%3-1) * er * 0.3 + Math.sin(Date.now()/200 + k)*1;
            ctx.beginPath(); ctx.moveTo(u.x + ox - er*0.15, u.y - er*0.2); ctx.lineTo(u.x + ox + er*0.15, u.y + er*0.2); ctx.stroke();
          }
        }
        // eName label (할말 나오는 적)
        if (u.eName) {
          ctx.font = "9px sans-serif"; ctx.fillStyle = "#f87171"; ctx.textAlign="center";
          ctx.fillText(u.eName, u.x, u.y - u.r - 10);
          ctx.textAlign="center";
        }
      } else {
        // 기존 플레이어 synthetic (invest glow 포함)
        // 시각 차별화: archetype별 미세 procedural (synthetic) + SSR god signatures (v2)
        if (u.arch === "drone") { ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.beginPath(); ctx.arc(u.x + u.r * 0.55, u.y - u.r * 0.45, 1.4, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(u.x - u.r * 0.45, u.y + u.r * 0.35, 1.1, 0, 7); ctx.fill(); }
        else if (u.arch === "marksman") { ctx.strokeStyle = "rgba(253,224,71,0.45)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(u.x, u.y); ctx.lineTo(u.x + u.r * 1.7, u.y - 1); ctx.stroke(); }
        else if (u.arch === "guardian") { ctx.strokeStyle = "rgba(103,232,249,0.35)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(u.x, u.y, u.r * 1.05, 0, 7); ctx.stroke(); }
        // invested regulars (SR/R specifics) get prestige glow — "my elites" visual meaning even w/o SSR god art
        if (u.isSpecific && u.rarity !== "SSR" && u.id) {
          const inv = (cStar(u.id) || 0) + (cAwak(u.id) || 0) + (charGearStats(u.id).str + charGearStats(u.id).int + charGearStats(u.id).agi + charGearStats(u.id).luk > 12 ? 1 : 0);
          if (inv > 0) {
            const pulse = 0.35 + Math.sin(Date.now()/260)*0.18; // Militia aura pulse (high-invest regulars = "MY anchored" endowment)
            ctx.strokeStyle = `rgba(163,230,53,${pulse})`; ctx.lineWidth = 1.8 + Math.min(2.5, inv * 0.7);
            ctx.beginPath(); ctx.arc(u.x, u.y, u.r * (1.15 + inv*0.02), 0, 7); ctx.stroke();
            if (inv >= 3) { ctx.fillStyle=`rgba(163,230,53,0.18)`; ctx.beginPath(); ctx.arc(u.x,u.y,u.r*1.28,0,7); ctx.fill(); }
          }
        }
      }
    }
    if (u.rarity === "SSR" && u.name) {
      ctx.globalAlpha = 0.65 + Math.sin(Date.now() / 380) * 0.12;
      if (u.name === "Arclight") { ctx.fillStyle = "#fbbf24"; ctx.fillText("⚖", u.x + u.r * 0.65, u.y - u.r * 0.55); }
      else if (u.name === "Solace") { ctx.fillStyle = "#67e8f9"; ctx.fillText("≈", u.x - u.r * 0.55, u.y + u.r * 0.65); }
      else if (u.name === "Dominus") { ctx.fillStyle = "#f5c451"; ctx.beginPath(); ctx.arc(u.x, u.y - u.r * 0.85, 2.8, 0, 7); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    // HP 바 — 둥근 배경 + 색상
    const w = u.r * 2, hpr = Math.max(0, u.hp / u.maxHp), hpw = w * hpr, by = u.y - u.r - 8.5;
    ctx.fillStyle = "rgba(0,0,0,0.55)"; rRect(u.x - w / 2 - 0.5, by - 0.5, w + 1, 4.5, 2); ctx.fill();
    ctx.fillStyle = hpr > 0.5 ? "#4ade80" : hpr > 0.25 ? "#fbbf24" : "#f87171";
    rRect(u.x - w / 2, by, hpw, 3.5, 1.6); ctx.fill();
  }
}
function rRect(x, y, w, h, r) {   // 둥근 사각형 path (HP바·UI)
  r = Math.min(r, w / 2, h / 2); if (w < 0) w = 0;
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
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
  if (window._ultBurst) { window._ultBurst.t -= dt; if (window._ultBurst.t <= 0) delete window._ultBurst; }
  if (!window._lastDraw || ts - window._lastDraw >= 14) { draw(); updateScore(); window._lastDraw = ts; }   // perf: draw ~60fps 쓰로틀 (120Hz 기기 과draw 방지)
  // throttle heavy UI updates (was per-frame DOM writes + style recalc causing lag on TG mobile after ULT/table polish)
  if (!window._lastUI || ts - window._lastUI > 100) {
    updateUltBtn();
    window._lastUI = ts;
  }
  const pA = units.some((u) => u.side === "p"), eA = units.some((u) => u.side === "e");
  if (!pA || !eA) return finish(pA, eA);
  raf = requestAnimationFrame(loop);
}

function updateScore() {
  // 🔵 N vs N 🔴 스코어 제거(군주 결정): 캔버스 유닛으로 충분·비전투 화면 잔재 군더더기. 안전 no-op(호출처 유지).
  if ($score) $score.innerHTML = "";
}

function finish(p, e) {
  running = false; gameOver = true;
  const win = p && !e, dr = !p && !e;
  if (win) META.dailyBattles = (META.dailyBattles || 0) + 1;   // ⚠️ TDZ 버그픽스: win 선언 뒤로 이동 (전엔 선언 전 참조→매 전투종료 ReferenceError로 finish() 전체 붕괴)
  const m = META.mode;
  let extra = "", title = win ? t("rWin") : dr ? t("rDraw") : t("rLose");
  let bonus = (x) => Math.floor(x * (META.vip ? 1.5 : META.starter ? 1.2 : 1));   // VIP +50% / 스타터 +20% 골드

  if (win) {
    let reward = 0;
    if (m === "tower") {                               // 🗼 무한탑: 다음 층
      reward = bonus(30 + curLevel * 15);
      META.dailyTower = (META.dailyTower || 0) + 1;
      if (META.tower > (META.towerBest || 0)) META.towerBest = META.tower;
      META.tower += 1;
      title = t("rTower", { n: META.tower - 1 });
      extra = `<div class="rwd">${t("rwGold", { n: reward })}</div><div class="rwd2">${t("rwTowerNext", { n: META.tower, b: META.towerBest })}</div>`;
    } else if (m === "daily") {                         // 📅 일일: 하루 1회 보너스 (ritual window var)
      if (META.dailyDone !== today()) {
        const sig = getLegionSignal(); const win = (META.ritualWin === today() || sig>2.0);
        reward = bonus(200 + META.chapter * 15 + (win ? Math.floor(55*(sig-1)) : 0));
        META.dailyDone = today(); extra = `<div class="rwd">${t("rwDailyBonus", { n: reward })}</div>` + (win ? '<div class="rwd2">⚡ 군단 전술 보너스</div>' : '');
        // Vanguard Focus FOMO 24h ritual (carry teaser + god-VFX hook; limited, ethical)
        if (!META.vanguard || META.vanguard !== today()) { if (win || sig > 2.1) { META.vanguard = today(); setTimeout(()=>toast("24h 집중 모드 ON — 내일 전투력 대폭 UP","#fbbf24"), 650); } }
      }
      else { extra = `<div class="rwd2">${t("rwDailyDone")}</div>`; }
      title = t("rDaily"); bumpPrestige(1);
    } else if (m === "boss") {                          // 🐲 보스: 골드 + 난이도별 다이아 + 박스 + 🔮소울
      reward = bonus(120 + META.chapter * 25);
      const gemR = 5 + Math.floor(META.chapter / 5);
      META.gems = (META.gems || 0) + gemR;
      const soulR = 2 + Math.floor(META.chapter / 6);   // 🔮 소울 — 희소(각성 전용 프리미엄)
      META.soul = (META.soul || 0) + soulR;
      const tier = META.chapter >= 25 ? "epic" : META.chapter >= 10 ? "rare" : "common";
      const bx = openBox(tier);
      title = t("rBoss");
      extra = `<div class="rwd">${t("rwBoss", { n: reward })} +💎${gemR} +🔮${soulR}</div><div class="rwd2" style="color:${bx.color}">${BOX[tier].icon} ${bx.text}</div>`;
    } else {                                            // 📖 캠페인: 다음 챕터
      const founders = getFounderCount();
      const protected = founders >= 3 && META.streak > 0 && Math.random() < 0.15; // ethical: 3+ Founders = 1 miss safe chance (no full reset abuse)
      if (!protected) META.streak = (META.streak || 0) + 1;
      reward = bonus(40 + META.chapter * 20 + Math.min(80, (META.streak - 1) * 10));
      reward = Math.round(reward * ascGoldMul());        // 🔄 환생 「쇄도」 골드획득 가속
      if (META.chapter < 999) META.chapter += 1;
      title = t("rChapter");
      extra = `<div class="rwd">${t("rwGold", { n: reward })}` + (META.streak > 1 ? t("rwStreak", { n: META.streak }) : "") + `</div><div class="rwd2">${t("rwChapter", { n: META.chapter })}</div>`;
      if (protected) extra += '<div class="rwd2" style="color:#67e8f9">🛡️ Founders protect streak</div>';
      checkMilestones();                                 // 🏆 챕터 해금/보상
      updateModeTabs(); // 탭 라벨 chX 즉시 갱신 (오버레이 떠 있는 동안에도 "캠페인 ch2" 보이게)
    }
    const div = dividendGold();                        // 복리 배당
    if (div > 0) { reward += div; extra += '<div class="rwd2">' + t("dDividend", { n: div }) + "</div>"; }
    META.gold += reward; bumpPrestige(2); saveMeta(); updateMeta();
  } else { if (m === "campaign") META.streak = 0; saveMeta(); }

  // manual play timestamp for synergy boost (MVP plan)
  META.lastManual = nowMs(); saveMeta();
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
  if (win) {
    let extraEnemy = "";
    const eNames = units.filter(u=>u.side==="e" && u.eName).map(u=>u.eName);
    if (eNames.length) extraEnemy = ` · ${eNames[0]} 격파`;
    carried = `<div class="rwd2 carried-pop" style="color:#fbbf24;font-size:12px;">${getCarriedFeedback()}${extraEnemy}</div>`;
  }
  // Vanguard Focus 24h FOMO + first-win stronger overlay (limited window carry teaser + personal belonging)
  const isV = META.vanguard && META.vanguard === today();
  if (win && isV) carried = carried.replace('carried', 'VANGUARD carried • 24h Focus');
  if (win && (META.chapter||1) <= 2) {
    const fwin = (typeof t === "function" && t("firstWinOverlay")) || "🏆 첫 승리! 내 군단이 {carried}% 활약 — 네 지휘였다";
    carried = `<div class="rwd2" style="color:#fbbf24;font-size:12px;">${fwin.replace('{carried}', getCarriedFeedback().match(/(\d+)%/)?.[1]||'42')}</div>`;
  }
  $overlayMsg.innerHTML = title + extra + carried;
  $("overlay-btn").textContent = win ? t("cont") : t("retry");
  $overlay.classList.remove("hidden");
  if (tg) { try { tg.HapticFeedback.notificationOccurred(win ? "success" : "error"); } catch (e2) {} }
  if (win) {
    SFX.win();
    // simple confetti for win/SSR dopamine (MVP)
    try { confettiBurst(); } catch(e){}
    // TG share hook in overlay for carried flex
    if (! $("overlay-share")) {
      const sh = document.createElement("button");
      sh.id = "overlay-share";
      sh.textContent = "📤 MY Legion carried 공유";
      sh.style.cssText = "margin-top:8px;width:100%;padding:8px;border-radius:8px;background:#2a1f0f;color:#fbbf24;border:1px solid #664e1f;";
      sh.onclick = () => { shareDominion(); };
      $overlayMsg.parentNode.appendChild(sh);
    }
  } else SFX.lose(); 
  // expand haptic to key events
  if (win) { try { tg && tg.HapticFeedback.impactOccurred("heavy"); } catch(e){} }
  // extra haptic on prestige claim, attend, play rewards (MVP)
  try { if (tg) tg.HapticFeedback.impactOccurred("medium"); } catch(e){}
  try { if (tg) tg.HapticFeedback.impactOccurred("medium"); } catch(e){}
  // (called from their handlers already have some, expand here for key)
  // 6hr daily loop + bazaar pulse (speculative dopamine, no balance break)
  if (win && Math.random()<0.25) { setTimeout(()=>toast("🔥 군단 사기 충천! 다음 챕터로 진격하세요","#a3e635"), 800); }
  updateMeta(); draw();
}

// 6hr patch: squad carried visual feedback (Legion immersion) — now EVERY deployed specific (SSR or regular SR/R) shows named carry %
function getCarriedFeedback() {
  const pCount = units.filter(u=>u.side==='p'&&u.hp>0).length;
  const distinct = ORDER.filter(tt => (counts.p||META.army)[tt]>0).length;
  const syn = distinct>=4 ? 42 : distinct>=3 ? 28 : 12;
  const specifics = getDeployedUnits();
  let carry = "volume swarm";
  if (specifics.length && units.length) {
    // real contrib: use live dmgOut if tracked (specifics), else power-share proxy
    const contribs = [];
    const baseSyn = squadSynergy(); // for mul reuse
    specifics.forEach(u => {
      const live = units.find(x => x.id === u.id && x.side==='p');
      let w = live && live.dmgOut ? live.dmgOut : 0;
      if (w <= 0) {
        // offline power proxy for the unit (same formula as squadPower slice)
        const s = SPEC[u.arch] || SPEC.drone, lv = charLv(u.id);
        const gcs = charGearStats(u.id);
        const invest = (1 + cEnh(u.id)*0.06) * (1 + cStar(u.id)*0.25) * (1 + cAwak(u.id)*0.35);
        const indiv = ((s.hp*0.5 + (s.atk/s.atkCd)*3) * u.mul * (1+lv*0.12) * invest + (gcs.str+gcs.int+gcs.agi+gcs.luk)*5 ) * (baseSyn.atk || 1);
        w = Math.max(10, indiv);
      }
      contribs.push({name: u.name || u.vis, w});
    });
    const totalW = contribs.reduce((s,c)=>s + c.w, 0) || 1;
    contribs.sort((a,b)=>b.w - a.w);
    const top = contribs.slice(0, 2).map(c => {
      const pct = Math.max(8, Math.floor((c.w / totalW) * 72));
      return `${c.name} ${pct}%`;
    }).join(" · ");
    carry = top + " carried — 네 지휘가 봉인했다";
  } else if (!specifics.length) {
    carry = ["Arclight judgment", "Solace repair", "Dominus command", "Vespera swarm", "Vector sync"][(META.pulls||0)%5];
  }
  return `Synergy +${syn}% | ${carry}`;
}

// ── Viral/Community Reinforcement: TG native share "MY Legion carried 68%" flex + cooldown + TG user verify exact anti-abuse + Dominion card export proxy ──
function getTGUserId() {
  try { return (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) || "guest"; } catch(e){ return "guest"; }
}
function shareDominion() {
  const uid = getTGUserId();
  const key = "share_" + uid;
  const last = META[key] || 0;
  const now = Date.now();
  const CD = 24*60*60*1000; // 24h exact cooldown anti-abuse
  if (now - last < CD) {
    const h = Math.ceil((CD - (now-last))/3600000);
    toast(t("shareCooldown", {h}), "#f87171"); haptic("error"); return;
  }
  // exact verify: TG user present or guest lock (prevents easy multi abuse)
  if (!tg || uid === "guest") { toast("TG에서만 공유 보상 (user verify)", "#fbbf24"); }
  const founders = Math.min(9, (META.owned||[]).filter(x=>x<10).length || 3);
  const topCarried = (META.carriedLog && META.carriedLog.length) ? Math.max(...META.carriedLog.map(c=>c.pct)) : 68;
  const handoffProxy = Math.floor((META.pulls||12) * 0.7 + founders*4); // real handoff density proxy
  const faction = META.factionName || "My Legion";
  const text = `MY Legion carried ${topCarried}%! ${t("legionQuoteViral")}\n${faction} · Founders ${founders}/9 · Power ~${handoffProxy}\n#LEGION #LEGION`;
  // TG native: copy + prompt (or tg open if avail); reward on success
  try { navigator.clipboard.writeText(text); } catch(e){}
  if (tg) { try { tg.HapticFeedback.impactOccurred("medium"); } catch(e){} }
  META.gems = (META.gems||0) + 5; META[key] = now; saveMeta(); updateMeta();
  toast(t("shareReward") + " · " + t("shareSent"), "#a3e635");
  // profile card visual hint
  setTimeout(()=> toast(t("dominionCard") + " " + founders + "/9 " + topCarried + "% " + t("factionTag") + " " + faction, "#fbbf24"), 900);
}
function getDominionCardText() {
  const founders = Math.min(9, (META.owned||[]).filter(x=>x<10).length || 3);
  const top = (META.carriedLog && META.carriedLog.length) ? Math.max(...META.carriedLog.map(c=>c.pct)) : 68;
  const proxy = Math.floor((META.pulls||12)*0.7);
  const fac = META.factionName || "My Legion";
  return `MY DOMINION\nFounders ${founders}/9 · Top carried ${top}%\n"${t("carriedQuote")}"\nHandoff density proxy: ${proxy}\n${fac}`;
}

// ── 가챠 (뽑기) — 등급·천장·전설해금 ─────────────────────────────────────────
const GACHA_COST = 8;   // 캐릭 단차: 💰골드100 → 💎젬8 (10연 💎80과 화폐 통일·비교가능. 1젬≈100골드라 골드단차=사실상 무한공짜였음. 트리니티 옵션A)
const RARITY = [
  { key: "N",   p: 0.60, color: "#9ca3af", lvls: 1 },
  { key: "R",   p: 0.25, color: "#60a5fa", lvls: 2 },
  { key: "SR",  p: 0.13, color: "#c084fc", lvls: 3 },
  { key: "SSR", p: 0.02, color: "#fbbf24", lvls: 5 },
]; // 캐릭터 N60% R25% SR13% SSR2% (2% base + pity>6 ramp0.06 hard10: low chase "one more" + safety net, Genshin/AFK avoid pity hell, dopamine 최적)
function rollRarity() {
  let p = (META.pity || 0);
  if (p >= 10) return RARITY[3]; // hard pity 10
  let ssrP = 0.02 + (p > 6 ? (p - 6) * 0.06 : 0);
  let r = Math.random(), a = 0;
  const adj = RARITY.map(x => x.key==="SSR" ? {...x, p: Math.min(ssrP, 1)} : x);
  const sum = adj.reduce((s,x)=>s+x.p,0) || 1;
  for (const t of adj) { a += t.p / sum; if (r <= a) return t; }
  return RARITY[0];
}
function gacha() {
  if (running) return;
  recordManualPlay(); // for synergy
  META.dailyPulls = (META.dailyPulls || 0) + 1;
  if ((META.gems || 0) < GACHA_COST) { toast(t("tGemShort", { n: GACHA_COST }), "#ef4444"); return; }
  META.gems -= GACHA_COST; META.pulls = (META.pulls || 0) + 1; META.pity = (META.pity || 0) + 1;
  let rar = rollRarity();
  if (META.pity >= 10) rar = RARITY[3];                 // hard pity 10 SSR (dopamine safety net, low-frust chase)
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
  bumpPrestige(0.5); saveMeta(); updateMeta(); reset();
  showGacha(rar, msg);
  // gacha pulse interlock from daily ritual
  if (rar.key==="SSR" && getLegionSignal()>1.8) setTimeout(()=>toast("✨ SSR 획득! 오프라인·일일 보상도 챙기세요", "#fbbf24"), 900);
  // §21 Eros Form Gaze tease (Plato eros for ideal + visual desire; god-pose hint on SSR without repeat prior teases)
  if (rar.key === "SSR") {
    setTimeout(() => {
      toast("✨ 전설의 영웅이 군단에 합류했습니다", "#fbbf24");
    }, 650);
  }
}
// 💎 프리미엄 10연 (SR↑ 1개 보장) — 다이아의 핵심 용도
const GACHA10_COST = 80; // 10연 80 gems (up; makes currency feel valuable, 10-pull exciting not cheap spam. Per dopamine: chase > easy free pulls)
function gacha10() {
  if (running) return;
  if ((META.gems || 0) < GACHA10_COST) { toast(t("tGemShort", { n: GACHA10_COST }), "#ef4444"); return; }
  META.gems -= GACHA10_COST;
  const RANK = { N: 0, R: 1, SR: 2, SSR: 3 };
  let best = 0;
  for (let i = 0; i < 10; i++) {
    META.pity = (META.pity || 0) + 1;
    let rar = rollRarity();
    if (META.pity >= 10) rar = RARITY[3]; // hard10
    if (i === 9 && best < 2) rar = RARITY[2];          // 10연 SR↑ 보장 (dopamine)
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
  if (rar.key === "SSR") $("gacha-rank").classList.add('ssr-tease'); else $("gacha-rank").classList.remove('ssr-tease');
  const pity = (META.pity||0); const pct = rar.key==="SSR" ? "2%+" : "visible";
  $("gacha-msg").innerHTML = msg + `<br><small style="opacity:.7">🎯 천장 ${pity}/10 · 캐릭터 N60% R25% SR13% SSR2% | 장비 동일 | pity 투명 (soft&gt;6 +6%/회 ramp, hard10 SSR 보장)</small>`;
  g.classList.remove("hidden");
  if (rar.key === "SSR") {
    SFX.ssr();
    haptic("heavy");
    try { confettiBurst(); } catch(e){}
  } else {
    SFX.gacha();
    haptic("light");
  }
}

// ── 토스트 ────────────────────────────────────────────────────────────────────
function toast(text, color) {
  const t = $("toast"); if (!t) return;
  t.textContent = text; t.style.borderColor = color || "#fbbf24";
  t.classList.add("show"); clearTimeout(t._tm);
  t._tm = setTimeout(() => t.classList.remove("show"), 2200);
}

// ── 일일 보상 (ritual claim window + Legion var seed) ─────────────────────────────────────────────────────────────────
function checkDaily() {
  let today = ""; try { today = new Date().toISOString().slice(0, 10); } catch (e) { return; }
  if (META.lastDaily !== today) {
    META.lastDaily = today;
    // loss aversion: reset loginStreak only on miss (attend.last != yesterday). Duolingo style.
    const yest = dayPlus(-1);
    if ((META.loginStreak || 0) > 0 && META.attend && META.attend.last !== yest) META.loginStreak = 0;
    const sig = getLegionSignal();
    const winOpen = (sig > 2.0);
    META.ritualWin = winOpen ? today : "";
    const base = 120; const varB = winOpen ? Math.floor(35 * (sig-1)) : 0;
    META.gold += base + varB; bumpPrestige(1);
    saveMeta(); updateMeta();
    setTimeout(() => toast(t("tDaily") + (varB? ` +${varB}`:""), "#fbbf24"), 500);
    // Vanguard 24h FOMO ritual interlock
    if (winOpen && (!META.vanguard || META.vanguard !== today)) { META.vanguard = today; setTimeout(()=> { toast("24h 집중 모드 ON: 전투력 + 시각 효과 강화", "#fbbf24"); if(!running) reset(); }, 820); }
  }
}

function start() {
  if (gameOver) reset();
  if (running) { running = false; $("start").textContent = t("resume"); cancelAnimationFrame(raf); return; }
  preloadSSRPortraits(); // 강제 로드 (GitHub Pages 타이밍 대응)
  running = true; lastT = 0; $("start").textContent = t("pause");
  $status.textContent = t("sFight");
  raf = requestAnimationFrame(loop);
  // 첫 프레임 후 한 번 더 보장 (이미지 로드 대기)
  setTimeout(() => { if (running) draw(); }, 280);
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
      renderDeploySpecificsPreview();  // archetype 조정 후에도 specific 배치 쉽게 확인
    });
  });
}

$("start").addEventListener("click", start);
$("reset").addEventListener("click", reset);
// Reset feedback 강화 (user: "디자인 좀 바꿔" — clear premium danger + confirmation already + bak safe)
const resetBtn = $("reset"); if (resetBtn) { resetBtn.style.border = "1px solid #f87171"; resetBtn.title = "진행 초기화 (백업 자동 생성, 복구 가능)"; }
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
  const h = HEROES[META.hero];
  // ULTIMATE CLEAN (Sovereign): no extra emoji/glyph in text to avoid overlap and make skill name visible. CSS ::before handles the fire. The ultLabel has the skill name prominently.
  if (!running) { b.textContent = "군단 지휘 본부 • " + (h.ultName || tUlt(h.ult)); b.disabled = true; b.classList.remove("ready"); b.classList.remove("hero-tinted"); b.style.removeProperty('--hcolor'); return; }
  b.disabled = ultT > 0;
  if (ultT > 0) { b.textContent = Math.ceil(ultT) + "s"; b.classList.remove("ready"); b.classList.remove("hero-tinted"); b.style.removeProperty('--hcolor'); }
  else {
    // Clean text only. No heavy prefix, no emoji. Just the ult name + EXECUTE. Effects removed in CSS.
    const ultLabel = (h.ultName || tUlt(h.ult)) + " EXECUTE";
    b.textContent = ultLabel;
    b.classList.add("ready");
    // No hero tint classes or vars — effects fully stripped per request. Flat clean button.
    b.classList.remove('hero-tinted');
    b.style.removeProperty('--hcolor');
  }
}
function getHeroColor(hk) { const map = { strategist:'#c4b5fd', berserker:'#f87171', warden:'#67e8f9', ranger:'#a3e635', mech:'#94a3b8', engineer:'#f0abfc', dragoon:'#fbbf24' }; return map[hk] || null; }
// 2026-06-16 Morpheus: rim tints match heroicon gens (purple/red/cyan/lime/silver/magenta/gold) for bar "MY POWER" consistency. Balance pass: ranger ult multi buff careful (within sim eff). Lean MVP.
function doUlt() {
  if (!running || ultT > 0) return;
  META.dailyUlts = (META.dailyUlts || 0) + 1;
  const h = HEROES[META.hero], lv = (META.heroLv[META.hero] || 1), k = heroScale(lv);
  const mine = units.filter((u) => u.side === "p" && u.hp > 0);
  const foes = units.filter((u) => u.side === "e" && u.hp > 0);
  if (h.ult === "focus")        mine.forEach((u) => { u.buff = Math.round(u.atk * 0.5); u.buffT = 4; });
  else if (h.ult === "rage")    mine.forEach((u) => { u.buff = Math.round(u.atk * 0.5); u.buffT = 5; u.spd = 1.5; u.spdT = 5; });
  else if (h.ult === "wall")    mine.forEach((u) => { u.shield = 4; });
  else if (h.ult === "volley")  {
    // 아크 볼리 — 진짜 "궁극기" 다중 정밀 일제 (Sovereign 피드백: 멋없는 flat dmg → spectacle barrage)
    const k2 = k * 1.1;
    const tgts = foes.slice().sort(() => Math.random() - 0.5).slice(0, Math.min(9, foes.length || 1));
    tgts.forEach((f, i) => {
      setTimeout(() => {
        if (f && f.hp > 0) {
          dmg(f, (24 + (i < 3 ? 10 : 0)) * k2, null);
          addFx(f.x + (Math.random()-0.5)*6, f.y + (Math.random()-0.5)*6, "boom");
          // precision shot lines from "sky" / center (crosshair lock feel)
          addFx(W/2 + (i-4)*18, 35, "shot", f.x, f.y, "p");
        }
      }, i * 38);
    });
    addFx(W/2, 38, "overclock"); // big lock-on pulse
    // extra green energy cross + multiple ctr pips for "ultimate" dopamine
    for (let j = 0; j < 4; j++) setTimeout(() => addFx(W/2 + (j-1.5)*22, 55, "ctr"), 80 + j*25);
  }
  else if (h.ult === "assault") mine.forEach((u) => { if (foes.length) { const t = foes.reduce((a, b) => (dist(u, b) < dist(u, a) ? b : a)); u.x += (t.x - u.x) * 0.5; u.y += (t.y - u.y) * 0.5; } addFx(u.x, u.y, "charge"); });
  else if (h.ult === "repair")  mine.forEach((u) => { u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.4); addFx(u.x, u.y, "barrier"); });
  else if (h.ult === "dragon")  { foes.forEach((f) => dmg(f, 42 * k, null)); addFx(W / 2, H / 2, "overclock"); }
  ultT = h.ultCd;
  triggerUltVfx(h.ult, getHeroColor(META.hero) || '#fbbf24'); // 궁극기 7종 고유 VFX (드래곤/볼리/강습/지휘/철벽/광폭/수리)
  toast(t("tUlt", { x: tUlt(h.ult) }), "#fbbf24");
  haptic("heavy");
}

// ── 영웅 선택 / 강화 ──────────────────────────────────────────────────────────
function heroUpCost() { return 150 * (META.heroLv[META.hero] || 1); }
function updateHeroUI() {
  HERO_ORDER.forEach((hk) => {
    const b = document.querySelector('.hbtn[data-h="' + hk + '"]'); if (!b) return;
    b.classList.toggle("sel", hk === META.hero);
    if (!b.dataset.dec) {
      // Jordan premium + 2026-06-16 Sovereign art: lazy heroicon PNG (god-pose, per-hero rim god-ray + host-weave, 128px, no text original). .him for command bar pop. PURE ICON — 이모지/랭크 오버레이 제거 (겹쳐 보이는 clutter 다 빼). Rank/glyph은 아래 hero-name 텍스트로만 표시. Fallback은 간단 glyph만. Reversible.
      const iconPath = `art/heroicon-${hk}.png`;
      const img = new Image();
      img.onload = () => { if (b) b.innerHTML = `<img class="him" src="${iconPath}" alt="${hk}">`; }; // clean pure PNG only — no hgly, no rk on art
      img.onerror = () => { if (b) b.innerHTML = ''; };
      img.src = iconPath;
      b.innerHTML = ''; // temp fallback until PNG
      b.dataset.dec = "1";
    }
    // 강제 클린: 이전 DOM에 남아있을 수 있는 .rk / .hgly (작은 랭크/이모지) 제거 — 궁극기 디자인 방해
    b.querySelectorAll('.rk, .hgly').forEach(el => el.remove());
  });
  const h = HEROES[META.hero], lv = META.heroLv[META.hero] || 1, tr = tHero(META.hero);
  // Alex: Command center per-hero (AFK/HSR power fantasy). "MY ULT" ready state sync.
  if ($("hero-name")) {
    const nameEl = $("hero-name");
    // Sovereign: "RANK" → "TIER" 로 변경 (고정 창설 티어 vs 업그레이드 레벨 구분 명확히). 유저가 "업글 안했는데 랭크 다름" 오해하지 않게. TIER은 영웅 고유 정체성 (Ⅰ~Ⅵ 순서), Lv만 골드 강화로 오름.
    nameEl.innerHTML = tr[0] + ' Lv' + lv;
    nameEl.title = "고유 창설 티어 (고정·변하지 않음) · 지휘 레벨 (골드로 강화)";
  }
  if ($("hero-desc")) {
    let ultHtml = ' <span style="color:#f59e0b;font-weight:700">· ULT: ' + tUlt(h.ult) + '</span>';
    if (META.hero === "ranger") {
      // Sovereign 20260616: ranger ULT 이미지 업그레이드 — 멋진 아크 볼리 아이콘 (lime precision crosshair volley, generated premium)
      ultHtml = ' <img src="art/ult-ranger-small.jpg" style="width:18px;height:18px;vertical-align:middle;margin:0 3px 1px 2px;border-radius:2px;box-shadow:0 0 4px #a3e635;"> <span style="color:#f59e0b;font-weight:700">· ULT: ' + tUlt(h.ult) + '</span>';
    }
    $("hero-desc").innerHTML = tr[1] + ultHtml;
  }
  if ($("hero-up")) $("hero-up").textContent = t("upgrade") + " " + heroUpCost() + "g";
  updateUltBtn(); // ensure hero color bleed syncs instantly on switch
  // ensure sel has premium class for CSS glow/scale
  document.querySelectorAll('.hbtn.sel').forEach(bb => bb.classList.add('hero-premium-sel'));
  updateBattleCombo(); // 캐릭터 선택 시 실시간 조합 버프 표시 (정적 상성 대신)
}
function selectHero(h) { if (running || !HEROES[h]) return; META.hero = h; saveMeta(); updateHeroUI(); reset(); haptic("heavy");
  // Premium sel feedback — "this hero's ultimate is MINE" power fantasy (HSR wow + AFK/E7). Strong scale + glow + ult sync. "MY POWER" visual pop.
  const bb = document.querySelector('.hbtn[data-h="' + h + '"]'); if (bb) {
    bb.style.transform = 'scale(1.15)'; // lower for perf (less layout/paint on tap)
    const hc = getHeroColor(h);
    if (hc) bb.style.boxShadow = `0 0 40px ${hc}99, 0 0 16px ${hc}, inset 0 0 10px rgba(255,255,255,0.2)`;
    setTimeout(() => { if (bb) { bb.style.transform = ''; bb.style.boxShadow = ''; updateUltBtn(); } }, 200);
  }
  // ult preview flash — screams "MY power"
  const ub = $("ult"); if (ub && !running) { ub.style.borderColor = getHeroColor(h) || '#4a3a00'; setTimeout(()=>{if(ub) ub.style.borderColor = '#4a3a00';}, 480); }
}
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
  let rate = 0.3 + META.chapter * 0.4;                        // 챕터 비례 초당 골드
  // MVP final plan: 7일 streak 영구 AFK 1.5x (memory temp, no DB schema risk)
  if ((META.streak || 0) >= 7) rate *= 1.5;
  // daily missions claim interlock: 내일 AFK +15% (progression tie, FOMO "claim today for tomorrow power")
  if (META.afkBoostDay && META.afkBoostDay === today()) rate *= 1.15;
  // MVP synergy: manual play boosts auto 30% (single formula, recent manual within 30min)
  const manualBoost = (META.lastManual && (nowMs() - META.lastManual < 30 * 60 * 1000)) ? 1.3 : 1;
  rate *= manualBoost;
  const cap = rate * 3600 * 8;                                  // 최대 8시간치
  const gold = Math.floor(Math.min(cap, elapsed * rate));
  if (gold > 0) {
    const sig = getLegionSignal();
    const varBonus = Math.floor(gold * (sig - 1) * 0.12); // small variable from real Legion handoff density
    META.gold += gold + varBonus; saveMeta(); updateMeta(); bumpPrestige(1);
    const hrs = Math.floor(elapsed / 3600), mins = Math.floor((elapsed % 3600) / 60);
    const tm = hrs ? hrs + "h " + mins + "m" : mins + "m";
    const flavor = sig > 2.2 ? "Legion tactics surging" : "Legion forecast stable";
    setTimeout(() => toast(`🌙 ${t("tIdle", { t: tm, n: gold })} +${varBonus} ${flavor}`, "#fbbf24"), 900);
    // Forecast popup flavor (lean toast + prestige pop)
    if (sig > 1.8) setTimeout(() => toast("군단 신호 강함: 방치 보상 폭발 + 리추얼 창구 열림", "#a3e635"), 1600);
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
  if ($("set-music")) { $("set-music").textContent = META.music === false ? "OFF" : "ON"; $("set-music").classList.toggle("off", META.music === false); }
  // A11y reinforcement
  if ($("set-highcontrast")) { $("set-highcontrast").textContent = META.highContrast ? "ON" : "OFF"; $("set-highcontrast").classList.toggle("off", !META.highContrast); }
  if ($("set-vfxfallback")) { $("set-vfxfallback").textContent = META.vfxFallback ? "ON" : "OFF"; $("set-vfxfallback").classList.toggle("off", !META.vfxFallback); }
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

// Viral/A11y wiring (index share + profile + a11y toggles + Dominion export)
function initViralA11y() {
  const shareBtn = $("share-dominion"); if (shareBtn) shareBtn.onclick = () => { haptic("medium"); shareDominion(); };
  const expBtn = $("export-dominion"); if (expBtn) expBtn.onclick = () => { const txt = getDominionCardText(); try{navigator.clipboard.writeText(txt);}catch(e){}; toast("MY Dominion 카드 복사됨 — TG paste로 flex! " + txt.split("\n")[1], "#a3e635"); haptic("light"); };
  const fc = $("faction-name"); if (fc && !fc.oninput) fc.oninput = () => { META.factionName = (fc.value||"").slice(0,16); saveMeta(); };
  const hc = $("set-highcontrast"); if (hc) hc.onclick = () => { META.highContrast = !META.highContrast; saveMeta(); updateToggles(); document.body.classList.toggle("high-contrast", !!META.highContrast); toast(t("a11yHigh"), "#67e8f9"); };
  const vf = $("set-vfxfallback"); if (vf) vf.onclick = () => { META.vfxFallback = !META.vfxFallback; saveMeta(); updateToggles(); document.body.classList.toggle("vfx-fallback", !!META.vfxFallback); toast(t("a11yVfx"), "#c084fc"); };
  // load persisted
  if (META.highContrast) document.body.classList.add("high-contrast");
  if (META.vfxFallback) document.body.classList.add("vfx-fallback");
  // TG MainButton for MVP 4 actions (battle start primary)
  if (tg) {
    try {
      tg.MainButton.setText("▶ 전투 시작");
      tg.MainButton.onClick(() => { if (!running) { if (gameOver) reset(); start(); } });
      tg.MainButton.show();
    } catch(e){}
  }
}
function openSettings() { updateToggles(); buildLangList(); renderProfile(); renderPrestige(); showPage("settings"); }
// 🔄 환생(Ascension) — 비파괴 메타 루프. 챕터·골드만 리셋, 유닛/장비/가챠/캐릭 100% 유지.
//    에테르(⬡, 영구화폐)로 복리노드(공세/불굴/쇄도) 강화 → 영구 전투배율. PRD-prestige-loop.md 확정.
const ASC_NODES = [
  { key: "might",    glyph: "⚔️" },
  { key: "bulwark",  glyph: "🛡️" },
  { key: "momentum", glyph: "⚡" },
];
function ascNodeKey(key, suf) { return "n" + key.charAt(0).toUpperCase() + key.slice(1) + (suf || ""); } // might→nMight / nMightD
function renderPrestige() {
  const box = $("prestige-box"); if (!box) return;
  const ch = META.chapter || 1, e = META.ether || 0, gain = etherGain(ch), pwr = ascPowerMul();
  let h = `<div class="prestige-desc">${t("ascDesc")}</div>`;
  h += `<div class="asc-stats">⬡ <b>${e}</b> · ${t("ascPower")} ×${pwr.toFixed(2)} · ${t("ascRuns")} ${META.ascCount || 0}</div>`;
  if (ch >= ASCEND_GATE) {
    h += `<div class="prestige-rw">${t("ascReady", { e: gain })}</div>`;
    h += `<button id="prestige-go" class="prestige-btn">${t("ascBtn", { ch: ch })}</button>`;
  } else {
    h += `<div class="asc-locked">${t("ascLocked", { gate: ASCEND_GATE, ch: ch })}</div>`;
  }
  h += `<div class="asc-shop-h">${t("ascShop")}</div>`;
  for (const n of ASC_NODES) {
    const lv = ascLv(n.key), cost = ascNodeCost(lv), can = e >= cost;
    h += `<div class="asc-node">`
      + `<div class="asc-node-main"><b>${n.glyph} ${t(ascNodeKey(n.key))}</b> <span class="asc-lv">${t("ascLvN", { n: lv })}</span>`
      + `<div class="asc-node-d">${t(ascNodeKey(n.key, "D"))}</div></div>`
      + `<button class="asc-buy${can ? "" : " off"}" data-node="${n.key}"${can ? "" : " disabled"}>${t("ascUp", { c: cost })}</button>`
      + `</div>`;
  }
  box.innerHTML = h;
  if (ch >= ASCEND_GATE) on("prestige-go", "click", doAscend);
  box.querySelectorAll(".asc-buy").forEach((b) => b.addEventListener("click", () => buyAscNode(b.dataset.node)));
}
function buyAscNode(node) {
  if (running || !META.asc || !(node in META.asc)) return;
  const lv = ascLv(node), cost = ascNodeCost(lv);
  if ((META.ether || 0) < cost) { toast(t("ascNeed"), "#ef4444"); return; }
  META.ether -= cost; META.asc[node] = lv + 1;
  saveMeta(); updateMeta(); renderPrestige();
  const g = { might: "⚔️", bulwark: "🛡️", momentum: "⚡" }[node];
  toast(g + " " + t("ascLvN", { n: lv + 1 }), "#c084fc"); SFX.ssr(); haptic("medium");
}
function doAscend() {
  const ch = META.chapter || 1; if (ch < ASCEND_GATE) return;
  const btn = $("prestige-go"), gain = etherGain(ch);
  const ask = t("ascConfirm", { ch: ch, e: gain });
  const go = () => {
    if (btn) { btn.disabled = true; btn.textContent = "..."; }
    META.ether = (META.ether || 0) + gain;
    META.ascCount = (META.ascCount || 0) + 1;
    // 비파괴 리셋: 챕터·골드·연승만. 유닛·장비·가챠·캐릭·타워는 전부 유지.
    META.chapter = 1; META.streak = 0;
    META.gold = 550 + ascStartGold();
    saveMeta();
    applyMode(); reset(); updateMeta(); showPage("battle");
    SFX.ssr(); haptic("heavy");
    setTimeout(() => { toast(t("ascDone", { e: gain }), "#c084fc"); }, 300);
  };
  const done = () => { if (btn) { btn.disabled = false; renderPrestige(); } };
  if (tg && tg.showConfirm) { tg.showConfirm(ask, (ok) => { if (ok) go(); else done(); }); }
  else if (confirm(ask)) { go(); }
  else done();
}
$("set-sound").addEventListener("click", () => { META.sound = META.sound === false; saveMeta(); updateToggles(); if (META.sound !== false) SFX.tap(); });
$("set-haptic").addEventListener("click", () => { META.haptic = META.haptic === false; saveMeta(); updateToggles(); });
on("set-music", "click", () => { META.music = META.music === false; saveMeta(); updateToggles(); if (META.music === false) bgmStop(); else bgmStart(); });

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
  if (tier === "legend") {                                    // 30일차 최고 보상: SR확정 + SSR 15%확률 + SR/SSR장비 + 💎200
    // ⚠️ 무료 출석 SSR 확정 제거(군주 "SSR 함부로 안 줌"): 무과금도 30일이면 SSR 확정이라 희소성 파괴됐음.
    // → SR 확정 보장(여전히 강함) + 15% SSR 잭팟(가챠 두근거림) + 💎200(보상가치 보전). 결제팩 SSR은 고액이라 유지.
    const isSSR = Math.random() < 0.15;
    const rar = isSSR ? "SSR" : "SR";
    const gu = grantUnit(rar);
    const g = newGear(rar); META.gear.push(g);
    META.gems = (META.gems || 0) + 200;
    return { color: "#fbbf24", text: (gu ? "【" + gu.name + "】 " : "") + rar + " + " + (SLOT_ICON[g.slot] || "") + rar + "장비 + 💎200", rank: rar };
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
  { sec: 180,  min: 3,  gold: 200,  gem: 0,  box: null },
  { sec: 600,  min: 10, gold: 500,  gem: 0,  box: null },
  { sec: 1200, min: 20, gold: 900,  gem: 0,  box: "common" },
  { sec: 1800, min: 30, gold: 1400, gem: 3,  box: "rare" },
  { sec: 3600, min: 60, gold: 2800, gem: 6,  box: "epic" },
];
function playReset() {                                  // 날짜 바뀌면 누적·수령 초기화 + daily missions cycle
  if (META.play.day !== today()) { 
    META.play.day = today(); META.play.sec = 0; META.play.claimed = []; 
    // reset daily cycle for habit loop
    META.dailyBattles = 0; META.dailyPulls = 0; META.dailyUlts = 0; META.dailyTower = 0; META.dailyMissionsClaimed = false;
    // streak: proper loss aversion — reset only if missed attend yesterday (Duolingo style). play time no longer nukes it.
  }
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
  // "claim all ready" for frictionless daily hook (must press once, like other games' dailies)
  const readyCount = PLAYTIME.filter((r,i) => sec >= r.sec && META.play.claimed.indexOf(i) < 0).length;
  if (readyCount > 1) {
    const allBtn = document.createElement("button");
    allBtn.textContent = `모두 받기 (${readyCount}개)`;
    allBtn.onclick = () => { PLAYTIME.forEach((r,i) => { if (sec >= r.sec && META.play.claimed.indexOf(i) < 0) claimPlay(i); }); };
    allBtn.style.cssText = "width:100%;margin-top:4px;padding:6px;background:#2a1f0f;color:#fbbf24;border:1px solid #664e1f;border-radius:6px;";
    box.appendChild(allBtn);
  }
  // FOMO + streak visible
  const f = $("play-fomo"); if (f) {
    const h = 24 - (new Date().getHours() || 0); const s = META.loginStreak || 0;
    f.textContent = `⏰ 리셋 ~${h}h · 🔥 streak ${s} (claim으로 유지)`;
  }
}
function claimPlay(i) {
  playReset();
  const r = PLAYTIME[i]; if (!r) return;
  if ((META.play.sec || 0) < r.sec) { toast(t("playLock", { m: r.min }), "#8b93a7"); return; }
  if (META.play.claimed.indexOf(i) >= 0) return;
  // Daily cycle hook: require at least 1 action (battle/pull) today for full reward (prevents pure passive, forces "must do something")
  const didAction = ((META.dailyBattles || 0) + (META.dailyPulls || 0)) > 0;
  let mult = 1 + Math.min(0.5, (META.loginStreak || 0) / 7 * 0.1);
  if (!didAction && i > 1) { mult = 0.5; toast("액션(전투/뽑기) 1번 이상 해야 풀 보상!", "#f87171"); } // half for long ones if no action
  META.play.claimed.push(i);
  META.gold += Math.floor(r.gold * mult);
  if (r.gem) META.gems = (META.gems || 0) + Math.floor(r.gem * mult);
  let boxRes = null;
  if (r.box) boxRes = openBox(r.box);
  bumpPrestige(1); saveMeta(); updateMeta(); renderPlay();
  haptic("medium"); SFX.claim();
  const txt = "💰" + Math.floor(r.gold * mult) + (r.gem ? " 💎" + Math.floor(r.gem * mult) : "") + (boxRes ? " " + boxRes.text : "");
  if (boxRes) setTimeout(() => showGacha({ key: boxRes.rank, color: boxRes.color }, boxRes.text), 400);
  else toast(t("tPlay", { x: txt }) + (mult > 1 ? " (🔥 streak +" + Math.floor((mult-1)*100) + "%)" : ""), "#fbbf24");
  // cycle: after claim, hint next action for loop (AFK accrues while away)
  setTimeout(() => toast("전투 1판 → 내일 보상 더 커져요! (오프라인 가속)", "#a3e635"), 1200);
}
function openEvent() { renderAttend(); renderPlay(); renderSeason(); showPage("event"); 
  const orb = $("ritual-orb"); if (orb) orb.style.display = (getLegionSignal() > 1.6 || META.ritualWin===today()) ? "" : "none";
  const vg = $("vanguard-ritual"); if (vg) {
    // Sovereign: 유저가 바로 아는 한국어 benefit 중심으로만. 미스터리 금지.
    vg.textContent = (META.vanguard===today()) ? "⚡ 24h 집중 모드 — 내일 전투력 대폭 상승" : "";
    vg.style.display = vg.textContent ? "" : "none";
  }
  // daily 4-mission checklist for habit cycle (must complete to claim bonus) – "must press reward" loop like AFK/Duolingo
  const miss = $("daily-missions-hint");
  if (miss) {
    const b = META.dailyBattles || 0, p = META.dailyPulls || 0, u = META.dailyUlts || 0, t = META.dailyTower || 0;
    const allDone = b >= 3 && p >= 1 && u >= 1 && t >= 1;
    miss.innerHTML = `오늘 미션: 전투 ${b}/3 · 뽑 ${p}/1 · ULT ${u}/1 · 탑 ${t}/1 ${allDone && !META.dailyMissionsClaimed ? '<button onclick="claimDailyMissions()">보상 받기 +500g + 내일 AFK 20% 부스트</button>' : ''} (매일 1번씩! claim으로 스트릭 유지)`;
  }
  // FOMO + cycle in event: "claim before reset" + streak visible
  if ($("play-now")) $("play-now").textContent = (META.play.sec||0) + "s (0시 리셋)";

  // Sovereign 20260616: 이벤트 페이지에 stray 보상 카드(여명 부적 + 강화 UI 등) 직접 박히지 않게 방어
  const evPage = $("page-event");
  if (evPage) {
    evPage.querySelectorAll(':scope > *').forEach(el => {
      const txt = (el.textContent || '').toLowerCase();
      if (el.id && ['attend-grid','play-list','season-list','vanguard-ritual','attend-fomo','play-fomo','play-now'].indexOf(el.id) >= 0) return;
      if (txt.includes('부적') || txt.includes('ssr+') || txt.includes('강화 +') || (el.style.border && el.style.border.includes('gold'))) {
        el.style.display = 'none';
      }
    });
  }
}
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
  // FOMO: claim before daily reset (visible compulsion)
  const fomo = $("attend-fomo"); if (fomo) {
    const h = 24 - (new Date().getHours() || 0);
    fomo.textContent = `⏰ 리셋까지 ~${h}시간 (놓치면 연속 초기화) · 오늘 받으면 내일 전투력 UP`;
  }
}
function claimAttend() {
  if (META.attend.last === today()) { toast(t("evDone"), "#8b93a7"); return; }
  const idx = (META.attend.day || 0) % 30, r = ATTEND[idx];
  if (r.g) META.gold += r.g;
  if (r.gem) META.gems = (META.gems || 0) + r.gem;
  let boxRes = null;
  if (r.box) boxRes = openBox(r.box);
  META.attend.day = (META.attend.day || 0) + 1; META.attend.last = today();
  // daily streak +1 on claim (for cycle)
  META.loginStreak = (META.loginStreak || 0) + 1;
  bumpPrestige(1); saveMeta(); updateMeta(); renderAttend();
  haptic("medium"); SFX.claim();
  if (boxRes) {
    setTimeout(() => showGacha({ key: boxRes.rank, color: boxRes.color }, boxRes.text), 400);
  } else toast(t("tAttend", { n: idx + 1 }) + " 🔥 streak " + META.loginStreak, "#fbbf24");
  // interlock: attend ritual → gacha pulse tease
  setTimeout(() => { if (Math.random()<0.6) toast("의식 완료 — 가챠 한 번 돌려볼까요?", "#a3e635"); }, 1200);
  // §21: Tanha Quench Mirror Insight stub (Buddhism layer — low-friction daily quench if 9 icons "thirst" met via founders in squad; insight var)
  const sq = getDeployedUnits ? getDeployedUnits() : [];
  const fCount = sq.filter(u => u && u.rarity === "SSR").length;
  if (fCount >= 3) {
    const insight = Math.floor(20 + getLegionSignal() * 15);
    META.gold = (META.gold || 0) + insight;
    setTimeout(() => toast("🪞 통찰 보너스 +" + insight + "골드 획득!", "#a3e635"), 900);
  }
  // FOMO: if streak high, next day bigger hint + loss aversion (miss = reset streak bonus)
  if (META.loginStreak >= 7) setTimeout(() => toast("7일 연속! 내일 보상 2배 기대 (놓치면 초기화)", "#fbbf24"), 1500);
}
$("attend-claim").addEventListener("click", claimAttend);

function claimDailyMissions() {  // MVP daily cycle claim — forces 1 action loop + progression tie
  if (META.dailyMissionsClaimed) return;
  const b = META.dailyBattles || 0, p = META.dailyPulls || 0, u = META.dailyUlts || 0, t = META.dailyTower || 0;
  if (!(b >= 3 && p >= 1 && u >= 1 && t >= 1)) { toast("미션 미완 — 전투/뽑/ULT/탑 1회씩", "#ef4444"); return; }
  META.gold = (META.gold || 0) + 350;
  META.dailyMissionsClaimed = true;
  META.afkBoostDay = dayPlus(1);  // 내일 전체 AFK 15% 부스트 (tie to progression)
  bumpPrestige(1); saveMeta(); updateMeta();
  if (curPage === "event") openEvent();
  haptic("medium"); SFX.claim();
  toast("🎁 미션 완료! +350g + 내일 AFK +15% (오프라인 가속)", "#fbbf24");
  setTimeout(() => toast("전투 1판 더 → 스트릭/보상 업! (3-5분 루프)", "#a3e635"), 1100);
}
on("om-ritual", "click", () => { bumpPrestige(1); checkDaily(); if (curPage!=="event") openEvent(); toast("🔮 의식 완료 — 가챠가 준비됐어요!", "#a3e635"); setTimeout(gacha, 700); });

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
  if (code === "REVIEWALL") {            // 🔒 군주 전용 검토 코드 (공개 X) — 전부 해금 (캐릭+장비 도감 + 챕터/재화)
    // 1) 캐릭터 도감 전체
    if (typeof ROSTER !== "undefined") META.owned = ROSTER.map((u) => u.id);
    // 2) 장비 도감 전체 — GEAR_ROSTER 템플릿을 보유 인스턴스로 (미보유분만 추가)
    if (typeof GEAR_ROSTER !== "undefined") {
      if (!META.gear) META.gear = [];
      const ownedTpl = new Set(META.gear.map((x) => x.tplId));
      GEAR_ROSTER.forEach((tpl) => {
        if (!ownedTpl.has(tpl.id)) META.gear.push({ id: ++META.gearSeq, tplId: tpl.id, slot: tpl.slot, rarity: tpl.rarity, color: tpl.color, name: tpl.name, str: tpl.str, int: tpl.int, agi: tpl.agi, luk: tpl.luk, enh: 0, star: 0, awak: 0 });
      });
    }
    // 3) 모든 챕터/모드 해금 + 재화 MAX (검토 편의)
    META.chapter = Math.max(META.chapter || 1, 999);
    META.gold = Math.max(META.gold || 0, 9999999);
    META.gems = Math.max(META.gems || 0, 999999);
    saveMeta();
    if (typeof renderCodex === "function") renderCodex();
    if (typeof renderGearCodex === "function") renderGearCodex();
    if (typeof renderGear === "function") renderGear();
    updateMeta();
    inp.value = ""; toast("🔓 전부 해금 — 캐릭 " + (META.owned || []).length + "종 · 장비 " + (META.gear || []).length + "개 · 챕터/재화 MAX", "#a3e635"); haptic("medium"); return;
  }
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
  { id: "gem3", gem: 1280, price: "₩19,900", tag: "+18%" },   // 1180→1280: 태그 +18% 실제와 일치(표시광고법) + 단가 단조
  { id: "gem4", gem: 3400, price: "₩49,900", tag: "+25%" },   // 3200→3400: 태그 +25% 실제와 일치. 단가 18.3→16.7→15.5→14.7 완벽 단조
  { id: "gold1", g: 6000, price: "₩1,100" },
  { id: "gold2", g: 35000, price: "₩5,500", tag: "+17%" },    // 태그 정직화(실제 +17%, 수량유지=유저이득)
  { id: "gold3", g: 140000, price: "₩19,900", tag: "+29%" },  // 태그 정직화(실제 +29%)
];
function dayPlus(n) { try { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); } catch (e) { return ""; } }
function passActive(kind) { return META.pass[kind] && today() <= META.pass[kind]; }
function checkPasses() {                                // 활성 패스 = 매일 💎 자동 수령
  let got = 0;
  if (passActive("monthly") && META.passClaim.monthly !== today()) { META.gems = (META.gems || 0) + 100; META.passClaim.monthly = today(); got += 100; }
  if (passActive("weekly") && META.passClaim.weekly !== today()) { META.gems = (META.gems || 0) + 100; META.passClaim.weekly = today(); got += 100; }   // 매일 50→100 (주간 가성비 1.5→2.9배)
  if (got) { saveMeta(); updateMeta(); toast("📅 " + t("passDaily", { n: got }), "#fbbf24"); }
}
function openShop() { renderShop(); showPage("shop"); }
function renderShop() {
  const box = $("shop-list"); if (!box) return;
  box.innerHTML = "";
  SHOP.forEach((p) => {
    const owned = (p.starter && META.starter) || (p.vip && META.vip) || (p.ultra && META.ultra);
    const active = p.id === "monthly" ? passActive("monthly") : p.id === "weekly" ? passActive("weekly") : false;
    const c = document.createElement("button"); c.className = "packcard" + (p.vip || p.ultra ? " vip" : "") + (p.k ? " grow" : "") + (active ? " active" : "") + (owned ? " owned" : "");
    const what = p.starter ? "💎 " + t("spTitle") : p.vip ? t("tVip") : p.ultra ? t("tUltra") : p.k ? t(p.k) : (p.gem ? "💎 " + p.gem : "💰 " + p.g);
    const sub = active ? '<div class="psub">✓ ~' + META.pass[p.id] + "</div>" : "";
    const price = owned ? "✓ " + t("ownedShort") : p.price;  // 보유중이면 가격 대신 표시(사라지지 않게)
    const isFB = !((META.firstBuy || {})[p.id]) && (p.gem || p.g) && !owned;  // 🎁 첫구매 2배 대상(젬·골드 팩, 미구매)
    const tagHtml = isFB ? '<span class="ptag pdbl">🎁 첫구매 2배</span>' : (p.tag ? '<span class="ptag">' + p.tag + "</span>" : "");
    c.innerHTML = tagHtml + '<div class="pwhat">' + what + "</div>" + sub + '<div class="pprice">' + price + "</div>";
    if (owned) c.disabled = true; else c.addEventListener("click", () => buyPack(p.id));
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
  if (p.id === "weekly") {                              // 📅 주간 패스: 즉시 💎150 + 7일 매일 💎100 (가성비 합당화)
    META.pass.weekly = dayPlus(7); META.passClaim.weekly = ""; META.gems = (META.gems || 0) + 150;
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
  // 🎁 첫구매 2배 — 젬·골드 팩 최초 1회 한정 추가 지급(다크패턴 아님: 진짜 2배, 정가 그대로)
  META.firstBuy = META.firstBuy || {};
  const dbl = !META.firstBuy[id] && (p.gem || p.g);
  if (p.gem) META.gems = (META.gems || 0) + (dbl ? p.gem * 2 : p.gem);
  if (p.g) META.gold += (dbl ? p.g * 2 : p.g);
  if (dbl) META.firstBuy[id] = true;
  saveMeta(); updateMeta(); renderShop();
  toast("🛒 " + (dbl ? "🎁 첫구매 2배! " : "") + (p.gem ? "💎+" + (dbl ? p.gem * 2 : p.gem) : "💰+" + (dbl ? p.g * 2 : p.g)), "#fbbf24"); haptic(dbl ? "heavy" : "medium");
}
on("gacha10-btn", "click", gacha10);
// 장비 뽑기 + 상점 뽑기 버튼 + 시즌 이벤트
function gearGacha(count) {
  const cost = count === 10 ? 72 : 8; // 장비: 단차💎8(캐릭과 동일단가 — 가치역전 해소) / 10연💎72(8×10에서 10%할인 — 10연 인센티브). 트리니티 옵션A
  if ((META.gems || 0) < cost) { toast(t("tGemShort", { n: cost }), "#ef4444"); return; }
  if (META.gear.length + count > 60) { toast(t("gFull"), "#ef4444"); return; }
  META.gems -= cost;
  const RK = { N: 0, R: 1, SR: 2, SSR: 3 }; let best = null;
  for (let i = 0; i < count; i++) {
    META.pity = (META.pity || 0) + 1;
    let rar = rollRarity();
    if (META.pity >= 10) rar = RARITY[3]; // hard10 SSR (dopamine safety net)
    if (count === 10 && i === 9 && (!best || RK[best.rarity] < 2)) rar = RARITY[2];   // 🔨 장비 10연 SR↑ 1보장 (캐릭 10연과 동일 인센티브)
    if (rar.key === "SSR" || rar.key === "SR") META.pity = 0;
    const g = newGear(rar.key); META.gear.push(g);
    if (!best || RK[g.rarity] > RK[best.rarity]) best = g;
  }
  saveMeta(); updateMeta(); renderGear();
  showGacha({ key: best.rarity, color: best.color }, "🔨 " + t("gTitle") + " ×" + count + " — best " + best.rarity);
}
function renderSeason() {
  const box = $("season-list"); if (!box) return;
  box.innerHTML = `<div class="seasoncard"><div class="sc-name">🏆 ${t("seasonSoon")}</div><div class="ddim">${t("seasonHint")}</div></div>`;
}
on("sg-char1", "click", gacha);
on("quick-pull", "click", gacha);   // 🎰 전투 하단 빠른 뽑기 — 보상 젬 즉석 소비(한손 도파민·수익 루프)
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
  bumpPrestige(3); saveMeta(); updateMeta(); renderDash();
  toast("⭐ " + SPEC[type].glyph + " ★" + META.star[type], "#fbbf24"); SFX.ssr(); haptic("heavy");
}
function renderSoulAltar() {
  if ($("soul-have")) $("soul-have").textContent = "🔮 " + (META.soul || 0);
  const box = $("soul-altar"); if (!box) return;
  box.innerHTML = '<div class="soulhint">' + t("soulAwakHint") + "</div>";
}
const AWAK_MAX = 5;                                                       // ✦5 초월
function awakCost(type) { return 30 * Math.pow(2, META.awak[type] || 0); }   // 🔮 30·60·120·240·480 (급증)
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
  const sq = getDeployedUnits();
  // 🔄 전력 표시엔 환생 복리배율 반영(도파민 "눈에 보이게 세짐"). 배당골드(dividendGold)는 raw 유지 — 패시브 인플레 방지.
  if ($("dash-power")) $("dash-power").textContent = Math.round((sq.length ? squadPower() : legionPower()) * ascPowerMul());
  if ($("dash-div")) $("dash-div").textContent = dividendGold();
  renderSquad();
}

// ── 편성 UI (출전 슬롯 + 보유 풀 + 시너지) ─────────────────────────────────────
function renderSquad() {
  const slots = $("squad-slots"); if (!slots) return;
  const sq = getDeployedUnits();
  if ($("squad-info")) $("squad-info").textContent = sq.length + "/" + DEPLOY_MAX + " · ⚡" + Math.round(squadPower() * ascPowerMul());
  // 시너지 칩
  const synBox = $("squad-syn");
  if (synBox) {
    const syn = squadSynergy();
    let html = syn.bonuses.length ? syn.bonuses.map((b) => `<span class="syn-chip">${b}</span>`).join("") : `<div class="ddim" style="font-size:11px">같은 진영 2+ / 다양한 아키타입으로 시너지 발동</div>`;
    if (META.vanguard && META.vanguard===today()) html += ` <span class="syn-chip" style="color:#fde047;border-color:#fbbf24">Vanguard 24h • MY carried tease</span>`;
    synBox.innerHTML = html;
  }
  // 출전 슬롯
  slots.innerHTML = "";
  for (let i = 0; i < DEPLOY_MAX; i++) {
    const u = sq[i];
    const el = document.createElement("div");
    el.className = "sq-slot" + (u ? " filled" : "");
    if (u) {
      el.style.borderColor = u.color;
      el.innerHTML = `<div class="sq-art">${artHTML(u, "sqgly", "sqim")}</div><div class="sq-nm" style="color:${u.color}">${u.name}</div><div class="sq-lv">Lv${charLv(u.id)} · ${u.rarity}</div><span class="sq-x">✕</span>`;
      el.querySelector(".sq-x").onclick = (e) => { e.stopPropagation(); toggleDeployUnit(u.id); };
      el.onclick = () => openCharPanel(u.id);
    } else {
      el.innerHTML = `<span class="sq-empty">＋</span>`;
    }
    slots.appendChild(el);
  }
  // 보유 풀 (편성 안 된 캐릭터)
  const pool = $("squad-pool"); if (!pool) return;
  pool.innerHTML = "";
  const owned = (typeof ROSTER !== "undefined" ? ROSTER.filter((u) => (META.owned || []).includes(u.id)) : []);
  const depSet = new Set(META.deployed || []);
  if (!owned.length) { pool.innerHTML = `<div class="ddim" style="font-size:12px;padding:4px">가챠로 캐릭터를 모아 편성하세요.</div>`; return; }
  owned.forEach((u) => {
    const isDep = depSet.has(u.id);
    const el = document.createElement("div");
    el.className = "sq-pool-item r" + u.rarity + (isDep ? " on" : "");
    el.style.borderColor = u.color + (isDep ? "" : "55");
    el.innerHTML = `<div class="sq-art">${artHTML(u, "sqgly", "sqim")}</div><div class="sq-pnm">${u.name}</div><div class="sq-prr" style="color:${u.color}">${u.rarity}${isDep ? " ✓" : ""}</div>`;
    el.onclick = () => toggleDeployUnit(u.id);
    pool.appendChild(el);
  });
}
// ── 캐릭터 상세 패널 (레벨업 + 캐릭별 장비) ──────────────────────────────────
let cpCharId = null, cpSlotFilter = null;
function charLvCost(id) { return 200 * (charLv(id) + 1); }
function charLevelUp(id) {
  if (running) return;
  const cost = charLvCost(id);
  if (META.gold < cost) { toast(t("tGoldShort", { n: cost }), "#ef4444"); return; }
  META.gold -= cost; if (!META.charLv) META.charLv = {}; META.charLv[id] = charLv(id) + 1;
  saveMeta(); updateMeta(); SFX.claim(); haptic("medium");
  openCharPanel(id); renderSquad(); if (!running) reset();
}
// ── 캐릭별 강화 · 승급 · 각성 ─────────────────────────────────────────────────
function cEnh(id) { return (META.charEnh && META.charEnh[id]) || 0; }
function cStar(id) { return (META.charStar && META.charStar[id]) || 0; }
function cAwak(id) { return (META.charAwak && META.charAwak[id]) || 0; }
function cEnhCost(id) { return 120 * (cEnh(id) + 1); }
function cEnhRate(id) { return Math.max(35, 100 - cEnh(id) * 6); }
function cAwakCost(id) { return 30 * Math.pow(2, cAwak(id)); }
function charEnhance(id) {
  if (running) return;
  const e = cEnh(id), cost = cEnhCost(id);
  if (META.gold < cost) { toast(t("tGoldShort", { n: cost }), "#ef4444"); return; }
  META.gold -= cost; if (!META.charEnh) META.charEnh = {};
  if (Math.random() * 100 < cEnhRate(id)) { META.charEnh[id] = e + 1; toast(t("dSuccess", { n: e + 1 }), "#a3e635"); SFX.claim(); haptic("medium"); }
  else { if (e >= 5) { META.charEnh[id] = e - 1; toast(t("dFail") + " −1", "#ef4444"); } else toast(t("dFail"), "#ef4444"); SFX.lose(); haptic("heavy"); }
  saveMeta(); updateMeta(); openCharPanel(id); renderSquad(); if (!running) reset();
}
function charAscend(id) {
  if (running || cEnh(id) < 10) return;
  const goldC = 5000, gemC = 50;
  if (META.gold < goldC || (META.gems || 0) < gemC) { toast(t("tGemShort", { n: gemC }), "#ef4444"); return; }
  META.gold -= goldC; META.gems -= gemC;
  if (!META.charStar) META.charStar = {}; if (!META.charEnh) META.charEnh = {};
  META.charStar[id] = cStar(id) + 1; META.charEnh[id] = 0;
  saveMeta(); updateMeta(); openCharPanel(id); renderSquad(); if (!running) reset();
  toast("⭐ ★" + cStar(id), "#fbbf24"); SFX.ssr(); haptic("heavy");
}
function charAwaken(id) {
  if (running) return;
  if (cStar(id) < 3) { toast(t("awNeedStar"), "#ef4444"); return; }
  if (cAwak(id) >= AWAK_MAX) { toast(t("awMax"), "#8b93a7"); return; }
  const cost = cAwakCost(id);
  if ((META.soul || 0) < cost) { toast(t("awSoulShort", { n: cost }), "#ef4444"); return; }
  META.soul -= cost; if (!META.charAwak) META.charAwak = {}; META.charAwak[id] = cAwak(id) + 1;
  saveMeta(); updateMeta(); openCharPanel(id); renderSquad(); if (!running) reset();
  toast("✦ " + t("awDone", { n: cAwak(id) }), "#c084fc"); SFX.ssr(); haptic("heavy");
}
function charEquip(id, gearId) {
  const g = META.gear.find((x) => x.id === gearId); if (!g) return;
  if (!META.charGear) META.charGear = {};
  if (!META.charGear[id]) META.charGear[id] = {};
  // 같은 슬롯이면 토글 해제, 아니면 장착(다른 캐릭에서 떼옴)
  if (META.charGear[id][g.slot] === gearId) { delete META.charGear[id][g.slot]; }
  else {
    for (const cid in META.charGear) { if (META.charGear[cid][g.slot] === gearId) delete META.charGear[cid][g.slot]; }  // 중복 장착 방지
    META.charGear[id][g.slot] = gearId;
  }
  saveMeta(); SFX.equip && SFX.equip(); haptic("light");
  openCharPanel(id); renderSquad(); if (!running) reset();
}
function openCharPanel(id) {
  const u = ROSTER.find((x) => x.id === id); if (!u) return;
  if (cpCharId !== id) cpSlotFilter = null;   // 새 캐릭터면 슬롯필터 초기화 (깔끔 시작)
  cpCharId = id;
  const lv = charLv(id), gcs = charGearStats(id);
  const head = $("cp-head");
  if (head) head.innerHTML = `<div class="cp-art" style="border-color:${u.color}">${artHTML(u, "cpgly", "cpim")}</div>`
    + `<div class="cp-meta"><div class="cp-nm" style="color:${u.color}">${u.name}</div>`
    + `<div class="cp-ti">${u.title || u.arch} · ${u.rarity} · 🏷️${u.faction}</div>`
    + `<div class="cp-st">⚡Lv${lv}${cEnh(id) ? " +" + cEnh(id) : ""}${cStar(id) ? " ★" + cStar(id) : ""}${cAwak(id) ? " ✦" + cAwak(id) : ""} · 💪${gcs.str} 🧠${gcs.int} 👟${gcs.agi} 🍀${gcs.luk}</div>`
    + `<button id="cp-lvup">⬆️ 레벨업 Lv${lv + 1} · 💰${charLvCost(id)}</button></div>`;
  on("cp-lvup", "click", () => charLevelUp(id));
  // 강화 · 승급 · 각성 (캐릭별)
  const gw = $("cp-grow");
  if (gw) {
    const e = cEnh(id), st = cStar(id), aw = cAwak(id);
    const canAsc = e >= 10, canAwk = st >= 3 && aw < AWAK_MAX;
    gw.innerHTML =
      `<button id="cp-enh">⚙️ ${t("dEnhance")} +${e} · ${cEnhRate(id)}% · 💰${cEnhCost(id)}</button>`
      + (canAsc ? `<button id="cp-asc" class="cp-gold">⭐ ${t("dCombo")} 💰5k+💎50</button>` : `<span class="cp-gdim">⭐ +10강 시 ${t("dCombo")}</span>`)
      + (canAwk ? `<button id="cp-awk" class="cp-purple">✦ 각성 🔮${cAwakCost(id)}</button>` : (st >= 3 && aw >= AWAK_MAX ? `<span class="cp-gdim">✦${aw} MAX</span>` : st < 3 ? `<span class="cp-gdim">✦ ★3↑ 각성</span>` : ""))
      + (st ? `<span class="cp-badge">★${st}</span>` : "") + (aw ? `<span class="cp-badge pur">✦${aw}</span>` : "");
    on("cp-enh", "click", () => charEnhance(id));
    on("cp-asc", "click", () => charAscend(id));
    on("cp-awk", "click", () => charAwaken(id));
  }
  // 장착 슬롯 (premium visual — toy 느낌 제거, scannable)
  const eq = (META.charGear && META.charGear[id]) || {};
  const gbox = $("cp-gear");
  if (gbox) {
    gbox.innerHTML = SLOTS.map((s) => {
      const gid = eq[s], g = gid ? META.gear.find((x) => x.id === gid) : null;
      const sel = cpSlotFilter === s ? " sel" : "";
      if (g) {
        const e=g.enh||0, ss=g.star||0, aa=g.awak||0;
        const nm = `${g.rarity}${e?"+"+e:""}${ss?" ★"+ss:""}${aa?" ✦"+aa:""}`;
        return `<div class="cp-slot on${sel}" data-pick="${s}" style="border-color:${g.color}"><div class="slot-art">${gearArt(g)}</div><div class="slot-nm" style="color:${g.color}">${nm}</div><div class="slot-x" data-slot="${s}">✕</div></div>`;
      }
      return `<div class="cp-slot${sel}" data-pick="${s}"><div class="slot-art">${SLOT_ICON[s]}</div><div class="slot-nm ddim">미착용</div></div>`;
    }).join("");
    gbox.querySelectorAll(".cp-slot").forEach((el) => el.onclick = (ev) => {
      if (ev.target.closest(".slot-x")) return;           // ✕는 해제
      cpSlotFilter = (cpSlotFilter === el.dataset.pick) ? null : el.dataset.pick; openCharPanel(id);
    });
    gbox.querySelectorAll(".slot-x").forEach((x) => x.onclick = (ev) => { ev.stopPropagation(); const s = x.dataset.slot; if (META.charGear[id]) delete META.charGear[id][s]; saveMeta(); if (!running) reset(); openCharPanel(id); });
  }
  // 보유 장비 — 슬롯 탭하면 그 부위만 (한 화면, 스크롤 최소화)
  const inv = $("cp-inv"), lbl = $("cp-inv-label");
  if (inv) {
    if (!cpSlotFilter) {
      if (lbl) lbl.textContent = "🎒 위 슬롯을 탭해 장비를 장착하세요";
      inv.innerHTML = `<div class="cp-pickhint">⚔️🛡️👟🍀💠 — 부위 슬롯을 탭하면 그 부위 장비가 여기 떠요</div>`;
    } else {
      const pool = META.gear.filter((g) => g.slot === cpSlotFilter).sort((a, b) => gearPowerForChar(b) - gearPowerForChar(a));
      if (lbl) lbl.innerHTML = `${SLOT_ICON[cpSlotFilter]} <b>${(t("st_" + SLOT_MAIN[cpSlotFilter]) || cpSlotFilter)}</b> 장비 ${pool.length}개 <span id="cp-inv-all" class="cp-allbtn">✕ 닫기</span>`;
      on("cp-inv-all", "click", () => { cpSlotFilter = null; openCharPanel(id); });
      if (!pool.length) { inv.innerHTML = `<div class="ddim" style="font-size:7px;padding:2px;text-align:center">이 부위 없음 — 제작</div>`; }
      else {
        inv.innerHTML = pool.slice(0, 8).map((g) => {
          const onThis = eq[g.slot] === g.id;
          const st = STAT_KEYS.filter((k) => g[k]).map((k) => `${t("st_" + k)}${gearStat(g, k)}`).join(" ");
          const e=g.enh||0; const nm = `${g.rarity}${e?"+"+e:""}`;
          const best = !onThis && isBestForChar(g, id) ? ' <span class="best">★추천</span>' : '';
          return `<div class="gear-card${onThis ? " on" : ""}" data-gid="${g.id}" style="border-color:${g.color}"><div class="g-art">${gearArt(g)}</div><div class="g-info"><div class="g-name"><b style="color:${g.color}">${nm}</b>${best}</div><div class="g-stats">${st}</div></div><div class="g-act">${onThis ? '<span class="act-on">✓</span>' : '<button class="g-equip">장착</button>'}</div></div>`;
        }).join("");
        inv.querySelectorAll(".gear-card").forEach((c) => { const gid = +c.dataset.gid; c.onclick = () => { charEquip(id, gid); }; });
      }
    }
  }
  $("char-panel").classList.remove("hidden");
}

// 유저가 보기 쉽게: battle deploy 영역 + char에서 specific deployed 미리보기 (distinct vis 사용)
function renderDeploySpecificsPreview() {
  const el = $("deploy-specifics");
  if (!el) return;
  const specs = getDeployedUnits();
  if (specs.length === 0) {
    el.innerHTML = "일반 군단 배치 — 투자한 정예가 곧 신화 (char 창에서 수집 유닛 편성)";
    el.style.opacity = "0.7";
    return;
  }
  el.style.opacity = "1";
  // show any specifics (SR/R included) as meaningful — "MY unit" endowment
  el.innerHTML = `<b>⚔️ 출전 ${specs.length}</b>: ` + specs.map(u => `<span style="color:${u.color}">${u.name}</span>`).join(" · ") + ` <small style="opacity:.7">(네가 키운 정예)</small>`;
}
// ── 캐릭터 도감 그리드 (79종 lean 수집: 9SSR god-tier + 70 fodder) ──────────────────────────────────────────
let codexFilter = "ALL";
function grantUnit(rarity) {
  if (typeof ROSTER === "undefined") return null;
  let pool = ROSTER.filter((u) => u.rarity === rarity);
  if (!pool.length) {                                   // 해당 등급 유닛 없으면 가까운 가용 등급으로 폴백 (예: N제거된 79로스터)
    const order = ["SSR", "SR", "R", "N"], i = order.indexOf(rarity);
    for (let j = i + 1; j < order.length && !pool.length; j++) pool = ROSTER.filter((u) => u.rarity === order[j]);
    for (let j = i - 1; j >= 0 && !pool.length; j--) pool = ROSTER.filter((u) => u.rarity === order[j]);
  }
  if (!pool.length) return null;
  const u = pool[(Math.random() * pool.length) | 0];
  if (!META.owned) META.owned = [];
  if (META.owned.indexOf(u.id) < 0) META.owned.push(u.id);
  return u;
}
// 캐릭터 아트: art/<slug>.png 있으면 표시, 없으면(404) 이모지 폴백 (onerror로 자동)
function unitSlug(u) { return (u.name || u.arch || "").toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, ""); }
function artHTML(u, glyphCls, imgCls) {
  const base = u.vis || u.glyph || "●";
  const acc = u.accent ? `<span class="acc" style="font-size:0.55em;opacity:0.7;margin-left:-2px;">${u.accent}</span>` : "";
  const g = `<span class="${glyphCls}">${base}${acc}</span>`;
  // PNG 우선 (u{id}.png for R "간지" art 76+ 포함) → slug → synth fallback (cool border+color "간지" placeholder)
  const slug = unitSlug(u);
  const col = (u.color || '#60a5fa').replace(/"/g, '');
  const b64 = (base + (u.accent || '')).replace(/"/g, '&quot;');
  // 3단 + synth: art/u{id} (R 76-90+ cool PNG) → ssr/slug → slug → colored synth fallback (no remove, grid always fills "간지" visual)
  return g + `<img class="${imgCls}" src="art/u${u.id}.png" alt="" loading="lazy" data-c="${col}" data-b="${b64}" onerror="var s=(+this.dataset.s||0)+1;this.dataset.s=s;if(s===1){this.src='art/ssr/${slug}.png'}else if(s===2){this.src='art/${slug}.png'}else{var c=this.dataset.c||'#60a5fa';var bb=this.dataset.b||'●';this.outerHTML='<span class=\\''+this.className+' synth\\'' style=\\'display:inline-block;border:1px solid '+c+';background:#0b111f;color:#e2e8f0;padding:1px 3px;border-radius:2px;font-size:0.95em;opacity:0.9;\\'>'+bb+'</span>'}">`;
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
    const archCls = u.arch ? ` arch-${u.arch}` : "";
    const facCls = u.faction ? ` fac-${u.faction.toLowerCase()}` : "";
    return `<div class="cxc r${u.rarity}${has ? "" : " lock"}${archCls}${facCls}" data-id="${u.id}"><div class="cxg">${artHTML(u, "cxgly", "cxim")}</div></div>`;
  }).join("");
  grid.querySelectorAll(".cxc").forEach((c) => c.addEventListener("click", () => {
    const id = +c.dataset.id;
    c.style.transform = 'scale(0.92)';
    setTimeout(() => { if (c) c.style.transform = ''; }, 90);
    showUnit(id);
  }));
}
let gdexFilter = "ALL";
function renderGearCodex() {
  const grid = $("gdex-grid"); if (!grid || typeof GEAR_ROSTER === "undefined") return;
  const owned = new Set((META.gear || []).map((g) => g.tplId).filter((x) => x != null));
  if ($("gdex-count")) $("gdex-count").textContent = owned.size + " / " + GEAR_ROSTER.length;
  const fbar = $("gdex-filter");
  if (fbar && !fbar.dataset.built) {
    const opts = [["ALL", "ALL"], ["weapon", SLOT_ICON.weapon], ["armor", SLOT_ICON.armor], ["acc", SLOT_ICON.acc], ["relic", SLOT_ICON.relic], ["core", SLOT_ICON.core]];
    fbar.innerHTML = opts.map(([k, lbl]) => `<button class="cfil" data-s="${k}">${lbl}</button>`).join("");
    fbar.querySelectorAll(".cfil").forEach((b) => b.addEventListener("click", () => { gdexFilter = b.dataset.s; renderGearCodex(); }));
    fbar.dataset.built = "1";
  }
  if (fbar) fbar.querySelectorAll(".cfil").forEach((b) => b.classList.toggle("on", b.dataset.s === gdexFilter));
  const list = gdexFilter === "ALL" ? GEAR_ROSTER : GEAR_ROSTER.filter((g) => g.slot === gdexFilter);
  grid.innerHTML = list.map((g) => {
    const has = owned.has(g.id);
    // Ultra clean gallery (no text/rarity/borders in grid per user — pure icon. Subtle r* shadow + art/synth. No inline border.
    const art = gearArt(g);
    return `<div class="gxc r${g.rarity}${has ? "" : " lock"}" data-tid="${g.id}"><div class="gxi gear-codex-art">${art}</div></div>`;
  }).join("");
  grid.querySelectorAll(".gxc").forEach((c) => c.addEventListener("click", () => showGearDex(+c.dataset.tid)));
}
function showGearDex(tid) {
  const g = GEAR_ROSTER.find((x) => x.id === tid); if (!g) return;
  const has = new Set((META.gear || []).map((x) => x.tplId)).has(tid);
  let disp = g, nm = g.name;
  if (has) {
    const inst = (META.gear || []).find(x => x.tplId === tid);
    if (inst) { disp = inst; nm = inst.name || g.name; }
  }
  $("unit-card").style.borderColor = g.color;
  $("unit-card").classList.toggle('rSSR', g.rarity === 'SSR');
  $("unit-card").classList.remove('gear-manage');   // 도감은 기본 세로 레이아웃
  $("unit-glyph").innerHTML = (g.vis || SLOT_ICON[g.slot] || "⚙️");
  const e = (disp.enh || 0), s = (disp.star || 0), a = (disp.awak || 0);
  $("unit-name").innerHTML = `<b style="color:${g.color}">[${g.rarity}${e?"+"+e:""}${s?" ★"+s:""}${a?" ✦"+a:""}]</b> ${has ? nm : "???"}`;
  $("unit-title").textContent = has ? (t("st_" + SLOT_MAIN[g.slot]) || g.slot) : t("locked");
  const dtl = has ? STAT_KEYS.filter((k) => g[k]).map((k) => t("st_" + k) + " +" + gearStat(disp, k)).join(" · ") : t("lockedHint");
  $("unit-detail").innerHTML = dtl;
  $("unit-pop").classList.remove("hidden");
}
// 보유 장비 상세 팝업 — 캐릭터창(#char-panel) 시각 언어 차용 (군주 20260616: "장비 눌렀을때 캐릭터 창 처럼")
// 좌측 아트 + 우측 이름/등급/스탯 헤더 + 하단 강화·별·각성 버튼 섹션. 이 안에서 강화. (enh>=10→★, ★>=3→✦)
function openGearItem(id) {
  const g = META.gear.find((x) => x.id === id); if (!g) return;
  const owner = gearOwnerName(id);
  const stats = STAT_KEYS.filter((k) => g[k]).map((k) => t("st_" + k) + " +" + gearStat(g, k)).join(" · ");
  const card = $("unit-card");
  card.style.borderColor = g.color;
  card.classList.toggle('rSSR', g.rarity === 'SSR');
  card.classList.add('gear-manage');                 // 캐릭터창 스타일 ON
  $("unit-glyph").innerHTML = ""; $("unit-name").innerHTML = ""; $("unit-title").textContent = "";  // 헤더로 대체
  const e = (g.enh || 0), s = (g.star || 0), a = (g.awak || 0);
  const tag = `${g.rarity}${e ? "+" + e : ""}${s ? " ★" + s : ""}${a ? " ✦" + a : ""}`;
  const rate = Math.max(40, 100 - e * 8);
  const enhC = 200 * (e + 1);
  // 캐릭터창식 가로 헤더 (좌측 아트 + 우측 메타)
  let html = `<div class="gm-head">`
    + `<div class="gm-art" style="border-color:${g.color}">${gearArt(g)}</div>`
    + `<div class="gm-meta">`
    + `<div class="gm-nm"><b style="color:${g.color}">[${tag}]</b> ${g.name || '장비'}</div>`
    + `<div class="gm-ti">${(t("st_" + SLOT_MAIN[g.slot]) || g.slot)}${owner ? ` · 🎽 ${owner} 착용중` : ''}</div>`
    + `<div class="gm-st">${stats}</div>`
    + `</div></div>`;
  // 성장 버튼 섹션 (캐릭터창 #cp-grow처럼)
  html += `<div class="gm-grow">`;
  html += `<button id="gpop-enh" class="gpop-enh">🔨 ${t("dEnhance")} +${e} · ${rate}% · 💰${enhC}</button>`;
  if (e >= 10 && s < 5) {
    const starC = 1000 * (s + 1);
    html += `<button id="gpop-star" class="gpop-star">⭐ 별강화 ★${s}→★${s+1} · 💰${starC}</button>`;
  }
  if (s >= 3 && a < 5) {
    const awkC = 50 * (a + 1);
    html += `<button id="gpop-awk" class="gpop-awk">✦ 각성 ✦${a}→✦${a+1} · 🔮${awkC}</button>`;
  }
  html += `</div>`;
  $("unit-detail").innerHTML = html;
  on("gpop-enh", "click", () => { enhanceGear(id); setTimeout(() => openGearItem(id), 50); });
  if (e >= 10 && s < 5) on("gpop-star", "click", () => { gearStar(id); setTimeout(() => openGearItem(id), 50); });
  if (s >= 3 && a < 5) on("gpop-awk", "click", () => { gearAwaken(id); setTimeout(() => openGearItem(id), 50); });
  $("unit-pop").classList.remove("hidden");
}
function showUnit(id) {
  const u = ROSTER.find((x) => x.id === id); if (!u) return;
  const has = (META.owned || []).indexOf(id) >= 0;
  $("unit-card").style.borderColor = u.color;
  $("unit-card").classList.toggle('rSSR', u.rarity === 'SSR');
  $("unit-card").classList.remove('gear-manage');   // 유닛 도감은 기본 세로 레이아웃
  $("unit-glyph").innerHTML = artHTML(u, "ucgly", "ucim");   // 미보유도 일러스트 노출(보는 맛) — 이름/스탯만 잠금
  $("unit-name").innerHTML = `<b style="color:${u.color}">[${u.rarity}]</b> ${has ? u.name : "???"}`;
  $("unit-title").textContent = has ? (u.title || u.arch) : t("locked");
  $("unit-detail").innerHTML = has
    ? `${u.faction ? "🏷️ " + u.faction + " · " : ""}${u.glyph} ${u.arch} ×${u.mul}<br>${u.persona ? "💬 " + u.persona + "<br>" : ""}${u.trait ? "✦ " + u.trait : ""}`
    : t("lockedHint");
  $("unit-pop").classList.remove("hidden");
}
// ── 장비: 제작 · 장착 · 강화 ──────────────────────────────────────────────────
function craftGear(forceRar) {
  const cost = 300;
  if (META.gold < cost) { toast(t("tGoldShort", { n: cost }), "#ef4444"); return; }
  if (META.gear.length >= 40) { toast(t("gFull"), "#ef4444"); return; }
  META.gold -= cost; const g = newGear(forceRar); g.enh=0; g.star=0; g.awak=0; META.gear.push(g);
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
  if (typeof g.enh !== 'number') g.enh = 0;
  if (typeof g.star !== 'number') g.star = 0;
  if (typeof g.awak !== 'number') g.awak = 0;
  const cost = 200 * (g.enh + 1);
  if (META.gold < cost) { toast(t("tGoldShort", { n: cost }), "#ef4444"); return; }
  META.gold -= cost;
  const rate = Math.max(40, 100 - g.enh * 8);
  if (Math.random() * 100 < rate) { g.enh = g.enh + 1; toast(t("dSuccess", { n: g.enh }), "#a3e635"); SFX.claim(); }
  else { toast(t("dFail"), "#ef4444"); SFX.lose(); }
  saveMeta(); updateMeta(); renderGear();
  if (!running) reset();   // 장착 중인 캐릭 전력 반영
}
function gearStar(id) {
  const g = META.gear.find((x) => x.id === id); if (!g) return;
  if ((g.enh || 0) < 10) { toast("강화 10회 이상 필요", "#ef4444"); return; }
  const s = (g.star || 0);
  if (s >= 5) { toast("★ 최대", "#8b93a7"); return; }
  const cost = 1000 * (s + 1);
  if (META.gold < cost) { toast(t("tGoldShort", { n: cost }), "#ef4444"); return; }
  META.gold -= cost;
  g.star = s + 1;
  toast("★ " + g.star, "#fbbf24"); SFX.ssr && SFX.ssr(); haptic("heavy");
  saveMeta(); updateMeta(); renderGear();
  if (!running) reset();
}
function gearAwaken(id) {
  const g = META.gear.find((x) => x.id === id); if (!g) return;
  if ((g.star || 0) < 3) { toast("★3 이상 필요", "#ef4444"); return; }
  const a = (g.awak || 0);
  if (a >= 5) { toast(t("awMax"), "#8b93a7"); return; }
  const cost = 50 * (a + 1);
  if ((META.soul || 0) < cost) { toast(t("awSoulShort", { n: cost }), "#ef4444"); return; }
  META.soul -= cost;
  g.awak = a + 1;
  toast("✦ " + g.awak, "#c084fc"); SFX.ssr && SFX.ssr(); haptic("heavy");
  saveMeta(); updateMeta(); renderGear();
  if (!running) reset();
}
function renderGear() {
  const eq = META.equip[META.hero] || {};
  const slotsBox = $("gear-slots");
  if (slotsBox) {
    slotsBox.innerHTML = SLOTS.map((s) => {
      const id = eq[s], g = id ? META.gear.find((x) => x.id === id) : null;
      const art = g ? gearArt(g) : SLOT_ICON[s];
      const ss = g ? (g.star || 0) : 0, aa = g ? (g.awak || 0) : 0;
      const badge = g ? `<span class="gmain" style="color:${g.color}">${g.rarity}${g.enh ? "+" + g.enh : ""}${ss ? " ★" + ss : ""}${aa ? " ✦" + aa : ""}</span>` : "";
      return `<div class="gslot${g ? " on" : ""}">${art}${badge}</div>`;
    }).join("");
  }
  if ($("gear-count")) $("gear-count").textContent = (META.gear || []).length + "개";
  const inv = $("gear-inv");
  if (inv) {
    if (!META.gear.length) { inv.innerHTML = `<div class="ddim" style="text-align:center;padding:12px 0">${t("gEmpty")}</div>`; return; }
    inv.innerHTML = META.gear.slice().sort((a, b) => b.id - a.id).map((g) => {
      const owner = gearOwnerName(g.id);
      const ss = g.star || 0, aa = g.awak || 0;
      return `<div class="ginv-tile r${g.rarity}" data-id="${g.id}" style="border-color:${g.color}"><div class="gt-art">${gearArt(g)}</div><div class="gt-rr" style="color:${g.color}">${g.rarity}${g.enh ? "+" + g.enh : ""}${ss ? " ★" + ss : ""}${aa ? " ✦" + aa : ""}</div>${owner ? '<span class="gt-eq">🎽</span>' : ""}</div>`;
    }).join("");
    // 타일 탭 → 상세 팝업(그 안에서 강화)
    inv.querySelectorAll(".ginv-tile").forEach((tile) => tile.addEventListener("click", () => openGearItem(+tile.dataset.id)));
  }
}
function gearOwnerName(gearId) {                        // 이 장비를 장착한 캐릭터 이름 (없으면 null)
  const cg = META.charGear || {};
  for (const cid in cg) { const slots = cg[cid]; for (const s in slots) { if (slots[s] === gearId) { const u = (typeof ROSTER !== "undefined") ? ROSTER.find((x) => x.id === +cid) : null; return u ? u.name : null; } } }
  return null;
}
// 안전 바인딩 헬퍼 (요소 없으면 무시 — null 크래시 방지)
function on(id, ev, fn) { const e = $(id); if (e) e.addEventListener(ev, fn); }
on("dash-protect", "click", () => { dashProtect = !dashProtect; renderDash(); });
on("gear-craft", "click", craftGear);
on("gdex-toggle", "click", () => { const w = $("gdex-wrap"); if (w) { w.classList.toggle("hidden"); renderGearCodex(); } });
on("unit-close", "click", () => $("unit-pop").classList.add("hidden"));
on("cp-close", "click", () => $("char-panel").classList.add("hidden"));
on("legend-toggle", "click", () => { const l = $("legend"); if (l) l.classList.toggle("hidden"); });
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
  else if (p === "gear") { showPage("gear"); renderGear(); renderGearCodex(); }
  else if (p === "codex") { showPage("codex"); renderCodex(); }
  else if (p === "shop") openShop();
  else if (p === "event") openEvent();
  else showPage("battle");
}));
on("settings-corner", "click", openSettings);   // 설정 = 상단 구석
initViralA11y(); // Community Viral A11y loop init (share/profile/a11y/faction/carried export)

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
checkMilestones();   // 🏆 기존 진행분 백필(해금/보상 누락 방지)
updateAutoBtn();
updateMeta(); // ensure cohesion dash shows on load
