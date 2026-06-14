# 🎨 캐릭터 아트 폴더

여기에 `<slug>.png` 를 넣으면 도감·유닛 상세창에 자동으로 뜬다. **파일 없으면 이모지로 폴백**(에러 안 남).

- 규칙: 유닛 이름 → 소문자, 공백/특수문자 `-`, 예) `Arclight` → `arclight.png`
- 권장: 정사각형(512×512 이상), 투명/단색 배경, 캐릭터 중앙. `object-fit: cover` 로 채워짐.
- 우선순위: **SSR 9인 먼저** → SR → 나머지. (N/R은 이모지로 둬도 충분)
- 이름은 전부 오리지널 창작(트레이드마크/내부명 없음).

## SSR 9인 파일명 (아트 프롬프트는 `../SSR-ART-PROMPTS.md`)
| 캐릭터 | 파일명 |
|---|---|
| Arclight | `arclight.png` |
| Solace | `solace.png` |
| Cipher | `cipher.png` |
| Ignis | `ignis.png` |
| Vector | `vector.png` |
| Vespera | `vespera.png` |
| Aegis | `aegis.png` |
| Anvil | `anvil.png` |
| Dominus | `dominus.png` |

넣고 `git push` 하면 1분 뒤 라이브 반영.
