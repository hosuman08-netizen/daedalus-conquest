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

## 권장 (9SSR만 해당)
- 정사각형 **512×512 이상**, 캐릭터 중앙, **배경 투명/단색**, dramatic rim/gold frame (SSR-ART common suffix).
- gear/pose variants: base + equip 장비 포함 버전 (image_gen 시 prompt 확장).
- `object-fit: cover`.

## 작업 순서
1. **SSR 9 god-tier** (SSR-ART-PROMPTS.md tailored prompts + gear) — image_gen → art/ drop → lazy integrate game.js artHTML.
2. 신규 SSR drip 시: 신규 prompt + art + units.js append (high id).

MANIFEST.csv는 legacy 참고용 (229 full). Phase1 실제는 units.js ROSTER + 9 PNG만.

넣고 즉시 synthetic fallback 안전. SSR 프롬프트 `../SSR-ART-PROMPTS.md`. "모방 OK, 카피 NO" (original design).
