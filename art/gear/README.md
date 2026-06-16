# Gear images — simplified 20 (5 slots × 4 rarities)

Full activation: art/gear/<slot>-<rarity>.png  (e.g. weapon-ssr.png, core-n.png)
Slots: weapon / armor / acc / relic / core
Rarities: ssr (gold) / sr (purple) / r (blue) / n (gray)

gearArt() in game.js prefers these PNGs first (slot+rarity map covers all 120 roster variants visually).
- cp-gear slots, .gear-card inv, page-gear, codex (gdex) all use <img> or cool synth fallback.

Priority: All 20 PNGs COMPLETE (2026-06-16 art dir review). weapon/armor/acc/relic/core × n/r/sr/ssr.
- N/R: simple functional (per user "아랫급 간지 안만들어도돼") + refined vol/rim/veins depth (not toy).
- SR/SSR: premium filigree/volumetric/rim/particles/energy (간지 max).
gearArt() (game.js) prefers PNGs first → onerror rich synth fallback (veins/shards/filigree). Covers gdex-grid / gslots / cp-gear / inv / cards. Dark trans bg, centered, original sci-fi (Warframe/Destiny/HSR insp, no direct copy).
Full art in codex now (no green/empty placeholders post-completion; .gxc .lock = 0.42 opacity only for unowned).
Prompts: ../GEAR-ART-PROMPTS.md (20 explicit, "모방 OK, 카피 NO", no text ideal).
Reversible (git/Trash). Synth always safety net. Reviewed: all unique, no overlaps, tier-correct. Baked labels in some PNGs (optional re-gen for pure-icon). Refs: HSR LC glow, Warframe layered, Destiny tech.
