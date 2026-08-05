# Gear images — simplified 20 (5 slots × 4 rarities)

Full activation: art/gear/<slot>-<rarity>.png  (e.g. weapon-ssr.png, core-n.png)
Slots: weapon / armor / acc / relic / core
Rarities: ssr (gold) / sr (purple) / r (blue) / n (gray)

gearArt() in game.js prefers these PNGs first (slot+rarity map covers all 120 roster variants visually).
- cp-gear slots, .gear-card inv, page-gear, codex (gdex) all use <img> or cool synth fallback.

Priority: All 20 PNGs COMPLETE (2026-06-16 art dir review). weapon/armor/acc/relic/core × n/r/sr/ssr.
- **강조**: 고급일수록 압도적으로 다르게. N은 심플+간지 기본, R은 업그레이드, SR은 화려 엘리트, SSR은 전설 아티팩트.
- PNG 20종 + synth fallback 모두 rarity 단계별로 극적 차이 나도록 설계 (prompts + CSS + synth 코드 업데이트).
gearArt() (game.js) prefers PNGs first → onerror rich synth fallback (veins/shards/filigree). Covers gdex-grid / gslots / cp-gear / inv / cards. Dark trans bg, centered, original sci-fi (Warframe/Destiny/HSR insp, no direct copy).
Full art in codex now (no green/empty placeholders post-completion; .gxc .lock = 0.42 opacity only for unowned).
Prompts: ../GEAR-ART-PROMPTS.md (20 explicit, "모방 OK, 카피 NO", no text ideal).
Reversible (git/Trash + session backup). Synth always safety net. Reviewed: all unique, no overlaps, tier-correct. 2026-06-16 full re-gen pure no-text. Refs: HSR LC glow, Warframe layered, Destiny tech.

**Morpheus/Art specialist 2026-06-16 Sovereign**: verified 20 PNGs exist. User 12/20 view addressed. Polished/re-gen ALL 20 to exact GEAR-ART-PROMPTS refined: N simple functional + subtle vol shadows/rim/veins (dramatic depth, not toy); SR/SSR premium etched filigree + energy conduit + dramatic volumetric rim + particles (no overlap, tier max 간지). All no text (pure icon), original (모방 OK 카피 NO). Generated via image_gen tailored. Reversible: old labeled PNGs remain in art/gear/; polished in ~/.grok/sessions/.../images/ (8-27.jpg map: 8=relic-n ... 27=core-ssr). To activate: copy/rename the 20 polished *.jpg -> art/gear/<slot>-<rar>.png (e.g. mv .../10.jpg art/gear/weapon-n.png). Heavy quality care. Synth fallback always. Ready.
