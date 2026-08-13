/* 💰 결제 지급 배수 회귀 테스트 — "첫 결제 2배"가 정확히 2배인지 실측으로 못박는다.
   배경: 2026-06-16 SKU별 첫구매 2배(META.firstBuy) → 2026-06-21 전역 첫결제 2배(firstPurchaseDone)가
         델타를 한 번 더 2배하며 중첩 → 젬·골드 팩 첫 결제가 base×4로 지급되고 있었다(15일간 미발견).
         표시(배지·배너)는 둘 다 "2배"라 코드=표시 불일치 = 표시광고 리스크 + 매출 누수.
   실행: node test/pay-money-path.test.js   (종료코드 0=통과)
   ⚠️ 이 테스트가 깨지면 지급 배수가 바뀐 것이다. 숫자를 테스트에 맞추지 말고 왜 바뀌었는지 먼저 확인할 것. */
const fs = require("fs"), vm = require("vm"), path = require("path");
const ROOT = path.join(__dirname, "..");

function mockEl() {
  const e = { textContent: "", innerHTML: "", value: "", dataset: {},
    style: new Proxy({}, { get(t, k) { return ["removeProperty", "setProperty", "getPropertyValue"].includes(k) ? () => "" : (t[k] ?? ""); }, set(t, k, v) { t[k] = v; return true; } }),
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    offsetWidth: 100, clientWidth: 360, width: 360, height: 360, children: [], firstChild: null, checked: false,
    addEventListener() {}, removeEventListener() {}, appendChild() {}, removeChild() {}, remove() {}, setAttribute() {}, getAttribute() { return null; },
    querySelector() { return mockEl(); }, querySelectorAll() { return []; }, getContext() { return ctx(); },
    getBoundingClientRect() { return { width: 360, height: 360, top: 0, left: 0 }; },
    insertBefore() {}, cloneNode() { return mockEl(); }, closest() { return null; }, focus() {}, click() {} };
  e.parentElement = { clientWidth: 360, appendChild() {}, style: {} };
  return e;
}
function ctx() { return new Proxy({ canvas: { width: 360, height: 360 }, measureText() { return { width: 10 }; } }, { get(t, k) { return (k in t) ? t[k] : () => ({ addColorStop() {} }); }, set() { return true; } }); }

const els = {}, sb = {};
Object.assign(sb, { console: { log() {}, warn() {}, error() {} }, Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp, isNaN, parseInt, parseFloat, Set, Map, Symbol, Proxy, Error, Promise, encodeURIComponent });
sb.setTimeout = () => 0; sb.clearTimeout = () => {}; sb.setInterval = () => 0; sb.clearInterval = () => {}; sb.requestAnimationFrame = () => 0; sb.cancelAnimationFrame = () => {};
sb.localStorage = { _d: {}, getItem(k) { return this._d[k] ?? null; }, setItem(k, v) { this._d[k] = String(v); }, removeItem(k) { delete this._d[k]; } };
sb.Image = function () { return mockEl(); };
sb.AudioContext = function () { return new Proxy({ state: "running", currentTime: 0, destination: {}, sampleRate: 44100 }, { get(t, k) { return (k in t) ? t[k] : () => ({ connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {}, value: 0 }, gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} }, type: "", detune: { setValueAtTime() {} }, buffer: null, addColorStop() {} }); } }); };
sb.webkitAudioContext = sb.AudioContext;
sb.navigator = { language: "ko", userAgent: "node" };
sb.document = { getElementById(id) { return els[id] || (els[id] = mockEl()); }, querySelector() { return mockEl(); }, querySelectorAll() { return []; }, createElement() { return mockEl(); }, addEventListener() {}, body: mockEl(), documentElement: mockEl(), hidden: false };
sb.getComputedStyle = () => new Proxy({}, { get() { return ""; } });
sb.fetch = () => Promise.resolve({ json: () => Promise.resolve({}) });
sb.window = sb; sb.globalThis = sb; sb.self = sb; sb.window.Telegram = undefined;
sb.addEventListener = () => {}; sb.removeEventListener = () => {}; sb.scrollTo = () => {}; sb.matchMedia = () => ({ matches: false, addEventListener() {} }); sb.innerWidth = 400; sb.innerHeight = 800;
vm.createContext(sb);
for (const f of ["i18n.js", "units.js", "gear.js", "lore.js", "game.js"]) {
  try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), "utf8"), sb, { filename: f }); }
  catch (e) { console.log("🔴 LOAD ERROR", f, e.message); process.exit(2); }
}

// 지급량 실측기 — 컨텍스트 안에서 grantPackWithBonus를 실제로 호출한다
vm.runInContext(`globalThis.__measure = function(ids, reset){
  var r = [];
  if (reset) { META.gems = 0; META.gold = 0; META.firstPurchaseDone = false; META.firstBuy = {}; }
  ids.forEach(function(id){
    var g0 = META.gems || 0, o0 = META.gold || 0;
    grantPackWithBonus(id);
    r.push({ id: id, gem: (META.gems||0) - g0, gold: (META.gold||0) - o0 });
  });
  return JSON.stringify(r);
};`, sb);
const measure = (ids, reset) => JSON.parse(sb.__measure(ids, reset));

const CASES = [
  // [설명, 구매순서, 리셋, 기대 지급]
  ["첫 결제 = 젬팩 → 정확히 2배(4배 아님)", ["gem1"], true, [{ gem: 120, gold: 0 }]],
  ["같은 SKU 재구매 → 배수 없음(정가)", ["gem1", "gem1"], true, [{ gem: 120, gold: 0 }, { gem: 60, gold: 0 }]],
  ["첫 결제 = 골드팩 → 정확히 2배", ["gold1"], true, [{ gem: 0, gold: 12000 }]],
  ["첫 결제 후 새 SKU → SKU별 첫구매 2배만", ["gem1", "gem2"], true, [{ gem: 120, gold: 0 }, { gem: 660, gold: 0 }]],
  ["첫 결제 = 창단팩(SKU 2배 비대상) → 전역 첫결제 2배 적용", ["founder"], true, [{ gem: 3000, gold: 0 }]],
  ["창단팩 이후 젬팩 → SKU 2배만(중첩 없음)", ["founder", "gem1"], true, [{ gem: 3000, gold: 0 }, { gem: 120, gold: 0 }]],
];

let bad = 0;
for (const [name, ids, reset, want] of CASES) {
  const got = measure(ids, reset);
  const ok = want.every((w, i) => got[i] && got[i].gem === w.gem && got[i].gold === w.gold);
  if (!ok) bad++;
  console.log((ok ? "✅ " : "❌ ") + name);
  if (!ok) console.log("   기대 " + JSON.stringify(want) + "\n   실제 " + JSON.stringify(got.map(g => ({ gem: g.gem, gold: g.gold }))));
}
console.log(bad === 0 ? "\n🟢 지급 배수 계약 유지 (모든 프로모션 = 정확히 2배)" : "\n🔴 지급 배수 계약 위반 " + bad + "건 — 표시(2배)와 코드 불일치. 배포 금지.");
process.exit(bad === 0 ? 0 : 1);
