# Gear images — simplified 20 (5 slots × 4 rarities)

Full activation: art/gear/<slot>-<rarity>.png  (e.g. weapon-ssr.png, core-n.png)
Slots: weapon / armor / acc / relic / core
Rarities: ssr (gold) / sr (purple) / r (blue) / n (gray)

gearArt() in game.js prefers these PNGs first (slot+rarity map covers all 120 roster variants visually).
- cp-gear slots, .gear-card inv, page-gear, codex (gdex) all use <img> or cool synth fallback.

Priority SSR+SR generated (10 PNGs). N/R use even-cooler synth (veins+shards+rim) until added.
If no file: fallback upgraded synth — volumetric, layered, premium feel (no ? in codex for priority).

Prompts: See ../GEAR-ART-PROMPTS.md (explicit 20, research HSR/Genshin/E7 + Warframe/Destiny/Diablo etc. "모방 OK, 카피 NO").

Reversible: files in place, code updated, synth always safety.
