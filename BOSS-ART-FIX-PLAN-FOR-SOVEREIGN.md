# BOSS ART FIX — Sovereign Execution Plan (2026-07-16)

## Status
- Code mitigation FULLY applied (game.js + deploy/game.js): asymmetric szW*1.08/szH*0.93, p6-lung torsion lean, JAGGED ORGANIC CLIP (18pt sin-mod), low-angle dramatic lighting gradient, foreground jagged plates, vertical lift translate, crack+HP always.
- Helper script ready + FIXED: `./boss-art-replace.sh` (clean logic, supports final-titan|giant-titan)
- Prompt ready in `boss-giant-prompt.txt` (Da Vinci refined, anti-boxy)
- ENEMY-ART-PROMPTS.md updated with refined e11 giant-boss/giant-titan entry.
- Current: ch>=55 titan boss uses "giant-titan" key (falls to procedural until PNG present). final-titan-nukki.jpg is for ch~50.

## Image Generation (your direct action)
Use the prompt in `boss-giant-prompt.txt` (or copy the full text).

**Quota note**: Grok's image_gen/image_edit currently hitting file limit. Use your own Imagine session or wait. No other Legion agent has direct image generation capability (tools are Grok-specific). Subagents can only help planning/prompts/code.

**Recommended output**:
- `art/enemy/giant-titan.png` (preferred — ch>=55 logic + jagged clip in drawBoss)
- OR overwrite `final-titan-nukki.jpg` (for ch50 variant)

## File Save + Deploy (your direct)
```bash
cd /Users/imhogyun/daedalus-conquest
./boss-art-replace.sh /full/path/to/your-generated-image.png giant-titan
# or: ./boss-art-replace.sh /full/path/to/your-generated-image.jpg final-titan
```

The script:
- Backs up current to backups/art-enemy/
- Copies to art/enemy/ + deploy/art/enemy/
- Reversible.

## Test (your direct)
1. `python3 -m http.server 8787`
2. Open http://localhost:8787
3. In console:
   META.chapter=55; META.mode='boss'; saveMeta(); reset(); start();
4. Verify:
   - Less square/boxy, premium epic, jagged organic silhouette (clip eats rect edges)
   - Dynamic lean/torsion + dramatic lighting overlay
   - Fits red frame + health bar below (vertical emphasis)
   - enemyPortraits['giant-titan'] loads (or final)
   - Single protagonist focal (eyes/maw), no cheesy flat panels

## Full Agent Involvement
- Grok (me): Prompts, code mitigation, helper, plan, docs.
- Spawned subagents: Da Vinci (art critique + prompt) + Ship-craft (test plan + script).
- Other agents (Morpheus/Trinity/Niobe): Can be spawned for more (e.g. virality on new boss, metrics on boss clear rate).
- No agent can bypass current image quota for generation.

## Next if needed
- New filename: already supported (giant-titan key in preload/portraitKey/drawBoss).
- After replace: hard refresh. For prod: ./minify.sh && verify.sh
- Update marketing screenshots if epic win.

Legion one. Sovereign: gen image (your Imagine), then replace+test. Report 1-line.