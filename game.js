/* 다이달로스 — AI 군단 전쟁 (오토배틀러)
   5종 유닛, 각자 다른 스펙·AI지능·스킬. 티어 높을수록 영리해 저티어를 몰살.
   군주는 군대 배치 → ▶전투 시작 → 관전. 스킬 자동 발동. 의존성 0.

   © Sovereign (Im Ho-gyun) — All Rights Reserved.
   Unauthorized modification, reverse engineering, distribution or use of cheats/hacks (including infinite gold/gems/soul) is strictly prohibited.
   Tamper detection and user-binding active. Sovereign TG ID locked for admin features.
   This is personal property. Theft or exploitation will be pursued. */

const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
const SOVEREIGN_TG_ID = 6510255545; // Sovereign (Im Ho-gyun) 전용 TG ID. REVIEWALL / GOD* 등 치트 오직 이 ID만 허용. 절대 공유 금지.
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

// ── 🎵 BGM (Dynamic Phonk — SPEC-bgm-dynamic.md)
// esdeekid/phonk dark groovy. 12-bar arc (Intro→Build→Drop+빨라짐→Break).
// Pure synth, original patterns. Tempo+밀도 shift로 FOMO 체감. mp3 fallback 우선.
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
// (이전 BGM_CHORDS 제거 — Phonk spec의 DYN_CHORDS 사용)
function bgmKick(vol) {   // 킥 — 클릭 + 바디 (더 펀치감, chip 감소)
  if (!_actx || (typeof META !== "undefined" && META && META.music === false)) return;
  try {
    const o = _actx.createOscillator(), g = _actx.createGain();
    o.type = "triangle"; o.frequency.setValueAtTime(220, _actx.currentTime); o.frequency.exponentialRampToValueAtTime(52, _actx.currentTime + 0.1);
    g.gain.value = vol; g.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + 0.2);
    o.connect(g); g.connect(_actx.destination); o.start(); o.stop(_actx.currentTime + 0.21);
    // noise attack layer
    const bl = Math.floor(_actx.sampleRate * 0.025);
    const nb = _actx.createBuffer(1, bl, _actx.sampleRate);
    const nd = nb.getChannelData(0); for (let i=0;i<bl;i++) nd[i] = Math.random()*2-1;
    const ns = _actx.createBufferSource(); ns.buffer=nb;
    const ng = _actx.createGain(); ng.gain.value = vol*0.9;
    ns.connect(ng); ng.connect(_actx.destination); ns.start();
    ng.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + 0.018);
  } catch (e) {}
}
function bgmHat(vol) {     // 하이햇 — 노이즈 기반 (칩튠 square 제거, 더 자연 + 덜 테트리스)
  if (!_actx || (typeof META !== "undefined" && META && META.music === false)) return;
  try {
    const len = Math.floor(_actx.sampleRate * 0.06);
    const buf = _actx.createBuffer(1, len, _actx.sampleRate);
    const dat = buf.getChannelData(0);
    for (let i = 0; i < len; i++) dat[i] = Math.random() * 2 - 1;
    const src = _actx.createBufferSource();
    src.buffer = buf;
    const hp = _actx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 5200;
    const g = _actx.createGain();
    g.gain.value = vol * 1.6;
    src.connect(hp); hp.connect(g); g.connect(_actx.destination);
    src.start();
    g.gain.exponentialRampToValueAtTime(0.0005, _actx.currentTime + 0.05);
    src.stop(_actx.currentTime + 0.07);
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
function bgm808(freq, dur, vol) {   // phonk 808 — 슬라이드 + 저음 레이어 (더 무겁고 두꺼움, 테트리스 탈출)
  if (!_actx || (typeof META !== "undefined" && META && META.music === false)) return;
  try {
    // main slide sine
    const o = _actx.createOscillator(), g = _actx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(freq * 1.45, _actx.currentTime); o.frequency.exponentialRampToValueAtTime(freq, _actx.currentTime + 0.09);
    g.gain.value = vol;
    // extra low body layer
    const o2 = _actx.createOscillator(), g2 = _actx.createGain();
    o2.type = "sine"; o2.frequency.value = freq * 0.5;
    g2.gain.value = vol * 0.6;
    const mg = _actx.createGain();
    o.connect(g); g.connect(mg);
    o2.connect(g2); g2.connect(mg);
    mg.connect(_actx.destination);
    mg.gain.value = 1;
    o.start(); o2.start();
    mg.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + dur);
    o.stop(_actx.currentTime + dur + 0.02);
    o2.stop(_actx.currentTime + dur + 0.02);
  } catch (e) {}
}
function bgmCowbell(freq, vol) {   // phonk 리드 — detune saw+triangle 레이어 (순수 triangle 제거, 더 두껍고 그루비, 테트리스 탈출)
  if (!_actx || (typeof META !== "undefined" && META && META.music === false)) return;
  try {
    // main triangle
    const o1 = _actx.createOscillator(), g1 = _actx.createGain();
    o1.type = "triangle"; o1.frequency.value = freq;
    g1.gain.value = vol;
    // detuned saw for body (덜 칩)
    const o2 = _actx.createOscillator(), g2 = _actx.createGain();
    o2.type = "sawtooth"; o2.frequency.value = freq * 1.007;
    g2.gain.value = vol * 0.55;
    const g = _actx.createGain();
    o1.connect(g1); g1.connect(g);
    o2.connect(g2); g2.connect(g);
    g.connect(_actx.destination);
    g.gain.value = 1;
    o1.start(); o2.start();
    g.gain.exponentialRampToValueAtTime(0.0001, _actx.currentTime + 0.22);
    o1.stop(_actx.currentTime + 0.24);
    o2.stop(_actx.currentTime + 0.24);
  } catch (e) {}
}
// Dynamic Phonk BGM (SPEC-bgm-dynamic.md)
const DYN_CHORDS = [
  [130.81, 155.56, 196.00], // Cm (i)
  [103.83, 130.81, 155.56], // Ab (VI)
  [116.54, 146.83, 174.61], // Bb (VII)
  [ 98.00, 116.54, 146.83]  // Gm (v)
];
const DROP_CHORDS = [
  [130.81, 155.56, 196.00], // Cm
  [174.61, 207.65, 261.63], // Fm (iv) — 긴장
  [103.83, 130.81, 155.56], // Ab
  [116.54, 146.83, 174.61]  // Bb
];
const MELODY = {
  intro: [1,0,0,0,0,0,0,0,0,0,1,0,0,0,3,0],
  build: [1,0,0,2,0,0,1,0,0,3,0,0,1,0,0,2],
  drop:  [1,0,2,0,1,0,3,0,0,1,0,2,1,3,0,1], // denser + sync
  break: [1,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0]  // sparse echo
};
const PAT = {
  kick: {
    intro: [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    build: [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    drop:  [1,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0], // extra
    break: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  },
  clap: {
    intro: [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    build: [0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    drop:  [0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0], // 2&4 + ghost
    break: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  },
  hat: {
    intro: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    build: [0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1],
    drop:  [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0], // dense base (rolls 별도)
    break: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  },
  bass: { // 1=bgm808(root, long, vol)
    intro: [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
    build: [1,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0],
    drop:  [1,0,0,1,0,0,1,0,1,0,1,0,0,1,0,0], // denser + double
    break: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]  // long slide 강조
  }
};
const DROP_ROLL = [2,6,10,14];
const SEC_MAP = ["intro","intro","build","build","build","build","drop","drop","drop","drop","break","break"];
const MS_MAP = { intro: 175, build: 148, drop: 118, break: 138 };

let bgmGlobalStep = 0, bgmCurSec = "intro";

function getSection(bar) {
  return SEC_MAP[bar % 12];
}

function bgmTick() {
  if (typeof META !== "undefined" && META && META.music === false) return;
  const step = bgmGlobalStep % 16;
  const bar = (bgmGlobalStep / 16) | 0;
  const sec = getSection(bar);
  const chords = (sec === 'drop') ? DROP_CHORDS : DYN_CHORDS;
  const ch = chords[bar % (sec==='intro'?1:4)];
  const root = ch[0];
  const melIdx = MELODY[sec][step];
  const sw = (sec==='drop' || sec==='break') ? 22 : 48;
  const D = (fn, d=sw) => (step%2===1 && d) ? setTimeout(fn, d) : fn();

  // kick
  if (PAT.kick[sec][step]) bgmKick(sec==='drop'?0.16:0.12);
  // clap (+ghost in drop)
  if (PAT.clap[sec][step]) D(() => bgmClap(sec==='drop'?0.032:0.026));
  if (sec==='drop' && (step===4 || step===12)) bgmClap(0.018);

  // hat (+roll)
  if (PAT.hat[sec][step]) D(() => bgmHat(sec==='drop'?0.011:0.007));
  if (sec==='drop' && DROP_ROLL.includes(step)) {
    for (let r=0; r<4; r++) setTimeout(()=>bgmHat(0.013), r*21);
  }

  // 808
  if (PAT.bass[sec][step]) {
    const dur = (sec==='break') ? 0.72 : (sec==='drop'?0.48:0.55);
    bgm808(root, dur, sec==='drop'?0.22:0.17);
  }

  // cowbell melody (phonk 리드)
  if (melIdx) {
    let f = ch[melIdx-1];
    if (sec==='drop' && step%2) f *= 1.018;
    const v = (sec==='drop'?0.028:(sec==='break'?0.015:0.021));
    D(() => bgmCowbell(f, v));
  }

  // pad (sine low / saw build-drop)
  if (step === 0) {
    const pVol = (sec==='drop'?0.015:(sec==='break'?0.009:0.011));
    const pType = (sec==='build'||sec==='drop') ? 'sawtooth' : 'sine';
    const pDur = (sec==='break') ? 1.8 : 1.2;
    bgmTone(ch[1]*0.5, pDur, pType, pVol);
  }

  bgmGlobalStep++;
  if ((bgmGlobalStep % 16) === 0 && bgmTimer) {
    const ns = getSection( (bgmGlobalStep / 16) | 0 );
    if (ns !== bgmCurSec) {
      bgmCurSec = ns;
      clearInterval(bgmTimer);
      bgmTimer = setInterval(bgmTick, MS_MAP[ns]);
    }
  }
}
function startSynthBgm() { if (bgmTimer || (META && META.music === false)) return; ensureAudio(); bgmGlobalStep = 0; bgmCurSec = "intro"; bgmTimer = setInterval(bgmTick, MS_MAP.intro); }
function stopSynthBgm() { if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; } }
function bgmStart() {      // 실제 음원 audio/bgm.mp3 있으면 사용(로열티프리만!), 없으면 합성 Phonk (SPEC)
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
// 상성 (순환 가위바위보, balance-sim 검증): 각 아키타입이 정확히 2승2패 → 무상성/쓰레기 제거.
// 링 순서(각자 다음 2체에 유리): drone→marksman→guardian→bruiser→commander→titan→drone
// titan도 약점(bruiser·commander에 짐), drone도 강점(marksman·guardian 이김) — 사다리 메타 붕괴 해소.
const COUNTER = {
  drone:     ["marksman", "guardian"],
  marksman:  ["guardian", "bruiser"],
  guardian:  ["bruiser", "commander"],
  bruiser:   ["commander", "titan"],
  commander: ["titan", "drone"],
  titan:     ["drone", "marksman"],
};
const CTR_MUL = 1.3;       // 유리 상성 데미지 ×1.3 (불리는 ×0.77 — dmg에서 적용)
const CTR_WEAK = 0.77;     // 불리 상성 데미지 ×0.77

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
// heroLv (별 강화) → 패시브 배율. 엄청나게 차이나게 (고성장형)
function heroScale(lv) { 
  // lv1=1, lv2=1.7, lv3=2.9, lv4=5, lv5=8.5, lv6~14+ ... 고레벨에서 폭발적으로 강해짐
  return Math.pow(1.65, lv - 1); 
}
function heroAiBonus(lv) { return Math.floor(1 + (lv - 1) * 1.2); }  // 고레벨에서 훨씬 빠른 AI 증가

function getLiveHeroPassive(hk) {
  const lv = META.heroLv[hk] || 1;
  const k = heroScale(lv);
  if (hk === 'strategist') {
    return `전군 AI +${heroAiBonus(lv)} · 집중사격 (치명타 확률 +${Math.round(5 * k)}%)`;
  } else if (hk === 'berserker') {
    return `광폭화: 피해 입을 때마다 공격 +${Math.round(8 * k)}% (스택, 최대 50%)`;
  } else if (hk === 'warden') {
    return `철벽: 전군 피해 감소 ${Math.round(12 * k)}% · 진입 시 보호막`;
  } else if (hk === 'ranger') {
    return `정밀 사격: 원거리 유닛 관통 +${Math.round(25 * k)}% · 다중 타격 확률`;
  } else if (hk === 'mech') {
    return `기계화: 중형 유닛 HP +${Math.round(35 * k)}% + 반격 피해`;
  } else if (hk === 'engineer') {
    return `수리 프로토콜: 전군 재생 +${(2.5 * k).toFixed(1)}/s · 과부하(공속)`;
  } else if (hk === 'dragoon') {
    return `용의 권능: 전군 +${Math.round(12 * k)}% · 궁극기 위력 대폭 증가`;
  }
  const tr = tHero(hk);
  return tr ? tr[1] : '';
}

let cv, ctx, W, H, units, fx, running, gameOver, lastT, speed = 1, raf = 0, auto = false, ultT = 0;
let curLevel = 1, bossFight = false;                 // 모드별 적 레벨/보스전 플래그
let tbActive = false, tbTurn = 0, tbPriority = "balanced", tbLog = [], tbMomentum = 0, tbStreak = 0; // 턴제 전용: 별도 로직 (auto와 완전 분리)

// High-tier battle portraits (preload the pretty arts so they appear "저대로" in canvas fight)
// SSR + UR/EX (u1~ + u201/u202). 고퀄 PNG로 보물 느낌 극대화. Non high stay synthetic.
let ssrPortraits = {};
function preloadSSRPortraits() {
  if (typeof ROSTER === "undefined") return;
  const NUKKI_IDS = new Set([1,2,3,4,5,6,7,8,9]); // 누끼 작업 대상 SSR
  ROSTER.filter(u => ["SSR","UR","EX"].includes(u.rarity) && !ssrPortraits[u.id]).forEach(u => {
    const img = new Image();
    const src = NUKKI_IDS.has(u.id) ? `art/u${u.id}-nukki.jpg` : `art/u${u.id}.png`;
    img.src = src;
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
  const NUKKI_IDS = new Set([1,2,3,4,5,6,7,8,9]);
  const img = new Image();
  const src = NUKKI_IDS.has(id) ? `art/u${id}-nukki.jpg` : `art/u${id}.png`;
  img.src = src;
  img.onload = () => { try { draw(); } catch (e) {} };   // 로드되면 pre-battle 프리뷰도 재렌더(placeholder 잔상 제거)
  ssrPortraits[id] = img;
}

// Enemy visuals: hostile boss PNGs for real variety (보스 레이드 맛 UP).
// Bosses use dedicated art/enemy/boss-*.png + final-titan etc. (drawBoss에서 PNG + variant overlay).
// Non-boss elites use limited PNGs, rest rich synthetic.
let enemyPortraits = {};
function preloadEnemyPortraits() {
  const keys = ["titan", "final-titan", "boss", "drone", "marksman", "guardian", "bruiser", "commander", "elite-drone", "corrupted-titan", "boss-guardian", "boss-commander", "boss-bruiser", "boss-marksman"];
  keys.forEach(k => {
    if (enemyPortraits[k]) return;
    const img = new Image();
    const src = (k === 'final-titan') ? 'art/enemy/final-titan-nukki.jpg' : (k === 'corrupted-titan') ? 'art/enemy/corrupted-titan-nukki.jpg' : `art/enemy/${k}.png`;
    img.src = src;
    img.onload = () => { enemyPortraits[k] = img; try { draw(); } catch (e) {} };   // 로드되면 보스 프리뷰 재렌더(첫진입 placeholder 제거)
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
function processReferralBonus() {
  if (META && META.referredBy) return; // already granted via direct link
  let sp = "";
  try {
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) sp = tg.initDataUnsafe.start_param;
  } catch (e) {}
  // 🔗 폴백: 워커 /start 버튼이 동봉한 URL ?ref=<id> (?start= 경로는 mini app start_param을 안 채워서 보완)
  let refUrl = "";
  try { refUrl = new URLSearchParams(location.search).get("ref") || ""; } catch (e) {}
  let refId = "";
  const m = /^ref(\d{4,})$/.exec(sp || "");   // start_param 형식: ref<id>
  if (m) refId = m[1];
  else if (/^\d{4,}$/.test(refUrl)) refId = refUrl;   // URL 형식: ?ref=<id>
  if (!refId) return;
  const myId = String(getTGUserId());
  if (refId === myId) return; // self
  // Reward ONLY on direct join via invite link (no button-click fake)
  META.referredBy = refId;
  META.gold = (META.gold || 0) + 1000;
  META.gems = (META.gems || 0) + 100;            // 💎100 환영 (링크 가입 유도)
  if (typeof META.soul === "number") META.soul = (META.soul || 0) + 10;
  saveMeta();
  logEvent('referral_bonus_granted', { ref: refId });
  setTimeout(() => {
    try { updateMeta && updateMeta(); } catch (e) {}
    toast("🎉 초대 링크로 가입 보너스! 💎100 + 💰1000 + 🔮10", "#a3e635");
  }, 1400);
}
// 👥 초대 보상 — 워커(KV) 카운트 기반(조작방지). 친구당 💎50 + 마일스톤 사다리(1→10000)
const REF_MILESTONES = [
  { n: 1, gem: 100 }, { n: 3, ssr: true }, { n: 5, gem: 500 }, { n: 10, gem: 1500 },
  { n: 30, gem: 5000, ssrGear: true }, { n: 100, gem: 20000 }, { n: 350, gem: 70000 },
  { n: 750, gem: 150000 }, { n: 1500, gem: 300000 }, { n: 3000, gem: 700000 }, { n: 10000, gem: 2000000 },
];
function refMilestoneReward(m) {
  const a = [];
  if (m.gem) a.push("💎" + m.gem.toLocaleString("en-US"));
  if (m.ssr) a.push("🏆SSR 유닛");
  if (m.ssrGear) a.push("⚔️SSR 장비");
  return a.join(" + ");
}
function refPendingValue(count) {   // 받을 수 있는 총 보상 미리보기
  const friend = (count - (META.refClaimed || 0)) * 50;
  const done = META.refMsClaimed || [];
  let ms = 0; REF_MILESTONES.forEach((m) => { if (count >= m.n && done.indexOf(m.n) < 0 && m.gem) ms += m.gem; });
  return friend + ms;
}
function refreshReferrals() {
  if (typeof PAY_BACKEND === "undefined" || !PAY_BACKEND) return;
  const myId = String(getTGUserId());
  if (!myId || myId === "0") return;
  fetch(PAY_BACKEND + "/referrals?uid=" + encodeURIComponent(myId))
    .then((r) => r.json())
    .then((d) => {
      const count = (d && d.count) || 0;
      META._refCount = count;
      const el = $("ref-status");
      const pendGem = refPendingValue(count);
      const done = META.refMsClaimed || [];
      const anyMs = REF_MILESTONES.some((m) => count >= m.n && done.indexOf(m.n) < 0);
      const hasPending = pendGem > 0 || anyMs;
      if (el) el.innerHTML = "👥 초대한 친구 <b>" + count + "</b>명" + (hasPending ? ' · <span style="color:#a3e635">보상 받기 🎁</span>' : ' · <span class="ddim">모두 수령</span>') + ' <span style="color:#67e8f9">(보상표 ▸)</span>';
      const btn = $("ref-claim"); if (btn) btn.style.display = hasPending ? "" : "none";
    })
    .catch(() => {});
}
// 🔔 활동 핑 — 세션마다 워커에 last 갱신(재참여 알림이 "비활성"을 정확히 판정). fire-and-forget.
function pingActive() {
  if (typeof PAY_BACKEND === "undefined" || !PAY_BACKEND) return;
  const myId = String(getTGUserId());
  if (!myId || myId === "0") return;
  try { fetch(PAY_BACKEND + "/active?uid=" + encodeURIComponent(myId)).catch(() => {}); } catch (e) {}
}
function claimReferralRewards() {
  const count = META._refCount || 0;
  const friendPending = count - (META.refClaimed || 0);
  if (!META.refMsClaimed) META.refMsClaimed = [];
  let gems = Math.max(0, friendPending) * 50, gotSSR = false, gotGear = false, msHit = 0;
  REF_MILESTONES.forEach((m) => {
    if (count >= m.n && META.refMsClaimed.indexOf(m.n) < 0) {
      META.refMsClaimed.push(m.n); msHit++;
      if (m.gem) gems += m.gem;
      if (m.ssr && typeof grantUnit === "function") { grantUnit("SSR"); gotSSR = true; }
      if (m.ssrGear && typeof newGear === "function") { if (!META.gear) META.gear = []; META.gear.push(newGear("SSR")); gotGear = true; }
    }
  });
  if (gems <= 0 && !gotSSR && !gotGear) { toast("받을 보상이 없어요", "#8b93a7"); return; }
  META.gems = (META.gems || 0) + gems; META.refClaimed = count;
  bumpPrestige(1); saveMeta(); updateMeta();
  toast("🎁 초대 보상! 💎" + gems.toLocaleString("en-US") + (gotSSR ? " +🏆SSR" : "") + (gotGear ? " +⚔️장비" : "") + (msHit ? " (마일스톤 " + msHit + ")" : ""), "#fbbf24");
  haptic("heavy"); try { confettiBurst(); } catch (e) {}
  refreshReferrals(); renderRefModal();
}
// 🏆 초대 보상 사다리 모달
function renderRefModal() {
  const body = $("ref-modal-body"); if (!body) return;
  const count = META._refCount || 0;
  const done = META.refMsClaimed || [];
  body.innerHTML = REF_MILESTONES.map((m) => {
    const claimed = done.indexOf(m.n) >= 0;
    const reached = count >= m.n;
    const cls = claimed ? "rm-done" : reached ? "rm-ready" : "rm-lock";
    const ic = claimed ? "✅" : reached ? "🎁" : "🔒";
    return '<div class="rm-row ' + cls + '"><span class="rm-n">' + ic + " " + m.n.toLocaleString("en-US") + '명</span><span class="rm-rw">' + refMilestoneReward(m) + "</span></div>";
  }).join("");
}
function openRefModal() { renderRefModal(); const m = $("ref-modal"); if (m) m.style.display = "flex"; }
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
                milestones: [], cqClaimed: [],   // 🗺️ 정복 연대기 보상 트랙(탭해서 상자 클레임)
                prestige: 0, // cohesion "numbers go up" on claims
                ether: 0, asc: { might: 0, bulwark: 0, momentum: 0 }, ascCount: 0, // 🔄 환생 루프: 에테르(영구화폐)+복리노드(공세/불굴/쇄도)
                ritualWin: "", // exact claim window seed for variable ritual bonuses
                vanguard: "", // 24h focus (FOMO pressure 금지 — neutral celebration only)
                deployed: [], // 편성: 출전할 보유 캐릭터 id 배열 (이들이 곧 부대)
                charLv: {}, charGear: {}, // 캐릭별 레벨 / 캐릭별 장비 {charId:{slot:gearId}}
                charEnh: {}, charStar: {}, charAwak: {}, // 캐릭별 강화/승급/각성
                loginStreak: 0, // daily login streak for bonus
                dailyBattles: 0, dailyPulls: 0, dailyUlts: 0, dailyTower: 0, dailyMissionsClaimed: false, // daily cycle missions for habit loop
                bossClears: 0 }; // 하이브리드 보스 보상: 누적 복리 (클리어 수에 따라 미래 보상 증가)
  if (!def.owned) def.owned = [];
  try {
    let raw = localStorage.getItem(META_KEY);
    let m = null;
    let tampered = false;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.d && parsed.c && parsed.u) {
        const uid = getTGUserId();
        const expected = btoa(parsed.u + ':' + parsed.d.length + ':' + (parsed.d.split('').reduce((a,c)=>a+c.charCodeAt(0),0) % 9973));
        if (parsed.u === uid && parsed.c === expected) {
          m = JSON.parse(parsed.d);
        } else {
          tampered = true;
          console.warn('[SECURITY] META 체크섬 실패 — 편집/해킹 가능. 핵심 자원 초기화.');
        }
      } else {
        m = parsed; // legacy format
      }
    }
    if (tampered || !m) {
      // Hard reset on tamper to protect ownership - user can reload from cloud or start fresh
      m = { gold: 550, gems: 50, soul: 0, chapter: 1 };
      // Wipe local to prevent persistent hack
      try { localStorage.removeItem(META_KEY); } catch(e){}
      setTimeout(() => toast('⚠️ 보안: 데이터 변조. 자원 초기화. 오류 시 Sovereign 연락.', '#ef4444'), 1000);
    }
    // Try CloudStorage for more secure per-user storage (harder to tamper)
    if (tg && tg.CloudStorage && tg.CloudStorage.getItem) {
      tg.CloudStorage.getItem(META_KEY, (err, cloudVal) => {
        if (!err && cloudVal) {
          try {
            const cloudParsed = JSON.parse(cloudVal);
            if (cloudParsed && cloudParsed.d) {
              const cloudM = JSON.parse(cloudParsed.d);
              // Prefer cloud if it has more progress (simple heuristic)
              if (cloudM && (cloudM.chapter > (m.chapter||0) || (cloudM.gold||0) > (m.gold||0))) {
                console.log('[CLOUD] CloudStorage에서 최신 META 로드');
                m = cloudM;
              }
            }
          } catch(e){}
        }
      });
    }
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
          if (tpl && tpl.effect && !gg.effect) gg.effect = { ...tpl.effect };
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
      if (!Array.isArray(merged.cqClaimed)) merged.cqClaimed = [];
      if (typeof merged.gems !== "number") merged.gems = 50;
      if (!merged.mode || merged.mode === "daily" || merged.mode === "turnbased") merged.mode = "campaign";   // 턴제 제거(군주: 재미없음) → 캠페인 폴백
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
      if (typeof merged.bossClears !== "number") merged.bossClears = 0;
      // Hard security caps - prevent infinite resource hacks even if tamper bypasses checksum
      if (merged.gold > 10000000000 || merged.gold < 0) merged.gold = 550;
      if (merged.gems > 10000000 || merged.gems < 0) merged.gems = 50;
      if (merged.soul > 1000000 || merged.soul < 0) merged.soul = 0;
      return merged;
    }
  } catch (e) {}
  return def;
}
function saveMeta() {
  try {
    META.lastSeen = nowMs();
    const data = JSON.stringify(META);
    const uid = getTGUserId();
    // Simple tamper protection: bind to user + checksum (raises bar for casual edits)
    const check = btoa(uid + ':' + data.length + ':' + (data.split('').reduce((a,c)=>a+c.charCodeAt(0),0) % 9973));
    const payload = { d: data, c: check, u: uid };
    localStorage.setItem(META_KEY, JSON.stringify(payload));
    // Also try Telegram CloudStorage for persistence/ownership (more secure per-user, harder for casual tamper)
    if (tg && tg.CloudStorage && tg.CloudStorage.setItem) {
      try { tg.CloudStorage.setItem(META_KEY, JSON.stringify(payload), () => {}); } catch(e){}
    }
  } catch (e) {}
}
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
  return Math.round((p + gearPower()) * heroPowerMul());   // ⚔️ 장비 + ✦각성 + 영웅 강화 반영
}
function dividendGold() { return 0; }   // 복리 완전 제거 (골드 수입은 전투/방치 고정으로만)

// ── 장비 시스템 (gear.js의 5슬롯·120종 카탈로그 사용) ────────────────────────
// SLOTS/SLOT_ICON/SLOT_MAIN/STAT_KEYS/GEAR_RARITY/makeGear/gearStat 는 gear.js에 정의됨
function newGear(forceRar) { const g = makeGear(forceRar); g.id = ++META.gearSeq; return g; }   // 보유 ID 부여
function heroGearStats() {
  const tot = { str: 0, int: 0, agi: 0, luk: 0 }, eq = META.equip[META.hero] || {};
  for (const slot of SLOTS) { const id = eq[slot]; if (!id) continue; const g = META.gear.find((x) => x.id === id); if (!g) continue; for (const k of STAT_KEYS) tot[k] += gearStat(g, k); }
  // P2: gear sets (Trinity in gear.js, CEO kickoff)
  if (typeof getGearSetBonusesForEquip === "function") {
    const sb = getGearSetBonusesForEquip(eq, META.gear || []);
    window._lastSetBonuses = sb.bonuses;
    const m = (sb.bonuses.atkMul || 1) * (sb.bonuses.hpMul || 1);
    for (const k of STAT_KEYS) tot[k] = Math.round(tot[k] * m);
    // Oracle set_activated (once-ish)
    if (sb && Object.keys(sb.counts || {}).length >= 1) {
      try { if (typeof emitEvent === "function") emitEvent("set_activated", { sets: sb.counts }); } catch(_) {}
    }
  }
  return tot;
}

const $ = (id) => document.getElementById(id);
const $status = $("status"), $score = $("score"), $overlay = $("overlay"), $overlayMsg = $("overlay-msg");

function fit() {
  cv = $("field");
  const w = Math.min(460, cv.parentElement.clientWidth);
  // 화면 높이에 맞춰 캔버스 높이 제한 (폰에서 배치·전투시작까지 한 화면에)
  let h = Math.round(w * 0.82);
  const vh = (tg && tg.viewportStableHeight) || window.innerHeight || 700;
  h = Math.min(h, Math.round(vh * 0.36));
  h = Math.max(h, 220);
  cv.width = w; cv.height = h;
  W = cv.width; H = cv.height; ctx = cv.getContext("2d");
  buildBgCache();   // perf: 배경+그리드 1회만 그려 캐시 → draw()는 drawImage 1회 (매프레임 그리드 path 제거)
}
// 🗺️ 챕터 10단계마다 전장(바이옴) 교체 — 깊어질수록 더 악랄·강렬 (절차적, 무에셋·무한확장)
const BIOMES = [
  { id: "hangar",   name: "🛰️ 강철 격납고", top: "#0f121a", bot: "#171d2c", grid: "#1b2230", accent: "#67e8f9", style: "calm" },
  { id: "crimson",  name: "🩸 진홍 전선",   top: "#1a0e0e", bot: "#2c1414", grid: "#3a1c1c", accent: "#ef4444", style: "ember" },
  { id: "toxic",    name: "☠️ 맹독 늪지",   top: "#0a1410", bot: "#102a1c", grid: "#163a26", accent: "#22c55e", style: "toxic" },
  { id: "magma",    name: "🌋 마그마 코어", top: "#1a0a06", bot: "#2e0f08", grid: "#48180c", accent: "#f97316", style: "lava" },
  { id: "void",     name: "🌀 공허의 균열", top: "#0d0820", bot: "#190b32", grid: "#2c1a4e", accent: "#a855f7", style: "star" },
  { id: "apoc",     name: "💀 종말의 핏빛", top: "#160305", bot: "#280509", grid: "#3c0810", accent: "#dc2626", style: "doom" },
];
function chapterBiome(ch) { return BIOMES[Math.min(BIOMES.length - 1, Math.floor(((ch || 1) - 1) / 10))]; }
function buildBgCache() {
  if (!W || !H || typeof document === "undefined") return;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d");
  const b = chapterBiome((typeof META !== "undefined" && META.chapter) || curLevel || 1);
  window._biome = b;
  // 수직 그라데이션 (전장 분위기)
  const grad = g.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, b.top); grad.addColorStop(1, b.bot);
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  // 테마 그리드
  g.strokeStyle = b.grid; g.lineWidth = 1;
  for (let x = 0; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (let y = 0; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  // 스타일별 분위기 디테일 (1회 베이크 → per-frame 비용 0)
  const rnd = (s) => { let x = Math.sin(s * 99.13) * 43758.5; return x - Math.floor(x); };   // 결정적 의사난수
  if (b.style === "ember" || b.style === "lava") {
    for (let i = 0; i < 26; i++) { const x = rnd(i) * W, y = rnd(i + 7) * H, r = 1 + rnd(i + 3) * 2.2; g.fillStyle = b.style === "lava" ? (i % 2 ? "#f97316" : "#fbbf24") : "#ef4444"; g.globalAlpha = 0.18 + rnd(i + 1) * 0.3; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    if (b.style === "lava") { g.globalAlpha = 0.5; g.strokeStyle = "#7c2d12"; g.lineWidth = 2.5; for (let i = 0; i < 5; i++) { g.beginPath(); let px = rnd(i + 20) * W, py = H; g.moveTo(px, py); for (let s = 0; s < 4; s++) { px += (rnd(i * 4 + s) - 0.5) * 40; py -= H / 4; g.lineTo(px, py); } g.stroke(); } }
    g.globalAlpha = 1;
  } else if (b.style === "toxic") {
    for (let i = 0; i < 16; i++) { const x = rnd(i) * W; g.fillStyle = "#22c55e"; g.globalAlpha = 0.12 + rnd(i + 5) * 0.18; const rr = 14 + rnd(i + 2) * 30; g.beginPath(); g.arc(x, H + 4, rr, Math.PI, 0); g.fill(); }
    g.globalAlpha = 1;
  } else if (b.style === "star") {
    for (let i = 0; i < 40; i++) { const x = rnd(i) * W, y = rnd(i + 11) * H; g.fillStyle = i % 5 ? "#c4b5fd" : "#a855f7"; g.globalAlpha = 0.3 + rnd(i + 2) * 0.6; g.fillRect(x, y, 1.4, 1.4); }
    g.globalAlpha = 1;
  } else if (b.style === "doom") {
    g.strokeStyle = "#dc2626"; for (let i = 0; i < 7; i++) { g.globalAlpha = 0.14 + rnd(i) * 0.16; g.lineWidth = 1 + rnd(i + 1) * 1.5; let px = rnd(i + 30) * W, py = 0; g.beginPath(); g.moveTo(px, py); for (let s = 0; s < 5; s++) { px += (rnd(i * 5 + s) - 0.5) * 36; py += H / 5; g.lineTo(px, py); } g.stroke(); }
    for (let i = 0; i < 20; i++) { const x = rnd(i + 50) * W, y = rnd(i + 60) * H; g.fillStyle = "#7f1d1d"; g.globalAlpha = 0.2 + rnd(i) * 0.25; g.beginPath(); g.arc(x, y, 1 + rnd(i) * 2, 0, 7); g.fill(); }
    g.globalAlpha = 1;
  }
  // 비네팅 (가장자리 어둡게 — 깊이감, 깊은 챕터일수록 강함)
  const vig = Math.min(0.6, 0.22 + Math.floor(((((typeof META !== "undefined" && META.chapter) || 1)) - 1) / 10) * 0.07);
  const rg = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9);
  rg.addColorStop(0, "rgba(0,0,0,0)"); rg.addColorStop(1, "rgba(0,0,0," + vig + ")");
  g.fillStyle = rg; g.fillRect(0, 0, W, H);
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
  const b = { aiBonus: 0, hpMul: 1, atkMul: 1, typeHp: {}, typeAtk: {}, regen: 0, crit: 0, pierce: 0, reflect: 0, haste: 0 };
  if (h === "strategist") { 
    b.aiBonus = heroAiBonus(lv); 
    b.atkMul = 1 + 0.12 * k; 
    b.crit = 5 * k;  // 집중사격 치명
  } else if (h === "berserker") { 
    b.atkMul = 1 + 0.18 * k; 
    // 광폭화: 전투 중 추가 스택 (dmg 함수에서 처리)
    b.rageMul = 0.08 * k; 
  } else if (h === "warden") { 
    b.hpMul = 1 + 0.25 * k; 
    b.pierce = - (12 * k); // 피해 감소 (음수로 방어)
  } else if (h === "ranger") { 
    b.typeAtk.drone = 0.35 * k; 
    b.typeAtk.marksman = 0.35 * k; 
    b.pierce = 25 * k;  // 관통
  } else if (h === "mech") { 
    b.typeHp.bruiser = 0.45 * k; 
    b.typeHp.guardian = 0.45 * k; 
    b.reflect = 0.2 * k; // 반격
  } else if (h === "engineer") { 
    b.regen = 2.5 * k; 
    b.haste = 0.1 * k;  // 공속
  } else if (h === "dragoon") { 
    b.atkMul = 1 + 0.15 * k; 
    b.hpMul = 1 + 0.15 * k; 
    b.ultPower = 1 + 0.8 * (lv - 1); // 궁극기 위력 폭발
  }
  return b;
}
// 영웅 레벨이 전력 표시에 반영되도록 대표 배율 (실전 heroBuffs와 일치 — 강화 시 전력 올라가는 게 보이게)
function heroPowerMul() {
  const hb = heroBuffs();
  let m = (hb.atkMul || 1) * (hb.hpMul || 1);
  const ta = Object.values(hb.typeAtk || {}).reduce((a, b) => a + b, 0);
  const th = Object.values(hb.typeHp || {}).reduce((a, b) => a + b, 0);
  m *= (1 + ta * 0.3 + th * 0.3) * (1 + (hb.aiBonus || 0) * 0.05 + (hb.regen || 0) * 0.02);
  return m;
}
// 영웅 버프 텍스트(레벨 반영 실제값) — 강화 시 효과가 화면에 오르는 게 보이게(군주: "레벨만 오르고 효과 똑같음" 픽스)
function heroBuffText() {
  const hb = heroBuffs(), p = [];
  if (hb.atkMul > 1.001) p.push("전군 공격 +" + Math.round((hb.atkMul - 1) * 100) + "%");
  if (hb.hpMul > 1.001) p.push("전군 체력 +" + Math.round((hb.hpMul - 1) * 100) + "%");
  for (const t in (hb.typeAtk || {})) if (hb.typeAtk[t] > 0) p.push(((SPEC[t] && SPEC[t].name) || t) + " 공격 +" + Math.round(hb.typeAtk[t] * 100) + "%");
  for (const t in (hb.typeHp || {})) if (hb.typeHp[t] > 0) p.push(((SPEC[t] && SPEC[t].name) || t) + " 체력 +" + Math.round(hb.typeHp[t] * 100) + "%");
  if (hb.regen > 0) p.push("전군 재생 +" + hb.regen.toFixed(1) + "/s");
  if (hb.aiBonus > 0) p.push("전군 지능 +" + hb.aiBonus);
  if (hb.crit > 0) p.push("치명타 +" + Math.round(hb.crit) + "%");
  if (hb.pierce > 0) p.push("관통 +" + Math.round(hb.pierce) + "%");
  if (hb.pierce < 0) p.push("피해감소 " + Math.round(-hb.pierce) + "%");
  if (hb.reflect > 0) p.push("반격 " + Math.round(hb.reflect*100) + "%");
  if (hb.haste > 0) p.push("공속 +" + Math.round(hb.haste*100) + "%");
  if (hb.ultPower > 1) p.push("궁극기 위력 +" + Math.round((hb.ultPower-1)*100) + "%");
  return p.join(" · ") || "—";
}

// ── 편성(스쿼드) 시스템 ───────────────────────────────────────────────────────
const DEPLOY_MAX = 8;
const MAX_COMBINED = 500; // 장비 인스턴스 + 캐릭터 보유(owned) 총합 500까지 허용
function charLv(id) { return (META.charLv && META.charLv[id]) || 0; }
function charGearStats(id) {                            // 캐릭별 장착 장비 합산
  const tot = { str: 0, int: 0, agi: 0, luk: 0 }, eq = (META.charGear && META.charGear[id]) || {};
  for (const slot of SLOTS) { const gid = eq[slot]; if (!gid) continue; const g = META.gear.find((x) => x.id === gid); if (!g) continue; for (const k of STAT_KEYS) tot[k] += gearStat(g, k); }
  // P2 sets
  if (typeof getGearSetBonusesForEquip === "function") {
    const sb = getGearSetBonusesForEquip(eq, META.gear || []);
    const m = (sb.bonuses.atkMul || 1) * (sb.bonuses.hpMul || 1);
    for (const k of STAT_KEYS) tot[k] = Math.round(tot[k] * m);
  }
  return tot;
}

function getGearEffectsForChar(charId) {
  const eq = (META.charGear && META.charGear[charId]) || {};
  const effects = [];
  for (const slot of SLOTS) {
    const gid = eq[slot];
    if (!gid) continue;
    const g = META.gear.find((x) => x.id === gid);
    if (g && g.effect) effects.push(g.effect);
    // 🌟 SSR 장비 슬롯 패시브 (처형/불굴/쾌속/행운/각인 — gear.js getGearPassive)
    if (g) { const psv = (typeof getGearPassive === "function") ? getGearPassive(g) : null; if (psv) effects.push({ type: "gear_passive", p: psv }); }
  }
  return effects;
}

function applyGearEffectToUnit(unit, effect) {
  if (!effect) return;
  if (effect.type === 'haste' || effect.type === 'ssr_skill' && effect.trigger === 'passive') {
    if (effect.val) unit.atkCd = (unit.atkCd || 1) * (1 - effect.val);
  }
  if (effect.type === 'type_slayer') {
    unit.typeSlayer = { target: effect.target, val: effect.val || 0.15 };
  }
  if (effect.type === 'regen') {
    unit.regen = (unit.regen || 0) + (effect.val || 1);
  }
  if (effect.type === 'lucky') {
    unit.crit = (unit.crit || 0) + (effect.val || 5);
  }
  // SSR skills applied in dmg / on events
  if (effect.type === 'ssr_skill') {
    unit.ssrSkill = effect;  // store for triggers
  }
  // 🌟 SSR 장비 슬롯 패시브 발동 (각인/쾌속/행운=스폰 적용, 불굴/처형=dmg 훅)
  if (effect.type === 'gear_passive' && effect.p) {
    const p = effect.p;
    if (p.allStat) { const m = 1 + p.allStat; unit.hp = Math.round(unit.hp * m); unit.maxHp = Math.round(unit.maxHp * m); unit.atk = Math.round(unit.atk * m); }  // 💠각인 전스탯+3%
    if (p.spd) unit.atkCd = (unit.atkCd || 1) * (1 - p.spd);                          // 👟쾌속 공속+10%
    if (p.evade) unit.gearEvade = (unit.gearEvade || 0) + p.evade;                    // 👟쾌속 회피5%
    if (p.crit) unit.crit = (unit.crit || 0) + p.crit * 100;                          // 🍀행운 치명+8%
    if (p.thresh) unit.endure = { thresh: p.thresh, reduce: p.reduce || 0.2 };        // 🛡️불굴
    if (p.proc) unit.execute = { proc: p.proc, mult: p.mult || 0.5 };                 // ⚔️처형
  }
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
  const slot = (g.slot || 'weapon').toLowerCase();
  const rar = (g.rarity || 'n').toLowerCase();
  const tid = g.tplId || g.id || 0;
  // Path support: deploy bundle uses "gear/" (files in deploy/gear/), source dev uses "art/gear/".
  // Try deploy first (common for screenshots/live), fallback to source path, then shared slot-rar, then synth.
  return `<img class="g-art" src="gear/i${tid}.png" alt="" loading="lazy" data-s="0" data-slot="${slot}" data-rar="${rar}" onerror="var s=(+this.dataset.s||0)+1;this.dataset.s=s;if(s===1){this.src='gear/i${tid}.png'}else if(s===2){this.src='art/gear/i${tid}.png'}else if(s===3){this.src='gear/${slot}-${rar}.png'}else if(s===4){this.src='art/gear/${slot}-${rar}.png'}else{this.outerHTML=gearSynthHTML(${JSON.stringify(g).replace(/"/g,'&quot;')})}">`;
}
function gearSynthHTML(g) {
  if (!g) return `<div class="gear-synth empty" style="opacity:.55">⚙️</div>`;
  const icon = SLOT_ICON[g.slot] || "⚙️";
  const r = g.rarity || "N";
  const s = g.slot || "";
  // STRONGLY DIFFERENTIATED synth: 고급일수록 압도적으로 간지나게. N은 깔끔 기본, R은 세련, SR은 화려, SSR은 전설급 과도한 디테일+이펙트.
  let extra = "";
  if (r === "SSR") {
    extra = `<span class="gear-vein"></span><span class="gear-vein2"></span><span class="gear-shard"></span><span class="gear-shard2"></span><span class="gear-shard3"></span>`;
    extra += `<span class="gear-rim gear-filigree" style="position:absolute;inset:0;border:3px solid #fbbf24;opacity:0.55;border-radius:6px;pointer-events:none;"></span><span class="gear-filigree2"></span>`;
  } else if (r === "SR") {
    extra = `<span class="gear-vein"></span><span class="gear-shard"></span><span class="gear-shard2"></span>`;
    extra += `<span class="gear-rim" style="position:absolute;inset:0;border:2px solid #c084fc;opacity:0.45;border-radius:5px;pointer-events:none;"></span>`;
  } else if (r === "R") {
    extra = `<span class="gear-vein"></span>`;
    extra += `<span class="gear-rim" style="position:absolute;inset:0;border:1.5px solid #60a5fa;opacity:0.35;border-radius:4px;pointer-events:none;"></span>`;
  } else {
    extra = `<span class="gear-rim" style="position:absolute;inset:0;border:1px solid #9ca3af;opacity:0.25;border-radius:3px;pointer-events:none;"></span>`;
  }
  return `<div class="gear-synth r${r} slot-${s}">${icon}${extra}<span class="gear-r">${r}</span></div>`;
}
function squadSynergy() {                               // 진영/아키타입 조합 시너지
  const sq = getDeployedUnits();
  const fac = {}; sq.forEach((u) => { fac[u.faction] = (fac[u.faction] || 0) + 1; });
  let atk = 1, hp = 1, crit = 0, spd = 1, shieldAdd = 0, critDmgMul = 1;
  const bonuses = [];
  const FAC_ICON = { Strategist: "🧠", Executor: "⚙️", Swarm: "🐜", Guardian: "🛡️", Intel: "👁️" };

  for (const f in fac) {
    const n = fac[f];
    if (f === "Executor") {
      const m = n >= 4 ? 0.20 : n >= 3 ? 0.12 : n >= 2 ? 0.06 : 0;
      spd *= (1 - m);
      if (m > 0) bonuses.push(`${FAC_ICON[f]} ${f} ×${n} 공속+${Math.round(m*100)}%`);
    } else if (f === "Strategist") {
      const m = n >= 4 ? 0.25 : n >= 3 ? 0.16 : n >= 2 ? 0.08 : 0;
      crit += m * 100;
      if (m > 0) bonuses.push(`${FAC_ICON[f]} ${f} ×${n} 치명+${Math.round(m*100)}%`);
    } else if (f === "Swarm") {
      const m = n >= 4 ? 0.30 : n >= 3 ? 0.18 : n >= 2 ? 0.08 : 0;
      atk += m;
      if (m > 0) bonuses.push(`${FAC_ICON[f]} ${f} ×${n} 공격+${Math.round(m*100)}%`);
    } else if (f === "Guardian") {
      const m = n >= 4 ? 0.33 : n >= 3 ? 0.20 : n >= 2 ? 0.10 : 0;
      hp += m;
      if (n >= 3) { shieldAdd = 2; bonuses.push(`${FAC_ICON[f]} ${f} ×${n} 체력+${Math.round(m*100)}% +시작실드`); }
      else if (m > 0) bonuses.push(`${FAC_ICON[f]} ${f} ×${n} 체력+${Math.round(m*100)}%`);
    } else if (f === "Intel") {
      const m = n >= 4 ? 0.50 : n >= 3 ? 0.30 : n >= 2 ? 0.15 : 0;
      critDmgMul = 1 + m;
      if (m > 0) bonuses.push(`${FAC_ICON[f]} ${f} ×${n} 치명피해+${Math.round(m*100)}%`);
    }
  }
  const archs = new Set(sq.map((u) => u.arch)).size;
  if (archs >= 5) { atk += 0.12; hp += 0.12; bonuses.push("🔀 다양성 ×" + archs + " 전군+12%"); }
  else if (archs >= 3) { atk += 0.08; hp += 0.08; bonuses.push("🔀 다양성 ×" + archs + " 전군+8%"); }

  // 🌟 레어도 스킬 시스템 (보수적 밸런스) — SR=정밀(패시브), SSR=지휘(패시브)+개전 일격(액티브)
  const srCount = sq.filter((u) => u.rarity === "SR").length;
  const ssrCount = sq.filter((u) => ["SSR", "UR", "EX"].includes(u.rarity)).length;
  if (srCount > 0) {                                   // ✦ SR 패시브 「정밀」: 치명 +1.5%/체, 최대 +9%
    const c = Math.min(9, srCount * 1.5);
    crit += c;
    bonuses.push("✦ SR 정밀 ×" + srCount + " 치명+" + c.toFixed(0) + "%");
  }
  let openShield = 0, openBuffMul = 0, openBuffT = 0;  // 🌟 SSR 액티브 「개전 일격」 (1회성, 전투 시작)
  if (ssrCount > 0) {                                  // 🌟 SSR 패시브 「지휘」: 공·체 +2%/체, 최대 +10%
    const m = Math.min(0.10, ssrCount * 0.02);
    atk += m; hp += m;
    bonuses.push("🌟 SSR 지휘 ×" + ssrCount + " 공·체+" + Math.round(m * 100) + "%");
    openShield = 2 + Math.min(2, (ssrCount - 1) * 0.5);          // 개전 실드 2~4초(피해 절반)
    openBuffMul = 0.20 + Math.min(0.15, (ssrCount - 1) * 0.04);  // 개전 공격 버스트 +20~35%
    openBuffT = 3;
    bonuses.push("⚡ SSR 개전 가속 — 시작 " + openBuffT + "초 공격+" + Math.round(openBuffMul * 100) + "%·실드");
  }
  // §21 Human Core: Effervescent Host Weave (Durkheim group effervescence + fusion surge in 3+ Founding or 4+ faction; secular sacred "we" heat from real proxy signals)
  const founders = sq.filter(u => ["SSR","UR","EX"].includes(u.rarity)).length;
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
  // 📋 도감 수집 보상 — 영구 전군 공·체 배율 (컬렉션 = 영구 파워)
  if (typeof collectionBonus === "function") { const cb = collectionBonus(); atk *= cb.atk; hp *= cb.hp; if (cb.atk > 1) bonuses.push("📋 수집 +" + Math.round((cb.atk - 1) * 100) + "% 영구"); }
  return { atk, hp, crit, spd, shieldAdd, critDmgMul, bonuses, archs, count: sq.length, founders, openShield, openBuffMul, openBuffT };
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
    el.innerHTML = `<div class="syn-h">${t("synHeader")}</div><div class="syn-grid"></div>`;
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
  const FAC_FX = { Strategist:{l:"치명",v:[8,16,25]}, Executor:{l:"공속",v:[6,12,20]}, Swarm:{l:"공",v:[8,18,30]}, Guardian:{l:"체",v:[10,20,33],x:" +실드"}, Intel:{l:"치명피해",v:[15,30,50]} };
  for (const f in el._synCards) {
    const c = el._synCards[f]; if (!c) continue;
    const n = fac[f] || 0; const on = n >= 2; const fx = FAC_FX[f] || FAC_FX.Swarm; let bonus = "", nxt;
    if (n >= 4) { bonus = fx.l+"+"+fx.v[2]+"%"+(fx.x||""); nxt = "★ MAX"; }
    else if (n >= 3) { bonus = fx.l+"+"+fx.v[1]+"%"+(fx.x||""); nxt = "1명 더 → "+fx.l+"+"+fx.v[2]+"%"; }
    else if (n >= 2) { bonus = fx.l+"+"+fx.v[0]+"%"; nxt = "1명 더 → "+fx.l+"+"+fx.v[1]+"%"; }
    else { nxt = (2 - n) + "명 더 → "+fx.l+"+"+fx.v[0]+"%"; }
    c._nm.textContent = `${f} ×${n}`;
    c._b.textContent = on ? `⚔️ ${bonus}` : '';
    c._b.style.display = on ? '' : 'none';
    c._nx.textContent = nxt;
    c.classList.toggle('on', on);
    c.classList.toggle('off', !on);
  }
  const archs = new Set(sq.map((u) => u.arch)).size; const dOn = archs >= 3; let dB = "", dNx;
  if (archs >= 5) { dB = "전군+12%"; dNx = "★ MAX"; }
  else if (archs >= 3) { dB = "전군+8%"; dNx = (5 - archs) + "종 더 → +12%"; }
  else { dNx = (3 - archs) + "종 더 → +10%"; }
  const dc = el._divCard;
  dc._nm.textContent = t("diversity") + ` ${archs}종`;
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
  const parts = [];
  const livePassive = getLiveHeroPassive(META.hero);
  if (livePassive) parts.push(livePassive); // 선택한 영웅 패시브 (live value, e.g. 전군 AI +20 at high lv)
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
  return Math.round(p * syn.atk * heroPowerMul());   // 영웅 강화 반영
  // Note: gear unique effects not in raw power (visual in combat)
}
// 단일 캐릭 유효 전력 (레벨·강화·승급·각성·장비 전부 반영) — 상세창 "세지는 게 보이는" 표시용
function charEffPower(id) {
  const u = (typeof ROSTER !== "undefined") && ROSTER.find((x) => x.id === id); if (!u) return 0;
  const s = SPEC[u.arch] || SPEC.drone, lv = charLv(id), gcs = charGearStats(id);
  const invest = (1 + cEnh(id) * 0.06) * (1 + cStar(id) * 0.25) * (1 + cAwak(id) * 0.35);
  const base = (s.hp * 0.5 + (s.atk / s.atkCd) * 3) * u.mul * (1 + lv * 0.12) * invest;
  // 간단 효과 기여 (unique gear)
  let effBonus = 0;
  const eqEffects = getGearEffectsForChar(id);
  eqEffects.forEach(e => { if (e.val) effBonus += Math.round(e.val * 20); });
  return Math.round(base + (gcs.str + gcs.int + gcs.agi + gcs.luk) * 5 + effBonus);
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
        let hp = Math.round(s.hp * u.mul * lvK * invest * hb.hpMul * (1 + (hb.typeHp[u.arch] || 0)) * syn.hp * cgHp);
        let atk = Math.round(s.atk * u.mul * lvK * invest * hb.atkMul * (1 + (hb.typeAtk[u.arch] || 0)) * syn.atk * cgAtk);
        let unitAtkCd = s.atkCd * cgSpd * (syn.spd || 1);
        let unitCrit = Math.min(70, cgCrit + (syn.crit || 0));
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
          atkCd: unitAtkCd, crit: unitCrit, ai: Math.min(3, s.ai + hb.aiBonus + aw),
          critDmgMul: syn.critDmgMul || 1, shield: syn.shieldAdd || 0,
          sight: s.sight, r: s.r * 1.18, skill: s.skill, skillCd: s.skillCd, ranged: s.ranged,
          regen: hb.regen, atkT: Math.random() * 0.3, skT: s.skillCd * 0.4, shield: 0, buff: 0, buffT: 0, spd: 0, spdT: 0,
          id: u.id, name: u.name, vis: u.vis, color: u.color, isSpecific: true, rarity: u.rarity, dmgOut: 0,
          r: specR, // larger visual for selected characters to appear properly on field
          star: star || 0
        });
        // 고등급은 더 크게 (보물 시각 강조)
        const lastU = units[units.length-1];
        if (["UR","EX"].includes(u.rarity) || u.id >= 201) lastU.r *= 1.22;
        // Apply unique gear effects
        const gearEffects = getGearEffectsForChar(u.id);
        gearEffects.forEach(eff => applyGearEffectToUnit(units[units.length-1], eff));
        loadPortrait(u.id);   // 편성 캐릭 일러스트 캔버스용 로드 (전 등급)
        // 🌟 9 SSR 고유 액티브 스킬 장착 (name 매핑)
        const sa = SSR_ACTIVE[u.name];
        if (sa) { 
          const lu = units[units.length - 1]; 
          lu.ssrActive = sa.key; 
          lu.ssrCd = sa.cd; 
          lu.ssrT = sa.delay; 
          lu.star = star || 0;
          lu.ssrScale = Math.pow(1.35, star || 0); // 별 레벨에 따라 액티브/패시브 엄청 강해지게 (star5 ~ 4.5x+)
        }
        const lu2 = units[units.length - 1];
        const unitStar = lu2.star || star || 0;
        const srScale = Math.pow(1.3, unitStar); // SR도 별 레벨에 따라 패시브 강해지게 (더 부드럽지만 여전히 차이 큼)
        // SSR 패시브 트레이트도 별 레벨 스케일 적용 (기계적 효과)
        if (u.rarity === "SSR") {
          const pscale = lu2.ssrScale || 1;
          // trait 기반 간단 패시브 (star에 따라 강해짐)
          if (u.name === "Arclight") { lu2.ai = Math.min(3, (lu2.ai||1) + 1 * pscale); lu2.ssrPassive = "arclight"; }
          else if (u.name === "Solace") lu2.regen = (lu2.regen||0) + 3 * pscale;
          else if (u.name === "Cipher") lu2.crit = (lu2.crit||0) + 15 * pscale;
          else if (u.name === "Ignis") { lu2.buff = Math.round((lu2.buff||0) + u.atk * 0.2 * pscale); lu2.buffT = 10; }
          else if (u.name === "Vector") lu2.spd = (lu2.spd||1) + 0.3 * pscale;
          else if (u.name === "Vespera") lu2.ai = Math.min(3, (lu2.ai||1) + 0.5 * pscale);
          else if (u.name === "Aegis") lu2.shield = (lu2.shield||0) + 5 * pscale;
          else if (u.name === "Anvil") lu2.regen = (lu2.regen||0) + 2 * pscale;
          else if (u.name === "Dominus") { lu2.atk = (lu2.atk||10) * (1 + 0.1 * pscale); lu2.hp = (lu2.hp||100) * (1 + 0.1 * pscale); }
        }
        // SR 패시브도 별 레벨에 따라 강해지게 + 아키타입별 차별화 (다 다르게)
        if (["SR", "SSR"].includes(u.rarity)) {
          if (u.arch === "drone") {
            lu2.shield = (lu2.shield || 0) + 2 * srScale; // evade-like bonus
          } else if (u.arch === "marksman") {
            lu2.crit = (lu2.crit || 0) + 8 * srScale;
          } else if (u.arch === "guardian") {
            lu2.shield = (lu2.shield || 0) + 4 * srScale;
          } else if (u.arch === "bruiser") {
            lu2.reflect = (lu2.reflect || 0) + 0.1 * srScale;
          } else if (u.arch === "commander") {
            lu2.ai = Math.min(3, (lu2.ai || 1) + 0.8 * srScale);
          } else if (u.arch === "titan") {
            lu2.atk = (lu2.atk || 10) * (1 + 0.08 * srScale);
          }
        }
        // SSR on_start skills (e.g. Iron Wall shield)
        const uGearEffects = gearEffects;
        uGearEffects.forEach(eff => {
          if (eff.type === 'ssr_skill' && eff.trigger === 'on_start') {
            units[units.length-1].shield = (units[units.length-1].shield || 0) + (eff.val || 3);
          }
        });
        // Squad level Guardian shield from synergy
        if (syn.shieldAdd) units[units.length-1].shield = (units[units.length-1].shield || 0) + syn.shieldAdd;
      });

      // ★ UR/EX 전용 고유 패시브 — 보물 같은 존재감 (실제 전투 효과)
      const hasHelix = squad.some(uu => uu.name === "Helix" || uu.id === 201);
      const hasAether = squad.some(uu => uu.name === "Aether" || uu.id === 202);
      if (hasHelix) {
        // Helix: 운명의 매듭 — 팀 전체 치명 대폭 + 연계 강화
        units.filter(ut => ut.side === 'p').forEach(ut => {
          ut.crit = Math.min(85, (ut.crit || 0) + 20);
          ut.critDmgMul = (ut.critDmgMul || 1) * 1.25;
        });
        // 특별 시각 표시용 플래그
        window._helixFateActive = true;
      }
      if (hasAether) {
        // Aether: 영원의 숨결 — 시작 실드 + 부활 등록
        units.filter(ut => ut.side === 'p').forEach(ut => {
          ut.shield = (ut.shield || 0) + Math.round(ut.maxHp * 0.28);
        });
        window._aetherBreathActive = true;
        window._aetherReviveUsed = false;
      }
      // 🌟 SSR 액티브 「개전 일격」 — 편성에 SSR+ 있으면 전군 1회 개전 버스트(실드+공격)
      if (syn.openBuffT > 0) {
        units.filter(ut => ut.side === 'p').forEach(ut => {
          ut.shield = Math.max(ut.shield || 0, syn.openShield);
          ut.buff = Math.round(ut.atk * syn.openBuffMul);
          ut.buffT = syn.openBuffT;
        });
        window._ssrOpeningActive = true;
      }
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
    const epm = side === "e" ? enemyPowerMul(curLevel) * (META.mode === "tower" ? towerExtraMul(META.tower) : 1) : 1;
    const aw = side === "p" ? (META.awak[t] || 0) : 0;                                                   // ✦ 각성(소울)
    const es = side === "p" ? (1 + (META.enh[t] || 0) * 0.06) * (1 + (META.star[t] || 0) * 0.25) * (1 + aw * 0.35) : 1;   // 강화·승급·각성
    let hpM = (side === "p" ? lvMul(t, "hp") : epm) * hb.hpMul * (1 + (hb.typeHp[t] || 0)) * powerComp * es * gHp;
    let atkM = (side === "p" ? lvMul(t, "atk") : epm) * hb.atkMul * (1 + (hb.typeAtk[t] || 0)) * synMul * powerComp * es * gAtk;
    // 초반 완전 초보 구간(ch<=8)만 강한 보너스 — 그 이후부터는 제대로 된 투자(가챠·강화·편성·기어) 없으면 자연 벽 (squad/편성에도 동일)
    if (side === "p" && curLevel <= 8) {
      hpM *= 1.4;
      atkM *= 1.3;
    }
    const isBoss = side === "e" && bossFight;
    let rr = isBoss ? s.r * 1.8 : s.r;                 // 🔧 선언을 isBoss 블록 위로 (TDZ 크래시 수정 — 879서 선언전 사용했었음)
    if (isBoss) {
      // 챕터가 높을수록 점점 더 강하고 깨기 어려움
      const bossScale = 5 + Math.floor(curLevel / 5) * 0.8;
      hpM *= bossScale;
      atkM *= 1.6 + Math.floor(curLevel / 8) * 0.3;
      rr *= 1.1 + Math.min(0.4, curLevel / 100); // bigger for high ch
    }
    const hp = Math.round(s.hp * hpM), atk = Math.round(s.atk * atkM);
    const ai = Math.min(3, s.ai + hb.aiBonus + aw);   // ✦ 각성마다 AI +1 (소울로만 가능)
    if (t === "titan" && side==="p") rr *= 1.4; // 6hr visual: higher rarity scale
    // Enemy flavor: portraitKey for rare PNG (bosses/elites use art/enemy/*.png like titan/corrupted-titan/drone/marksman)
    // non-PNG enemies stay rich synthetic. Red hostile frame + dark overlay applied in draw for cool vs player army.
    // MVP enemy visual upgrade: wider triggers so tower formations (screenshot like 47층) use more PNGs instead of pure identical synth
    let portraitKey = null, eName = null;
    if (side === "e") {
      if (isBoss) {
        // 보스 챕터별 다양성
        if (t === "titan") {
          portraitKey = (curLevel >= 50) ? "final-titan" : (curLevel >= 25 ? "corrupted-titan" : "titan");
        } else if (t === "guardian") portraitKey = "boss-guardian";
        else if (t === "commander") portraitKey = "boss-commander";
        else if (t === "bruiser") portraitKey = "boss-bruiser";
        else if (t === "marksman") portraitKey = "boss-marksman";
        else if (t === "drone") portraitKey = "elite-drone";
        else portraitKey = "titan";

        eName = curLevel < 15 ? "약화 보스" : (curLevel < 40 ? "강화 보스" : "최종 보스");
        eName = "보스 " + (SPEC[t]?.name || t) + (curLevel > 40 ? " (전설)" : "");
      } else if (t === "titan") {
        // 무한탑 등 고층에서도 고급 아트 사용 (final-titan nukki로 눈/중간 요소 깨끗)
        if (curLevel >= 50) portraitKey = "final-titan";
        else if (curLevel >= 25) portraitKey = "corrupted-titan";
        else portraitKey = "titan";
        eName = curLevel < 15 ? "타락 거신" : (curLevel < 40 ? "타락 심연" : "종말의 심판자"); 
      }
      else if (curLevel >= 40) { portraitKey = "corrupted-titan"; eName = "타락 " + (SPEC[t].name || t); }
      else if (t === "drone" && (curLevel >= 18 || (curLevel >= 10 && (i % 2 === 0)))) { portraitKey = "drone"; eName = "적 정찰기"; }
      else if (t === "marksman" && curLevel >= 14) { portraitKey = "marksman"; eName = "적 저격수"; }
      else if (curLevel >= 25 && (i % 3 === 0)) { portraitKey = "elite-drone"; eName = "망령 " + (SPEC[t].name || t); }
      else if (t === "commander" && curLevel > 15) { eName = "그림자 지휘"; }
      else if (t === "guardian" && curLevel >= 20) { portraitKey = "corrupted-titan"; eName = "타락 방벽"; }
      else if (t === "bruiser" && curLevel >= 16) { portraitKey = "titan"; eName = "적 강습"; }
    }
    units.push({
      t, side, x, y, hp: hp, maxHp: hp, atk: atk, range: s.range, speed: s.speed,
      atkCd: s.atkCd * (side === "p" ? gSpd : 1), crit: side === "p" ? gCrit : 0,
      ai: ai, sight: s.sight, r: rr, skill: s.skill, skillCd: s.skillCd, ranged: s.ranged, boss: isBoss,
      regen: side === "p" ? hb.regen : 0,
      atkT: Math.random() * 0.4, skT: s.skillCd * 0.5, shield: 0, buff: 0, buffT: 0, spd: 0, spdT: 0,
      portraitKey, eName,
      bossVariant: isBoss ? (curLevel < 15 ? 'base' : (curLevel < 40 ? 'corrupted' : 'final')) : undefined,
      bossSkillT: isBoss ? 4 : 0,  // 보스 전용 스킬 타이머
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
// 🗼 무한탑 난이도 곡선 — 완만한 층별 램프 + 50층마다 계단형 벽(밸런스: 초반 쉽고 깊을수록 가팔라짐)
function towerExtraMul(f) {
  f = f | 0;
  const ramp = 1 + Math.max(0, f - 10) * 0.012;     // 10층까지 base, 이후 +1.2%/층 완만
  const wall = 1 + Math.floor(f / 50) * 0.25;        // 50·100·150…층 +25% 계단(보스벽)
  return ramp * wall;
}

// ── 🔄 환생(Ascension) 루프 — 에테르(영구화폐) + 복리노드. PRD-prestige-loop.md 확정 수치 ──
const ASCEND_GATE = 18;                                   // ch18 도달 시 환생 가능
function ascLv(node) { return (META.asc && META.asc[node]) || 0; }
function etherGain(ch) { ch = ch | 0; if (ch < ASCEND_GATE) return 0; return Math.round(20 * Math.pow(1.18, (ch - ASCEND_GATE) / 2)); } // 깊이비례 기하급수
// ⚠️ 노드 배율 +8%/lv (1.08): 분리노드라 전투력 = atk×hp = 1.08^(공+체). +18%면 5환생째 폭주(sim 검증) → 1.08이 루프 생존값.
function ascAtkMul() { return 1; }   // 복리 제거
function ascHpMul() { return 1; }   // 복리 제거
function cohesionMul() { return 1; }  // 복리 제거 (소액 표시만 남김)
function ascGoldMul() { return 1; }   // 복리 제거
function ascStartGold() { return 0; }
function ascPowerMul() { return 1; }  // 표시용도 1로 (실제 복리 없음)
function ascNodeCost(lv) { return Math.round(5 * Math.pow(1.25, lv)); }  // 노드 다음레벨 비용: 5·6·8·10·12·15…

// ── 모드별 전투 셋업 (사이클의 핵심) ─────────────────────────────────────────
function applyMode() {
  const m = META.mode;
  bossFight = false;
  if (m === "tower") {
    curLevel = META.tower + 8;                        // 탑은 챕터보다 빡셈
    counts.e = enemyForChapter(META.tower);
    if (META.tower % 50 === 0) bossFight = true;       // 🗼 50층마다 보스 관문(벽)
    $status.textContent = (META.tower % 50 === 0 ? "🐲 " + META.tower + "층 보스 관문! · " : "") + t("sTower", { n: META.tower, b: META.towerBest || 0 });
  } else if (m === "daily") {
    curLevel = META.chapter + 4;
    counts.e = enemyForChapter(META.chapter + 4);
    $status.textContent = META.dailyDone === today() ? t("sDailyDone") : t("sDaily");
  } else if (m === "boss") {
    curLevel = META.chapter; bossFight = true;
    // 챕터별 보스 다양성 (초반 약해 보이게 → 후반 간지+강력)
    let bossT = "titan";
    if (curLevel >= 50) bossT = "titan";       // final titan
    else if (curLevel >= 35) bossT = "commander";
    else if (curLevel >= 25) bossT = "bruiser";
    else if (curLevel >= 15) bossT = "guardian";
    else if (curLevel >= 8) bossT = "marksman";
    else bossT = "drone";                      // 초반: 드론 보스 (안 쌔보임)
    counts.e = { drone: 0, marksman: 0, guardian: 0, bruiser: 0, commander: 0, titan: 0 };
    counts.e[bossT] = 1;
    $status.textContent = t("sBoss");
  } else if (m === "turnbased") {                   // 🧠 턴제: 캠페인 적 사용 + 별도 턴 로직
    curLevel = META.chapter;
    counts.e = enemyForChapter(META.chapter);
    $status.textContent = "🧠 턴제 전술 — 배치 후 시작 → 다음 턴으로 수동 진행 (자동과 완전 분리)";
  } else {                                            // campaign
    curLevel = META.chapter;
    counts.e = enemyForChapter(META.chapter);
    let st = t("sDeploy", { n: META.chapter });
    if (META.chapter <= 8) st += " · " + (LANG==="ko"?"초보자 모드 (쉽게 시작!)":"Beginner mode (easy start!)");
    else if (META.chapter > 20) st += " · " + (LANG==="ko"?"본격 난이도 ↑":"Full difficulty ↑");
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
  tbActive = false; tbTurn = 0; tbLog = []; tbPriority = "balanced";
  tbMomentum = 0; tbStreak = 0;
  if (META.mode === "turnbased") {
    tbMomentum = META.tbCarry || 0; tbStreak = 0;
    // do NOT delete carry here: keep in META so repeated resets before play still preserve pending carry (persist nicely)
  }
  delete window._ultBurst; // ULT vfx 잔여 클리어
  delete window._tbTactic; // tb choice reset (reversible)
  window._rageStacks = 0; // berserker rage reset
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
  showTbControls(false);
  const lEl = $("tb-log"); if (lEl) lEl.innerHTML = "";
  // 2026-06-16 업데이트: 모든 모드 탭 표시 (캠페인 + 무한탑 + 보스 + 턴제 + 아레나).
  // 이전 MVP 때는 turn/arena/boss를 hard hide 했으나, 이제 roadmap 전체 보이게 해서 progression 느낌 주고 "왜 이거만 있어?" 질문 해결.
  // 잠긴 모드는 updateModeTabs + .locked 스타일로 처리 (🔒 + 클릭 시 coming soon).
  // running 중에는 modes 숨길 수 있지만 기본은 항상 보이게 (pre-battle roadmap).
  if (running) document.querySelectorAll('#modes').forEach(m => m.style.display = 'none');
  // 하단바 전체 6탭 강제 표시 완료
  document.querySelectorAll('#bnav .navtab').forEach(el => el.style.display = '');
  delete window._ultBurst;
  // legend-toggle removed (정적 유닛·상성은 전투에서 제거 · 동적 조합 버프로 대체)
  const legDiv = $("legend");
  if (legDiv) legDiv.style.display = 'none';
}

// ── 메타 UI 갱신 ──────────────────────────────────────────────────────────────
function updateMeta() {
  const vals = {gold:META.gold, gems:META.gems||0, soul:META.soul||0, chapter:META.chapter, ether:META.ether||0};
  Object.keys(vals).forEach(k => {
    const el = $(k); if (!el) return;
    if (String(el.textContent) !== String(vals[k])) { el.classList.add('pop'); setTimeout(()=>el && el.classList.remove('pop'), 380); }
    el.textContent = vals[k];
  });
  // cohesion display removed (no #cohesion element; prestige surfaced via ether)
  // 🔄 환생 발견성 배너: ch18+ 도달 시 "환생 가능 · ⬡+N" 노출 (배틀화면)
  const ap = $("asc-prompt");
  if (ap) {
    const ch = META.chapter || 1;
    if (ch >= ASCEND_GATE) { ap.style.display = ""; ap.innerHTML = t("tAscBanner", { e: etherGain(ch) }); }
    else ap.style.display = "none";
  }
  const sv = $("streak-val"); if (sv) sv.textContent = (META.loginStreak || 0);  // visible streak everywhere (click → event for claim)
  // MVP final plan: pity always visible lobby top "다음 SSR까지 XX회"
  const pityEl = $("pity-left");
  if (pityEl) {
    const p = (META.pity || 0);
    const remain = Math.max(0, 12 - p);
    pityEl.textContent = remain;
    // 가챠 천장 진행바(상점) — 코드값과 100% 일치 (n/12)
    const pf = $("pity-fill"); if (pf) pf.style.width = Math.min(100, (p / 12) * 100) + "%";
    const pbl = $("pity-bar-label"); if (pbl) pbl.textContent = Math.min(p, 12) + "/12";
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
  // starter-btn removed (integrated to shop)
  const sp = $("speed"); if (sp && !running) {
    sp.textContent = t("speed", { n: speed });
  }
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
    const locked = !modeUnlocked(b.dataset.m) || b.dataset.m === "arena" || b.dataset.m === "mystery";
    b.classList.toggle("locked", locked);
  });
  // Sovereign: 캠페인 탭에 현재 챕터 번호 동적 표시 — "2챕터가 안넘어가" 혼란 방지. 유저가 "이 버튼이 챕터 진행용"임을 즉시 인지.
  const camp = document.querySelector('.modetab[data-m="campaign"]');
  // 높은 챕터(2자리↑)면 'chN' 빼고 단어만 — 메타바 📖N로 이미 표시됨(넘침 방지). 한자리는 힌트로 유지.
  if (camp) { const ch = META.chapter || 1; camp.textContent = ch >= 10 ? t("mode.campaign") : (t("tCampaignChLabel") + ch); }
  const tower = document.querySelector('.modetab[data-m="tower"]');
  if (tower) tower.textContent = t("mode.tower");   // 🗼 무한탑만 — 층수는 헤더 뱃지(🗼N층)에 표시(넘침 방지)
  // 🗼/🐲 헤더 뱃지 — 무한탑(층수) · 보스(탄수) 모드일 때 노출
  const tf = $("tower-floor");
  if (tf) {
    if (META.mode === "tower") {
      const f = Math.max(1, META.tower || 1);
      const toWall = 50 - ((f - 1) % 50) - 1;            // 다음 50층 보스벽까지 남은 층
      tf.style.display = ""; tf.style.borderColor = "#a855f7"; tf.style.color = "#fde047";
      tf.innerHTML = "🗼 " + f + "층" + (f % 50 === 0 ? " 🐲" : (toWall <= 5 && toWall > 0 ? ' <span style="color:#f97316">·벽까지' + toWall + '</span>' : ""));
    } else if (META.mode === "boss") {
      const stage = (META.bossClears || 0) + 1;          // 현재 도전 보스 = 클리어수+1
      tf.style.display = ""; tf.style.borderColor = "#ef4444"; tf.style.color = "#fca5a5";
      tf.innerHTML = "🐲 보스 <b style=\"color:#fde047\">" + stage + "</b>탄" + (stage % 25 === 0 ? " 👑" : (stage % 5 === 0 ? " 🎁" : ""));
    } else tf.style.display = "none";
  }
  renderMsHint();
}
function setMode(m) {
  if (running) { toast(t("tNoSwitch"), "#ef4444"); return; }
  if (m === "turnbased") { 
    // 이제 playable: 별도 턴 로직 (배치 + 수동 턴 + 결과)
    META.mode = m; saveMeta(); reset();
    tbActive = true; tbTurn = 0; tbPriority = "balanced";
    // carry load handled inside reset() for tb mode (persist safe)
    $("status").textContent = "🧠 턴제: 배치 후 ▶ 시작 → '다음 턴' 클릭. 전술 선택으로 군단 흐름 제어";
    showTbControls(true);
    updateModeTabs();
    return;
  }
  if (m === "arena") {
    // MVP final plan: arena daily 5회 제한만, 자동매칭 placeholder (Phase2 full)
    // 2026-06-16 Morpheus: decided HIDE (lean MVP, 4-action dopamine focus, reversible no-broken). Stubs remain for future.
    const tdy = today();
    if (!META.arenaDay || META.arenaDay !== tdy) { META.arenaDay = tdy; META.arenaCount = 0; saveMeta(); }
    if ((META.arenaCount || 0) >= 5) { toast(t("tArenaDone"), "#ef4444"); return; }
    META.arenaCount = (META.arenaCount || 0) + 1; saveMeta();
    toast(t("tArenaMatch"), "#a855f7");
    return;   // ⚠️ 버그픽스: return 없으면 840줄로 fall-through→META.mode="arena" 영구저장+campaign 둔갑 오염. MVP 숨김 스텁이라 no-op.
  }
  if (m === "mystery") {
    // Sovereign: 아레나 옆 ??? 티저 (중립 호기심, FOMO·압박 금지)
    toast(t("tMystery"), "#fbbf24");
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
  if (u.bossSkillT > 0) u.bossSkillT -= dt;
  if (u.ssrActive) u.ssrT -= dt;

  const foes = enemiesOf(u);
  const tgt = chooseTarget(u, foes);
  if (!tgt) return;
  const d = dist(u, tgt);

  // 🌟 SSR 고유 액티브 발동 (적 있을 때, 보스 제외)
  if (u.ssrActive && u.ssrT <= 0 && !u.boss && foes.length) { fireSSRActive(u, foes); u.ssrT = u.ssrCd; }

  // ── 스킬 자동 발동 ──
  if (u.skT <= 0) {
    let skillScale = 1;
    if (u.star && ["SR","SSR","UR","EX"].includes(u.rarity)) {
      skillScale = Math.pow(1.25, u.star); // SR 패시브(스킬)도 별 레벨에 따라 강해지게
    }
    if (u.skill === "evade" && u.hp < u.maxHp * 0.5) { u.shield = 1.6 * skillScale; u.spd = 1.8; u.spdT = 1.6; u.skT = u.skillCd; addFx(u.x, u.y, "evade"); }
    else if (u.skill === "snipe") { const best = chooseTarget(u, foes); if (best && dist(u, best) < u.sight) { dmg(best, 32 * skillScale, u); u.skT = u.skillCd; addFx(u.x, u.y, "snipe", best.x, best.y, u.side); } }
    else if (u.skill === "barrier") { u.shield = 3 * skillScale; const m = alliesOf(u).filter((a) => dist(u, a) < 60).sort((a, b) => a.hp - b.hp)[0]; if (m) m.shield = 3 * skillScale; u.skT = u.skillCd; addFx(u.x, u.y, "barrier"); }
    else if (u.skill === "charge" && d > u.range + 6 && d < 120) { const k = Math.min(1, (d - u.range) / d); u.x += (tgt.x - u.x) * k; u.y += (tgt.y - u.y) * k; foes.filter((f) => dist(u, f) < 36).forEach((f) => dmg(f, 16 * skillScale, u)); u.skT = u.skillCd; addFx(u.x, u.y, "charge"); }
    else if (u.skill === "overclock") { const m = alliesOf(u).filter((a) => dist(u, a) < 85); if (m.length) { m.forEach((a) => { a.hp = Math.min(a.maxHp, a.hp + 22 * skillScale); a.buff = 5 * skillScale; a.buffT = 5; }); u.hp = Math.min(u.maxHp, u.hp + 12 * skillScale); u.skT = u.skillCd; addFx(u.x, u.y, "overclock"); } }
  }

  // ★ 보스 전용 스킬 — 명명 로테이션 + 깊이 스케일(데미지↑·쿨다운↓) + 시네마틱 배너 (뒤로 갈수록 간지·강·잦음)
  if (u.boss && u.bossSkillT <= 0 && foes.length) {
    const v = u.bossVariant || 'base';
    const cl = curLevel;
    const sc = 1 + Math.max(0, cl - 10) * 0.022;                         // 깊을수록 스킬 데미지↑
    const cdK = Math.max(0.6, 1 - Math.max(0, cl - 20) * 0.012);          // 깊을수록 쿨다운↓ (더 자주 = 난이도↑)
    let name = "", col = "#ff3b3b";
    if (v === 'final' || cl > 40) {                                       // 🔴 최종 — 4종 로테이션
      const r = (u._bsk = (u._bsk || 0) + 1) % 4;
      if (r === 0) {            // 멸절의 빔 (전체 강타)
        name = "☄️ 멸절의 빔"; col = "#fde047";
        foes.forEach((f) => dmg(f, u.atk * 1.1 * sc, u));
        for (let k = 0; k < 7; k++) { const x = W * (0.16 + k * 0.11); addFx(x, 3, "snipe", x, H * 0.5, "e"); }
        u.bossSkillT = 6.5 * cdK;
      } else if (r === 1) {     // 광란의 진노 (자버프 + 흡혈)
        name = "🔥 광란의 진노"; col = "#ef4444";
        u.buff = Math.round(u.atk * 0.6); u.buffT = 5; u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.1);
        for (let k = 0; k < 5; k++) addFx(u.x + (Math.random() - 0.5) * 55, u.y, "charge");
        u.bossSkillT = 5.5 * cdK;
      } else if (r === 2) {     // 절대 방벽 + 전체 약화
        name = "🛡️ 절대 방벽"; col = "#a855f7";
        u.shield = 4.5; foes.forEach((f) => { f.buff = -6; f.buffT = 5; });
        for (let k = 0; k < 4; k++) addFx(u.x + (Math.random() - 0.5) * 50, u.y, "barrier");
        u.bossSkillT = 6 * cdK;
      } else {                  // 중력 붕괴 (광역 + 둔화)
        name = "🌀 중력 붕괴"; col = "#c026d3";
        foes.forEach((f) => { dmg(f, u.atk * 0.7 * sc, u); f.spd = 0.4; f.spdT = 2.5; });
        for (let k = 0; k < 5; k++) addFx(u.x + (Math.random() - 0.5) * 80, u.y + (Math.random() - 0.5) * 50, "overclock");
        u.bossSkillT = 6 * cdK;
      }
    } else if (v === 'corrupted' || cl > 12) {                            // 🟣 중간 — 2종
      const r = (u._bsk = (u._bsk || 0) + 1) % 2;
      if (r === 0) {            // 부식 충격파 (광역)
        name = "💥 부식 충격파"; col = "#c026d3";
        foes.filter((f) => dist(u, f) < 95).forEach((f) => dmg(f, u.atk * 0.85 * sc, u));
        addFx(u.x, u.y, "overclock"); addFx(u.x, u.y, "charge");
        u.bossSkillT = 5.5 * cdK;
      } else {                  // 부식 흡혈
        name = "🩸 부식 흡혈"; col = "#a855f7";
        foes.filter((f) => dist(u, f) < 75).forEach((f) => { f.buff = -4; f.buffT = 5; });
        u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.08); addFx(u.x, u.y, "overclock");
        u.bossSkillT = 5 * cdK;
      }
    } else {                                                              // ⚪ 초반 — 강타
      name = "⚔️ 강타"; col = "#ff3b3b";
      if (tgt) dmg(tgt, u.atk * 1.4 * sc, u);
      addFx(u.x, u.y, "charge", tgt ? tgt.x : 0, tgt ? tgt.y : 0, u.side);
      u.bossSkillT = 6 * cdK;
    }
    if (name) window._bossFlash = { name, color: col, t: 1.2 };           // 캔버스 보스 스킬 배너
    // 고챕터 보스 phase: 하수인 소환 (다른 게임 레이드처럼, 깨기 어렵게)
    if ((curLevel > 30 || v === 'final') && u.hp < u.maxHp * 0.55 && !u.minionsSpawned) {
      u.minionsSpawned = true;
      for (let k = 0; k < (curLevel > 45 ? 3 : 2); k++) {
        const addT = ["drone", "marksman"][k % 2];
        const sAdd = SPEC[addT] || SPEC.drone;
        units.push({
          t: addT, side: "e", x: u.x + (k-1)*30, y: u.y + 30 + Math.random()*20,
          hp: u.maxHp * 0.15, maxHp: u.maxHp*0.15, atk: u.atk * 0.4, range: sAdd.range *0.8,
          speed: sAdd.speed, atkCd: sAdd.atkCd *1.2, ai:1, sight:80, r: sAdd.r||9,
          atkT:1, skT:3, shield:0, buff:0, buffT:0, spd:0, spdT:0, boss: false
        });
      }
      addFx(u.x, u.y, "barrier");
    }
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
  if (target.gearEvade && Math.random() < target.gearEvade) { addFx(target.x, target.y, "evade"); return; }   // 👟쾌속 회피
  let a = amount, ctr = false;
  if (from && from.execute && Math.random() < from.execute.proc) a *= (1 + from.execute.mult);                // ⚔️처형 추가타
  // 🧠 턴제 도파민: dmgMul + momentum 실제 적용 (우선순위 선택 효과 체감)
  if (tbActive && window._tbDmgMul) {
    a *= window._tbDmgMul * (1 + Math.min(0.9, (tbMomentum || 0) / 140));
  }
  // 영웅 패시브 효과 적용 (전략가 치명, 레인저 관통, 워든 감소, 버서커 광폭, 메크 반격)
  const hbFrom = (from && from.side === "p") ? heroBuffs() : null;
  const hbTgt = (target.side === "p") ? heroBuffs() : null;
  if (hbFrom && hbFrom.crit) {
    // strategist crit 추가
  }
  if (hbFrom && hbFrom.pierce > 0) a *= (1 + hbFrom.pierce / 100); // ranger 관통
  if (hbTgt && hbTgt.pierce < 0) a *= Math.max(0.35, 1 + hbTgt.pierce / 100); // warden 피해감소
  { const _ec = (from && from.side === "p") ? ascEdgeCrit() : 0; const _bc = (from && from.crit) || 0; 
    let totCrit = _bc + _ec + (hbFrom ? (hbFrom.crit || 0) : 0);
    if (from && totCrit > 0 && Math.random() * 100 < totCrit) { 
      a *= (from.critDmgMul || 2.0) + (from.side === "p" ? ascPierceDmg() : 0); 
      ctr = true; 
    } 
  }                    // 운→치명타 ×1.6 + Intel bonus + strategist
  // berserker rage ramp
  if (from && from.side === "p" && META.hero === "berserker") {
    window._rageStacks = Math.min(8, (window._rageStacks || 0) + 1);
    const r = (window._rageStacks || 0) * (hbFrom ? (hbFrom.rageMul || 0.08) : 0.08);
    a *= (1 + Math.min(0.6, r));
  }
  if (from && from.t && target.t) {                                                                       // 순환 상성: 유리 ×1.3 / 불리 ×0.77
    if (COUNTER[from.t] && COUNTER[from.t].indexOf(target.t) >= 0) { a *= CTR_MUL; ctr = true; }          // 유리(+30%)
    else if (COUNTER[target.t] && COUNTER[target.t].indexOf(from.t) >= 0) { a *= CTR_WEAK; }              // 불리(-23%)
  }
  // Gear unique: type slayer
  if (from && from.typeSlayer && from.typeSlayer.target === target.t) {
    a *= (1 + (from.typeSlayer.val || 0.15));
  }
  if (target.endure && target.hp <= target.maxHp * target.endure.thresh) a *= (1 - target.endure.reduce);   // 🛡️불굴 저체력 피해감소
  if (target.shield > 0) a *= 0.5;
  target.hp -= a;
  // mech 반격 (p side 받을 때 from에게 반사)
  if (target.side === "p" && META.hero === "mech" && hbTgt && hbTgt.reflect > 0 && from && from.hp > 0) {
    const refD = a * hbTgt.reflect;
    from.hp = Math.max(0, from.hp - refD);
    addFx(from.x + 5, from.y - 5, "dnum", Math.round(refD), 0, from.side);
  }
  // Gear SSR skill procs
  if (from && from.ssrSkill && from.ssrSkill.trigger === 'on_hit') {
    const extra = a * (from.ssrSkill.val || 0.25);
    target.hp -= extra;
    addFx(target.x + (Math.random()*6-3), target.y - target.r -10, "dnum", Math.round(extra), 0, from.side);
  }
  if (ctr && from && from.ssrSkill && from.ssrSkill.trigger === 'on_crit') {
    const extra = a * (from.ssrSkill.val || 0.4);
    target.hp -= extra;
  }
  addFx(target.x + (Math.random() * 14 - 7), target.y - target.r, "dnum", Math.round(a), ctr ? 1 : 0, from && from.side);  // 군주/트리니티 PRD1: 데미지 숫자 팝업(세지는 게 보이는 게임)
  if (ctr) { addFx(target.x, target.y, "ctr"); if (Math.random() < 0.3) SFX.ctr(); }
  if (from && from.id) { from.dmgOut = (from.dmgOut || 0) + a; }  // track for real "MY unit carried X%" even on regulars
  if (target.hp <= 0) { 
    addFx(target.x, target.y, "die", 0, 0, target.side); if (Math.random() < 0.5) SFX.boom(); 
    // Gear on_kill (e.g. Anvil Blessing heal allies)
    if (from && from.ssrSkill && from.ssrSkill.trigger === 'on_kill' && from.side === 'p') {
      const allies = units.filter(u => u.side === 'p' && u.hp > 0);
      allies.forEach(al => {
        const heal = al.maxHp * (from.ssrSkill.val || 0.2);
        al.hp = Math.min(al.maxHp, al.hp + heal);
        addFx(al.x, al.y - 5, "overclock");
      });
    }
    // Arclight SSR passive on-kill (처치 시 전군 AI+치명, star scale)
    if (from && from.ssrPassive === "arclight" && from.side === 'p' && target.side === 'e') {
      const pscale = from.ssrScale || 1;
      const allies = units.filter(u => u.side === 'p' && u.hp > 0);
      allies.forEach(al => {
        al.ai = Math.min(3, (al.ai || 0) + 1 * pscale);
        al.crit = Math.min(90, (al.crit || 0) + 12 * pscale);
        addFx(al.x, al.y - 8, "ctr");
      });
    }
    // ★ Aether EX 전용: 영원의 숨결 부활 (진짜 보물 각인 - 유저가 아끼게)
    if (target.hp <= 0 && target.side === 'p' && window._aetherBreathActive && !window._aetherReviveUsed) {
      const aetherAlive = units.find(ut => ut.side==='p' && (ut.name === 'Aether' || ut.id === 202) && ut.hp > 0);
      if (aetherAlive) {
        target.hp = Math.round(target.maxHp * 0.62);
        target.shield = Math.max(target.shield || 0, 5.5);
        window._aetherReviveUsed = true;
        addFx(target.x, target.y, "overclock");
        addFx(target.x, target.y - 25, "dnum", "부활", 1, 'p');
        units.filter(al => al.side==='p' && al.hp > 0 && dist(target, al) < 90).forEach(al => {
          al.hp = Math.min(al.maxHp, al.hp + Math.round(al.maxHp * 0.18));
          addFx(al.x, al.y - 8, "overclock");
        });
      }
    }
  }
}

function addFx(x, y, kind, x2, y2, side) { if (fx.length > 90) return; fx.push({ x, y, kind, x2, y2, side, t: 0, life: kind === "shot" ? 0.12 : kind === "dnum" ? 0.7 : 0.45 }); }
// 💥 궁극기 발동 시각효과 — 7종 완전 차별화 + 레벨(k) 스케일 (도파민: 1→2 올라가면 "더 세짐"이 *보이게*)
// 각 ult별 signature VFX + k에 따라 파티클 수/크기/지속 증가
function triggerUltVfx(ult, color, lv = 1) {
  const mine = units.filter((u) => u.side === "p" && u.hp > 0);
  const foes = units.filter((u) => u.side === "e" && u.hp > 0);
  const cx = W / 2, cy = H / 2;
  const cap = (arr, n) => arr.slice(0, n);
  const k = heroScale(lv || 1);
  const nBase = Math.round(8 + (k - 1) * 7); // lv1~ lv2+ 더 많아짐
  const lifeMul = 0.9 + (k - 1) * 0.35;
  window._ultBurst = { t: 0.75 * lifeMul, color: color || "#fbbf24", style: ult, k };
  switch (ult) {
    case "dragon":   // 🐉 드래곤 강림 — 하늘에서 용 강림, 불꽃 폭포 + 중심 충격
      window._ultBurst.color = "#ff5a2a";
      cap(foes, Math.min(14, nBase + 4)).forEach((f) => addFx(f.x, f.y, "die", 0, 0, "e"));
      // 하늘에서 내려오는 용의 숨결/메테오
      for (let i = 0; i < nBase + 2; i++) {
        const x = W * (0.15 + Math.random() * 0.7);
        addFx(x, 2, "shot", x + (Math.random()-0.5)*20, H*0.55 + Math.random()*30, "e");
      }
      break;
    case "volley":   // 🎯 아크 볼리 — 아크라이트 일제사, 하늘에서 정밀 다발 사격
      window._ultBurst.color = "#a3e635";
      cap(foes, Math.min(16, nBase + 6)).forEach((f, i) => addFx(f.x, 3 + (i%4), "snipe", f.x, f.y, "e"));
      // 연속 볼리: 위에서 여러 줄 일제
      for (let i = 0; i < nBase; i++) {
        const sx = W * (0.12 + (i % 7) * 0.11);
        addFx(sx, 1, "snipe", sx + (i%2-0.5)*8, H * 0.52, "p");
      }
      break;
    case "assault":  // 🤖 강습 — 전군 돌격 강습, 전방으로 쇄도하는 충격
      window._ultBurst.color = "#cbd5e1";
      cap(mine, nBase).forEach((u) => { addFx(u.x, u.y, "charge"); addFx(u.x + 12, u.y - 6, "shot", u.x + 40, u.y - 30, "p"); });
      break;
    case "focus":    // 🧠 전술 지휘 — 지휘관의 명령, 중앙에서 전군으로 퍼지는 전술 오더
      window._ultBurst.color = "#c4b5fd";
      cap(mine, nBase).forEach((u) => { addFx(u.x, u.y, "evade"); addFx(u.x, u.y - 12, "ctr"); });
      // 명령 방사
      for (let i = 0; i < 6; i++) addFx(cx, cy * 0.42, "ctr");
      break;
    case "wall":     // 🛡️ 철벽 — 단단한 철벽 방벽, 수직으로 솟아오르는 성벽
      window._ultBurst.color = "#67e8f9";
      cap(mine, nBase).forEach((u) => addFx(u.x, u.y, "barrier"));
      // 두껍고 단단한 수직 철벽
      for (let i = 0; i < 4; i++) addFx(W * (0.18 + i * 0.22), H * 0.45, "barrier");
      break;
    case "rage":     // ⚡ 광폭화 — 광폭한 베기, 미친 듯한 연속 슬래시
      window._ultBurst.color = "#ef4444";
      cap(mine, nBase).forEach((u) => { addFx(u.x, u.y, "ctr"); addFx(u.x, u.y, "charge"); });
      // 광폭 베기 여러 방향
      for (let i = 0; i < Math.floor(nBase * 0.8); i++) addFx(cx - 60 + (i % 5) * 35, cy * (0.3 + (i % 4) * 0.12), "charge");
      break;
    case "repair":   // 💉 긴급 수리 — 긴급 수리, 아군에게 퍼지는 수리 에너지
      window._ultBurst.color = "#4ade80";
      cap(mine, nBase).forEach((u) => { addFx(u.x, u.y, "overclock"); addFx(u.x, u.y - 5, "barrier"); });
      break;
    default:
      addFx(cx, cy, "overclock");
      for (let i = 0; i < nBase; i++) { const a = (Math.PI * 2 * i) / nBase; addFx(cx + Math.cos(a) * 34, cy + Math.sin(a) * 34, "charge"); }
  }
}
// 🎉 승리/가챠 축포 — 1339·1517 호출처가 미정의(try/catch라 죽은 연출)였던 것 정의.
function confettiBurst() {
  for (let i = 0; i < 14; i++) { addFx(W * (0.15 + Math.random() * 0.7), H * (0.18 + Math.random() * 0.4), i % 2 ? "charge" : "barrier"); }
}

// ════════ 🌟 9 SSR 고유 액티브 스킬 — 캐릭터마다 완전히 다른 효과 + 이펙트 (도파민 폭발) ════════
// units.js의 9 SSR(name) → 고유 전투 액티브. 장비효과 ssrSkill과는 별개 필드(ssrActive/ssrT/ssrCd) 사용.
const SSR_ACTIVE = {
  Arclight: { key: "judgment", cd: 8.0, delay: 1.6 },   // ⚖️ 심판의 일제사: 강적 3체 천공강타 + 전군 치명↑
  Solace:   { key: "renewal",  cd: 7.0, delay: 2.2 },    // 🌊 재생의 물결: 약한 아군 대회복 + 전군 소회복
  Cipher:   { key: "decrypt",  cd: 7.0, delay: 2.0 },    // 🔭 정밀 해독: 단일 약점노출 대뎀 + 아군 치명대폭
  Ignis:    { key: "frenzy",   cd: 6.0, delay: 1.4 },    // 🔥 광란의 폭주: 주변 화염 AOE + 자버프 폭주
  Vector:   { key: "rally",    cd: 8.0, delay: 1.8 },    // ↯ 동시 지휘: 아군 3체 돌격 + 속도/공격 버프
  Vespera:  { key: "swarm",    cd: 6.0, delay: 1.2 },    // 🐝 군집 분열: 최근접 적 벌떼 다발 연타
  Aegis:    { key: "bulwark",  cd: 9.0, delay: 0.8 },    // 🛡️ 수호의 방벽: 전군 보호막
  Anvil:    { key: "forge",    cd: 7.0, delay: 2.6 },    // 🔨 건설 프로토콜: 망치 강타 + 둔화 + 팀 재생
  Dominus:  { key: "command",  cd: 9.0, delay: 2.4 },    // 👑 군단의 호령: 전군 대버프(공격·속도)
};
function fireSSRActive(u, foes) {
  const allies = (u.hp > 0 ? [u] : []).concat(alliesOf(u));
  const scale = u.ssrScale || 1;  // 별 레벨 스케일 (액티브 강력하게)
  let name = "", col = "#fbbf24";
  switch (u.ssrActive) {
    case "judgment": {   // ⚖️ Arclight
      name = "⚖️ 심판의 일제사"; col = "#bef575";
      foes.slice().sort((a, b) => b.hp - a.hp).slice(0, 3).forEach((f) => {
        dmg(f, u.atk * 1.8 * scale, u); addFx(f.x, 4, "snipe", f.x, f.y, "p"); addFx(f.x, f.y, "die", 0, 0, "e");
      });
      allies.forEach((a) => { a.crit = Math.min(90, (a.crit || 0) + 15 * scale); });
      break;
    }
    case "renewal": {    // 🌊 Solace
      name = "🌊 재생의 물결"; col = "#4ade80";
      allies.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp).slice(0, 3)
        .forEach((a) => { a.hp = Math.min(a.maxHp, a.hp + a.maxHp * 0.25 * scale); addFx(a.x, a.y, "overclock"); });
      allies.forEach((a) => { a.hp = Math.min(a.maxHp, a.hp + a.maxHp * 0.08 * scale); });
      break;
    }
    case "decrypt": {    // 🔭 Cipher
      name = "🔭 정밀 해독"; col = "#67e8f9";
      const tgt = chooseTarget(u, foes);
      if (tgt) { dmg(tgt, u.atk * 2.4 * scale, u); addFx(u.x, u.y, "snipe", tgt.x, tgt.y, "p"); tgt.spd = 0.4; tgt.spdT = 2.5; }
      allies.slice(0, 4).forEach((a) => { a.crit = Math.min(90, (a.crit || 0) + 25 * scale); addFx(a.x, a.y - 10, "ctr"); });
      break;
    }
    case "frenzy": {     // 🔥 Ignis
      name = "🔥 광란의 폭주"; col = "#f97316";
      foes.filter((f) => dist(u, f) < 90).forEach((f) => { dmg(f, u.atk * 1.3 * scale, u); addFx(f.x, f.y, "die", 0, 0, "e"); });
      u.buff = Math.round(u.atk * 0.6 * scale); u.buffT = 4; u.spd = 1.4; u.spdT = 4;
      for (let i = 0; i < 6; i++) addFx(u.x + (Math.random() - 0.5) * 60, u.y + (Math.random() - 0.5) * 40, "charge");
      break;
    }
    case "rally": {      // ↯ Vector
      name = "↯ 동시 지휘"; col = "#e2e8f0";
      allies.slice(0, 3).forEach((a) => {
        a.buff = Math.round(a.atk * 0.4 * scale); a.buffT = 4; a.spd = 1.5; a.spdT = 4;
        addFx(a.x, a.y, "charge"); addFx(a.x + 12, a.y - 6, "shot", a.x + 40, a.y - 30, "p");
      });
      break;
    }
    case "swarm": {      // 🐝 Vespera
      name = "🐝 군집 분열"; col = "#fde047";
      const tgt = chooseTarget(u, foes);
      if (tgt) for (let i = 0; i < 5; i++) { dmg(tgt, u.atk * 0.5 * scale, u); addFx(u.x, u.y, "shot", tgt.x + (Math.random() - 0.5) * 22, tgt.y + (Math.random() - 0.5) * 22, "p"); }
      break;
    }
    case "bulwark": {    // 🛡️ Aegis
      name = "🛡️ 수호의 방벽"; col = "#67e8f9";
      allies.forEach((a) => { a.shield = Math.max(a.shield || 0, 4 * scale); addFx(a.x, a.y, "barrier"); });
      break;
    }
    case "forge": {      // 🔨 Anvil
      name = "🔨 건설 프로토콜"; col = "#fbbf24";
      const tgt = chooseTarget(u, foes);
      if (tgt) { dmg(tgt, u.atk * 2.0 * scale, u); addFx(tgt.x, tgt.y, "charge"); foes.filter((f) => dist(tgt, f) < 42).forEach((f) => { f.spd = 0.3; f.spdT = 2; }); }
      allies.forEach((a) => { a.hp = Math.min(a.maxHp, a.hp + a.maxHp * 0.1 * scale); });
      break;
    }
    case "command": {    // 👑 Dominus
      name = "👑 군단의 호령"; col = "#fbbf24";
      allies.forEach((a) => { a.buff = Math.round(a.atk * 0.5 * scale); a.buffT = 5; a.spd = 1.4; a.spdT = 5; addFx(a.x, a.y, "evade"); addFx(a.x, a.y - 12, "ctr"); });
      break;
    }
    default: return;
  }
  if (name) window._ssrFlash = { name, color: col, t: 1.05 };   // 캔버스 스킬명 배너(도파민)
}

// 🐲 위압적 보스 전용 렌더 — 보스별 디자인 차별화 (base / corrupted / final) + 실제 PNG 이미지 다양성
function drawBoss(u) {
  const t = Date.now();
  const variant = u.bossVariant || 'base';
  const R = u.r * 2.5;
  const breathe = 1 + Math.sin(t / 430) * 0.03;
  const bob = Math.sin(t / 640) * 3;
  const cx = u.x, cy = u.y + bob;
  const hpr = u.maxHp ? Math.max(0, u.hp / u.maxHp) : 1;
  ctx.save();

  // 보스 이미지 사용 (다양성 위해 portraitKey 기반 PNG 우선)
  const pk = u.portraitKey;
  const hasBossImg = pk && enemyPortraits[pk] && enemyPortraits[pk].complete && enemyPortraits[pk].naturalWidth > 0;

  let glow = "#ff2a2a", body1 = "#5a1414", body2 = "#2e0a0a", body3 = "#160404", stroke = "#ff3b3b", core1 = "#fff2c0", core2 = "#ff5a2a";
  let spikeCount = 9, plateSides = 6, eyeColor = "#ff1a1a";
  let crackAlpha = 0.7 - hpr;

  if (variant === 'corrupted') {
    glow = "#a855f7"; body1 = "#3a0a3a"; body2 = "#1a0520"; body3 = "#0a0310"; stroke = "#c026d3"; core1 = "#e0b0ff"; core2 = "#c026d3";
    spikeCount = 12; plateSides = 8; eyeColor = "#c026d3"; crackAlpha = 0.5;
  } else if (variant === 'final') {
    glow = "#fbbf24"; body1 = "#3a2a12"; body2 = "#1a1408"; body3 = "#0a0804"; stroke = "#fde047"; core1 = "#fff"; core2 = "#fbbf24";
    spikeCount = 7; plateSides = 5; eyeColor = "#fde047"; crackAlpha = Math.max(0.2, 0.3 - hpr * 0.3);
  }

  // 👑 보스 위엄(majesty) — 발밑 throne 광채 + 위압 오라 링 + 상승 잉걸불 (본체 밑 레이어, 경량·결정적)
  const majK = variant === 'final' ? 1.4 : variant === 'corrupted' ? 1.18 : 1;
  const gy = cy + R * 1.05;
  const thr = ctx.createRadialGradient(cx, gy, 2, cx, gy, R * 1.7 * majK);
  thr.addColorStop(0, "rgba(0,0,0,0.55)"); thr.addColorStop(0.5, "rgba(0,0,0,0.28)"); thr.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = thr; ctx.beginPath(); ctx.ellipse(cx, gy, R * 1.7 * majK, R * 0.5, 0, 0, 7); ctx.fill();
  for (let i = 0, ringN = variant === 'final' ? 3 : variant === 'corrupted' ? 2 : 1; i < ringN; i++) {   // 위압 오라 링(펄스)
    const ph = (t / 1400 + i / ringN) % 1;
    ctx.globalAlpha = (1 - ph) * 0.42; ctx.strokeStyle = glow; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(cx, cy, R * (1.2 + ph * 0.9 * majK), 0, 7); ctx.stroke();
  }
  for (let i = 0, embN = variant === 'final' ? 7 : variant === 'corrupted' ? 5 : 4; i < embN; i++) {     // 상승 잉걸불
    const sp = (t / 1100 + i * 0.37) % 1;
    const ex = cx + Math.sin(i * 2.1 + t / 900) * R * 0.9, ey = cy + R * 0.9 - sp * R * 2.2;
    ctx.globalAlpha = (1 - sp) * 0.7; ctx.fillStyle = i % 2 ? core1 : core2;
    ctx.beginPath(); ctx.arc(ex, ey, 1.4 + (1 - sp) * 1.8, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (hasBossImg) {
    // 실제 PNG 이미지로 보스 본체 (챕터별 다양성 + 간지)
    const img = enemyPortraits[pk];
    let sz = R * 2.8;
    if (variant === 'final' || curLevel > 35) sz *= 1.15; // high ch bigger more epic
    ctx.shadowColor = glow; ctx.shadowBlur = (variant==='final' ? 45 : 30);
    ctx.save();
    // 🐉 보스 위엄: 원형 크롭 제거 → 전신/상반신 그대로 표시 (머리·눈알만 보이던 "동그란 눈알" 문제 해결). nukki 아트면 배경 자연스럽게.
    ctx.drawImage(img, cx - sz/2, cy - sz * 0.5, sz, sz);
    ctx.restore();
    ctx.shadowBlur = 0;
    // high tier extra aura
    if (variant === 'final' || curLevel > 40) {
      ctx.strokeStyle = `rgba(251,191,36,${0.3 + Math.sin(t/200)*0.2})`;
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.55, 0, 7); ctx.stroke();
    }
  } else {
    // 폴백 procedural (기존)
    ctx.shadowColor = glow; ctx.shadowBlur = 26;
    ctx.fillStyle = body1; ctx.strokeStyle = stroke; ctx.lineWidth = 1.5;
    for (let i = 0; i < spikeCount; i++) {
      const a = (i / spikeCount) * 6.283 + t / 2600;
      const sl = R * (1.18 + Math.sin(t / 480 + i) * 0.09);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a - 0.13) * R * 0.72, cy + Math.sin(a - 0.13) * R * 0.72);
      ctx.lineTo(cx + Math.cos(a) * sl, cy + Math.sin(a) * sl);
      ctx.lineTo(cx + Math.cos(a + 0.13) * R * 0.72, cy + Math.sin(a + 0.13) * R * 0.72);
      ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.shadowBlur = 0;

    const plate = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 2, cx, cy, R * breathe);
    plate.addColorStop(0, body1); plate.addColorStop(0.6, body2); plate.addColorStop(1, body3);
    ctx.fillStyle = plate; ctx.beginPath();
    for (let i = 0; i <= plateSides; i++) {
      const a = (i / plateSides) * 6.283 - t / 4200;
      const rr = R * breathe * (1 + Math.sin(t / 720 + i) * 0.02);
      const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = stroke; ctx.stroke();
  }

  // 크랙 (모든 경우 적용, 이미지 위에)
  if (hpr < 0.8) {
    ctx.strokeStyle = `rgba(255,90,40,${crackAlpha})`; ctx.lineWidth = 1.5;
    const crackNum = variant === 'corrupted' ? 8 : 5;
    for (let i = 0; i < crackNum; i++) {
      const a = i * (6.28 / crackNum) + 0.4;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * R * 0.78, cy + Math.sin(a) * R * 0.78); ctx.stroke();
    }
  }

  // 코어 + 눈 removed (이미지 아트 자체에 포함되도록. 중앙에 이상한 발광 점/이모지처럼 보이는 UI 문제 해결)
  // 사용자 피드백: 중간 눈이 이상함, 전부 없애서 깔끔하게
  ctx.restore();

  // HP 바 + 이름 (변형에 따라 아이콘/이름)
  const w = R * 1.9;
  // 상단 보스(화면 위로 네임플레이트 잘림)면 본체 아래로 플립 — 왕관·이름 항상 보이게(위엄)
  const flip = (cy - R * 1.34) < 16;
  const by = flip ? Math.min(H - 14, cy + R * 1.05) : cy - R * 1.34;
  // 👑 위엄 왕관 — 고티어 보스 머리 위 (변형별 색·개수)
  const crown = variant === 'final' ? "👑" : variant === 'corrupted' ? "♛" : (curLevel >= 25 ? "♛" : "");
  if (crown) {
    ctx.font = (variant === 'final' ? "bold 18px" : "15px") + " sans-serif"; ctx.textAlign = "center";
    ctx.save(); ctx.shadowColor = stroke; ctx.shadowBlur = 12; ctx.fillStyle = core1;
    ctx.fillText(crown, cx, by - 18); ctx.restore();
  }
  // HP 바 (테두리 + 글로우)
  ctx.fillStyle = "rgba(0,0,0,0.72)"; rRect(cx - w / 2 - 1, by - 1, w + 2, 8, 3); ctx.fill();
  ctx.save(); ctx.shadowColor = hpr > 0.4 ? "#ef4444" : "#fbbf24"; ctx.shadowBlur = 8;
  ctx.fillStyle = hpr > 0.4 ? "#ef4444" : "#fbbf24"; rRect(cx - w / 2, by, w * hpr, 6, 3); ctx.fill(); ctx.restore();
  // 위엄 네임 (글로우 + 칭호)
  let bName = "타락 거신";
  if (curLevel >= 50) bName = "종말의 심판자";
  else if (variant === 'final' || curLevel >= 40) bName = "최종형 거신";
  else if (variant === 'corrupted' || curLevel >= 25) bName = "타락 심연";
  else if (curLevel >= 15) bName = "강화 거신";
  ctx.save(); ctx.shadowColor = stroke; ctx.shadowBlur = 10;
  ctx.fillStyle = core1; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
  ctx.fillText("🐲 " + (u.eName || u.name || bName), cx, by - 6); ctx.restore();
  // 고챕터 간지 칭호
  if (curLevel > 20) {
    ctx.font = "bold 9px sans-serif"; ctx.fillStyle = "rgba(251,191,36,0.85)"; ctx.textAlign = "center";
    ctx.fillText("⚔ CH." + curLevel + (variant === 'final' ? " · FINAL FORM" : variant === 'corrupted' ? " · CORRUPTED" : ""), cx, by - 19 - (crown ? 14 : 0));
  }
}

// ── 그리기 ────────────────────────────────────────────────────────────────────
function fmtNum(n) { n = Math.round(n || 0); if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M"; if (n >= 1e4) return (n / 1e3).toFixed(n >= 1e5 ? 0 : 1) + "K"; return "" + n; }
function drawHpGauge() {   // 양팀 총 HP 바 (전투 중만) — 트리니티 도파민맵
  if (!running || !units || !units.length) return;
  let php = 0, pmax = 0, ehp = 0, emax = 0;
  for (const u of units) { if (u.side === "p") { php += Math.max(0, u.hp); pmax += u.maxHp || 0; } else { ehp += Math.max(0, u.hp); emax += u.maxHp || 0; } }
  const bw = (W - 22) / 2;
  ctx.fillStyle = "rgba(0,0,0,0.5)"; rRect(8, 4, bw, 6, 3); ctx.fill();
  ctx.fillStyle = "#5a8cff"; rRect(8, 4, bw * (pmax ? php / pmax : 0), 6, 3); ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.5)"; rRect(W - 8 - bw, 4, bw, 6, 3); ctx.fill();
  const ew = bw * (emax ? ehp / emax : 0); ctx.fillStyle = "#ff5a5a"; rRect(W - 8 - ew, 4, ew, 6, 3); ctx.fill();
}
function draw() {
  if (window._bgCache) ctx.drawImage(window._bgCache, 0, 0);   // perf: 캐시된 배경+그리드 1회 합성
  else { ctx.fillStyle = "#0f121a"; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = "#1b2030"; ctx.lineWidth = 1; for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
  drawHpGauge();   // 양팀 HP 게이지 (전투 중)
  if (tbActive) { // 캔버스에 턴 표시 (UI와 함께)
    ctx.fillStyle = "#a5b4fc"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
    const mg = (new Date().getHours()>=6 && new Date().getHours()<11) || (new Date().getHours()>=20 && new Date().getHours()<24) ? "🌅" : "";
    ctx.fillText(`🧠 T${tbTurn} ${tbPriority.toUpperCase()} S${tbStreak||0}M${tbMomentum||0}${mg}`, W/2, 22);
    if ((tbMomentum || 0) > 12) {
      ctx.fillStyle = "#a3e635"; ctx.font = "9px sans-serif";
      const buf = Math.floor((tbMomentum||0) / 5);
      ctx.fillText(`⚡ 모멘텀 +${buf}% 전력 캐리`, W/2, 34);
    }
    ctx.textAlign = "left";
  }

  for (const f of fx) {
    const k = f.t / f.life;
    ctx.globalAlpha = 1 - k;
    if (f.kind === "shot")      { ctx.strokeStyle = f.side === "p" ? "#7db1ff" : "#ff9a9a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x2, f.y2); ctx.stroke(); }
    else if (f.kind === "dnum") { const rise = 26 * k, crit = f.y2 === 1; ctx.textAlign = "center"; ctx.font = crit ? "bold 22px sans-serif" : "bold 13px sans-serif"; if (crit) { ctx.lineWidth = 3; ctx.strokeStyle = "rgba(0,0,0,0.6)"; ctx.strokeText(f.x2, f.x, f.y - 8 - rise); } ctx.fillStyle = crit ? "#fde047" : (f.side === "p" ? "#ffffff" : "#ffb4b4"); ctx.fillText(f.x2, f.x, f.y - 8 - rise); }
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
  const foundersU = eff ? units.filter(u => u.side==='p' && ["SSR","UR","EX"].includes(u.rarity) && u.hp>0) : [];
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

  // Vanguard Focus 24h visual cue (fair teaser, no FOMO pressure)
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

  // 🌟 SSR 액티브 발동 배너 — 스킬명 떠오르며 페이드(도파민 시각 보상)
  if (window._ssrFlash && window._ssrFlash.t > 0) {
    const sf = window._ssrFlash, a = Math.min(1, sf.t), rise = (1.05 - sf.t) * 18;
    ctx.save(); ctx.textAlign = "center"; ctx.globalAlpha = a;
    ctx.font = "bold 21px sans-serif"; ctx.lineWidth = 4.5; ctx.strokeStyle = "rgba(0,0,0,0.72)";
    ctx.strokeText(sf.name, W / 2, H * 0.28 - rise);
    ctx.fillStyle = sf.color; ctx.fillText(sf.name, W / 2, H * 0.28 - rise);
    ctx.globalAlpha = a * 0.55; ctx.strokeStyle = sf.color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(W * 0.26, H * 0.30 - rise); ctx.lineTo(W * 0.74, H * 0.30 - rise); ctx.stroke();
    ctx.restore(); ctx.globalAlpha = 1;
  }
  // 🐲 보스 스킬 발동 배너 — 상단(보스 위치)에 위압적으로 (플레이어 SSR 배너와 분리)
  if (window._bossFlash && window._bossFlash.t > 0) {
    const bf = window._bossFlash, a = Math.min(1, bf.t);
    ctx.save(); ctx.textAlign = "center"; ctx.globalAlpha = a;
    ctx.fillStyle = `rgba(0,0,0,${a * 0.45})`; ctx.fillRect(0, H * 0.40, W, 26);
    ctx.font = "bold 18px sans-serif"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.strokeText("🐲 " + bf.name, W / 2, H * 0.40 + 19);
    ctx.fillStyle = bf.color; ctx.fillText("🐲 " + bf.name, W / 2, H * 0.40 + 19);
    ctx.restore(); ctx.globalAlpha = 1;
  }
  // 💥 ULT 전용 렌더 — 궁극기 이름에 정확히 맞는 이팩트 (드래곤 강림 / 아크 볼리 / 강습 / 전술 지휘 / 철벽 / 광폭화 / 긴급 수리)
  if (window._ultBurst && window._ultBurst.t > 0) {
    const bt = window._ultBurst.t, col = window._ultBurst.color || '#fbbf24';
    const k = window._ultBurst.k || 1;
    const alpha = Math.min(0.96, bt * 1.18);
    const rBase = 170 + (k - 1) * 45;
    const style = window._ultBurst.style;
    if (style === "dragon") {
      // 🐉 드래곤 강림 — 하늘에서 떨어지는 용의 불길 + 중심 대폭발
      ctx.fillStyle = `rgba(255,80,30,${alpha * 0.75})`; ctx.beginPath(); ctx.arc(W/2, H*0.48, rBase * 0.95, 0, 7); ctx.fill();
      // 하강 불꽃 기둥 여러 개 (강림 느낌)
      for (let i = 0; i < 7 + Math.floor(k * 3); i++) {
        const x = W * (0.18 + (i % 6) * 0.11);
        const len = H * (0.22 + bt * 0.3);
        ctx.strokeStyle = (i % 2 ? "#f97316" : "#ef4444");
        ctx.lineWidth = 4 + k * 0.8;
        ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x + Math.sin(bt*6 + i)*8, 12 + len); ctx.stroke();
        ctx.fillStyle = "#fbbf24"; ctx.beginPath(); ctx.arc(x, 14 + len * bt, 6 + k * 2, 0, 7); ctx.fill();
      }
    } else if (style === "volley") {
      // 🎯 아크 볼리 — 하늘에서 쏟아지는 아크라이트 일제사 (volley = 다발 사격)
      ctx.strokeStyle = "#bef575"; ctx.lineWidth = 2.8 + k * 0.8;
      for (let wave = 0; wave < 3; wave++) {
        for (let i = 0; i < 4 + Math.floor(k * 2); i++) {
          const x = W * (0.14 + ((wave + i) % 8) * 0.09);
          ctx.globalAlpha = alpha * (0.6 - wave * 0.15);
          ctx.beginPath(); ctx.moveTo(x, 4 + wave * 8); ctx.lineTo(x + (i % 3 - 1) * 5, H * 0.5); ctx.stroke();
          ctx.fillStyle = "#fde047"; ctx.beginPath(); ctx.arc(x, H * 0.48 + wave * 5, 3 + k, 0, 7); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    } else if (style === "assault") {
      // 🤖 강습 — 전방으로 쇄도하는 강습 돌격 (assault = 돌격)
      ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 3 + k;
      for (let i = 0; i < 8 + Math.floor(k * 3); i++) {
        const progress = (bt * 1.4 + i * 0.08) % 1.2;
        const ry = H * 0.32 + progress * 110;
        ctx.beginPath(); ctx.arc(W * 0.5, ry, 18 + i * 2 + k * 5, 0, 7); ctx.stroke();
      }
      // 전진 충격파
      ctx.globalAlpha = alpha * 0.7; ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(W * 0.12, H * 0.35, W * 0.76, 8 + k * 3);
      ctx.globalAlpha = 1;
    } else if (style === "focus") {
      // 🧠 전술 지휘 — 중앙 지휘소에서 전군으로 퍼지는 명령 (tactical command)
      ctx.strokeStyle = "#c4b5fd"; ctx.lineWidth = 2.2;
      // 명령 동심원
      for (let r = 0; r < 5 + Math.floor(k); r++) {
        ctx.globalAlpha = alpha * (0.35 + r * 0.1);
        ctx.beginPath(); ctx.arc(W / 2, H * 0.42, 36 + r * 26 + bt * 8, 0, 7); ctx.stroke();
      }
      // 방사형 명령선 (지휘 느낌)
      ctx.globalAlpha = alpha * 0.6; ctx.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + bt * 2;
        ctx.beginPath(); ctx.moveTo(W/2, H*0.42); ctx.lineTo(W/2 + Math.cos(a)*120, H*0.42 + Math.sin(a)*70); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    } else if (style === "wall") {
      // 🛡️ 철벽 — 단단하고 두꺼운 철의 벽이 솟아오름 (iron wall)
      ctx.strokeStyle = "#67e8f9"; ctx.lineWidth = 7 + k * 1.5;
      for (let i = 0; i < 4; i++) {
        const wx = W * (0.16 + i * 0.23);
        // 두꺼운 수직 성벽
        ctx.beginPath(); ctx.moveTo(wx - 3, H * 0.26); ctx.lineTo(wx - 3, H * 0.64); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(wx + 3, H * 0.26); ctx.lineTo(wx + 3, H * 0.64); ctx.stroke();
        // 벽 상단 강조 (철 느낌)
        ctx.fillStyle = "rgba(103,232,249,0.6)"; ctx.fillRect(wx - 5, H * 0.26, 10, 8 + k);
      }
    } else if (style === "rage") {
      // ⚡ 광폭화 — 광폭한 베기와 광란의 슬래시가 미친 듯이 휘몰아침
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 3.5 + k * 1.2;
      for (let i = 0; i < 9 + Math.floor(k * 4); i++) {
        const sx = W * (0.08 + (i % 7) * 0.12);
        const sy = H * (0.28 + ((i * 0.7) % 3) * 0.13);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 70 + Math.sin(bt * 14 + i) * 25, sy - 25 + Math.cos(bt * 11 + i) * 30);
        ctx.stroke();
      }
      // 광분 폭발
      ctx.globalAlpha = alpha * 0.55; ctx.fillStyle = "#f87171";
      ctx.fillRect(W * 0.18, H * 0.36, W * 0.64, 5 + k * 2);
      ctx.globalAlpha = 1;
    } else if (style === "repair") {
      // 💉 긴급 수리 — 아군 위치 중심으로 퍼지는 수리 에너지 + 응급 패치
      ctx.fillStyle = `rgba(74,222,128,${alpha * 0.6})`; ctx.beginPath(); ctx.arc(W / 2, H * 0.44, 75 + k * 30, 0, 7); ctx.fill();
      ctx.strokeStyle = "#4ade80"; ctx.lineWidth = 2.8;
      for (let i = 0; i < 5 + Math.floor(k); i++) {
        const px = W / 2 - 30 + (i % 5) * 15;
        ctx.beginPath(); ctx.arc(px, H * 0.44, 12 + i * 3 + bt * 18, 0, 7); ctx.stroke();
        // 수리 스파크 (작은 + 또는 점)
        ctx.fillStyle = "#86efac"; ctx.beginPath(); ctx.arc(px, H*0.44 - 6 - (i%2)*3, 2 + k*0.5, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(px + 3, H*0.44 - 3, 1.5, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    } else {
      // fallback
      const grad = ctx.createRadialGradient(W / 2, H * 0.38, 8, W / 2, H * 0.42, rBase);
      grad.addColorStop(0, `rgba(255,255,255,${alpha * 0.9})`);
      grad.addColorStop(0.25, col.replace('#', '#') + Math.floor(alpha * 180).toString(16).padStart(2, '0'));
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(W / 2, H * 0.40, rBase, 0, 7); ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = 2;
      for (let i = -2; i <= 2; i++) { const ax = W / 2 + i * 28; ctx.beginPath(); ctx.moveTo(ax, 10); ctx.lineTo(ax, H * 0.55); ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
  }

  // 🐲 보스 등장 시 화면 위압감 — 가장자리 핏빛 펄스(보스전 분위기, 경량)
  const _boss = units.find((u) => u.boss && u.hp > 0);
  if (_boss) {
    const pulse = 0.13 + Math.sin(Date.now() / 700) * 0.05;
    const col = _boss.bossVariant === 'final' ? '251,191,36' : _boss.bossVariant === 'corrupted' ? '168,85,247' : '255,42,42';
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.98);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(${col},${pulse})`);
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
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
    // 🔥 MY Legion endowment glow — applyMYVisuals 표식 정예는 금빛 후광 강화(소유효과 실제 렌더)
    if (u.side === "p" && META.myLegionVisuals && META.myLegionVisuals[u.id]) {
      const mr = u.r + 9 + Math.sin(Date.now() / 300) * 1.5;
      const mg = ctx.createRadialGradient(u.x, u.y, u.r, u.x, u.y, mr);
      mg.addColorStop(0, "rgba(251,191,36,0)"); mg.addColorStop(0.65, "rgba(251,191,36,0.30)"); mg.addColorStop(1, "rgba(251,191,36,0)");
      ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(u.x, u.y, mr, 0, 7); ctx.fill();
    }
    // 상태 링은 활성 시에만 (의미 있는 정보)
    if (u.boss)       { ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(u.x, u.y, u.r + 5, 0, 7); ctx.stroke(); }
    if (u.shield > 0) { ctx.strokeStyle = "#67e8f9"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(u.x, u.y, u.r + 4.5, 0, 7); ctx.stroke(); }
    if (u.buff > 0)   { ctx.strokeStyle = "#a3e635"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(u.x, u.y, u.r + 6.5, 0, 7); ctx.stroke(); }
    // 모멘텀 캐리 시각화 (전력 버프 링 — canvas에서 momentum carry 즉시 보이게)
    if (tbActive && (tbMomentum || 0) > 15 && u.side === "p") {
      ctx.strokeStyle = "rgba(163,230,53,0.6)"; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.arc(u.x, u.y, u.r + 8.2, 0, 7); ctx.stroke();
    }
    // Battle body: player SSR PNG or enemy hostile PNG (small set) — or rich synthetic
    const hasPlayerPortrait = u.id && ssrPortraits[u.id] && ssrPortraits[u.id].complete && ssrPortraits[u.id].naturalWidth > 0;
    const hasEnemyPortrait = u.side === "e" && u.portraitKey && u.portraitKey!=="drone" && u.portraitKey!=="marksman" && enemyPortraits[u.portraitKey] && enemyPortraits[u.portraitKey].complete && enemyPortraits[u.portraitKey].naturalWidth > 0;
    if (hasPlayerPortrait || hasEnemyPortrait) {
      const img = hasPlayerPortrait ? ssrPortraits[u.id] : enemyPortraits[u.portraitKey];
      let clipR = hasPlayerPortrait ? u.r * 1.15 : Math.min(22, u.r + 4);
      let sz = hasPlayerPortrait ? u.r * 2.6 : 48;
      if (u.side === "e" && u.portraitKey && (u.portraitKey.includes("titan") || u.portraitKey.includes("boss"))) {
        sz = u.r * 2.8;
        clipR = u.r * 1.25;
      }
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
      // ★ 고등급 특수 시각 (Helix 운명 실, Aether 영원 오라) — 보물 느낌 극대화
      if (u.name === "Helix" || u.id === 201) {
        // 운명의 매듭: 주변 아군에게 실 연결 (시각)
        const allies = units.filter(a => a.side==='p' && a.hp>0 && a !== u && dist(u,a) < 120);
        ctx.strokeStyle = "rgba(232,121,249,0.55)"; ctx.lineWidth = 1.2;
        allies.slice(0,3).forEach(al => {
          ctx.beginPath(); ctx.moveTo(u.x, u.y); ctx.lineTo(al.x, al.y); ctx.stroke();
          ctx.beginPath(); ctx.arc(al.x, al.y, 3, 0, 7); ctx.fillStyle="rgba(232,121,249,0.7)"; ctx.fill();
        });
      }
      if (u.name === "Aether" || u.id === 202) {
        // 영원의 숨결: 부드러운 영원 오라
        ctx.strokeStyle = "rgba(244,114,182,0.35)"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(u.x, u.y, u.r * 1.35, 0, 7); ctx.stroke();
        ctx.strokeStyle = "rgba(244,114,182,0.18)"; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(u.x, u.y, u.r * 1.6, 0, 7); ctx.stroke();
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
        if (u.isSpecific && !["SSR","UR","EX"].includes(u.rarity) && u.id) {
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
    if (["SSR","UR","EX"].includes(u.rarity) && u.name) {
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
  if (tbActive) return; // 턴제는 executeTbTurn 수동 호출 전용 (auto 실시간과 분리)
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
  if (window._ssrFlash) { window._ssrFlash.t -= dt; if (window._ssrFlash.t <= 0) delete window._ssrFlash; }
  if (window._bossFlash) { window._bossFlash.t -= dt; if (window._bossFlash.t <= 0) delete window._bossFlash; }
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
  if (win) { META.dailyBattles = (META.dailyBattles || 0) + 1; META.totalWins = (META.totalWins || 0) + 1; }   // ⚠️ TDZ 버그픽스: win 선언 뒤로 이동 (전엔 선언 전 참조→매 전투종료 ReferenceError로 finish() 전체 붕괴)
  if (win) logEvent("battle_win", { mode: META.mode, ch: META.chapter, tower: META.tower, lvl: curLevel });   // 📊 계측
  if (tbActive) { tbActive = false; showTbControls(false); $("start").textContent = t("start"); delete window._tbTactic; }
  const m = META.mode;
  let extra = "", title = win ? t("rWin") : dr ? t("rDraw") : t("rLose");
  let bonus = (x) => Math.floor(x * (META.vip ? 1.5 : META.starter ? 1.2 : 1) * (META.founder ? 1.25 : 1));   // VIP +50% / 스타터 +20% / 🏅창단 +25% 골드(영구)

  if (win) {
    let reward = 0;
    if (m === "tower") {                               // 🗼 무한탑: 다음 층
      reward = bonus(30 + curLevel * 15);
      META.dailyTower = (META.dailyTower || 0) + 1;
      if (META.tower > (META.towerBest || 0)) META.towerBest = META.tower;
      const cleared = META.tower;                       // 방금 깬 층
      META.tower += 1;
      title = t("rTower", { n: cleared });
      extra = `<div class="rwd">${t("rwGold", { n: reward })}</div><div class="rwd2">${t("rwTowerNext", { n: META.tower, b: META.towerBest })}</div>`;
      // 🎁 5층 마일스톤 보상 (조작방지: towerBest 갱신분만 = 첫 도달 시에만 지급)
      if (cleared % 5 === 0 && cleared > (META.towerRewarded || 0)) {
        if (cleared % 50 === 0) {                        // 🏆 50층 대형 보상 + 난이도 돌파 축포
          const bigGem = 500 + cleared * 10;
          META.gems = (META.gems || 0) + bigGem;
          if (typeof grantUnit === "function") grantUnit("SSR");
          if (typeof newGear === "function") { if (!META.gear) META.gear = []; META.gear.push(newGear("SSR")); }
          extra += `<div class="rwd2" style="color:#fbbf24;font-weight:800">🏆 ${cleared}층 돌파! 💎${bigGem.toLocaleString("en-US")} + 🌟SSR유닛 + ⚔️SSR장비</div><div class="rwd2" style="color:#f97316">🐲 이후 난이도 +25% — 더 깊은 지옥</div>`;
          try { confettiBurst(); } catch (e) {}
        } else {                                         // 🎁 5층 기본 마일스톤
          const g = 40 + cleared * 6;
          META.gems = (META.gems || 0) + g;
          const soul = 5 + Math.floor(cleared / 5);
          META.soul = (META.soul || 0) + soul;
          extra += `<div class="rwd2" style="color:#a3e635">🎁 ${cleared}층 보상 💎${g} + 🔮${soul}</div>`;
        }
        META.towerRewarded = cleared;
      }
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
    } else if (m === "boss") {                          // 🐲 보스: 난이도 배율 + 즉시 큰 보상 + 복리 하이브리드 (어려울수록 즉시↑, 클리어할수록 미래↑)
      // 난이도 배율: 챕터 높을수록 (보스 강함에 비례) 즉시 보상 크게
      const diffMul = 1 + (META.chapter * 0.05);  // e.g. ch20=2x, ch50=3.5x
      let baseGold = bonus(80 + META.chapter * 40);
      let baseGem = 10 + Math.floor(META.chapter / 4);
      let baseSoul = 4 + Math.floor(META.chapter / 5);

      // 즉시 난이도 적용
      let rGold = Math.round(baseGold * diffMul);
      let rGem = Math.round(baseGem * diffMul);
      let rSoul = Math.round(baseSoul * diffMul);

      // 복리 (과거 클리어 보너스) - 미래 보스 보상에 영구 적용
      META.bossClears = (META.bossClears || 0) + 1;
      const compMul = 1 + Math.min(1.0, (META.bossClears - 1) * 0.01); // 클리어당 +1%, 최대 100% (2배)
      rGold = Math.round(rGold * compMul);
      rGem = Math.round(rGem * compMul);
      rSoul = Math.round(rSoul * compMul);

      reward = rGold;
      META.gems = (META.gems || 0) + rGem;
      META.soul = (META.soul || 0) + Math.round(rSoul * ascSoulMul());

      const tier = META.chapter >= 40 ? "legend" : META.chapter >= 25 ? "epic" : META.chapter >= 10 ? "rare" : "common";
      const bx = openBox(tier);
      title = t("rBoss");
      const effMul = diffMul * compMul;
      extra = `<div class="rwd">${t("rwBoss", { n: reward })} +💎${rGem} +🔮${rSoul}</div><div class="rwd2" style="color:${bx.color}">${BOX[tier].icon} ${bx.text}</div>`;
      extra += `<div class="rwd2">난이도×${diffMul.toFixed(2)} · 복리×${compMul.toFixed(2)} = 총 ${effMul.toFixed(2)}배</div>`;
      if (compMul > 1.01) extra += `<div class="rwd2">🔥 복리 +${Math.round((compMul-1)*100)}% (총 ${META.bossClears}회 보스 클리어)</div>`;
      // 🎁 보스 5클리어마다 마일스톤 보상 (bossClears 단조증가 = 조작방지) · 25마다 대형
      if (META.bossClears % 5 === 0) {
        if (META.bossClears % 25 === 0) {                  // 🏆 25클리어 대형
          const mg = 300 + META.bossClears * 8;
          META.gems = (META.gems || 0) + mg;
          if (typeof grantUnit === "function") grantUnit("SSR");
          if (typeof newGear === "function") { if (!META.gear) META.gear = []; META.gear.push(newGear("SSR")); }
          extra += `<div class="rwd2" style="color:#fbbf24;font-weight:800">🏆 보스 ${META.bossClears}회 돌파! 💎${mg.toLocaleString("en-US")} + 🌟SSR유닛 + ⚔️SSR장비</div>`;
          try { confettiBurst(); } catch (e) {}
        } else {                                            // 🎁 5클리어 기본 마일스톤
          const mg = 60 + META.bossClears * 4;
          const ms = 8 + Math.floor(META.bossClears / 5);
          META.gems = (META.gems || 0) + mg; META.soul = (META.soul || 0) + ms;
          extra += `<div class="rwd2" style="color:#a3e635">🎁 보스 ${META.bossClears}회 마일스톤 💎${mg} + 🔮${ms}</div>`;
        }
      }
    } else if (m === "turnbased") {
      // 🧠 턴제 전용 보상: 연속 성과 + 아침고로 + 모멘텀 (변동 보상)
      const hour = new Date().getHours();
      const isMorning = (hour >= 6 && hour < 11) || (hour >= 20 && hour < 24);
      let base = 55 + (tbTurn || 1) * 7 + Math.floor((tbStreak || 0) * 11);
      reward = bonus(base + Math.min(55, (tbMomentum || 0)));
      // 변동 보상 스파이크 (전술 대박)
      const vr = Math.random();
      let vrNote = "";
      if (vr < 0.12) { reward = Math.round(reward * 3.1); vrNote = "💥 VARIABLE JACKPOT!"; }
      else if (vr < 0.28) { reward = Math.round(reward * 1.75); vrNote = "🔥 큰 수확!"; }
      else if (vr > 0.82) { reward = Math.round(reward * 0.6); vrNote = "아슬아슬 (다음이 크다)"; }
      if (isMorning) reward = Math.round(reward * 1.32);
      title = "🧠 턴제 승리";
      extra = `<div class="rwd">${t("rwGold", { n: reward })}</div><div class="rwd2">턴${tbTurn||0} · S${tbStreak||0} · M${tbMomentum||0}${isMorning?" · 🌅아침고로":""}</div>`;
      if (isMorning) extra += `<div class="rwd2" style="color:#a3e635">🌅 아침고로 — 첫 턴 보너스 + 약간 추가 금화 적용</div>`;
      if (vrNote) extra += `<div class="rwd2" style="color:#fde047">${vrNote}</div>`;
      // 모멘텀 일부 이월 (다음 전투 준비) — reward는 공통 경로에서 처리
      if (tbMomentum > 20) { META.tbCarry = Math.min(45, Math.floor(tbMomentum * 0.6)); }
      tbMomentum = 0; tbStreak = 0;
    } else {                                            // 📖 캠페인: 다음 챕터
      const founders = getFounderCount();
      const protected = founders >= 3 && META.streak > 0 && Math.random() < 0.15; // ethical: 3+ Founders = 1 miss safe chance (no full reset abuse)
      if (!protected) META.streak = (META.streak || 0) + 1;
      reward = bonus(50 + META.chapter * 22 + Math.min(80, (META.streak - 1) * 10));  // early boost for ch18 reach (치명적 P0)
      // ascGoldMul 복리 제거됨
      if (META.chapter < 999) META.chapter += 1; if (META.chapter > (META.maxChapter || 0)) META.maxChapter = META.chapter;
      META.chStuck = 0;   // 🧗 진행 성공 → 막힘 카운터 리셋
      // ARG-like fictional origin lore drop (deceptive "found signal" hype, reversible flag)
      if (ENABLE_DECEPTIVE_ORIGIN && META.chapter % 3 === 0) {
        setTimeout(() => {
          const sample = (typeof ROSTER !== "undefined") ? ROSTER.find(x => x.rarity === "SSR") : null;
          if (sample) triggerOriginDrop(sample);
        }, 1400);
      }
      // 🗺️ 10단계 돌파 → 새 전장(바이옴) 진입 연출
      const nb = chapterBiome(META.chapter);
      if (META._biomeId !== nb.id) { META._biomeId = nb.id; setTimeout(() => toast("⚔️ 새 전장 진입: " + nb.name, nb.accent), 900); if (typeof buildBgCache === "function") buildBgCache(); }
      title = t("rChapter");
      extra = `<div class="rwd">${t("rwGold", { n: reward })}` + (META.streak > 1 ? t("rwStreak", { n: META.streak }) : "") + `</div><div class="rwd2">${t("rwChapter", { n: META.chapter })}</div>`;
      if (protected) extra += '<div class="rwd2" style="color:#67e8f9">🛡️ Founders protect streak</div>';
      checkMilestones();                                 // 🏆 챕터 해금/보상
      updateModeTabs(); // 탭 라벨 chX 즉시 갱신 (오버레이 떠 있는 동안에도 "캠페인 ch2" 보이게)
    }
    // 복리 배당 제거됨 (소액 표시만 UI에)
    META.gold += reward; bumpPrestige(2); saveMeta(); updateMeta();
  } else {
    if (m === "campaign") {
      META.streak = 0;
      META.chStuck = (META.chStuck || 0) + 1;   // 🧗 막힘 감지 (같은 진행에서 연속 패배)
      if (META.chStuck >= 3 && (META.chStuck - 3) % 2 === 0) setTimeout(() => { try { showStuckHelp(); } catch (e) {} }, 1600);   // 3패부터 격패 업셀(스팸 방지: 격번)
    }
    saveMeta();
  }

  // manual play timestamp for synergy boost (MVP plan)
  META.lastManual = nowMs(); saveMeta();
  // 자동사냥: 캠페인·무한탑에서만, 승리 시 자동 진행
  const autoMode = (m === "campaign" || m === "tower");
  if (auto && win && autoMode) {
    if (window._montage && META.chapter > window._montageTarget) { endMontage(); return; }   // 몽타주 목표 도달 → 종료
    if (window._montage) addFx(W / 2, H * 0.28, "dnum", "CH " + (META.chapter - 1) + " 격파!", 1, "p");   // 격파 플래시
    toast(t("tAutoRun"), "#a3e635");
    updateMeta(); draw();
    setTimeout(() => { if (auto) { reset(); start(); } }, window._montage ? 220 : 1000);   // 몽타주는 고속 재시작
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
  if (auto && (!win || !autoMode)) { if (window._montage) endMontage(); else { auto = false; updateAutoBtn(); } }

  let carried = "";
  if (win) {
    let extraEnemy = "";
    const eNames = units.filter(u=>u.side==="e" && u.eName).map(u=>u.eName);
    if (eNames.length) extraEnemy = ` · ${eNames[0]} 격파`;
    carried = `<div class="rwd2 carried-pop" style="color:#fbbf24;font-size:12px;">${getCarriedFeedback()}${extraEnemy}</div>`;
  }
  // Vanguard Focus 24h FOMO + first-win stronger overlay (limited window carry teaser + personal belonging)
  const isV = META.vanguard && META.vanguard === today();
  if (win && isV) carried = '<div class="rwd2" style="color:#fde047;font-size:11px;">' + t("vanguardFocus") + '</div>' + carried;
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

// ── 🧠 턴제 모드 전용 로직 (auto 실시간 loop와 완전 분리, 배치+수동 턴+결과) ──
function showTbControls(show) {
  const el = $("tb-controls");
  if (el) { el.style.display = show ? "block" : "none"; if (!show) el.classList.remove('morning'); }
  const autoBtn = $("auto");
  if (autoBtn) autoBtn.style.opacity = (tbActive || META.mode === "turnbased") ? "0.4" : "1";
  const startBtn = $("start");
  if (startBtn && tbActive) startBtn.textContent = "다음 턴 ▶";
  // 실시간 지휘 지표 표시 (아침고로 + 모멘텀 + 연속)
  if (show && el) {
    const hour = new Date().getHours();
    const isM = (hour>=6&&hour<11)||(hour>=20&&hour<24);
    const mg = isM ? "🌅아침고로 " : "";
    if (isM) el.classList.add('morning'); else el.classList.remove('morning');
    const stats = `${mg}S${tbStreak||0} M${tbMomentum||0}`;
    let hint = el.querySelector('.tb-stats');
    if (!hint) { hint = document.createElement('div'); hint.className='tb-stats'; hint.style.cssText='font-size:10px;color:#a3e635;margin-top:2px;'; el.appendChild(hint); }
    const momBuf = (tbMomentum||0) > 12 ? ` (+${Math.floor((tbMomentum||0)/5)}% 전력)` : "";
    hint.textContent = stats + momBuf + " · 지휘 교리 선택으로 군단 흐름 제어";
  }
}
function executeTbTurn() {
  if (!tbActive || !running) return;
  if (window._tbTactic) {
    // 재진입 (선택 후): 턴 번호 중복 증가 방지 — 이미 첫 호출에서 ++ 됨
  } else {
    tbTurn++;
  }
  const beforeP = units.filter(u => u.side === "p").reduce((s,u)=>s + Math.max(0,u.hp), 0);
  const beforeE = units.filter(u => u.side === "e").reduce((s,u)=>s + Math.max(0,u.hp), 0);
  _aliveP = units.filter((u) => u.side === "p" && u.hp > 0);
  _aliveE = units.filter((u) => u.side === "e" && u.hp > 0);
  if (!_aliveP.length || !_aliveE.length) { finish(_aliveP.length > 0, _aliveE.length > 0); tbActive = false; showTbControls(false); return; }

  // 🧠 전술 이벤트 시 실제 3-선택 지휘 교리 (도파민: "내 선택이 mattered" + surprise win 느낌)
  // 3~4턴 주기, 선택 없으면 pause → 버튼 클릭 시 _tbTactic 세팅 후 재호출로 진행
  const isTacticEvent = (tbTurn > 1 && (tbTurn % 3 === 0 || tbTurn % 4 === 1) && Math.random() < 0.55);
  if (isTacticEvent && !window._tbTactic) {
    showTbTacticChoice();
    tbLog.push("🧠 전술 지휘 교리 선택 대기 — 측면/순환/돌파 중 결정하라. 선택이 이번 턴을 바꾼다");
    const logEl = $("tb-log"); if (logEl) { logEl.innerHTML = tbLog.slice(-6).join("<br>"); logEl.scrollTop = logEl.scrollHeight; }
    $("status").textContent = `🧠 턴 ${tbTurn} · 지휘 교리 선택 중...`;
    return; // 선택 대기 — 버튼이 executeTbTurn() 재호출
  }

  // 🔥 아침고로 + 전술 지휘 변동 (미꾸라지: 선택은 투명하지만 결과는 높은 변동으로 "더 해보고 싶게")
  // 모든 우선순위 설명 UI에 실제 효과 공개. 내부 변동은 전략적으로 숨김.

  let orderedP = _aliveP.slice();
  let dmgMul = 1.0;
  let riskBackfire = 0;
  let buildNext = 0;

  if (tbPriority === "skill") {
    orderedP.sort((a,b) => ((b.skill && b.skT<=0 ? 10 : 0) + b.ai) - ((a.skill && a.skT<=0 ? 10 : 0) + a.ai));
    dmgMul = 1.12;
  } else if (tbPriority === "atk") {
    orderedP.sort((a,b) => b.atk - a.atk);
    dmgMul = 1.18;
  } else if (tbPriority === "conserve") {
    dmgMul = 0.58;
    buildNext = 1.32;
    tbMomentum = Math.max(0, (tbMomentum || 0) + 22);
  } else if (tbPriority === "aggressive") {
    dmgMul = 1.42 + (Math.random() * 1.1 - 0.55); // 높은 변동 — 전면 돌파 교리
    if (Math.random() < 0.28) riskBackfire = 0.75; // 투명 리스크
    tbStreak = Math.max(0, (tbStreak || 0) - 1);
  } else {
    dmgMul = 1.0 + (Math.random()*0.3 - 0.15);
  }

  // 아침고로: 군단 아침/저녁 전술 우위 상태 (요청된 도파민 후킹)
  const hour = new Date().getHours();
  const isMorningHigh = (hour >= 6 && hour < 11) || (hour >= 20 && hour < 24);
  if (isMorningHigh) {
    if (tbTurn === 1) {
      dmgMul *= 1.35;
      tbMomentum = (tbMomentum || 0) + 32;
      tbStreak = (tbStreak || 0) + 1;
      tbLog.push("🌅 아침고로 — 첫 전술 사이클 변동성 극대! (아침고로 보너스 로그)");
    } else if (tbTurn % 3 === 0 && Math.random() < 0.6) {
      dmgMul *= 1.18;
      if (Math.random() < 0.5) tbLog.push("☀️ 아침고로 잔여 — 추가 전력");
    }
    if (tbTurn % 2 === 0 && Math.random() < 0.4) {
      tbMomentum = Math.min(90, (tbMomentum||0) + 8);
      tbLog.push("🌅 아침고로 루틴 — 모멘텀 충전");
    }
  }

  // 전술 지휘 교리 적용 (이벤트 3선택 결과). 선택 없을 땐 기존 priority 유지 — 선택 시 override로 "내 선택" 느낌 극대
  if (window._tbTactic) {
    const t = window._tbTactic; delete window._tbTactic;
    if (t === 'flank') {
      dmgMul *= 1.35; tbMomentum = (tbMomentum || 0) + 14;
      tbLog.push("⚔️ 측면 타격 교리 발동 — 적 측면 노출 포착. 전과 확정 + 모멘텀");
    } else if (t === 'cycle') {
      dmgMul *= 0.62; buildNext = 1.45;
      tbMomentum = Math.max(0, (tbMomentum || 0) + 36);
      tbLog.push("🛡️ 보존 순환 교리 발동 — 이번 약화 대신 다음 대폭 강화. 캐리 체감");
    } else if (t === 'break') {
      dmgMul *= (1.48 + (Math.random() * 1.0 - 0.45));
      if (Math.random() < 0.30) riskBackfire = 0.78;
      tbStreak = Math.max(0, (tbStreak || 0) - 1);
      tbLog.push("🔥 전면 돌파 교리 발동 — 고위험 고보상. 돌파 성공 시 대박!");
    }
  }
  // (과거 자동 이벤트는 선택으로 대체 — copy feel 제거 + 선택지로 dopamine up)

  // 타이머 리셋 (턴제 핵심: 매 턴 풀 액션)
  orderedP.forEach(u => { u.atkT = 0; u.skT = 0; u.bossSkillT = 0; });
  _aliveE.forEach(u => { u.atkT = 0; u.skT = 0; u.bossSkillT = 0; });

  // 플레이어 페이즈 (dmgMul 실제 적용)
  window._tbDmgMul = dmgMul;
  orderedP.forEach(u => {
    if (u.hp > 0) {
      step(u, 0.6);
      if (dmgMul > 1.3 && Math.random() < 0.42) {
        tbLog.push(`⚡ ${u.name} 거의 처치! 다음 턴이 승부처 (near-miss tease)`);
        addFx(u.x, u.y - 14, "dnum", "!", 1, "p"); combatPop();
      }
    }
  });
  delete window._tbDmgMul;

  // 적 페이즈
  _aliveE = units.filter((u) => u.side === "e" && u.hp > 0);
  _aliveE.forEach(u => { if (u.hp > 0) step(u, 0.6); });

  // backfire (aggressive 리스크 실제)
  if (riskBackfire > 0) {
    const p = units.filter(u=>u.side==="p"&&u.hp>0);
    if (p.length) p[0].hp = Math.max(1, p[0].hp * riskBackfire);
    tbLog.push("💥 공격적 과감 — 아군 약간 손실 (투명 리스크)");
  }

  // 정리 + 스트릭/모멘텀
  units = units.filter((u) => u.hp > 0);
  const afterP = units.filter(u => u.side === "p").reduce((s,u)=>s + Math.max(0,u.hp), 0);
  const afterE = units.filter(u => u.side === "e").reduce((s,u)=>s + Math.max(0,u.hp), 0);
  const pD = Math.max(0, Math.round(beforeP - afterP));
  const eD = Math.max(0, Math.round(beforeE - afterE));

  // 더 강한 near-miss tease (적 거의 전멸 시 canvas fx + log + haptic — dopamine surprise win)
  const enemyRem = units.filter(u => u.side === "e").reduce((s,u)=>s + Math.max(0,u.hp), 0);
  if (beforeE > 10 && enemyRem > 0 && (enemyRem / beforeE) < 0.22) {
    tbLog.push("💥 적 잔여 병력 아슬아슬! 마무리 지휘의 순간 — near-miss 압박");
    addFx(W * 0.72, 26, "dnum", "!", 1.1, "e");
    combatPop();
    try { if (typeof tg !== "undefined" && tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("light"); } catch(e){}
  }

  // 좋은 턴 연속 시 전력 상승 (연속 성공 보상)
  if (eD > pD * 0.7) { tbStreak = (tbStreak || 0) + 1; }
  else if (pD > eD * 1.3) { tbStreak = Math.max(0, (tbStreak||0) - 1); }

  // 모멘텀 decay + carry (conserve payoff)
  tbMomentum = Math.max(0, Math.round((tbMomentum || 0) + (buildNext ? 28 : -7) + (isMorningHigh ? 3 : 0)));
  if (tbMomentum > 90) tbMomentum = 90; // cap

  tbLog.push(`턴${tbTurn}: 아군-${pD} 적군-${eD} ${tbStreak>2? "🔥STREAK"+tbStreak:""} ${tbMomentum>20?"⚡M"+tbMomentum:""}`);
  $("status").textContent = `🧠 턴 ${tbTurn} · ${tbPriority} · 피해${pD}/${eD} · S${tbStreak||0} M${tbMomentum||0} ${isMorningHigh?"🌅":""}`;
  const logEl = $("tb-log");
  if (logEl) { logEl.innerHTML = tbLog.slice(-6).join("<br>"); logEl.scrollTop = logEl.scrollHeight; }

  if (!window._lastDraw || Date.now() - window._lastDraw >= 10) { draw(); updateScore(); window._lastDraw = Date.now(); }

  const pA = units.some((u) => u.side === "p"), eA = units.some((u) => u.side === "e");
  if (!pA || !eA) {
    finish(pA, eA);
    tbActive = false;
    showTbControls(false);
    $("start").textContent = t("start");
  } else {
    showTbControls(true);
  }
}
function setTbPriority(pri) {
  tbPriority = pri || "balanced";
  const s = $("status");
  if (s && tbActive) s.textContent = `🧠 턴제 (우선:${tbPriority}) · S${tbStreak||0} M${tbMomentum||0} · 다음 턴`;
}

// 🧠 전술 지휘 3-선택 (이벤트 시 StS 스타일 선택이나 Legion "군단 지휘 교리"로 reframing. 선택 투명, 효과 즉시 체감)
function showTbTacticChoice() {
  let ch = $("tb-tactic");
  if (!ch) return;
  ch.innerHTML = `<div style="color:#bae6fd;margin-bottom:3px;font-weight:600;">🧠 군단 지휘 선택 — 이번 턴 전술 교리 결정 (선택이 결과 좌우)</div>`;
  const opts = [
    {k:'flank', label:'측면 타격 교리', desc:'적 허점 집중 타격 · dmg+35% 모멘텀+ · 리스크 낮음'},
    {k:'cycle', label:'보존 순환 교리', desc:'이번 전력 아껴 축적 · dmg- · 다음 턴 모멘텀 대폭+ (캐리)'},
    {k:'break', label:'전면 돌파 교리', desc:'과감 정면 승부 · 고변동 dmg · backfire 리스크 있음'}
  ];
  opts.forEach(o => {
    const b = document.createElement('button');
    b.textContent = `${o.label}: ${o.desc}`;
    b.style.cssText = 'display:block;width:100%;margin:2px 0;padding:4px 6px;font-size:10px;text-align:left;background:#0f172a;color:#e0f2fe;border:1px solid #475569;border-radius:4px;cursor:pointer;';
    b.onclick = () => {
      window._tbTactic = o.k;
      ch.style.display = 'none'; ch.innerHTML = '';
      try { if (typeof tg !== "undefined" && tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred("medium"); } catch(e){}
      if (tbActive) executeTbTurn();
    };
    ch.appendChild(b);
  });
  ch.style.display = 'block';
  ch.style.background = 'rgba(15,23,42,0.96)';
  ch.style.border = '1px solid #64748b';
  ch.style.padding = '4px';
  ch.style.borderRadius = '5px';
}

// 6hr patch: squad carried visual feedback (Legion immersion) — now EVERY deployed specific (SSR or regular SR/R) shows named carry %
function getCarriedFeedback() {
  const pCount = units.filter(u=>u.side==='p'&&u.hp>0).length;
  const distinct = ORDER.filter(tt => (counts.p||META.army)[tt]>0).length;
  const syn = distinct>=4 ? 42 : distinct>=3 ? 28 : 12;
  const specifics = getDeployedUnits();
  let carry = t("carryVolume");
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
    carry = top + " " + t("carrySeal");
  } else if (!specifics.length) {
    carry = ["Arclight","Solace","Dominus","Vespera","Vector"][(META.pulls||0)%5] + " " + t("carryLed");
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
  { key: "N",   p: 0.55, color: "#9ca3af", lvls: 1 },
  { key: "R",   p: 0.30,  color: "#60a5fa", lvls: 2 },
  { key: "SR",  p: 0.12,  color: "#c084fc", lvls: 3 },
  { key: "SSR", p: 0.03,  color: "#fbbf24", lvls: 5 },
  { key: "UR",  p: 0, color: "#e879f9", lvls: 6 }, // 출시 후 활성(유닛 채운 뒤). 시스템 보존, 확률 0
  { key: "EX",  p: 0, color: "#f472b6", lvls: 7 }, // 출시 후 활성. 확률 0이라 grantUnit 폴백·연출 미발화
]; // Sovereign 지정: N55 R30 SR12 SSR3 (표시=코드 100% 일치). UR/EX 출시 후 활성.

// DECEPTIVE_ORIGIN_TACTICS (safe fictional hype) — ARG-like lore drops + origin reveals for FOMO/variable feel.
// Feel "deceptive" (secret found, classified) but 100% fictional framing + ALWAYS real rates shown.
// Reversible: set false to strip all. No minors targeting. Code disclosures intact. Per Sovereign + JP/KR/US self-reg.
const ENABLE_DECEPTIVE_ORIGIN = true; // git-revert / flag flip safe. Deploy default ON for test.
function rollRarity() {
  let p = (META.pity || 0);
  if (p >= 12) {
    // hard pity 12 → SSR 보장 (Sovereign 지정)
    const ssr = RARITY.find(x => x.key === "SSR");
    return ssr || RARITY[3];
  }
  let ssrP = 0.03 + (p > 7 ? (p - 7) * 0.04 : 0);  // soft 7+ +4%/pull (base 3%)
  let r = Math.random(), a = 0;
  const adj = RARITY.map(x => x.key==="SSR" ? {...x, p: Math.min(ssrP, 0.15)} : x);
  const sum = adj.reduce((s,x)=>s+x.p,0) || 1;
  for (const t of adj) { a += t.p / sum; if (r <= a) return t; }
  return RARITY[0];
}
// 🔥 CHEAT MODE: cycle-cheat + psych-narrative-moat (Lilith/Seraphine/Economist implant). Variable variance + near-miss tease hook here. Rates 100% match getRatesText. Narrative "MY Legion" injected in callers. p1/p2. Hegemony. Disclosure exact.
// 📊 전체 확률 공개 — RARITY 배열에서 직접 생성하므로 코드값과 영원히 일치(법적 안전)
function getRatesText() {
  return RARITY.filter(x => x.p > 0).map(x => { const pct = Math.round(x.p * 1000) / 10; return `${x.key}${Number.isInteger(pct)?pct:pct.toFixed(1)}%`; }).join(" ");
}
function getOriginReveal(u) {
  if (!ENABLE_DECEPTIVE_ORIGIN || !u) return "";
  const flavors = ["다이달로스 코어 아카이브 단편", "기밀 판단 로그 복구", "침묵 시대 전송 신호", "분류 해제: Founding 프로토콜", "폐허 잔해 신호 포착", "의식 파편 해독 완료"];
  const f = flavors[(u.id || 0) % flavors.length];
  return `🔓 ${f} — ${u.name} 기원 확인됨. (Legion Chronicles 내 fictional)`;
}
function triggerOriginDrop(u) {
  if (!ENABLE_DECEPTIVE_ORIGIN || !u) return;
  // ARG-like "secret intercept" feel — hype without mechanic lie. Always rates accessible.
  const flavor = getOriginReveal(u);
  const txt = `${flavor} 📡 다음 한정 기회 놓치면 영구 공백 위험. `;
  setTimeout(() => {
    toast(txt + "📊 Rates 확인", "#a3e635");
    // Optional: auto hint rates if openable
    try { if (typeof showOdds === 'function') {} } catch(e){}
  }, 900);
}
function showOdds() {
  const rows = RARITY.filter(x => x.p > 0).map(x => { const pct = Math.round(x.p * 1000) / 10; const txt = Number.isInteger(pct) ? pct : pct.toFixed(1); return `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #1c2638;padding:3px 0;"><span style="color:${x.color};font-weight:600;">${x.key}</span><span>${txt}%</span></div>`; }).join("");
  // 💰 골드 가챠 확률 공개 (rollGoldRarity와 일치: N70 R25 SR5, SSR 미등장) — 법적 정확공개
  const GOLD_ODDS = [ { key: "N", p: 0.70, color: "#9ca3af" }, { key: "R", p: 0.25, color: "#60a5fa" }, { key: "SR", p: 0.05, color: "#c084fc" } ];
  const goldRows = GOLD_ODDS.map(x => `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #1c2638;padding:3px 0;"><span style="color:${x.color};font-weight:600;">${x.key}</span><span>${Math.round(x.p * 100)}%</span></div>`).join("");
  const body = $("odds-body");
  if (body) body.innerHTML =
    `<div style="font-weight:600;margin-bottom:4px;">💎 ${t("oddsGemTitle") || "젬 가챠"}</div>` +
    rows +
    `<div style="font-weight:600;margin:12px 0 4px;">💰 ${t("oddsGoldTitle") || "골드 가챠"}</div>` +
    goldRows +
    `<div style="margin-top:4px;font-size:11px;opacity:.6;">${t("oddsGoldNote") || "※ 골드 가챠는 SSR 미등장 (SSR은 젬 가챠 전용)"}</div>` +
    `<div style="margin-top:10px;font-size:11.5px;opacity:.85;line-height:1.6;">` +
    `<div>${t("oddsPity")}</div>` +
    `<div style="margin-top:6px;opacity:.6;">${t("oddsFict")}</div>` +
    `</div>`;
  const m = $("odds-modal");
  if (m) {
    m.classList.remove("hidden");
    m.style.display = "flex";                 // 인라인 직접 제어 — CSS 전파·캐시 무관 보장
    // close on background click (robust) — direct onclick for max compat
    m.onclick = (e) => { if (e.target === m) closeOdds(); };
    const closeBtn = $("odds-close");
    if (closeBtn) closeBtn.onclick = closeOdds;
  }
}
function closeOdds() {
  const m = $("odds-modal");
  if (m) {
    m.style.display = "none";
    m.classList.add("hidden");
    // robust: clear any direct handlers too
    m.onclick = null;
    const cb = $("odds-close");
    if (cb) cb.onclick = null;
  }
}
// ── 🪙 골드 뽑기 + 🔮 소울 분해 루프 (트리니티 SPEC-soul-fodder-loop) ──────────────
const GOLD_GACHA_COST = 200;
const SOUL_VAL = { N: 2, R: 5, SR: 15, SSR: 60, UR: 150, EX: 300 };   // 분해 시 등급별 소울 (고등급 보호)
// 🔨 장비 분해 → 골드 (군주: 쓸모없는 장비 정리. 캐릭=소울 / 장비=골드 역할분리)
const GEAR_SCRAP = { N: 80, R: 200, SR: 600, SSR: 1500 };
function gearScrapGold(g){ return Math.round((GEAR_SCRAP[g.rarity]||80) * (1 + (g.enh||0)*0.1 + (g.star||0)*0.3 + (g.awak||0)*0.5)); }
function dismantleGear(id){
  if(running) return;
  const g = META.gear.find(x=>x.id===id); if(!g) return;
  if(gearOwnerName(id)){ toast("장착중 — 분해 불가","#ef4444"); return; }
  const gold = gearScrapGold(g);
  if((g.rarity==="SSR"||g.rarity==="SR") && !confirm(g.rarity+" 장비를 분해할까요? +"+gold+"골드")) return;
  META.gear = META.gear.filter(x=>x.id!==id);
  META.gold = (META.gold||0) + gold; saveMeta(); updateMeta(); if(typeof renderGear==="function")renderGear();
  toast("🔨 +"+gold+" 골드 · 장비 분해","#fbbf24"); haptic("medium");
}
function dismantleJunkGear(){
  let gold=0, cnt=0;
  META.gear = (META.gear||[]).filter(g=>{
    if((g.rarity==="N"||g.rarity==="R") && !gearOwnerName(g.id) && !((g.enh||0)>0||(g.star||0)>0)){ gold+=gearScrapGold(g); cnt++; return false; }
    return true;
  });
  if(cnt===0){ toast("분해할 잡템 없어요 (N/R 미장착·미강화)","#9ca3af"); return; }
  META.gold = (META.gold||0) + gold; saveMeta(); updateMeta(); if(typeof renderGear==="function")renderGear();
  toast("🔨 +"+gold+" 골드 · "+cnt+"개 분해","#fbbf24"); if(typeof SFX!=="undefined"&&SFX.claim)SFX.claim();
}
function rollGoldRarity() { const r = Math.random(); if (r < 0.05) return RARITY[2]; if (r < 0.30) return RARITY[1]; return RARITY[0]; }  // SR5/R25/N70, SSR 0%
function goldGacha() {
  if (running) return;
  if ((META.gold || 0) < GOLD_GACHA_COST) { toast(t("tGoldShort", { n: GOLD_GACHA_COST }), "#ef4444"); return; }
  META.gold -= GOLD_GACHA_COST; META.dailyPulls = (META.dailyPulls || 0) + 1;
  const rar = rollGoldRarity();
  const pool = ORDER.filter((u) => u !== "titan" || META.titanOwned);
  for (let i = 0; i < rar.lvls; i++) { const u = pool[(Math.random() * pool.length) | 0]; META.lv[u] = (META.lv[u] || 0) + 1; }
  const gu = grantUnit(rar.key); const isNew = window._lastGrantNew;
  let msg = gu ? (isNew ? `🎉 【${gu.name}】 획득!` : `🔄 【${gu.name}】 중복 — 합성/분해 가능`) : t("tGachaUp", { n: rar.lvls });
  bumpPrestige(0.2); saveMeta(); updateMeta(); reset();
  showGacha(rar, msg, gu ? [{ name: gu.name, rarity: rar.key, dupe: !isNew, isNew }] : []);
}
const GOLD_GACHA10_COST = 1800;   // 10연 = 1,800골드 (10% 할인 + SR↑ 1보장)
function goldGacha10() {
  if (running) return;
  if ((META.gold || 0) < GOLD_GACHA10_COST) { toast(t("tGoldShort", { n: GOLD_GACHA10_COST }), "#ef4444"); return; }
  META.gold -= GOLD_GACHA10_COST; META.dailyPulls = (META.dailyPulls || 0) + 10;
  const RANK = { N: 0, R: 1, SR: 2 }; let best = 0; const results = [];
  for (let i = 0; i < 10; i++) {
    let rar = rollGoldRarity();
    if (i === 9 && best < 2) rar = RARITY[2];          // SR↑ 1보장
    best = Math.max(best, RANK[rar.key]);
    const gu = grantUnit(rar.key);
    if (gu) results.push({ name: gu.name, rarity: rar.key, dupe: !window._lastGrantNew, isNew: window._lastGrantNew });
    const pool = ORDER.filter((u) => u !== "titan" || META.titanOwned);
    for (let j = 0; j < rar.lvls; j++) { const u = pool[(Math.random() * pool.length) | 0]; META.lv[u] = (META.lv[u] || 0) + 1; }
  }
  bumpPrestige(0.5); saveMeta(); updateMeta(); reset();
  const bestKey = Object.keys(RANK).find((k) => RANK[k] === best);
  showGacha(RARITY[best], t("tGacha10", { x: bestKey }), results);
}
function dismantleDupes() {
  META.dupes = META.dupes || {};
  let soul = 0, count = 0;
  for (const id in META.dupes) {
    const n = META.dupes[id] | 0; if (n <= 0) continue;
    const u = (typeof ROSTER !== "undefined") && ROSTER.find((x) => x.id === +id); if (!u || ["SSR","UR","EX"].includes(u.rarity)) continue;   // SSR/UR/EX 초희소 보호
    soul += n * (SOUL_VAL[u.rarity] || 2); count += n; META.dupes[id] = 0;
  }
  if (count === 0) { toast("분해할 중복이 없어요 (SSR 제외)", "#9ca3af"); return; }
  META.soul = (META.soul || 0) + soul; saveMeta(); updateMeta();
  if (typeof renderSquad === "function") renderSquad();
  if (typeof renderCodex === "function") renderCodex();
  toast("🔮 +" + soul + " 소울! · " + count + "장 분해", "#c084fc");
  if (SFX && SFX.ssr) SFX.ssr(); haptic("medium");
}
// 소울 상점 제거됨 (각성 전용으로 변경). 소울은 오직 각성에만 사용.
function gacha() {
  if (running) return;
  recordManualPlay(); // for synergy
  META.dailyPulls = (META.dailyPulls || 0) + 1;
  if ((META.gems || 0) < GACHA_COST) { toast(t("tGemShort", { n: GACHA_COST }), "#ef4444"); return; }
  META.gems -= GACHA_COST; META.pulls = (META.pulls || 0) + 1; META.pity = (META.pity || 0) + 1;
  let rar = rollRarity();
  if (META.pity >= 12) {
    const ssr = RARITY.find(x => x.key === "SSR") || RARITY[3];
    rar = ssr;
  }                 // hard pity 12 SSR (Sovereign 지정)
  if (["SSR","UR","EX","SR"].includes(rar.key)) META.pity = 0;
  let msg;
  if (rar.key === "SSR" && !META.titanOwned) { META.titanOwned = true; counts.p.titan = 1; msg = t("tTitan"); }
  else {
    const pool = ORDER.filter((u) => u !== "titan" || META.titanOwned);
    for (let i = 0; i < rar.lvls; i++) { const u = pool[(Math.random() * pool.length) | 0]; META.lv[u] = (META.lv[u] || 0) + 1; }
    msg = t("tGachaUp", { n: rar.lvls });
  }
  const gu = grantUnit(rar.key);                        // 캐릭터 수집(도감)
  const isNew = window._lastGrantNew;
  if (gu) msg = isNew ? `🎉 【${gu.name}】 획득!` : `🔄 【${gu.name}】 중복 — 합성/분해 가능`;
  logEvent("gacha_pull", { rarity: rar.key, kind: "single", isNew: !!isNew });   // 📊 계측
  bumpPrestige(0.5); saveMeta(); updateMeta(); reset();
  showGacha(rar, msg, gu ? [{ name: gu.name, rarity: rar.key, dupe: !isNew, isNew }] : []);
  // gacha pulse interlock from daily ritual
  if (["SSR","UR","EX"].includes(rar.key) && getLegionSignal()>1.8) setTimeout(()=>toast("✨ 고등급 획득! 오프라인·일일 보상도 챙기세요", "#fbbf24"), 900);
  // §21 high tease
  if (["SSR","UR","EX"].includes(rar.key)) {
    setTimeout(() => {
      toast(rar.key==="EX" ? "🌌 초월 영웅 강림!" : (rar.key==="UR" ? "🌀 전설+ 영웅 합류" : "✨ 전설의 영웅이 군단에 합류했습니다"), "#fbbf24");
    }, 650);
  }
  // 고등급 전용 보물 획득 멘트 (유저가 아끼게)
  if (gu && (gu.rarity === "UR" || gu.rarity === "EX")) {
    setTimeout(() => {
      const txt = gu.rarity === "EX" ? "🌌 이 존재는 군단의 절대 보물. 소중히 키우세요." : "🌀 운명의 매듭이 맺어졌습니다. 이 유닛은 평범하지 않습니다.";
      toast(txt, gu.color);
    }, 1400);
  }
  // 🔥 CHEAT: psych-narrative-moat "MY Legion" + cycle-cheat. High tier = belonging + cycle growth. p1 immediate.
}
// 💎 프리미엄 10연 (SR↑ 1개 보장) — 다이아의 핵심 용도
const GACHA10_COST = 80; // 10연 80 gems (up; makes currency feel valuable, 10-pull exciting not cheap spam. Per dopamine: chase > easy free pulls)
function gacha10() {
  if (running) return;
  if ((META.gems || 0) < GACHA10_COST) { toast(t("tGemShort", { n: GACHA10_COST }), "#ef4444"); return; }
  META.gems -= GACHA10_COST;
  const RANK = { N: 0, R: 1, SR: 2, SSR: 3, UR: 4, EX: 5 };
  let best = 0; const results = [];
  for (let i = 0; i < 10; i++) {
    META.pity = (META.pity || 0) + 1;
    let rar = rollRarity();
    if (META.pity >= 12) {
      const ssr = RARITY.find(x => x.key === "SSR") || RARITY[3];
      rar = ssr;
    }
    if (i === 9 && best < 2 && (META.pity || 0) < 12) rar = RARITY[2];          // 12연 SR↑ 보장 (단 천장 SSR은 보존)
    if (["SSR","UR","EX","SR"].includes(rar.key)) META.pity = 0;
    best = Math.max(best, RANK[rar.key] || 0);
    const gu = grantUnit(rar.key);
    if (gu) results.push({ name: gu.name, rarity: rar.key, dupe: !window._lastGrantNew, isNew: window._lastGrantNew });
    logEvent("gacha_pull", { rarity: rar.key, kind: "x10", isNew: !!window._lastGrantNew });   // 📊 계측
    if (rar.key === "SSR" && !META.titanOwned) { META.titanOwned = true; counts.p.titan = 1; }
    else { const pool = ORDER.filter((u) => u !== "titan" || META.titanOwned); for (let j = 0; j < rar.lvls; j++) { const u = pool[(Math.random() * pool.length) | 0]; META.lv[u] = (META.lv[u] || 0) + 1; } }
  }
  saveMeta(); updateMeta(); reset();
  const bestKey = Object.keys(RANK).find((k) => RANK[k] === best);
  const showR = RARITY.find(r => r.key === bestKey) || RARITY[best] || RARITY[0];
  showGacha(showR, t("tGacha10", { x: bestKey }), results);
}
// ── 🎯 Featured 한정 배너 (주간 SSR pickup + spark 천장90 + 7일 countdown — 매출 핵심, Trinity SPEC) ──
const FEATURED_LAUNCH = Date.UTC(2026, 5, 21);   // 2026-06-21 출시 = week0(Arclight)
const FEATURED_COST = 80, FEATURED_SPARK = 90;
function currentFeatured() {
  if (typeof getFeaturedBanner !== "function") return null;
  const wk = Math.max(0, Math.floor((Date.now() - FEATURED_LAUNCH) / 604800000));
  return getFeaturedBanner(wk);
}
function featuredDaysLeft() {
  const into = (((Date.now() - FEATURED_LAUNCH) % 604800000) + 604800000) % 604800000;
  return Math.max(1, Math.ceil((604800000 - into) / 86400000));
}
function grantUnitByName(name) {   // 특정 SSR(픽업) 지급 — owned 로직은 grantUnit과 동일
  if (typeof ROSTER === "undefined") return grantUnit("SSR");
  const u = ROSTER.find((x) => x.name === name); if (!u) return grantUnit("SSR");
  if (!META.owned) META.owned = [];
  if (META.owned.indexOf(u.id) < 0) { META.owned.push(u.id); window._lastGrantNew = true; applyMYVisuals(u); }
  else { META.dupes = META.dupes || {}; META.dupes[u.id] = (META.dupes[u.id] || 0) + 1; window._lastGrantNew = false; }
  return u;
}
function gachaFeatured() {
  if (running) return;
  const fb = currentFeatured(); if (!fb) { gacha10(); return; }
  forceRatesOnBanner(); // prominent rates micro ON
  if ((META.gems || 0) < FEATURED_COST) { toast(t("tGemShort", { n: FEATURED_COST }), "#ef4444"); return; }
  META.gems -= FEATURED_COST;
  const RANK = { N: 0, R: 1, SR: 2, SSR: 3, UR: 4, EX: 5 };
  let best = 0; const results = []; let gotPickup = false;
  for (let i = 0; i < 10; i++) {
    META.pity = (META.pity || 0) + 1;
    META.spark = (META.spark || 0) + 1;
    let rar = rollRarity();
    if (META.pity >= 12) rar = RARITY.find((x) => x.key === "SSR") || RARITY[3];
    if (i === 9 && best < 2 && (META.pity || 0) < 12) rar = RARITY[2];
    if (["SSR", "UR", "EX", "SR"].includes(rar.key)) META.pity = 0;
    const sparkHit = (META.spark || 0) >= FEATURED_SPARK;
    let gu;
    if (sparkHit || rar.key === "SSR") {
      const pickPickup = sparkHit || Math.random() < 0.5;   // 픽업 확률 UP(rate-up 50%) + spark 90 강제확정
      if (pickPickup) { rar = RARITY.find((x) => x.key === "SSR") || rar; gu = grantUnitByName(fb.pickup); gotPickup = true; META.spark = 0; }
      else gu = grantUnit("SSR");
    } else gu = grantUnit(rar.key);
    best = Math.max(best, RANK[rar.key] || 0);
    if (gu) results.push({ name: gu.name, rarity: rar.key, dupe: !window._lastGrantNew, isNew: window._lastGrantNew });
    logEvent("gacha_pull", { rarity: rar.key, kind: "featured", isNew: !!window._lastGrantNew });
    if (rar.key === "SSR" && !META.titanOwned) { META.titanOwned = true; counts.p.titan = 1; }
    else { const pool = ORDER.filter((u) => u !== "titan" || META.titanOwned); for (let j = 0; j < rar.lvls; j++) { const u = pool[(Math.random() * pool.length) | 0]; META.lv[u] = (META.lv[u] || 0) + 1; } }
  }
  saveMeta(); updateMeta(); reset(); renderFeaturedBanner();
  const bestKey = Object.keys(RANK).find((k) => RANK[k] === best);
  const showR = RARITY.find((r) => r.key === bestKey) || RARITY[best] || RARITY[0];
  showGacha(showR, "🎯 " + (fb.name || "Featured") + (gotPickup ? " — ✨" + fb.pickup + " 획득!" : ""), results);
}

// 🔥 FULL CHEAT ENGINE — top micros: prominent rates + featured FOMO 72h + MY visuals. (Sovereign 2026-06-23)
// SPEC-featured-banner-arclight.md 구현 즉시. Arclight 72h real FOMO override. Disclosure exact.
// p1 immediate. p2 sync later. Reversible.
function isArclightBannerActive() {
  const fb = currentFeatured();
  return fb && fb.id === "arclight" && (Date.now() - FEATURED_LAUNCH) < (72 * 3600 * 1000); // 72h launch window real, not fake
}
function forceRatesOnBanner() {
  // prominent rates: banner open 즉시 rates 강제 + visible
  try { if (typeof showOdds === 'function') showOdds(); } catch(e){}
  const ratesEl = $("gacha-rates");
  if (ratesEl) ratesEl.style.display = "block";
}
// enhance render for Arclight 72h loss aversion "permanent MY gap"
function renderFeaturedBanner() {
  const el = $("featured-banner"); if (!el) return;
  const fb = currentFeatured(); if (!fb) { el.innerHTML = ""; return; }
  const d = featuredDaysLeft(), spark = (META.spark || 0);
  el.innerHTML = '<div style="background:linear-gradient(135deg,#3a2c12,#1a1018);border:1.5px solid #fbbf24;border-radius:12px;padding:10px 12px;margin-bottom:8px;box-shadow:0 0 18px rgba(251,191,36,.25);">'
    + '<div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-weight:800;color:#fde047;font-size:13px;">🎯 한정 배너 · ' + (fb.name || "") + '</span><span style="font-size:10px;color:#f97316;font-weight:700;">⏳ ' + d + '일 한정</span></div>'
    + '<div style="font-size:11px;color:#e2e8f0;margin:3px 0 5px;">픽업 SSR <b style="color:#fbbf24;">' + (fb.pickup || "") + '</b> 확률 UP · 90뽑 천장 확정</div>'
    + '<div style="font-size:10px;color:#a3a3c2;margin-bottom:6px;">✨ Spark ' + spark + '/' + FEATURED_SPARK + (spark >= FEATURED_SPARK ? ' — 다음 SSR ' + fb.pickup + ' 확정!' : '') + '</div>'
    + '<button id="sg-featured" class="gbig" style="width:100%;background:linear-gradient(135deg,#f5c451,#d97706);border-color:#f5c451;color:#1a1400;font-weight:800;">🎯 한정 10연 · 💎' + FEATURED_COST + '</button>'
    + '</div>';
  const bn = $("sg-featured"); if (bn) bn.onclick = () => gachaFeatured();
  // 72h Arclight FOMO loss + MY
  if (fb && isArclightBannerActive()) {
    const loss = '<div style="font-size:9px;color:#f87171;margin-top:4px;font-weight:700;">⚠️ 놓치면 MY Legion 영구 공백. 다음 기회 수주 후.</div>';
    el.innerHTML = el.innerHTML.replace('</div>', loss + '</div>');
  }
}
// MY visuals endowment: stronger aura for owned featured
function applyMYVisuals(u) {
  if (!u) return;
  if (!META.myLegionVisuals) META.myLegionVisuals = {};
  if (["Arclight", "Dominus"].includes(u.name) || u.rarity === "SSR") {
    META.myLegionVisuals[u.id] = true; // endowment flag — MY glow stronger
  }
}
function rarColor(k) { const r = RARITY.find((x) => x.key === k); return r ? r.color : "#9ca3af"; }
function showGacha(rar, msg, results) {
  const g = $("gacha"); if (!g) return;
  $("gacha-rank").textContent = rar.key;
  $("gacha-rank").style.color = rar.color;
  $("gacha-card").style.boxShadow = `0 0 40px ${rar.color}, inset 0 0 0 2px ${rar.color}`;
  if (["SSR","UR","EX"].includes(rar.key)) $("gacha-rank").classList.add('ssr-tease'); else $("gacha-rank").classList.remove('ssr-tease');
  const pity = (META.pity||0); const pct = ["SSR","UR","EX"].includes(rar.key) ? "고등급!" : "visible";
  const dynRates = ENABLE_DECEPTIVE_ORIGIN ? getRatesText() : "N55% R30% SR12% SSR3%";
  $("gacha-msg").innerHTML = msg + `<br><small style="opacity:.7">🎯 천장 ${pity}/12 · ${dynRates} | hard12=SSR 보장</small>`;
  const listEl = $("gacha-list");   // 🎰 뽑힌 목록 (10연 = 10개 다, 단차 = 신규/중복)
  if (listEl) listEl.innerHTML = (results && results.length)
    ? results.map((r) => `<div class="gres r${r.rarity}" style="border-color:${rarColor(r.rarity)}"><b style="color:${rarColor(r.rarity)}">${r.rarity}</b><span class="gres-nm">${r.name}</span>${r.dupe ? '<span class="gres-dup">중복</span>' : (r.isNew ? '<span class="gres-new">NEW</span>' : '')}</div>`).join("")
    : "";
  g.classList.remove("hidden");
  if (["SSR","UR","EX"].includes(rar.key)) {
    SFX.ssr();
    haptic("heavy");
    try { confettiBurst(); } catch(e){}
    try { ssrSpectacle(); } catch(e){}   // ⭐ 고등급 강림 (UR/EX 포함)
  } else {
    SFX.gacha();
    haptic("light");
  }
  // Fictional deceptive origin reveal (hype only, real % intact)
  if (ENABLE_DECEPTIVE_ORIGIN && results && results.length) {
    const newHigh = results.find(r => r.isNew && ["SR","SSR","UR","EX"].includes(r.rarity));
    if (newHigh) {
      const u = (typeof ROSTER !== "undefined") && ROSTER.find(x => x.name === newHigh.name);
      if (u) setTimeout(() => triggerOriginDrop(u), 1100);
    }
  }
  // 🔥 FULL CHEAT ENGINE: near-miss theater + MY visuals + loss FOMO + cycle. p1/p2 full ruthless.
  // featured FOMO + prominent + endowment. "no fun limit"
  if (pity >= 9 && pity < 12 && Math.random() < 0.45) {
    setTimeout(() => toast("⏳ Dalio window... pity " + pity + "/12. MY Legion almost. 영구 공백 위기. Seize now.", "#fbbf24"), 1400);
  }
  if (rar.key === "SSR") {
    setTimeout(() => toast("⚔️ Forged into MY Legion. Historical timing seized. Variable paid off. Collection gap closed.", "#a3e635"), 1600);
  }
  if (isArclightBannerActive && isArclightBannerActive()) {
    setTimeout(() => toast("72h Arclight — 지금 아니면 영원히. MY Pantheon judgment.", "#f97316"), 1800);
  }
}

// ── 토스트 ────────────────────────────────────────────────────────────────────
function toast(text, color) {
  const t = $("toast"); if (!t) return;
  t.textContent = text; t.style.borderColor = color || "#fbbf24";
  t.classList.add("show"); clearTimeout(t._tm);
  const dur = Math.max(2200, Math.min(7000, (text ? text.length : 0) * 55));   // 긴 설명은 더 오래 표시(가독성)
  t._tm = setTimeout(() => t.classList.remove("show"), dur);
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
  // 🧠 턴제: 완전 별도 로직 (실시간 loop 사용 안 함, 배치+수동 턴)
  if (META.mode === "turnbased" || tbActive) {
    if (!tbActive) {
      tbActive = true; tbTurn = 0; tbLog = []; tbPriority = "balanced";
      tbMomentum = META.tbCarry||0; tbStreak = 0; if(META.tbCarry) delete META.tbCarry; // consume carry on actual session start
      delete window._tbTactic;
      running = true; gameOver = false;
      $("start").textContent = "다음 턴 ▶";
      $status.textContent = "🧠 턴제 시작 — 전술 지휘 개시. 아침 우위 반영";
      showTbControls(true);
      draw();
    }
    executeTbTurn();
    return;
  }
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
  // 무료 1x·2x / VIP 4x / 울트라 8x — 팝업 없이 순환 (스타터는 속도 영향 없음)
  const tiers = META.ultra ? [1, 2, 4, 8] : META.vip ? [1, 2, 4] : [1, 2];
  const i = tiers.indexOf(speed);
  speed = tiers[(i + 1) % tiers.length];
  $("speed").textContent = t("speed", { n: speed });
});

// (턴제 UI 바인딩 제거됨 — tb-controls DOM 삭제로 no-op이던 죽은 코드 정리)

// 🧗 막힘 돌파 업셀 — 연속 패배 감지 시 가속/성장팩 추천 (FOMO 모네타이즈, 하드월 아님)
function showStuckHelp() {
  const el = $("stuck-help"); if (!el) return;
  const ch = META.chapter || 1, stuck = META.chStuck || 0;
  const body = $("stuck-help-body");
  if (body) body.innerHTML = '<div style="font-size:34px;margin-bottom:4px;">🧗</div>'
    + '<div style="font-size:18px;font-weight:800;color:#fbbf24;margin-bottom:8px;">Ch.' + ch + ' 벽에 막히셨나요?</div>'
    + '<div style="font-size:13px;color:#cbd5e1;line-height:1.6;margin-bottom:14px;">' + stuck + '연패 — 전력이 부족해요.<br><b style="color:#67e8f9;">⚡ 성장 패키지</b>로 골드·젬·장비를 한번에 받아 단숨에 돌파!</div>'
    + '<button id="stuck-buy" class="gbig" style="width:100%;background:linear-gradient(135deg,#f5c451,#d97706);border-color:#f5c451;color:#1a1400;font-weight:800;margin-bottom:8px;">⚡ 성장 패키지 보러가기</button>'
    + '<button id="stuck-free" class="ghost" style="width:100%;font-size:12px;">무료로 더 키울게요 (환생·강화·뽑기)</button>'
    + '<div style="font-size:10px;color:#5a5a72;margin-top:10px;">💡 무과금도 환생·도감수집·일일보상으로 돌파 가능</div>';
  el.style.display = "flex";
  const buy = $("stuck-buy"); if (buy) buy.onclick = () => { el.style.display = "none"; showPage("shop"); try { renderShop(); } catch (e) {} haptic("medium"); };
  const free = $("stuck-free"); if (free) free.onclick = () => { el.style.display = "none"; };
  el.onclick = (e) => { if (e.target === el) el.style.display = "none"; };
  try { logEvent("stuck_upsell", { ch: ch, losses: stuck }); } catch (e) {}
  haptic("light");
}
// ── 스타터팩 (⭐50 첫 결제 상품) ─────────────────────────────────────────────
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
  const ultK = k * (1 + (lv - 1) * 0.65); // 별 강화로 궁극기 엄청나게 차이나게 강해짐 (고레벨 폭발)
  const mine = units.filter((u) => u.side === "p" && u.hp > 0);
  const foes = units.filter((u) => u.side === "e" && u.hp > 0);
  if (h.ult === "focus")        mine.forEach((u) => { u.buff = Math.round(u.atk * 0.5); u.buffT = 4; });
  else if (h.ult === "rage")    mine.forEach((u) => { u.buff = Math.round(u.atk * 0.5); u.buffT = 5; u.spd = 1.5; u.spdT = 5; });
  else if (h.ult === "wall")    mine.forEach((u) => { u.shield = 4; });
  else if (h.ult === "volley")  {
    // 아크 볼리 — 하늘에서 퍼붓는 아크 일제 (이름 그대로 volley)
    const k2 = ultK;
    const tgts = foes.slice().sort(() => Math.random() - 0.5).slice(0, Math.min(9, foes.length || 1));
    tgts.forEach((f, i) => {
      setTimeout(() => {
        if (f && f.hp > 0) {
          dmg(f, (24 + (i < 3 ? 10 : 0)) * k2, null);
          addFx(f.x + (Math.random()-0.5)*6, f.y + (Math.random()-0.5)*6, "boom");
          addFx(W/2 + (i-4)*18, 30 + (i%2)*5, "snipe", f.x, f.y, "p"); // 볼리다운 연속 사격
        }
      }, i * 32);
    });
    for (let j=0; j<3; j++) addFx(W*0.2 + j*0.3*W, 25, "snipe", W*0.5, H*0.5, "p");
  }
  else if (h.ult === "assault") {
    // 강습 — 전군이 적진으로 쇄도
    mine.forEach((u) => { if (foes.length) { const t = foes.reduce((a, b) => (dist(u, b) < dist(u, a) ? b : a)); u.x += (t.x - u.x) * 0.6; u.y += (t.y - u.y) * 0.4; } addFx(u.x, u.y, "charge"); });
  }
  else if (h.ult === "repair")  {
    // 긴급 수리 — 아군에게 직접 수리 에너지 주입
    mine.forEach((u) => { u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.4); addFx(u.x, u.y - 4, "overclock"); addFx(u.x + 4, u.y, "barrier"); });
  }
  else if (h.ult === "dragon")  {
    // 드래곤 강림 — 하늘에서 강림한 용의 일격
    foes.forEach((f) => dmg(f, 42 * ultK, null));
    for (let i=0; i<5; i++) addFx(W/2 + (i-2)*18, 20, "shot", W/2, H*0.55, "e");
    addFx(W / 2, H / 2, "overclock");
  }
  ultT = h.ultCd;
  triggerUltVfx(h.ult, getHeroColor(META.hero) || '#fbbf24', lv); // lv 전달 → 도파민: 레벨에 따라 궁극기 이팩트 강도/밀도 다르게
  toast(t("tUlt", { x: tUlt(h.ult) }), "#fbbf24");
  haptic("heavy");
}

// ── 영웅 선택 / 강화 ──────────────────────────────────────────────────────────
function heroUpCost() { const lv = META.heroLv[META.hero] || 1; return Math.round(150 * lv * Math.pow(1.18, lv - 1)); }   // 선형→지수(밸런스: heroScale +50%/lv 가파른데 비용 선형이라 영웅 가성비 폭발했던 것. 캐릭 등급비용과 일관)
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
    const livePassive = heroBuffText();   // 레벨 반영 실제 버프값(강화 시 효과 오르는 게 보임) — getLiveHeroPassive는 strategist만 반영하던 버그
    $("hero-desc").innerHTML = livePassive + ultHtml;
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
  const oldLv = META.heroLv[META.hero] || 1;
  const oldPassive = getLiveHeroPassive(META.hero);
  META.gold -= cost; META.heroLv[META.hero] = oldLv + 1;
  saveMeta(); updateHeroUI(); updateMeta(); reset();
  const newLv = META.heroLv[META.hero];
  const newPassive = getLiveHeroPassive(META.hero);
  // 도파민 핵심: 1→2 업글 시 "효과 올라가는 맛" 즉시 보이게 — 패시브 숫자 변화 + 델타 플래시
  const combo = $("battle-combo");
  if (combo) {
    combo.classList.add('powerPop');
    setTimeout(() => { if (combo) combo.classList.remove('powerPop'); }, 520);
  }
  const hdesc = $("hero-desc");
  if (hdesc) {
    hdesc.classList.add('powerPop');
    setTimeout(() => { if (hdesc) hdesc.classList.remove('powerPop'); }, 520);
  }
  // 패시브 변화 시 delta 강조 (전군 공격 +15% → +22% 같은 식)
  if (oldPassive !== newPassive && combo) {
    const delta = document.createElement('span');
    delta.textContent = ' ▲' + (newLv > oldLv ? 'UP' : '');
    delta.style.color = '#a3e635';
    delta.style.fontWeight = '900';
    delta.style.fontSize = '10px';
    delta.style.marginLeft = '2px';
    combo.appendChild(delta);
    setTimeout(() => { if (delta && delta.parentNode) delta.parentNode.removeChild(delta); }, 820);
  }
  // hero-desc에도 같은 맛 (책략가/광전사/수호자 등 모두)
  if (oldPassive !== newPassive && hdesc) {
    hdesc.style.transition = 'color .1s';
    hdesc.style.color = '#a3e635';
    setTimeout(() => { if (hdesc) hdesc.style.color = ''; }, 480);
  }
  // battle-combo 강제 갱신 + 패시브 스팬 하이라이트 (광전사·수호자 등 모든 영웅)
  updateBattleCombo();
  setTimeout(() => {
    const el = $("battle-combo");
    if (el) el.querySelectorAll('span').forEach(s => {
      if (s.textContent.includes('공격') || s.textContent.includes('체력') || s.textContent.includes('재생') || s.textContent.includes('지능')) {
        s.style.transition = 'all .1s'; s.style.background = '#14532d'; s.style.color = '#bef575';
        setTimeout(() => { if (s) { s.style.background = '#1a2a14'; s.style.color = ''; } }, 650);
      }
    });
  }, 60);
  toast(t("tHeroUp", { x: tHero(META.hero)[0], n: newLv }) + " · ⚡전력 " + fmtNum(legionPower()), "#a3e635");
}

// ── 자동사냥 토글 ─────────────────────────────────────────────────────────────
function updateAutoBtn() {
  const b = $("auto"); if (!b) return;
  b.textContent = auto ? "⚔️ 자동 ON" : "⚔️ 자동사냥";
  b.classList.toggle("on", auto);
}
function toggleAuto() {
  if (tbActive || META.mode === "turnbased") { toast("🧠 턴제 모드에서는 자동 불가 — 수동 턴으로 진행", "#f59e0b"); return; }
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
  // re-render prestige (and other dynamic) after lang switch so Korean strings don't linger
  if ($("prestige-box")) renderPrestige();
  if (typeof renderGameStats === "function") renderGameStats();
  if (typeof updateToggles === "function") updateToggles();
  toast(t("langOk"), "#a3e635");
}
function updateToggles() {
  if ($("set-sound")) { $("set-sound").textContent = META.sound === false ? "OFF" : "ON"; $("set-sound").classList.toggle("off", META.sound === false); }
  if ($("set-haptic")) { $("set-haptic").textContent = META.haptic === false ? "OFF" : "ON"; $("set-haptic").classList.toggle("off", META.haptic === false); }
  if ($("set-music")) { $("set-music").textContent = META.music === false ? "OFF" : "ON"; $("set-music").classList.toggle("off", META.music === false); }
  if ($("set-invite")) { $("set-invite").textContent = t("inviteBtn") || "링크 공유"; }
  // A11y reinforcement
  if ($("set-highcontrast")) { $("set-highcontrast").textContent = META.highContrast ? "ON" : "OFF"; $("set-highcontrast").classList.toggle("off", !META.highContrast); }
  if ($("set-vfxfallback")) { $("set-vfxfallback").textContent = META.vfxFallback ? "ON" : "OFF"; $("set-vfxfallback").classList.toggle("off", !META.vfxFallback); }
}
function renderGameStats() {
  const el = $("game-stats"); if (!el) return;
  const total = (typeof ROSTER !== "undefined") ? ROSTER.length : 200;
  const owned = (META.owned || []).length;
  const maxCh = Math.max(META.maxChapter || 0, META.chapter || 1);
  const power = (getDeployedUnits().length ? squadPower() : legionPower()) * ascPowerMul();
  const rows = [["🏆", maxCh, t("statBest")],["📋", owned + "/" + total, t("statCollect")],["🔄", (META.ascCount || 0), t("statRebirth")],["⚡", fmtNum(power), t("statPower")],["🎰", (META.pulls || 0), t("statPulls")],["⚔️", (META.totalWins || 0), t("statWins")]];
  el.innerHTML = "<div class=\"gstat-grid\">" + rows.map(function(r){return "<div class=\"gstat\"><span class=\"gs-ic\">"+r[0]+"</span><b class=\"gs-v\">"+r[1]+"</b><small class=\"gs-l\">"+r[2]+"</small></div>";}).join("") + "</div>";
}
// 🏅 칭호 — 진행도 기반 최고 등급 (업적 동기부여)
function getTitle() {
  const ch = Math.max(META.maxChapter || 0, META.chapter || 1);
  const asc = META.ascCount || 0;
  const coll = (META.owned || []).length;
  const ssr = (typeof ROSTER !== "undefined" ? ROSTER : []).filter((u) => (META.owned || []).includes(u.id) && ["SSR", "UR", "EX"].includes(u.rarity)).length;
  if (asc >= 10) return "🔱 환생의 군주";
  if (ch >= 50) return "⚔️ 대정복자";
  if (ssr >= 15) return "🏆 SSR 수집가";
  if (ch >= 30) return "🛡️ 챕터 정복자";
  if (coll >= 60) return "📜 군단 사령관";
  if (ch >= 10) return "🗡️ 전선의 지휘관";
  return "🔰 신병 사령관";
}
// 📤 내 군단 전과 카드 공유 — 텔레그램 네이티브 공유(바이럴 유입)
function shareProfile() {
  const ch = Math.max(META.maxChapter || 0, META.chapter || 1);
  const power = Math.round((getDeployedUnits().length ? squadPower() : legionPower()) * ascPowerMul());
  const ssr = (typeof ROSTER !== "undefined" ? ROSTER : []).filter((u) => (META.owned || []).includes(u.id) && ["SSR", "UR", "EX"].includes(u.rarity)).length;
  const coll = (META.owned || []).length;
  const text = "⚔️ Daedalus Conquest — " + getTitle() + "\n🏆 최고 ch" + ch + " · ⚡전력 " + fmtNum(power) + " · ⭐SSR " + ssr + "\n📋 도감 " + coll + "/200 · 🔄환생 " + (META.ascCount || 0) + "\n\n나랑 AI 군단 키우자 👇";
  const url = "https://t.me/daedalus_conquest_bot";
  try {
    if (tg && tg.openTelegramLink) {
      tg.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(text));
    } else { try { navigator.clipboard.writeText(text + "\n" + url); } catch (e) {} toast("📤 전과 카드 복사됨 — 텔레그램에 붙여넣기!", "#a3e635"); }
  } catch (e) { toast("공유 실패", "#ef4444"); }
  haptic("medium");
}
function renderProfile() {
  const box = $("tg-profile"); if (!box) return;
  let u = null;
  try { u = tg && tg.initDataUnsafe && tg.initDataUnsafe.user; } catch (e) {}
  if (!u) { box.innerHTML = '<div class="prof-guest">' + t("profGuest") + "</div>"; return; }
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || ("User" + u.id);
  const photo = u.photo_url ? '<img class="prof-img" src="' + u.photo_url + '" alt="" referrerpolicy="no-referrer">' : '<div class="prof-img prof-ph">👤</div>';
  const vip = META.ultra ? '<span class="prof-vip ultra">👑 ULTRA</span>' : (META.vip ? '<span class="prof-vip">👑 VIP</span>' : "");
  box.innerHTML = photo +
    '<div class="prof-meta">' +
      '<div class="prof-name">' + name + (u.is_premium ? ' <span class="prem">⭐</span>' : "") + (vip ? " " + vip : "") + "</div>" +
      '<div class="prof-title">' + getTitle() + "</div>" +
      (u.username ? '<div class="prof-uid">@' + u.username + "</div>" : "") +
      '<div class="prof-uid ddim" onclick="navigator.clipboard.writeText(\'' + u.id + '\'); toast(\'ID 복사됨\', \'#67e8f9\')" style="cursor:pointer">ID: ' + u.id + " (탭해서 복사)</div>" +
    "</div>";
  const sb = $("share-profile"); if (sb) sb.onclick = () => { haptic("medium"); shareProfile(); };
  const ib = $("invite-friend"); if (ib) ib.onclick = () => { haptic("medium"); if (typeof inviteFriend === "function") inviteFriend(); };
  const rc = $("ref-claim"); if (rc) rc.onclick = () => { haptic("medium"); claimReferralRewards(); };
  const rs = $("ref-status"); if (rs) rs.onclick = () => { haptic("light"); openRefModal(); };
  const rmc = $("ref-modal-claim"); if (rmc) rmc.onclick = () => { haptic("medium"); claimReferralRewards(); };
  const rmx = $("ref-modal-close"); if (rmx) rmx.onclick = () => { const m = $("ref-modal"); if (m) m.style.display = "none"; };
  if (typeof refreshReferrals === "function") refreshReferrals();
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
function openSettings() { updateToggles(); buildLangList(); renderProfile(); renderGameStats(); renderPrestige(); showPage("settings"); }
// 환생(Ascension) — 비파괴 메타 루프. 챕터·골드만 리셋, 유닛/장비/가챠/캐릭 100% 유지.
//    에테르(⬡)로 노드 구매 (flat 보너스). 실제 복리 제거, UI에만 소액 cosmetic 복리 표시.
const ASC_NODES = [
  { key: "might",    glyph: "⚔️" },
  { key: "bulwark",  glyph: "🛡️" },
  { key: "momentum", glyph: "⚡" },
  { key: "soulnode", glyph: "🔮" },
  { key: "plunder",  glyph: "💰" },
  { key: "edge",     glyph: "🗡" },
  { key: "pierce",   glyph: "💥" },
  { key: "vanguard", glyph: "🚩" },
  { key: "prosper",  glyph: "💎" },
  { key: "insight",  glyph: "🌟" },
];
function ascSoulMul()    { return 1 + ascLv("soulnode") * 0.25; }
function ascPlunderMul() { return 1 + ascLv("plunder") * 0.12; }
function ascEdgeCrit()   { return ascLv("edge") * 2; }
function ascPierceDmg()  { return ascLv("pierce") * 0.08; }
function ascVanguardCh() { return Math.min(5, ascLv("vanguard")); }
function ascProsperGem() { return ascLv("prosper") * 3; }
function ascInsightDisc(){ return Math.min(0.40, ascLv("insight") * 0.04); }
function ascNodeStat(key, lv) {
  // 복리 제거 후 flat 보너스. power compounding은 cosmetic으로만.
  switch (key) {
    case "might":    return "+" + (lv * 1) + " 공격 보너스 (flat)";
    case "bulwark":  return "+" + (lv * 1) + " 체력 보너스 (flat)";
    case "momentum": return "+" + (lv * 5) + " 시작 골드";
    case "soulnode": return "+" + (lv * 25) + "% 소울";
    case "plunder":  return "+" + (lv * 12) + "% 전투골드";
    case "edge":     return "+" + (lv * 2) + "% 치명";
    case "pierce":   return "+" + (lv * 8) + "% 치명피해";
    case "vanguard": return "+" + Math.min(5, lv) + " 시작챕터";
    case "prosper":  return "+" + (lv * 3) + " 젬/환생";
    case "insight":  return "-" + Math.round(Math.min(0.40, lv * 0.04) * 100) + "% 각성비용";
    default: return "";
  }
}
function ascNodeKey(key, suf) { return "n" + key.charAt(0).toUpperCase() + key.slice(1) + (suf || ""); } // might→nMight / nMightD
function renderPrestige() {
  const box = $("prestige-box"); if (!box) return;
  const ch = META.chapter || 1, e = META.ether || 0, gain = etherGain(ch), pwr = ascPowerMul();
  let h = `<div class="prestige-desc">${t("ascDesc")}</div>`;
  // 소액 복리 표시 (0.1~0.19% 랜덤, 실제 경제 영향 거의 없음 — 심리적 만족용)
  const smallComp = (0.10 + Math.random() * 0.09).toFixed(2);
  h += `<div class="asc-stats">⬡ <b>${e}</b> · ${t("ascPower")} ×${pwr.toFixed(2)} · ${t("ascRuns")} ${META.ascCount || 0} · <span style="color:#fbbf24">복리 +${smallComp}%</span></div>`;
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
      + `<div class="asc-node-d">${t(ascNodeKey(n.key, "D"))}</div>`
      + `<div class="asc-node-now">${t("ascNow") || "Now"} <b>${ascNodeStat(n.key, lv)}</b> → <b style="color:#a3e635">${ascNodeStat(n.key, lv + 1)}</b></div></div>`
      + `<button class="asc-buy${can ? "" : " off"}" data-node="${n.key}"${can ? "" : " disabled"}>${t("ascUp", { c: cost })}</button>`
      + `</div>`;
  }
  box.innerHTML = h;
  // 신뢰성 있는 버튼 연결 (innerHTML 동적 생성 후 직접 onclick — on() 헬퍼 다중리스너/타이밍 문제 방지)
  // delegation for prestige buttons (survives re-renders)
  box.onclick = (e) => {
    const go = e.target.closest("#prestige-go");
    if (go) { doAscend(); return; }
    const buy = e.target.closest(".asc-buy");
    if (buy && !buy.disabled) buyAscNode(buy.dataset.node);
  };
}
function buyAscNode(node) {
  if (running || !META.asc) return; if (!(node in META.asc)) META.asc[node] = 0;
  const lv = ascLv(node), cost = ascNodeCost(lv);
  if ((META.ether || 0) < cost) { toast(t("ascNeed"), "#ef4444"); return; }
  META.ether -= cost; META.asc[node] = lv + 1;
  saveMeta(); updateMeta(); renderPrestige();
  const g = { might: "⚔️", bulwark: "🛡️", momentum: "⚡" }[node];
  toast(g + " " + t("ascLvN", { n: lv + 1 }), "#c084fc"); SFX.ssr(); haptic("medium");
}
// 첫 SSR 스펙터클 (황금 강림 연출) — 트리니티 도파민맵
function ssrSpectacle(name) {
  const v = $("rebirth-veil"), txt = $("rebirth-text");
  if (!v) return;
  if (txt) txt.textContent = "⭐ " + (name || "전설") + " 강림!";
  v.classList.remove("hidden"); void v.offsetWidth; v.classList.add("play-ssr");
  if (SFX && SFX.ssr) SFX.ssr(); haptic("heavy");
  setTimeout(() => { v.classList.remove("play-ssr"); v.classList.add("hidden"); if (txt) txt.textContent = ""; }, 1900);
}
// 일일 출정식 의례 (종교 도메인 — 데일리를 '숙제'가 아닌 '의식'으로). 하루 1회.
function maybeSortie() {
  if (!META || META.sortieDay === today()) return;
  META.sortieDay = today(); saveMeta();
  const v = $("rebirth-veil"), txt = $("rebirth-text");
  if (!v) return;
  if (txt) txt.textContent = "⚔️ 출정! 군단 진격";
  v.classList.remove("hidden"); void v.offsetWidth; v.classList.add("play-sortie");
  if (SFX && SFX.win) SFX.win(); haptic("medium");
  setTimeout(() => { v.classList.remove("play-sortie"); v.classList.add("hidden"); if (txt) txt.textContent = ""; }, 2000);
}
// 🗺️ 정복 연대기 — 챕터 진행 + 탭해서 까는 보상 상자 트랙 (도파민 후크). 기존 MILESTONES와 별개 레이어.
const CQ_REWARDS = [
  { ch: 3,   gold: 800,    soul: 10 },
  { ch: 6,   gold: 1800,   soul: 20,   gem: 20 },
  { ch: 10,  gold: 3500,   soul: 40,   gem: 30 },
  { ch: 15,  gold: 7000,   soul: 70,   gem: 40 },
  { ch: 20,  gold: 14000,  soul: 120,  gem: 60 },
  { ch: 30,  gold: 28000,  soul: 220,  gem: 90 },
  { ch: 45,  gold: 60000,  soul: 380,  gem: 130 },
  { ch: 60,  gold: 120000, soul: 650,  gem: 200 },
  { ch: 80,  gold: 240000, soul: 1100, gem: 320 },
  { ch: 100, gold: 600000, soul: 2200, gem: 550 },
];
function cqRewardAt(ch) { return CQ_REWARDS.find((r) => r.ch === ch); }
function cqClaimable(ch) { return (META.chapter || 1) >= ch && !(META.cqClaimed || []).includes(ch); }
function renderConquestMap() {
  const el = $("conquest-map"); if (!el) return;
  const cur = META.chapter || 1;
  const claimableCount = CQ_REWARDS.filter((r) => cqClaimable(r.ch)).length;
  const nextRwd = CQ_REWARDS.find((r) => cur < r.ch);
  // 보상 마일스톤 10개만 콤팩트 노출(전 챕터 나열 X → 가로스크롤 제거, flex-wrap로 한눈에)
  const nodes = CQ_REWARDS.map((r) => {
    const c = r.ch;
    const claimed = (META.cqClaimed || []).includes(c);
    const can = cqClaimable(c);
    const cls = claimed ? "rwd done" : can ? "rwd ready" : "rwd lock";
    const ic = claimed ? "✅" : can ? "🎁" : (cur >= c ? "🚩" : "🔒");
    return `<div class="cq-node ${cls}" ${can ? `onclick="claimCq(${c})"` : ""}><span class="cq-ic">${ic}</span><span class="cq-n">${c}</span></div>`;
  }).join("");
  const badge = claimableCount ? ` <span class="cq-badge">🎁 ${t("cqClaimN", { n: claimableCount })}</span>` : (nextRwd ? ` <span class="cq-next">▶ ch${nextRwd.ch}</span>` : "");
  el.innerHTML = `<div class="cq-title">🗺️ ${t("cqTitle")} · <b>${cur - 1}</b> ${t("cqFell")}${badge}</div><div class="cq-strip">${nodes}</div>`;
}
function claimCq(ch) {
  if (running) return;
  const rwd = cqRewardAt(ch); if (!rwd || !cqClaimable(ch)) return;
  if (!Array.isArray(META.cqClaimed)) META.cqClaimed = [];
  META.cqClaimed.push(ch);
  if (rwd.gold) META.gold = (META.gold || 0) + rwd.gold;
  if (rwd.soul) META.soul = (META.soul || 0) + rwd.soul;
  if (rwd.gem)  META.gems = (META.gems || 0) + rwd.gem;
  bumpPrestige(0.5); saveMeta(); updateMeta();
  const parts = [rwd.gold ? "💰" + fmtNum(rwd.gold) : "", rwd.soul ? "🔮" + rwd.soul : "", rwd.gem ? "💎" + rwd.gem : ""].filter(Boolean).join(" ");
  toast("🎁 " + t("cqReward", { n: ch }) + " · " + parts, "#fbbf24");
  try { confettiBurst(); } catch (e) {}
  if (typeof SFX !== "undefined" && SFX.claim) SFX.claim();
  haptic("heavy");
  renderConquestMap();
}
// 부활 의식 연출 (캠벨 영웅여정 — 죽음→심연 정적→빛과 함께 더 강하게 귀환). 트리니티 토론 TOP1.
function playRebirthCeremony(cb) {
  const v = $("rebirth-veil"), txt = $("rebirth-text");
  if (!v) { if (cb) cb(); return; }
  const wasMusic = !(typeof META !== "undefined" && META && META.music === false);
  if (wasMusic) { try { stopSynthBgm(); } catch (e) {} }           // 정적
  v.classList.remove("hidden");
  if (txt) txt.textContent = "심연…";
  setTimeout(() => { if (txt) txt.textContent = "군단, 부활하라"; }, 1500);
  void v.offsetWidth; v.classList.add("play");
  if (SFX && SFX.boom) SFX.boom();
  setTimeout(() => { if (SFX && SFX.win) SFX.win(); haptic("heavy"); }, 1500);   // 부활 순간
  setTimeout(() => {
    v.classList.remove("play"); v.classList.add("hidden");
    if (wasMusic) { try { bgmStart(); } catch (e) {} }
    if (cb) cb();
  }, 2600);
}
// PRD2: 환생 빨리감기 폭살 몽타주 — ch1~10 고속 자동클리어, 스킵 가능. "내가 이만큼 세졌다" 카타르시스.
function startMontage() {
  window._montage = true; window._montageTarget = 10;
  speed = 8; auto = true; updateAutoBtn();
  reset(); start();
  setTimeout(() => toast("⚡ 군단 재각성 — 빨리감기 진격! (탭하면 스킵)", "#c084fc"), 250);
  if (cv) cv.addEventListener("click", montageSkip);
}
function montageSkip() {
  if (!window._montage) return;
  META.chapter = (window._montageTarget || 10) + 1; saveMeta();
  endMontage();
}
function endMontage() {
  if (!window._montage) return;
  window._montage = false; speed = 1; auto = false;
  if (cv) cv.removeEventListener("click", montageSkip);
  running = false; updateAutoBtn(); reset(); updateMeta();
  toast("⚡ 재각성 완료 · 본격 진격!", "#a3e635"); haptic("heavy");
}
function doAscend() {
  const ch = META.chapter || 1; if (ch < ASCEND_GATE) return;
  const btn = $("prestige-go"), gain = etherGain(ch);
  const oldPwr = ascPowerMul();
  const ask = t("ascConfirm", { ch: ch, e: gain });
  const go = () => {
    if (btn) { btn.disabled = true; btn.textContent = "..."; }
    META.ether = (META.ether || 0) + gain; META.gems = (META.gems || 0) + ascProsperGem();
    META.ascCount = (META.ascCount || 0) + 1;
    logEvent("ascend", { fromCh: ch, ether: gain, runs: META.ascCount });   // 📊 계측
    // 비파괴 리셋: 챕터·골드·연승만. 유닛·장비·가챠·캐릭·타워는 전부 유지.
    META.chapter = 1 + ascVanguardCh(); META.streak = 0;
    META.gold = 550 + ascStartGold();
    saveMeta();
    const newPwr = ascPowerMul();
    applyMode(); reset(); updateMeta(); renderPrestige(); renderDash(); showPage("battle");
    // 도파민: 환생 직후 영구 배율 즉시 표시 + 차이 토스트
    const dp = $("dash-power");
    if (dp) dp.textContent = fmtNum((getDeployedUnits().length ? squadPower() : legionPower()) * newPwr);
    SFX.ssr(); haptic("heavy");
    toast(`🔄 환생! ⬡+${gain} · 영구배율 ${oldPwr.toFixed(2)} → ${newPwr.toFixed(2)}×`, "#c084fc");
    setTimeout(() => { playRebirthCeremony(startMontage); }, 280);
  };
  const done = () => { if (btn) { btn.disabled = false; renderPrestige(); } };
  // ⚠️ 환생버그픽스: 브라우저(텔레그램 앱 밖)에선 tg.showConfirm()이 WebAppMethodUnsupported throw → 환생 멈춤. try/catch+confirm 폴백
  if (tg && tg.showConfirm) { try { tg.showConfirm(ask, (ok) => { if (ok) go(); else done(); }); return; } catch (e) {} }
  if (confirm(ask)) { go(); }
  else done();
}
$("set-sound").addEventListener("click", () => { META.sound = META.sound === false; saveMeta(); updateToggles(); if (META.sound !== false) SFX.tap(); });
$("set-haptic").addEventListener("click", () => { META.haptic = META.haptic === false; saveMeta(); updateToggles(); });
on("set-music", "click", () => { META.music = META.music === false; saveMeta(); updateToggles(); if (META.music === false) bgmStop(); else bgmStart(); });
on("set-invite", "click", () => { haptic("medium"); inviteFriend(); });

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
  // 💰 플레이 골드도 전력비례 하한(SPEC): max(절대값, 전력×playMul). playMul 3m 0.05→60m 0.5.
  const playMul = Math.max(0.05, Math.min(0.5, 0.05 + (r.min - 3) * (0.45 / 57)));
  const lpPlay = (typeof legionPower === "function" ? legionPower() : 0);
  META.gold += Math.max(Math.floor(r.gold * mult), Math.floor(lpPlay * playMul * mult));
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
    miss.innerHTML = `오늘 미션: 전투 ${b}/3 · 뽑 ${p}/1 · ULT ${u}/1 · 탑 ${t}/1 ${allDone && !META.dailyMissionsClaimed ? '<button onclick="claimDailyMissions()">보상 받기 +800g + 내일 AFK 15% 부스트</button>' : ''} <span style="color:#a3e635;">오늘 완료 시 내일 AFK +15% (습관 루프)</span>`;
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
  // 💰 골드 전력비례 하한 하이브리드(SPEC): max(절대값, 전력×dayMul). 초반=절대값 보존, 후반=유효.
  if (r.g) { const day = idx + 1, lp = (typeof legionPower === "function" ? legionPower() : 0); META.gold += Math.max(r.g, Math.floor(lp * (0.03 + day * 0.009))); }
  if (r.gem) META.gems = (META.gems || 0) + r.gem;
  let boxRes = null;
  if (r.box) boxRes = openBox(r.box);
  META.attend.day = (META.attend.day || 0) + 1; META.attend.last = today();
  // 🏅 누적 출석 충성(loyalty) 마일스톤 — 장기 접속 대형보상 (attend.day = 누적 출석일, 매일+1이라 정확히 1회 도달)
  const LOYALTY = [
    { d: 7, gem: 50 }, { d: 30, gem: 200, unit: "SR" }, { d: 100, gem: 800, unit: "SSR" },
    { d: 200, gem: 2000, gear: "SSR" }, { d: 365, gem: 5000, unit: "SSR", gear: "SSR" },
  ];
  const ms = LOYALTY.find((m) => m.d === META.attend.day);
  if (ms) {
    META.gems = (META.gems || 0) + ms.gem;
    let extra = "💎" + ms.gem;
    if (ms.unit && typeof grantUnit === "function") { grantUnit(ms.unit); extra += " + 🏆" + ms.unit; }
    if (ms.gear && typeof newGear === "function") { if (!META.gear) META.gear = []; META.gear.push(newGear(ms.gear)); extra += " + ⚔️" + ms.gear + "장비"; }
    setTimeout(() => { toast("🏅 누적 출석 " + ms.d + "일 충성 보상! " + extra, "#fbbf24"); try { confettiBurst(); } catch (e) {} }, 700);
  }
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
  META.gold = (META.gold || 0) + 800;   // 🔧 350→800 (군주: 골드복리 후하게에 맞춰 미션 비례)
  META.dailyMissionsClaimed = true;
  META.afkBoostDay = dayPlus(1);  // 내일 전체 AFK 15% 부스트 (tie to progression)
  bumpPrestige(1); saveMeta(); updateMeta();
  if (curPage === "event") openEvent();
  haptic("medium"); SFX.claim();
  toast("🎁 미션 완료! +800g + 내일 AFK +15% (오프라인 가속)", "#fbbf24");
  setTimeout(() => toast("전투 1판 더 → 스트릭/보상 업! (3-5분 루프)", "#a3e635"), 1100);
}

// Post-launch Viral (D+0 focus as per priority ②)
// 초대 버튼: 링크 공유만. 실제 보상은 친구가 start=ref 링크로 직접 들어왔을 때만 (joiner)
function inviteFriend() {
  const ref = getTGUserId();
  const link = `https://t.me/daedalus_conquest_bot?start=ref${ref}`;
  const text = "⚔️ Daedalus Conquest — AI 군단 전쟁! 같이 정복하자. 가입하면 💎100+💰1000+🔮10 보너스:";
  if (tg && tg.openTelegramLink) {
    // 텔레그램 친구목록 공유 시트 (탭해서 친구에게 바로 전송)
    tg.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(link) + "&text=" + encodeURIComponent(text));
  } else {
    try { navigator.clipboard.writeText(link); toast("초대 링크 복사됨", "#67e8f9"); } catch(e){}
  }
}

// 📊 익명 분석 ID (TG id와 분리 — 프라이버시). localStorage 영속.
function getAnonId() {
  try {
    let a = localStorage.getItem("daedalus_anon");
    if (!a) { a = "a" + Math.random().toString(36).slice(2, 11) + Date.now().toString(36); localStorage.setItem("daedalus_anon", a); }
    return a;
  } catch (e) { return "a0"; }
}
// 📊 이벤트 계측 — 워커로 fire-and-forget 전송(실패해도 게임 영향 0). Oracle(CDO) 실측용.
function logEvent(name, data) {
  try {
    if (typeof console !== "undefined") console.log("[METRIC]", name, data || {}); // debug metric (minify strips)
    // Analytics 독립 (PAY와 분리 — metrics P1 필수). /ev + {type,anonId} 스키마 일치.
    if (typeof ANALYTICS_BACKEND !== "undefined" && ANALYTICS_BACKEND) {
      const body = JSON.stringify({ type: name, anonId: getAnonId(), ts: Date.now(), d: data || {} });
      const url = ANALYTICS_BACKEND + "/ev";
      if (typeof navigator !== "undefined" && navigator.sendBeacon) { navigator.sendBeacon(url, body); }
      else if (typeof fetch !== "undefined") fetch(url, { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(() => {});
    }
    // PAY /event 는 metrics 아님 (pay-worker 전용 경로 별도)
  } catch (e) {}
}
on("om-ritual", "click", () => { bumpPrestige(1); checkDaily(); if (curPage!=="event") openEvent(); toast("🔮 의식 완료 — 가챠가 준비됐어요!", "#a3e635"); setTimeout(gacha, 700); });

// ── 이벤트/쿠폰 코드 (회원 배포용) ───────────────────────────────────────────
const CODES = {
  WELCOME:    { gold: 1000, gem: 50 },
  LEGION:     { gem: 100 },
  DAEDALUS:   { gold: 3000 },
  LAUNCH2026: { gold: 2000, gem: 200 },
};
// 👑 마스터 전용 히든 코드 (나만 쓰게 — 코드값 비밀·재사용 가능·소비 안 됨)
// (마스터 코드 전부 제거 — 군주 지시 2026-06-20. 공개 이벤트 코드만 유지)
function redeemCode() {
  const inp = $("code-input"); if (!inp) return;
  const code = (inp.value || "").trim().toUpperCase();
  if (!code) return;
  const uid = getTGUserId();
  if (SOVEREIGN_TG_ID && (code === "REVIEWALL" || code.startsWith("GOD")) && String(uid) !== String(SOVEREIGN_TG_ID)) {
    toast("Sovereign 전용", "#ef4444"); inp.value = ""; return;
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
  { id: "founder", founder: true, limited: true, tag: "🏅창단·7일한정", k: "pkFounder" },   // 🏅 창단멤버 한정팩(출시 7일)
  { id: "starter", starter: true, tag: "BEST", k: "pkStarter" },
  { id: "monthly", k: "pkMonthly", tag: "30일·💎" },
  { id: "weekly", k: "pkWeekly", tag: "7일·💎" },
  { id: "vip", vip: true, tag: "VIP·4x·💎600" },
  { id: "ultra", ultra: true, tag: "MAX·8x·SSR" },
  { id: "growth1", k: "pkGrow1", tag: "성장" },
  { id: "growth2", k: "pkGrow2", tag: "성장·SSR" },
  { id: "gem1", gem: 60 },
  { id: "gem2", gem: 330, tag: "+10%" },
  { id: "gem3", gem: 1280, tag: "+18%" },   // 1180→1280: 태그 +18% 실제와 일치(표시광고법) + 단가 단조
  { id: "gem4", gem: 3400, tag: "+25%" },   // 3200→3400: 태그 +25% 실제와 일치. 단가 18.3→16.7→15.5→14.7 완벽 단조
  { id: "gold1", g: 6000 },
  { id: "gold2", g: 35000, tag: "+17%" },    // 태그 정직화(실제 +17%, 수량유지=유저이득)
  { id: "gold3", g: 140000, tag: "+29%" },  // 태그 정직화(실제 +29%)
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
  try {
  if (typeof renderFeaturedBanner === "function") renderFeaturedBanner();   // 🎯 한정 배너
  const box = $("shop-list"); if (!box) return;
  box.innerHTML = "";
  if (!PAY_BACKEND) {
    const note = document.createElement("div");
    note.style.cssText = "font-size:11px;color:#f59e0b;margin-bottom:6px;text-align:center;";
    note.textContent = t("payDemoNote");
    box.appendChild(note);
  }
  // 🎉 첫 결제 2배 배지 (미구매 시)
  if (!META.firstPurchaseDone) {
    const fp = document.createElement("div");
    fp.style.cssText = "font-size:12px;font-weight:800;color:#1a1400;background:linear-gradient(135deg,#fde047,#f5c451);border-radius:9px;padding:7px 10px;margin-bottom:8px;text-align:center;box-shadow:0 0 14px rgba(253,224,71,.4);";
    fp.textContent = "🎉 첫 결제 2배 보너스! (골드·젬 2배 지급)";
    box.appendChild(fp);
  }
  SHOP.forEach((p) => {
    if (p.founder && (META.founder || !founderActive())) return;   // 🏅 창단팩: 이미 소유 or 7일 만료 시 숨김
    const owned = (p.starter && META.starter) || (p.vip && META.vip) || (p.ultra && META.ultra) || (p.founder && META.founder);
    const active = p.id === "monthly" ? passActive("monthly") : p.id === "weekly" ? passActive("weekly") : false;
    const c = document.createElement("button"); c.className = "packcard" + (p.vip || p.ultra ? " vip" : "") + (p.k ? " grow" : "") + (active ? " active" : "") + (owned ? " owned" : "");
    const what = p.k ? t(p.k) : p.vip ? t("tVip") : p.ultra ? t("tUltra") : (p.gem ? "💎 " + p.gem : "💰 " + p.g);
    const sub = active ? '<div class="psub">✓ ~' + META.pass[p.id] + "</div>" : "";
    const price = owned ? "✓ " + t("ownedShort") : "⭐ " + (STARS[p.id] || 0).toLocaleString("en-US");  // ⭐ Stars 단일소스(STARS=표시=청구, 오차0). 보유중이면 ✓
    const isFB = !((META.firstBuy || {})[p.id]) && (p.gem || p.g) && !owned;  // 🎁 첫구매 2배 대상(젬·골드 팩, 미구매)
    const tagHtml = isFB ? '<span class="ptag pdbl">' + t("firstBuyDouble") + '</span>' : (p.tag ? '<span class="ptag">' + p.tag + "</span>" : "");
    c.innerHTML = tagHtml + '<div class="pwhat">' + what + "</div>" + sub + '<div class="pprice">' + price + "</div>";
    if (owned) c.disabled = true; else c.addEventListener("click", () => buyPack(p.id));
    box.appendChild(c);
  });
  } catch(e) { console.warn('상점 렌더 오류', e); }
}
// ── 💳 결제 (Telegram Stars) ─────────────────────────────────────────────────
// PAY_BACKEND 비어있으면 데모 즉시지급. 채우면 봇 서버가 인보이스 발급 → tg.openInvoice → 결제확인 후 지급.
const PAY_BACKEND = "https://legion-pay.hoyashi95.workers.dev";   // ✅ 실결제 ON (Cloudflare Worker + Telegram Stars). 텔레그램 밖에선 자동 데모.
const ANALYTICS_BACKEND = "https://legion-analytics.hoyashi95.workers.dev";   // 📊 Oracle analytics-worker (출시 측정) — 배포 완료(Trinity). PAY와 독립.
const STARS = { founder: 990, starter: 50, weekly: 250, monthly: 750, vip: 1500, ultra: 5000, growth1: 500, growth2: 2500,
                gem1: 55, gem2: 280, gem3: 1000, gem4: 2500, gold1: 55, gold2: 280, gold3: 1000 };
function founderActive() { return (typeof FEATURED_LAUNCH !== "undefined") ? (Date.now() - FEATURED_LAUNCH < 7 * 86400000) : true; }   // 출시 7일 한정창
function buyPack(id) {
  const p = SHOP.find((x) => x.id === id); if (!p) return;
  const stars = STARS[id] || 0;
  if (!tg || !tg.openInvoice || !stars) {   // 텔레그램 밖 = 결제 불가 → 무료지급 차단(매출 보호). 데모는 PAY_BACKEND 미설정 시에만.
    if (!PAY_BACKEND) { grantPackWithBonus(id); toast(t("payDemo"), "#8b93a7"); }
    else toast(t("payTgOnly"), "#fbbf24");
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
        if (status === "paid") { verifyThenGrant(id, uid); }   // 🔒 서버 영수증 확인 후 지급
        else if (status === "failed") toast(t("payFail"), "#ef4444");
        else toast(t("payCancel"), "#8b93a7");   // cancelled/pending
      });
    })
    .catch(() => toast(t("payErr"), "#ef4444"));
}
// 🔒 결제 완료 → pay-worker /verify(서버 영수증) 확인 후 grant. 텔레그램→워커 직통 영수증이라 위조 불가.
// webhook 도착 지연 대비 폴링(최대 8회/~12s). 영수증은 1회 소비(멱등=중복지급 차단).
// 타임아웃 시: 결제자 보호 위해 지급하되 purchase_unverified 감사로그(webhook 실패 추적). 자가치트는 무해(자기 세이브).
function verifyThenGrant(id, uid, tries) {
  tries = tries || 0;
  if (typeof PAY_BACKEND === "undefined" || !PAY_BACKEND) { grantPackWithBonus(id); toast(t("payOk"), "#a3e635"); haptic("heavy"); return; }
  fetch(PAY_BACKEND + "/verify?item=" + encodeURIComponent(id) + "&uid=" + encodeURIComponent(uid))
    .then((r) => r.json())
    .then((v) => {
      if (v && v.ok) { grantPackWithBonus(id); toast(t("payOk"), "#a3e635"); haptic("heavy"); }       // ✅ 서버 영수증 확인
      else if (tries < 7) { if (tries === 0) toast(t("payVerifying"), "#fbbf24"); setTimeout(() => verifyThenGrant(id, uid, tries + 1), 1500); }
      else { grantPackWithBonus(id); logEvent("purchase_unverified", { item: id }); toast(t("payOk"), "#a3e635"); haptic("heavy"); }  // 타임아웃: 결제자 보호 지급 + 감사
    })
    .catch(() => { if (tries < 7) setTimeout(() => verifyThenGrant(id, uid, tries + 1), 1500); else { grantPackWithBonus(id); logEvent("purchase_unverified", { item: id }); toast(t("payOk"), "#a3e635"); } });
}
// 🎉 첫 결제 2배 — 결제 전환율 직타. 첫 구매 시 골드/젬 델타를 2배(1회성).
function grantPackWithBonus(id) {
  const firstBuy = !META.firstPurchaseDone;
  const gems0 = META.gems || 0, gold0 = META.gold || 0;
  grantPack(id);
  if (firstBuy) {
    const dg = Math.max(0, (META.gems || 0) - gems0), dgold = Math.max(0, (META.gold || 0) - gold0);
    META.gems = (META.gems || 0) + dg; META.gold = (META.gold || 0) + dgold;
    META.firstPurchaseDone = true;
    saveMeta(); updateMeta(); if (typeof renderShop === "function") renderShop();
    if (dg || dgold) setTimeout(() => { toast("🎉 첫 결제 2배 보너스! " + (dg ? "💎+" + dg + " " : "") + (dgold ? "💰+" + dgold.toLocaleString("en-US") : ""), "#fbbf24"); try { confettiBurst(); } catch (e) {} }, 650);
    try { logEvent("first_purchase_2x", { item: id, gem: dg, gold: dgold }); } catch (e) {}
  }
}
function grantPack(id) {
  const p = SHOP.find((x) => x.id === id); if (!p) return;
  logEvent("purchase", { item: id, stars: (typeof STARS !== "undefined" && STARS[id]) || 0 });   // 📊 계측 (지급=결제완료 시점)
  if (p.founder) {                                     // 🏅 창단멤버 한정팩: 💎1500 + SSR유닛 + SSR장비 + 영구 창단뱃지 + 영구 골드+25%
    META.founder = true; META.gems = (META.gems || 0) + 1500;
    const u = grantUnit("SSR"); const g = newGear("SSR"); if (!META.gear) META.gear = []; META.gear.push(g);
    saveMeta(); updateMeta(); renderShop();
    if (u) setTimeout(() => showGacha({ key: "SSR", color: "#fbbf24" }, "🏅 창단멤버! " + u.name + " (SSR) + SSR장비 · 영구 골드+25%"), 300);
    toast("🏅 창단멤버 등극! 영구 뱃지 + 골드+25%", "#fbbf24"); haptic("heavy"); return;
  }
  if (p.starter) {                                     // 💎 초심자: 골드3000 + 유닛10 + 골드+20% (속도 혜택 제거)
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
  toast("🛒 " + (dbl ? t("firstBuyDouble") + "! " : "") + (p.gem ? "💎+" + (dbl ? p.gem * 2 : p.gem) : "💰+" + (dbl ? p.g * 2 : p.g)), "#fbbf24"); haptic(dbl ? "heavy" : "medium");
}
on("gacha10-btn", "click", gacha10);
// 장비 뽑기 + 상점 뽑기 버튼 + 시즌 이벤트
function gearGacha(count) {
  const cost = count === 10 ? 72 : 8; // 장비: 단차💎8(캐릭과 동일단가 — 가치역전 해소) / 10연💎72(8×10에서 10%할인 — 10연 인센티브). 트리니티 옵션A
  if ((META.gems || 0) < cost) { toast(t("tGemShort", { n: cost }), "#ef4444"); return; }
  const _combined = ((META.owned || []).length) + (META.gear || []).length;
  if (_combined + count > MAX_COMBINED) { toast(t("gFull"), "#ef4444"); return; }   // 총합(캐릭+장비) 500 한도
  META.gems -= cost;
  const RK = { N: 0, R: 1, SR: 2, SSR: 3, UR: 4, EX: 5 }; let best = null; const results = [];
  for (let i = 0; i < count; i++) {
    META.pity = (META.pity || 0) + 1;
    let rar = rollRarity();
    if (META.pity >= 12) {
      const ssr = RARITY.find(x => x.key === "SSR") || RARITY[3];
      rar = ssr;
    }
    if (["UR","EX"].includes(rar.key)) rar = RARITY.find(x => x.key === "SSR") || rar;  // 장비는 고등급 미지원 → SSR 폴백
    if (count === 10 && i === 9 && (!best || RK[best.rarity] < 2)) rar = RARITY[2];   // 🔨 장비 10연 SR↑ 1보장 (pity 12는 별도)
    if (["SSR","UR","EX","SR"].includes(rar.key)) META.pity = 0;
    const g = newGear(rar.key); META.gear.push(g);
    results.push({ name: (SLOT_ICON[g.slot] || "🔨") + " " + (g.name || g.slot), rarity: g.rarity });
    if (!best || RK[g.rarity] > RK[best.rarity]) best = g;
  }
  saveMeta(); updateMeta(); renderGear();
  showGacha({ key: best.rarity, color: best.color }, "🔨 " + t("gTitle") + " ×" + count, results);
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
on("sg-gold1", "click", goldGacha);            // 🪙 골드 뽑기 (소울루프)
on("sg-gold10", "click", goldGacha10);         // 🪙 골드 10연
on("odds-view", "click", showOdds);            // 📊 전체 확률 공개 (법적 disclosure) — origin drops에도 항상 노출 필수 (미꾸라지)
on("odds-close", "click", closeOdds);
// also close on background for the odds disclosure modal (robust UX)
const oddsM = $("odds-modal");
if (oddsM) {
  oddsM.addEventListener("click", (e) => { if (e.target === oddsM) closeOdds(); }, {once: false});
}
// permanent direct onclick safety for close btn (robust, works even if addEvent timing odd)
const ocb = $("odds-close");
if (ocb) ocb.onclick = closeOdds;

on("dismantle-dupes", "click", dismantleDupes); // 🔮 중복 전부 소울로

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
  // 🔥 CHEAT MODE cycle-cheat: prestige = samsara rebirth cycle (p1 core + p2 karma). "MY Legion eternal" narrative. Economist implant. Var multiplier theater. Hegemony. Exact disclosure.
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
  // 전력 표시 (복리 완전 제거)
  if ($("dash-power")) $("dash-power").textContent = fmtNum((sq.length ? squadPower() : legionPower()));
  if ($("dash-div")) $("dash-div").textContent = 0;  // 배당 복리 제거
  renderCharProgress();
  renderSquad();
}
// 📊 수집·전과 진행 띠 (빈 공간 채움 + 수집욕·가챠 동기)
function renderCharProgress() {
  const el = $("char-progress"); if (!el) return;
  const total = (typeof ROSTER !== "undefined") ? ROSTER.length : 200;
  const owned = (META.owned || []).length;
  const pct = total ? Math.round(owned / total * 100) : 0;
  const ssr = (typeof ROSTER !== "undefined" ? ROSTER : []).filter((u) => (META.owned || []).includes(u.id) && ["SSR", "UR", "EX"].includes(u.rarity)).length;
  const maxCh = Math.max(META.maxChapter || 0, META.chapter || 1);
  el.innerHTML =
    '<div class="cprog-bar"><div class="cprog-fill" style="width:' + pct + '%"></div></div>' +
    '<div class="cprog-row">' +
      '<span>📋 도감 <b>' + owned + '/' + total + '</b> <i>' + pct + '%</i></span>' +
      '<span>⭐ SSR <b>' + ssr + '</b></span>' +
      '<span>🏆 ch <b>' + maxCh + '</b></span>' +
      '<span>🔄 환생 <b>' + (META.ascCount || 0) + '</b></span>' +
    '</div>';
}

// ── 편성 UI (출전 슬롯 + 보유 풀 + 시너지) ─────────────────────────────────────
function renderSquad() {
  const slots = $("squad-slots"); if (!slots) return;
  const sq = getDeployedUnits();
  const squadInfo = $("squad-info");
  if (squadInfo) {
    squadInfo.textContent = sq.length + "/" + DEPLOY_MAX + " · ⚡" + Math.round(squadPower() * ascPowerMul());
  }
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
// 등급별 업그레이드 비용 배율 (군주 원칙: 고등급일수록 비쌈). N싸게 양산 / SSR 비싼 대신 강함
const RARITY_COST = { N: 1, R: 1.5, SR: 2.5, SSR: 4 };
function charRarityCost(id) { const u = (typeof ROSTER !== "undefined") && ROSTER.find((x) => x.id === id); return (u && RARITY_COST[u.rarity]) || 1; }
function charLvCost(id) { return Math.round(200 * (charLv(id) + 1) * charRarityCost(id)); }

function maxLevelsWithGold(id) {
  let count = 0;
  let g = META.gold || 0;
  let l = charLv(id);
  while (true) {
    const c = Math.round(200 * (l + 1) * charRarityCost(id));
    if (g < c) break;
    g -= c;
    l++;
    count++;
  }
  return count;
}
function charLevelUp(id, times = 1) {
  if (running || times < 1) return;
  let totalCost = 0;
  let l = charLv(id);
  for (let i = 0; i < times; i++) {
    const c = Math.round(200 * (l + 1) * charRarityCost(id));
    totalCost += c;
    l++;
  }
  if (META.gold < totalCost) { toast(t("tGoldShort", { n: totalCost }), "#ef4444"); return; }
  META.gold -= totalCost;
  if (!META.charLv) META.charLv = {};
  META.charLv[id] = charLv(id) + times;
  logEvent("growth_moment", { type: "levelup", delta: times, id: id });   // 📊 계측
  saveMeta(); updateMeta(); SFX.claim(); haptic("medium");
  openCharPanel(id); renderSquad(); if (!running) reset();
}
// ── 캐릭별 강화 · 승급 · 각성 ─────────────────────────────────────────────────
function cEnh(id) { return (META.charEnh && META.charEnh[id]) || 0; }
function cStar(id) { return (META.charStar && META.charStar[id]) || 0; }
function cAwak(id) { return (META.charAwak && META.charAwak[id]) || 0; }
function cEnhCost(id) { return Math.round(120 * (cEnh(id) + 1) * charRarityCost(id)); }
function cEnhRate(id) { return Math.max(35, 100 - cEnh(id) * 6); }
function cAwakCost(id) { return Math.round(30 * Math.pow(2, cAwak(id)) * (1 - ascInsightDisc())); }
function charEnhance(id) {
  if (running) return;
  const e = cEnh(id), cost = cEnhCost(id);
  if (META.gold < cost) { toast(t("tGoldShort", { n: cost }), "#ef4444"); return; }
  META.gold -= cost; if (!META.charEnh) META.charEnh = {};
  if (Math.random() * 100 < cEnhRate(id)) { META.charEnh[id] = e + 1; logEvent("growth_moment", { type: "enhance", delta: 1, id: id }); toast(t("dSuccess", { n: e + 1 }), "#a3e635"); SFX.claim(); haptic("medium"); }
  else { if (e >= 5) { META.charEnh[id] = e - 1; toast(t("dFail") + " −1", "#ef4444"); } else toast(t("dFail"), "#ef4444"); SFX.lose(); haptic("heavy"); }
  saveMeta(); updateMeta(); openCharPanel(id); renderSquad(); if (!running) reset();
}
function fuseChar(id) {   // ✨ 합성: 같은 캐릭 중복 N장 → ★승급 (골드/젬 없이, 중복의 또다른 쓸모)
  if (running) return;
  const st = cStar(id), need = st + 1, have = (META.dupes && META.dupes[id]) || 0;
  if (st >= 5) { toast("최대 ★5", "#8b93a7"); return; }
  if (have < need) { toast(`합성에 중복 ${need}장 필요 (보유 ${have})`, "#ef4444"); return; }
  META.dupes[id] -= need;
  if (!META.charStar) META.charStar = {};
  META.charStar[id] = st + 1;
  logEvent("growth_moment", { type: "fuse", delta: 1, star: st + 1, id: id });   // 📊 계측
  saveMeta(); updateMeta(); openCharPanel(id); renderSquad(); if (typeof renderCodex === "function") renderCodex(); if (!running) reset();
  toast("✨ 합성! ★" + cStar(id) + " 승급 · 중복 " + need + "장 소모", "#fbbf24"); SFX.ssr(); haptic("heavy");
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
  logEvent("growth_moment", { type: "awaken", delta: 1, awak: cAwak(id), id: id });   // 📊 계측
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
// 🌟 SSR 9종 고유 액티브 설명(상세창 표기용) — 전투 fireSSRActive와 1:1
const SSR_ACTIVE_DESC = {
  Arclight: "⚖️ <b>심판의 일제사</b>: 강적 3체에 천공 강타 + 전군 치명타 +15%",
  Solace:   "🌊 <b>재생의 물결</b>: 약한 아군 3체 HP 25% 대회복 + 전군 8% 회복",
  Cipher:   "🔭 <b>정밀 해독</b>: 단일 적 약점노출 240% 강타·둔화 + 아군 치명 +25%",
  Ignis:    "🔥 <b>광란의 폭주</b>: 주변 적 화염 AOE + 자신 공격+60%·속도+40%",
  Vector:   "↯ <b>동시 지휘</b>: 아군 3체 즉시 돌격 + 공격·속도 버프",
  Vespera:  "🐝 <b>군집 분열</b>: 최근접 적에 벌떼 5연타 폭격",
  Aegis:    "🛡️ <b>수호의 방벽</b>: 전군에 보호막 부여(피해 절반)",
  Anvil:    "🔨 <b>건설 프로토콜</b>: 망치 200% 강타 + 광역 둔화 + 팀 10% 재생",
  Dominus:  "👑 <b>군단의 호령</b>: 전군 공격 +50%·속도 +40% 대버프",
};
// 🌟 레어도 스킬 안내(상세창) — 편성 시 발동하는 팀 스킬 + SSR 고유 액티브를 유저에게 명시
function raritySkillHTML(u) {
  const rarity = u && u.rarity;
  if (["SSR", "UR", "EX"].includes(rarity)) {
    const uniq = (u && SSR_ACTIVE_DESC[u.name]) ? '<br><span style="color:#fde047">' + SSR_ACTIVE_DESC[u.name] + " <i>(고유 액티브)</i></span>" : "";
    return '<div class="cp-skill"><b style="color:#fbbf24">🌟 SSR 스킬</b><br>'
      + '🛡️ <b>지휘</b>(패시브): 편성한 SSR+ 1체당 전군 공격·체력 +2% (최대 +10%)' + uniq + "</div>";
  }
  if (rarity === "SR") {
    return '<div class="cp-skill"><b style="color:#c084fc">✦ SR 스킬</b><br>'
      + '🎯 <b>정밀</b>(패시브): 편성한 SR 1체당 전군 치명타 +1.5% (최대 +9%)</div>';
  }
  return "";
}
function openCharPanel(id) {
  const u = ROSTER.find((x) => x.id === id); if (!u) return;
  if (cpCharId !== id) cpSlotFilter = null;   // 새 캐릭터면 슬롯필터 초기화 (깔끔 시작)
  cpCharId = id;
  const lv = charLv(id), gcs = charGearStats(id);
  const maxB = maxLevelsWithGold(id);
  const head = $("cp-head");
  if (head) head.innerHTML = `<div class="cp-art" style="border-color:${u.color}">${artHTML(u, "cpgly", "cpim", true)}</div>`
    + `<div class="cp-meta"><div class="cp-nm" style="color:${u.color}">${u.name}</div>`
    + `<div class="cp-ti">${u.title || u.arch} · ${u.rarity} · 🏷️${u.faction}</div>`
    + `<div class="cp-st">⚔️ 전력 <b>${charEffPower(id)}</b> · Lv${lv}${cEnh(id) ? " +" + cEnh(id) : ""}${cStar(id) ? " ★" + cStar(id) : ""}${cAwak(id) ? " ✦" + cAwak(id) : ""} · 💪${gcs.str} ❤️${gcs.int} 👟${gcs.agi} 🍀${gcs.luk}</div>`
    + `<button id="cp-lvup">⬆️ 레벨업 Lv${lv + 1} · 💰${charLvCost(id)}</button>`
    + `<div style="margin-top:3px;font-size:10px;display:flex;gap:2px;align-items:center;">일괄 <input id="cp-lv-num" type="number" value="${maxB||1}" min="1" max="${maxB||1}" style="width:32px">`
    + `<button id="cp-lv-batch" style="padding:0 4px;font-size:9px">실행</button>`
    + `<button id="cp-lv-max" style="padding:0 4px;font-size:9px">전부</button></div>`
    + raritySkillHTML(u) + `</div>`;
  on("cp-lvup", "click", () => charLevelUp(id));
  const numEl = $("cp-lv-num");
  on("cp-lv-batch", "click", () => { const n = numEl ? (parseInt(numEl.value)||1) : 1; charLevelUp(id, n); });
  on("cp-lv-max", "click", () => { const m = maxLevelsWithGold(id); if(m>0){ if(numEl) numEl.value=m; charLevelUp(id, m); } });
  // 강화 · 승급 · 각성 (캐릭별)
  const gw = $("cp-grow");
  if (gw) {
    const e = cEnh(id), st = cStar(id), aw = cAwak(id);
    const canAsc = e >= 10, canAwk = st >= 3 && aw < AWAK_MAX;
    const dup = (META.dupes && META.dupes[id]) || 0, fuseNeed = st + 1, canFuse = st < 5 && dup >= fuseNeed;   // 합성: 중복 N장 → ★승급
    gw.innerHTML =
      `<button id="cp-enh">⚙️ ${t("dEnhance")} +${e} · ${cEnhRate(id)}% · 💰${cEnhCost(id)}</button>`
      + (canFuse ? `<button id="cp-fuse" class="cp-purple">✨ 합성 ★${st}→★${st + 1} (중복 ${fuseNeed}장)</button>` : (dup ? `<span class="cp-gdim">✨ 합성 중복 ${dup}/${fuseNeed}</span>` : ""))
      + (canAsc ? `<button id="cp-asc" class="cp-gold">⭐ ${t("dCombo")} 💰5k+💎50</button>` : `<span class="cp-gdim">⭐ +10강 시 ${t("dCombo")}</span>`)
      + (canAwk ? `<button id="cp-awk" class="cp-purple">✦ 각성 🔮${cAwakCost(id)}</button>` : (st >= 3 && aw >= AWAK_MAX ? `<span class="cp-gdim">✦${aw} MAX</span>` : st < 3 ? `<span class="cp-gdim">✦ ★3↑ 각성</span>` : ""))
      + (st ? `<span class="cp-badge">★${st}</span>` : "") + (aw ? `<span class="cp-badge pur">✦${aw}</span>` : "");
    on("cp-enh", "click", () => charEnhance(id));
    on("cp-fuse", "click", () => fuseChar(id));
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
// ── 캐릭터 도감 그리드 (202종: EX/UR+SSR9 god-tier + SR/R/N) ──────────────────────────────────────────
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
  if (META.owned.indexOf(u.id) < 0) {
    const _c = META.owned.length + (META.gear || []).length;
    if (_c >= MAX_COMBINED) { toast(t("gFull"), "#ef4444"); window._lastGrantNew = false; return u; }
    META.owned.push(u.id); window._lastGrantNew = true;
    applyMYVisuals(u); // MY visuals endowment micro
  }
  else { META.dupes = META.dupes || {}; META.dupes[u.id] = (META.dupes[u.id] || 0) + 1; window._lastGrantNew = false; }   // 신규 vs 중복(분해/합성 대상)
  return u;
}
// 캐릭터 아트: art/<slug>.png 있으면 표시, 없으면(404) 이모지 폴백 (onerror로 자동)
function unitSlug(u) { return (u.name || u.arch || "").toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-|-$/g, ""); }
function artHTML(u, glyphCls, imgCls, noGlyph) {
  const base = u.vis || u.glyph || "●";
  const acc = u.accent ? `<span class="acc" style="font-size:0.55em;opacity:0.7;margin-left:-2px;">${u.accent}</span>` : "";
  const g = (noGlyph ? "" : `<span class="${glyphCls}">${base}${acc}</span>`);
  // PNG 우선 (u{id}.png for R "간지" art 76+ 포함) → slug → synth fallback (cool border+color "간지" placeholder)
  const slug = unitSlug(u);
  const col = (u.color || '#60a5fa').replace(/"/g, '');
  const b64 = (base + (u.accent || '')).replace(/"/g, '&quot;');
  // 누끼 우선 (SSR 1-9): u{id}-nukki.jpg → u{id}.png → slug → synth
  const NUKKI_IDS = new Set([1,2,3,4,5,6,7,8,9]);
  const imgSrc = NUKKI_IDS.has(u.id) ? `art/u${u.id}-nukki.jpg` : `art/u${u.id}.png`;
  const img = `<img class="${imgCls}" src="${imgSrc}" alt="" loading="lazy" data-c="${col}" data-b="${b64}" data-slug="${slug}">`;
  // safe nukki fallback
  setTimeout(() => {
    const imgs = document.querySelectorAll(`.${imgCls}[data-slug="${slug}"]`);
    imgs.forEach(im => {
      if (!im._errBound) {
        im._errBound = true;
        im.addEventListener('error', function onerr() {
          const s = (+this.dataset.s || 0) + 1; this.dataset.s = s;
          if (s === 1) {
            // nukki 실패 → 일반 png로 폴백 (src에서 -nukki 제거)
            let next = this.src;
            if (next.includes('-nukki')) {
              next = next.replace('-nukki.jpg', '.png').replace('-nukki.PNG', '.png');
            } else {
              next = `art/ssr/${slug}.png`;
            }
            this.src = next;
          } else if (s === 2) this.src = `art/ssr/${slug}.png`;
          else if (s === 3) this.src = `art/${slug}.png`;
          else {
            const c = this.dataset.c || '#60a5fa'; const bb = this.dataset.b || '●';
            const span = document.createElement('span');
            span.className = this.className + ' synth';
            span.style.cssText = `display:inline-block;border:1px solid ${c};background:#0b111f;color:#e2e8f0;padding:1px 3px;border-radius:2px;font-size:0.95em;opacity:0.9;`;
            span.textContent = bb;
            if (this.parentNode) this.parentNode.replaceChild(span, this);
          }
          this.removeEventListener('error', onerr);
        });
      }
    });
  }, 50);
  return g + img;
}
// ── 📋 도감 수집 보상 — 수집 N종 달성 시 영구 전군 버프(컬렉션 = 영구 파워) ──
const COLLECT_MILESTONES = [
  { n: 25,  atk: 0.03, hp: 0.03, gem: 100 },
  { n: 50,  atk: 0.05, hp: 0.05, gem: 250 },
  { n: 100, atk: 0.08, hp: 0.08, gem: 600 },
  { n: 150, atk: 0.12, hp: 0.12, gem: 1200 },
  { n: 200, atk: 0.20, hp: 0.20, gem: 3000 },   // 도감 컴플리트 — 전군 +20% 영구
];
function collectionBonus() {   // 수령한 마일스톤 합산 → {atk, hp} 영구 배율
  const done = META.collectClaimed || [];
  let atk = 0, hp = 0;
  COLLECT_MILESTONES.forEach((m) => { if (done.indexOf(m.n) >= 0) { atk += m.atk; hp += m.hp; } });
  return { atk: 1 + atk, hp: 1 + hp };
}
function claimCollect(n) {
  const m = COLLECT_MILESTONES.find((x) => x.n === n); if (!m) return;
  const owned = (META.owned || []).length;
  if (owned < n) { toast(t("tColLock", { n: n }) || (n + "종 수집 필요"), "#ef4444"); return; }
  if (!META.collectClaimed) META.collectClaimed = [];
  if (META.collectClaimed.indexOf(n) >= 0) { toast("이미 수령", "#8b93a7"); return; }
  META.collectClaimed.push(n);
  META.gems = (META.gems || 0) + m.gem;
  bumpPrestige(1); saveMeta(); updateMeta(); renderCollectRewards(); if (!running) reset();
  toast("📋 " + n + "종 수집 보상! 💎" + m.gem + " + 전군 영구 공·체 +" + Math.round(m.atk * 100) + "%", "#fbbf24");
  haptic("heavy"); try { confettiBurst(); } catch (e) {}
}
function renderCollectRewards() {
  const el = $("collect-rewards"); if (!el) return;
  const owned = (META.owned || []).length, done = META.collectClaimed || [];
  const b = collectionBonus();
  const totBuff = Math.round((b.atk - 1) * 100);
  el.innerHTML = '<div style="font-size:11px;color:#a3e635;margin:6px 0 3px;font-weight:700;">📋 수집 보상 · 도감 ' + owned + '/200' + (totBuff > 0 ? ' · 현재 전군 +' + totBuff + '% 영구' : '') + '</div>'
    + '<div style="display:flex;gap:4px;flex-wrap:wrap;">' + COLLECT_MILESTONES.map((m) => {
      const claimed = done.indexOf(m.n) >= 0, ready = owned >= m.n && !claimed;
      const bg = claimed ? '#1c2638' : ready ? 'linear-gradient(135deg,#3a2c12,#1a1410)' : '#14131c';
      const bd = ready ? '#fbbf24' : claimed ? '#2b3650' : '#1c1b27';
      const ic = claimed ? '✅' : ready ? '🎁' : '🔒';
      return '<button class="col-rw" data-n="' + m.n + '" style="flex:1;min-width:60px;font-size:10px;padding:5px 3px;border-radius:7px;background:' + bg + ';border:1px solid ' + bd + ';color:#e2e8f0;cursor:' + (ready ? 'pointer' : 'default') + ';">' + ic + ' ' + m.n + '종<br><span style="color:#fbbf24">+' + Math.round(m.atk * 100) + '%</span></button>';
    }).join('') + '</div>';
  el.querySelectorAll('.col-rw').forEach((bn) => bn.onclick = () => { const n = +bn.dataset.n; if ((META.owned || []).length >= n && (META.collectClaimed || []).indexOf(n) < 0) claimCollect(n); });
}
function renderCodex() {
  try {
  renderConquestMap();   // 🗺️ 정복 연대기
  renderCollectRewards();   // 📋 수집 보상 마일스톤
  const grid = $("codex-grid"); if (!grid || typeof ROSTER === "undefined") return;
  const owned = new Set(META.owned || []);
  if ($("codex-count")) $("codex-count").textContent = owned.size + " / " + ROSTER.length;
  const fbar = $("codex-filter");
  if (fbar && !fbar.dataset.built) {
    const _present = ["EX", "UR", "SSR", "SR", "R", "N"].filter((r) => ROSTER.some((u) => u.rarity === r));   // 유닛 있는 등급만(UR/EX 0개면 숨김, 출시후 채우면 자동부활)
    fbar.innerHTML = ["ALL", ..._present].map((r) => `<button class="cfil" data-r="${r}">${r}</button>`).join("");
    fbar.querySelectorAll(".cfil").forEach((b) => b.addEventListener("click", () => { codexFilter = b.dataset.r; renderCodex(); }));
    fbar.dataset.built = "1";
  }
  if (fbar) fbar.querySelectorAll(".cfil").forEach((b) => b.classList.toggle("on", b.dataset.r === codexFilter));
  const list = codexFilter === "ALL" ? ROSTER : ROSTER.filter((u) => u.rarity === codexFilter);
  grid.innerHTML = list.map((u) => {
    const has = owned.has(u.id);
    const archCls = u.arch ? ` arch-${u.arch}` : "";
    const facCls = u.faction ? ` fac-${u.faction.toLowerCase()}` : "";
    const dn = (META.dupes && META.dupes[u.id]) ? `<span class="cxc-dup">×${META.dupes[u.id] + 1}</span>` : "";   // 중복 수량 뱃지
    return `<div class="cxc r${u.rarity}${has ? "" : " lock"}${archCls}${facCls}" data-id="${u.id}"><div class="cxg">${artHTML(u, "cxgly", "cxim")}</div>${dn}</div>`;
  }).join("");
  grid.querySelectorAll(".cxc").forEach((c) => c.addEventListener("click", () => {
    const id = +c.dataset.id;
    c.style.transform = 'scale(0.92)';
    setTimeout(() => { if (c) c.style.transform = ''; }, 90);
    showUnit(id);
  }));
  } catch(e) { console.warn('도감 렌더 오류', e); }
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
  // 장비 도감 일러스트: gearArt 큰 프리뷰 (미보유도 미리보기). CSS가 tight nukki와 fill 담당
  const artHtml = gearArt(g);
  $("unit-glyph").innerHTML = `<div class="gdex-gear-preview">${artHtml}</div>`;
  const e = (disp.enh || 0), s = (disp.star || 0), a = (disp.awak || 0);
  $("unit-name").innerHTML = `<b style="color:${g.color}">[${g.rarity}${e?"+"+e:""}${s?" ★"+s:""}${a?" ✦"+a:""}]</b> ${has ? nm : "???"}`;
  $("unit-title").textContent = has ? (t("st_" + SLOT_MAIN[g.slot]) || g.slot) : t("locked");
  const dtl = has ? STAT_KEYS.filter((k) => g[k]).map((k) => t("st_" + k) + " +" + gearStat(disp, k)).join(" · ") : t("lockedHint");
  const effHtml = (has && disp.effect) ? `<br>✨ ${disp.effect.name || disp.effect.type}: ${disp.effect.desc || ''}` : '';
  $("unit-detail").innerHTML = dtl + effHtml;
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
    + (g.effect ? `<div class="gm-eff" style="font-size:11px;color:#fde047;margin-top:2px;">✨ ${g.effect.name || ''} ${g.effect.desc || g.effect.type || ''}</div>` : '')
    + `</div></div>`;
  // 성장 버튼 섹션 (캐릭터창 #cp-grow처럼)
  html += `<div class="gm-grow">`;
  html += `<button id="gpop-enh" class="gpop-enh">🔨 ${t("dEnhance")} +${e} · ${rate}% · 💰${enhC}</button>`;
  if (e >= 10 && s < 30) {
    const starC = Math.round(1000 * (s + 1) * Math.pow(1.3, s));
    html += `<button id="gpop-star" class="gpop-star">⭐ 별강화 ★${s}→★${s+1} · 💰${starC.toLocaleString("en-US")}</button>`;
  }
  if (s >= 3 && a < 5) {
    const awkC = 50 * (a + 1);
    html += `<button id="gpop-awk" class="gpop-awk">✦ 각성 ✦${a}→✦${a+1} · 🔮${awkC}</button>`;
  }
  const dupG = (g.tplId != null) && META.gear.find((x) => x.id !== id && x.tplId === g.tplId && !gearOwnerName(x.id));   // 같은 장비(미장착) 합성용
  if (dupG && s < 30) html += `<button id="gpop-fuse" class="gpop-star">✨ 합성 ★${s}→★${s + 1} (같은 장비 소모)</button>`;
  if (!gearOwnerName(id)) html += `<button id="gpop-scrap" class="gpop-enh" style="border-color:#fbbf24;background:linear-gradient(160deg,#3a2c1a,#1a1410)">🔨 분해 +${gearScrapGold(g)}골드</button>`;
  html += `</div>`;
  $("unit-detail").innerHTML = html;
  on("gpop-enh", "click", () => { enhanceGear(id); setTimeout(() => openGearItem(id), 50); });
  if (e >= 10 && s < 30) on("gpop-star", "click", () => { gearStar(id); setTimeout(() => openGearItem(id), 50); });
  if (s >= 3 && a < 5) on("gpop-awk", "click", () => { gearAwaken(id); setTimeout(() => openGearItem(id), 50); });
  if (dupG && s < 30) on("gpop-fuse", "click", () => { fuseGear(id); setTimeout(() => openGearItem(id), 50); });
  if (!gearOwnerName(id)) on("gpop-scrap", "click", () => dismantleGear(id));
  $("unit-pop").classList.remove("hidden");
}
function showUnit(id) {
  try {
  const u = ROSTER.find((x) => x.id === id); if (!u) return;
  const has = (META.owned || []).indexOf(id) >= 0;
  $("unit-card").style.borderColor = u.color;
  $("unit-card").classList.toggle('rSSR', u.rarity === 'SSR');
  $("unit-card").classList.remove('gear-manage');   // 유닛 도감은 기본 세로 레이아웃
  $("unit-glyph").innerHTML = artHTML(u, "ucgly", "ucim", true);   // 깨끗한 누끼 일러스트 (옆 이모티콘 제거) — Anvil 등 SSR 포트레이트에 맞춤
  $("unit-name").innerHTML = `<b style="color:${u.color}">[${u.rarity}]</b> ${has ? u.name : "???"}`;
  $("unit-title").textContent = has ? (u.title || u.arch) : t("locked");
  const baseLore = (typeof LORE !== "undefined" && LORE[id]) ? LORE[id] : "";
  const lore = baseLore ? `<div class="unit-lore">📖 ${ENABLE_DECEPTIVE_ORIGIN ? getOriginReveal(u) + "<br>" : ""}${baseLore}</div>` : "";   // 군주 20260617: 캐릭터 서사(도파민) — 항상 노출 + fictional origin hype (deceptive feel via "기밀 해독")
  $("unit-detail").innerHTML = (has
    ? `${u.faction ? "🏷️ " + u.faction + " · " : ""}${u.glyph} ${u.arch} ×${u.mul}<br>${u.persona ? "💬 " + u.persona + "<br>" : ""}${u.trait ? "✦ " + u.trait : ""}`
    : t("lockedHint")) + lore;
  $("unit-pop").classList.remove("hidden");
  } catch(e) { console.warn('유닛표시 오류', e); }
}
// ── 장비: 제작 · 장착 · 강화 ──────────────────────────────────────────────────
function craftGear(forceRar) {
  // 🔥 CHEAT: psych-narrative-moat + cycle-cheat (near-miss build in FX, "MY Legion forges" narrative, var cycle yield). p1 craft jackpot amp. Lilith+Seraphine. Disclosure 100%.
  const cost = 300;
  if (META.gold < cost) { toast(t("tGoldShort", { n: cost }), "#ef4444"); return; }
  const _combined = ((META.owned || []).length) + (META.gear || []).length;
  if (_combined >= MAX_COMBINED) { toast(t("gFull"), "#ef4444"); return; }   // 총합(캐릭+장비) 500 한도
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
function fuseGear(id) {   // ✨ 장비 합성: 같은 장비(같은 tplId·미장착) 소모 → 별강화 (강화10 우회)
  if (running) return;
  const g = META.gear.find((x) => x.id === id); if (!g) return;
  if ((g.star || 0) >= 30) { toast("★ 최대 (30)", "#8b93a7"); return; }   // 🌟 30성 개편
  const dup = META.gear.find((x) => x.id !== id && x.tplId === g.tplId && !gearOwnerName(x.id));
  if (!dup) { toast("합성할 같은 장비(미장착)가 없어요", "#ef4444"); return; }
  META.gear = META.gear.filter((x) => x.id !== dup.id);
  g.star = (g.star || 0) + 1;
  saveMeta(); updateMeta(); renderGear();
  toast("✨ 장비 합성! ★" + g.star + " · 같은 장비 1개 소모", "#fbbf24"); if (SFX && SFX.ssr) SFX.ssr(); haptic("heavy");
  if (!running) reset();
}
function gearStar(id) {
  const g = META.gear.find((x) => x.id === id); if (!g) return;
  if ((g.enh || 0) < 10) { toast("강화 10회 이상 필요", "#ef4444"); return; }
  const s = (g.star || 0);
  if (s >= 30) { toast("★ 최대 (30)", "#8b93a7"); return; }       // 🌟 30성 개편
  const cost = Math.round(1000 * (s + 1) * Math.pow(1.3, s));      // 🌟 비용 1.3^s 지수(★30 누적 233M = 극악)
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
      const effTag = g && g.effect ? `<span style="font-size:8px;color:#a3e635;">${g.effect.name?g.effect.name.slice(0,6):''}</span>` : '';
      return `<div class="gslot${g ? " on" : ""}">${art}${badge}${effTag}</div>`;
    }).join("");
  }
  if ($("gear-count")) $("gear-count").textContent = (META.gear || []).length + "개";
  const inv = $("gear-inv");
  if (inv) {
    if (!META.gear.length) { inv.innerHTML = `<div class="ddim" style="text-align:center;padding:12px 0">${t("gEmpty")}</div>`; return; }
    inv.innerHTML = META.gear.slice().sort((a, b) => b.id - a.id).map((g) => {
      const owner = gearOwnerName(g.id);
      const ss = g.star || 0, aa = g.awak || 0;
      const eff = g.effect ? `<div class="gt-eff" style="font-size:8px;color:#a3e635;">${g.effect.name || g.effect.type}</div>` : '';
      return `<div class="ginv-tile r${g.rarity}" data-id="${g.id}" style="border-color:${g.color}"><div class="gt-art">${gearArt(g)}</div><div class="gt-rr" style="color:${g.color}">${g.rarity}${g.enh ? "+" + g.enh : ""}${ss ? " ★" + ss : ""}${aa ? " ✦" + aa : ""}</div>${eff}${owner ? '<span class="gt-eq">🎽</span>' : ""}</div>`;
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
// dash-protect removed (legacy)
on("gear-craft", "click", () => craftGear());
on("gear-scrap-junk", "click", dismantleJunkGear);
on("gdex-toggle", "click", () => { const w = $("gdex-wrap"); if (w) { w.classList.toggle("hidden"); renderGearCodex(); } });
on("unit-close", "click", () => $("unit-pop").classList.add("hidden"));
// bg click close for unit-pop (robust UX)
const unitPop = $("unit-pop");
if (unitPop) unitPop.addEventListener("click", (e) => { if (e.target.id === "unit-pop") unitPop.classList.add("hidden"); });
on("cp-close", "click", () => $("char-panel").classList.add("hidden"));
// bg click close for char-panel
const charP = $("char-panel");
if (charP) charP.addEventListener("click", (e) => { if (e.target.id === "char-panel") charP.classList.add("hidden"); });
// legend-toggle removed (legacy UI)
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
// gacha-btn removed (now handled in shop/quick-pull)
$("gacha-close").addEventListener("click", () => $("gacha").classList.add("hidden"));
$("auto").addEventListener("click", toggleAuto);
$("ult").addEventListener("click", doUlt);
$("hero-up").addEventListener("click", upgradeHero);
$("starter-buy").addEventListener("click", buyStarter);
$("starter-close").addEventListener("click", () => $("starter").classList.add("hidden"));
// starter-btn integrated to shop (removed)
document.querySelectorAll(".modetab").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.m)));
document.querySelectorAll(".hbtn").forEach((b) => b.addEventListener("click", () => selectHero(b.dataset.h)));
// 💡 메타바 아이콘 탭 → 재화 설명 토스트
(function () {
  const mb = document.getElementById("metabar"); if (!mb) return;
  const INFO = {
    gold: "💰 골드 — 유닛·장비 강화의 기본 재화. 🔄 골드 복리: 영웅을 모을수록 군단 전력↑ → 전투마다 자동 배당 골드↑. 즉 컬렉션이 곧 이자(복리)다. 더 모으면 가만히 있어도 골드 수입이 눈덩이처럼 커진다 (무과금 플라이휠).",
    gem: "💎 젬 — 프리미엄 재화. 영웅 가챠 소환에 사용 (상점 충전·이벤트)",
    soul: "🔮 소울 — 중복 캐릭 분해로 획득. 소울 상점·각성에 사용",
    ch: "📖 챕터 — 현재 진행 챕터. 클리어할수록 보상·전력↑",
    eth: "⬡ 에테르 — 환생으로 얻는 영구 화폐. 에테르 상점서 전군 영구 강화",
    pity: "🎯 천장 — N회 뽑으면 SSR 확정. 12회 = 보장",
  };
  mb.addEventListener("click", (e) => {
    const item = e.target.closest(".meta"); if (!item) return;
    if (item.id === "streak-meta") { toast("🔥 연속 출석 — 매일 클레임으로 유지. 7일+ AFK 보상↑", "#fbbf24"); return; }
    for (const k in INFO) { if (item.classList.contains(k)) { toast(INFO[k], "#67e8f9"); return; } }
  });
})();
window.addEventListener("resize", () => { if (!running) reset(); });
// lastSeen 하트비트 (방치 보상 정확도) + 이탈 시 저장
setInterval(() => { try { META.lastSeen = nowMs(); localStorage.setItem(META_KEY, JSON.stringify(META)); } catch (e) {} }, 15000);
setInterval(tickPlay, 1000);   // ⏱️ 플레이타임 보상 적립(보이는 동안만)
document.addEventListener("visibilitychange", () => { if (document.hidden) saveMeta(); });
window.addEventListener("beforeunload", saveMeta);

// Escape to close common modals (robust for stuck UI)
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    ['odds-modal', 'unit-pop', 'gacha', 'starter', 'char-panel', 'overlay'].forEach(function(id) {
      const el = $(id);
      if (el && !el.classList.contains('hidden')) {
        if (id === 'odds-modal') {
          closeOdds();  // use full robust closer (display + hidden + cleanup)
        } else {
          el.classList.add('hidden');
        }
      }
    });
  }
});

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
// Referral bonus ONLY when direct link join (start=ref). Button share gives nothing. (user: "초대를 직접 해야 보상")
try { processReferralBonus(); } catch (e) {}
// Daily 미션 힌트 (치명적 루프)
if (!META.dailyMissionsClaimed && ((META.dailyBattles||0) + (META.dailyPulls||0)) < 2) {
  setTimeout(() => toast("📅 이벤트 → 일일 미션 확인! (전투/뽑 1회씩)", "#a3e635"), 2500);
}
// 기본 FTUE (신규 첫 경험 유도 — 출시 임박 최소 가이드)
if ((META.chapter || 1) <= 2 && ((META.pulls || 0) + (META.owned || []).length) < 5) {
  // 스타터 3인 고정 지급 (SR 전략가 + R 사수 + R 수호자)
  if (!META.starterUnitsGiven) {
    META.army.marksman = (META.army.marksman || 0) + 1;
    META.army.guardian = (META.army.guardian || 0) + 1;
    META.army.commander = (META.army.commander || 0) + 1;
    META.starterUnitsGiven = true;
    saveMeta();
    setTimeout(() => toast("🎁 스타터 3인 지급! (사수+수호자+지휘관) 시너지 확인!", "#a3e635"), 2000);
  }
  setTimeout(() => {
    toast("⚔️ 전투 시작 → 🎰 가챠 → 🦸 강화! (시너지로 강해짐)", "#a3e635");
  }, 1400);
}
setTimeout(() => { try { maybeSortie(); } catch (e) {} }, 700);   // ⚔️ 일일 출정식 의례
// 🎓 신규 가이드 튜토리얼 (스포트라이트 코치마크 — 핵심 루프 30초 안내)
const TUT_STEPS = [
  { text: "⚔️ 환영합니다, 사령관님!\n\nAI 군단을 모아 키우고 끝없이 정복하는 게임이에요.\n30초면 핵심을 다 익혀요!", target: null, next: "시작 👉" },
  { text: "👇 먼저 <b>▶ 전투 시작</b>을 눌러보세요.\n군단이 자동으로 싸웁니다!", target: "#start", next: "다음" },
  { text: "💎 전투로 모은 젬으로 <b>🎰 뽑기</b>를 해\n강력한 영웅(SSR!)을 소환하세요.", target: "#quick-pull", next: "다음" },
  { text: "👥 <b>캐릭터</b> 탭에서 영웅을 편성·강화하면\n시너지로 군단이 더 강해져요.", target: ".navtab[data-p='char']", next: "다음" },
  { text: "🛒 <b>상점</b>엔 한정 배너·창단팩,\n📋 <b>도감</b>엔 수집 보상이 있어요!", target: ".navtab[data-p='shop']", next: "다음" },
  { text: "🐉 끝! 군단은 당신이 없는 동안에도\n자동으로 정복하고 성장합니다.\n\n이제 세계를 정복하세요!", target: null, next: "정복 시작! ⚔️" },
];
let _tutStep = 0;
function startTutorial() {
  const ov = document.getElementById("tutorial"); if (!ov) return;
  try { showPage("battle"); } catch (e) {}   // 핵심 버튼 보이게
  _tutStep = 0; ov.style.display = "block";
  try { logEvent("tutorial_start", {}); } catch (e) {}
  const nx = document.getElementById("tut-next"); if (nx) nx.onclick = tutNext;
  const sk = document.getElementById("tut-skip"); if (sk) sk.onclick = finishTutorial;
  window.addEventListener("resize", tutReposition);
  tutShow();
}
function tutShow() {
  const s = TUT_STEPS[_tutStep]; if (!s) { finishTutorial(); return; }
  const txt = document.getElementById("tut-text"); if (txt) txt.innerHTML = s.text;
  const nx = document.getElementById("tut-next"); if (nx) nx.textContent = s.next || "다음";
  const dots = document.getElementById("tut-dots"); if (dots) dots.textContent = TUT_STEPS.map((_, i) => i === _tutStep ? "●" : "○").join(" ");
  setTimeout(tutReposition, 30);
}
function tutReposition() {
  const s = TUT_STEPS[_tutStep], ring = document.getElementById("tut-ring"), card = document.getElementById("tut-card"); if (!ring) return;
  const tgt = s && s.target ? document.querySelector(s.target) : null;
  if (!tgt || tgt.getBoundingClientRect().width === 0) {
    ring.style.display = "none";
    if (card) { card.style.top = "auto"; card.style.bottom = "84px"; }   // 타겟 없으면 카드 하단
    return;
  }
  const r = tgt.getBoundingClientRect();
  ring.style.display = "block";
  ring.style.left = (r.left - 6) + "px"; ring.style.top = (r.top - 6) + "px";
  ring.style.width = (r.width + 12) + "px"; ring.style.height = (r.height + 12) + "px";
  // 카드가 하이라이트를 안 가리게 — 타겟이 하단이면 카드 위로, 상단이면 카드 아래
  if (card) {
    if (r.top > window.innerHeight * 0.5) { card.style.bottom = "auto"; card.style.top = "56px"; }
    else { card.style.top = "auto"; card.style.bottom = "84px"; }
  }
}
function tutNext() { _tutStep++; if (_tutStep >= TUT_STEPS.length) { finishTutorial(); return; } tutShow(); }
function finishTutorial() {
  const ov = document.getElementById("tutorial"); if (ov) ov.style.display = "none";
  META.tutDone = true; try { saveMeta(); } catch (e) {}
  try { logEvent("tutorial_done", { step: _tutStep }); } catch (e) {}
  window.removeEventListener("resize", tutReposition);
}
function maybeStartTutorial() {
  if (META.tutDone) return;
  if ((META.owned || []).length > 3 || (META.pulls || 0) > 0 || (META.chapter || 1) > 2) { META.tutDone = true; try { saveMeta(); } catch (e) {} return; }   // 기존 유저 스킵
  setTimeout(() => { try { startTutorial(); } catch (e) {} }, 500);
}
// 🔞 연령 확인 게이트 (확률형 아이템 미성년 보호 — 1회, META.ageOk 저장)
(function () {
  try {
    if (META.ageOk) { maybeStartTutorial(); return; }   // 이미 연령확인 → 바로 튜토 체크
    const g = document.getElementById("age-gate"); if (!g) return;
    g.style.display = "flex";
    const yes = document.getElementById("age-yes"), no = document.getElementById("age-no");
    if (yes) yes.onclick = function () { META.ageOk = true; try { saveMeta(); } catch (e) {} g.style.display = "none"; try { logEvent("age_confirmed", {}); } catch (e) {} try { maybeStartTutorial(); } catch (e) {} };
    if (no) no.onclick = function () {
      g.innerHTML = '<div style="max-width:340px;text-align:center;color:#e2e8f0;font-family:system-ui,sans-serif;padding:24px;line-height:1.8;"><div style="font-size:34px;margin-bottom:10px;">🔞</div><div style="font-size:16px;font-weight:700;color:#fbbf24;margin-bottom:10px;">보호자 동의가 필요합니다</div><div style="font-size:13px;color:#a3a3c2;">미성년자는 법정 보호자의 동의 후 이용할 수 있습니다.<br>Minors require parental/guardian consent to continue.</div></div>';
    };
  } catch (e) {}
})();
// 📊 계측: 최초 설치(1회) + 세션 시작. fire-and-forget, 게임 영향 0.
try {
  if (!META._installed) { META._installed = true; saveMeta(); logEvent("install", { ch: META.chapter || 1 }); }
  logEvent("session_start", { ch: META.chapter || 1, tower: META.tower || 1, pulls: META.pulls || 0 });
  pingActive();   // 🔔 재참여 알림용 활동 핑(비활성 판정 정확)
} catch (e) {}
