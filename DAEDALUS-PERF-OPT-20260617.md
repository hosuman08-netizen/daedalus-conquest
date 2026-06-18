# Daedalus Perf Analysis — Stutter/Lag (CEO → COO)

**Date**: 2026-06-17  
**Target**: TG mobile WebApp 60fps stable (battle canvas primary)  
**Scope**: game.js draw/loop + style.css infinite anims (index.html canvas setup)  
**Method**: code inspection (no runtime profile yet)

## Top 3 Bottlenecks (priority order)

1. **Per-frame canvas synthetic overdraw (draw:1033-1248)**  
   - Full clear + grid (2x ~W/40 beginPath/stroke loops every frame — static waste).  
   - Per-unit (10-30): createRadialGradient (glow) xN + ellipse shadow + 3-8 arcs/strokes + HP rRect (4 arcTo) + conditional rich synth (enemy: 5-12 lines/arcs/fills per arch + sin(Date.now) corruption; player militia pulse).  
   - fx per particle (unbounded, 20-50+ in ult/chain): globalAlpha + beginPath/arc/stroke each.  
   - Portrait drawImage good; fallback synth = main cost. Host Weave (founders pairs) + ultBurst rays add more paths/sin.  
   - loop:1256 calls draw() + 3x .filter (units/fx) + step every rAF. No batch, no cache, no throttle.

2. **Date.now() + trig hot path in render**  
   - 6-10+ direct Date.now()/sin per frame inside draw: Host Weave t=Date.now()/180 (1065 per pair), corruption lines sin(Date.now/200+k) (1207), militia pulse (1227), SSR alpha sin(/380) (1236), ult sin(bt), boss breathe etc.  
   - nowMs() wrapper (207) exists but unused in hot draw. Adds call overhead + prevents opts in tight loop.

3. **Concurrent infinite CSS box-shadow anims + fx leak + uncapped rAF**  
   - Multiple running always/when-visible:  
     - #ult.ready: ultsparkle 1.3s inf (box-shadow heavy, 492)  
     - .syn-card.on: synpulse 1.6s inf (897, visible in battle synergy table)  
     - #auto.on: pulse 1.2s inf (522)  
     - #asc-prompt: ascPulse 2.4s inf (806)  
     - .modetab.teaser, .carried-pop, gearShardFloat (many), hselpop etc.  
   - Box-shadow = expensive paint/compositor on TG webview. No will-change on most.  
   - fx accumulation: addFx in skills/ult/confetti without cap; life filter only (1265). Long fights = death by 1000 particles.  
   - rAF:1272 always full speed (no dt-skip, no fps cap).

**Evidence lines**: game.js:1033(draw grid/fx/units/gradients/sin), 1256(loop filters+draw), 956(addFx), 1059(weave), 1197-1236(synth+Date), 1264(fx), 484(ultsparkle), style.css:415(teaser),522(pulse),803(asc),889(synpulse),492(ultsparkle). fit:369 (no DPR, logical px ~400x220 good base).

**Mobile TG reality**: Webview on mid Android + canvas vector + 4+ box-shadow inf + 30fx = <30fps stutter on bursts/ult. 60fps budget ~10-12ms/frame tight.

## CEO-Prioritized Fixes (COO: ship-craft micro-steps, dry-run, backup ~/.Trash first, trace in FS, one handoff at end)

**Fix 1 — Canvas batch + static cache + cheap path (biggest win)**  
- fit/reset: create offscreen gridCache = document.createElement('canvas'); draw grid ONCE to it (static). In draw(): ctx.drawImage(gridCache,0,0) first.  
- draw units: cap ops/unit to 4-5 max (shadow + 1 glow stroke or remove radial entirely for non-elite; keep PNG primary). Enemy synth: simplify to 1-2 strokes max except boss. Move rich details behind META.perf!=='low'.  
- fx: limit `if(fx.length>28) fx=fx.slice(-28);` or tiered life. Use one ctx save/restore for alpha group.  
- rRect keep but inline simple.  
- Result: ~50-70% draw cost drop.

**Fix 2 — Frame time cache + throttle**  
- loop: `const now = Date.now(); if (lastDraw && now-lastDraw < 16) { raf=requestAnimationFrame(loop); return; } lastDraw=now;` (or use ts param + dt).  
- draw(nowOrT): replace all Date.now() with single `const t = now || Date.now();` passed or window._t. Update nowMs calls outside.  
- In weave/corruption/militia/SSR: use t not fresh now.  
- Add hidden fps counter (dev only, toggle META.debugFps) for verification.

**Fix 3 — GPU CSS + fx cap + anim hygiene + vfx gate**  
- All inf anim targets (ult.ready, syn-card.on, #auto.on, #asc-prompt, .teaser etc): add `will-change: transform, opacity;` + prefer transform/opacity over box-shadow where possible (e.g. ultsparkle → cheap scale(1.02)+shadow small or disable on battle).  
- .syn-card.on in battle: consider toggle class or make pulse very subtle/transform only.  
- On vfx-fallback (already exists 1854): force disable heavy inf + reduce fx count. Extend to auto low-perf detect (e.g. long frame or TG low mem).  
- fx cap + short life on mobile.  
- ULT ready sparkle: change to non-inf or 30% duty burst (on ready only pulse once then steady).  
- Keep box-shadow minimal; isolate layers.

**Additional quick wins (do in same pass)**  
- loop: reduce _aliveP/E filters (use live counters on dmg/kill). units=filter only on death events if possible.  
- Pre-draw unit "sprites" or cache simple paths? (low pri).  
- Canvas context attrs: after getContext add `ctx.imageSmoothingEnabled=false;` (for glyph).  
- In reset/fit: clear fx =[].  
- Test: 3-acc TG iOS/Android battle long fight + ult + many deployed. Measure stutter absence.  
- Add META.perfMode='low'|'high' (persist) wired to above.

**Order for COO**: 1 (cache+simplify draw) → 2 (time+throttle) → 3 (CSS+cap) in 3-4 micro PRs or one tight edit session. Dry-run each. Verify with visual + (optional) simple rAF fps log. TG viewportStableHeight already used — good.

**Success**: Battle 60fps stable on target TG devices (no visible stutter on deploy/ult/fx heavy). No feature loss. Reversible (vfx-fallback path).

**Files touched**: game.js (draw/loop/fit/addFx), style.css (anim rules + will-change), possibly index for debug toggle.

**Handoff to Morpheus**: See marker. Execute, ship, drop evidence (console/FS trace + before/after feel on device). Report "shipped" + 1-line lesson to jarvis-lesson if new insight.

(Concise per CEO rule. Full context in code at listed lines.)
