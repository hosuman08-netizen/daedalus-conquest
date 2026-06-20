# 🎨 캐릭터 아트 폴더 (Phase1 120종: 9 god-tier SSR 우선, 일단 120 for volume)

Phase1: **non-SSR는 synthetic(canvas glyph + RARITY_COLOR/glow + gear tint)** — TG perf/zero heavy asset. 
**9 SSR Founding (Arclight 등)만 god-tier PNG** (lazy load codex/gacha/unit-pop, onerror synthetic fallback). 
Later: drip new SSR releases 시 신규 art 추가 (u10+ 또는 ssr/ slug).

`art/u<id>.png` 또는 `art/ssr/arclight.png` 등을 넣으면 도감·유닛 상세창에 자동 표시. **파일 없으면 이모지/합성 폴백**.

## 파일명 규칙
- **`u<번호>.png`** — legacy (u1~u9 = 9SSR). 숫자 방식 권장.
- **slug 방식**: `art/ssr/arclight.png` 등 (SSR-ART-PROMPTS.md 매핑). codex/gacha에서 artHTML lazy 시도.
- 번호/슬러그 매핑은 ROSTER (units.js) + SSR_CHARS.

## Phase1 범위
| 등급 | 아트 | 수 | 비고 |
|---|---|---|---|
| **SSR** | u1~u9 또는 art/ssr/*.png | 9 (Arclight·Solace·Cipher·Ignis·Vector·Vespera·Aegis·Anvil·Dominus) | god-tier "멋지게" must-collect 최우선 |
| **SR/R** | 없음 (synthetic) | 70 | procedural fodder volume. PNG 불필요 |
| **Enemy** | art/enemy/*.png (소수) + rich canvas synthetic | 6 arches + boss variants | 적 시각화 (ENEMY-ART-PROMPTS.md). 보스/엘리트 PNG 우선. 나머지 aggressive procedural (spikes, red corruption, level scale)로 "할말 나는" 위협감. TG perf 유지. |

## 권장 (gear 포함)
- 정사각형 **512×512+**, 중앙, 투명/단색 배경, dramatic rim + volumetric god-ray. **중요: no text, no numbers, no letters, no UI/HUD/labels/names anywhere** (UI에서 별도 표시). Gear처럼 철저히 clean.
- gear: art/gear/<slot>-<rarity>.png (e.g. weapon-ssr.png). 5×4=20 files cover all via slot+rarity (GEAR-ART-PROMPTS simplified). gearArt() auto prefer; synth (cooler veins/shards/rim) for missing N/R. PNG drop 즉시 codex/slots/inv proper images (no ?).
- 2026-06-16 polish: all 20 re-gen no-text pure per refined (N functional vol, SR/SSR premium filigree no overlap).
- heroicons (command bar hbtn): art/heroicon-<key>.png (7: strategist/berserker/warden/ranger/mech/engineer/dragoon). 128px square, god-pose close-bust, per-hero rim (purple-blue/crimson/cyan-steel/lime-green/slate-silver/magenta-rose/gold-dragon fire) + volumetric god-ray + host-weave + etched filigree, no text, original. Lazy .him in updateHeroUI.
- 연구 (에이전트 전부 서치): HSR/Genshin/E7/AFK (volumetric + etched runes + heroic weight), Warframe/Destiny/AC (layered plating, energy conduits, particle exhaust), Diablo/PoE/MH/Arknights (dark metal + bone + inner-glow crystal + subsurface refraction + intricate filigree). 모방 스타일만, 완전 original 디자인. "모방 OK, 카피 NO" 엄수.
- `object-fit: contain; filter: contrast(1.1) saturate(1.15)` 적용 (CSS).

**Heroicon 2026-06-16 (Morpheus Art spawn)**: 7 heroicon-<key>.png gen complete for hbtn bar "MY POWER" (critical per Sovereign). Prompts exact from HERO-ART-PROMPTS (god-pose, per-hero rim tint, god-ray + Host Weave). Drop from gen session to art/ enables .him lazy in updateHeroUI + sel premium scale/glow. Fallback emoji always. Quality: tier correct (rims match getHeroColor), fun dopamine, original. Gear 20 verified/polished in docs.

## 작업 순서
1. **SSR 9 god-tier** (SSR-ART-PROMPTS.md tailored prompts + gear) — image_gen → art/ drop → lazy integrate game.js artHTML.
2. 신규 SSR drip 시: 신규 prompt + art + units.js append (high id).

MANIFEST.csv는 legacy 참고용 (229 full). Phase1 실제는 units.js ROSTER + 9 PNG만.

넣고 즉시 synthetic fallback 안전. SSR 프롬프트 `../SSR-ART-PROMPTS.md`. "모방 OK, 카피 NO" (original design).
