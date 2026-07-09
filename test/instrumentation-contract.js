#!/usr/bin/env node
/* 계측 계약 게이트 — game.js가 logEvent로 쏘는 모든 이벤트가
   analytics-worker.js ALLOWED 화이트리스트에 있는지 검증.
   교훈(2026-07-02): core_loop_complete가 화이트리스트에 없어 North Star 이벤트가
   라이브에서 bad-event로 폐기됐음. 정적으로는 안 잡히는 계약 drift를 여기서 잡는다.
   실패 시 exit 1. verify.sh 4단계에서 호출. */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const g = fs.readFileSync(path.join(root, "game.js"), "utf8");
const w = fs.readFileSync(path.join(root, "analytics-worker.js"), "utf8");

const emitted = new Set();
for (const m of g.matchAll(/logEvent\(\s*["']([a-z0-9_]+)["']/g)) emitted.add(m[1]);

const allowBlock = (w.match(/const ALLOWED = new Set\(\[([\s\S]*?)\]\)/) || [])[1] || "";
const allowed = new Set([...allowBlock.matchAll(/["']([a-z0-9_]+)["']/g)].map((x) => x[1]));

const missing = [...emitted].filter((e) => !allowed.has(e)).sort();

if (allowed.size === 0) {
  console.log("🔴 계측: worker ALLOWED 파싱 실패 — 스키마 확인 필요");
  process.exit(1);
}
if (missing.length) {
  console.log("🔴 계측 계약 위반 — 워커가 버리는 이벤트:", missing.join(", "));
  console.log("   → analytics-worker.js ALLOWED에 추가 필요 (안 하면 라이브에서 bad-event 폐기).");
  process.exit(1);
}
console.log(`🟢 계측 계약 OK — emit ${emitted.size}종 전부 worker 허용(${allowed.size}종 화이트리스트).`);
process.exit(0);
