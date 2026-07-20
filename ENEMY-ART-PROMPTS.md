# 🎨 적군 (Enemy) 일러스트 프롬프트 — Phase1 적대 세력 시각화

> 목적: 플레이어 "MY Legion" (아름다운 SSR PNG + 투자 glow + carried narrative) 과 대칭되는 **위협적 적** 시각. 유저가 "이 적이랑 싸우는 게 의미있다" 느끼게.
> TG perf 최우선: PNG는 **보스·엘리트 소수**만 (art/enemy/*.png). 나머지 적은 rich synthetic (아래 코드 업그레이드) + glyph.
> "모방 OK, 카피 NO". original hostile sci-fi AI legion opposition.

## ⚖️ 저작권·안전 규칙 (SSR-ART-PROMPTS와 동일 엄수)
- 상업 라이선스 AI만 사용.
- 장르 키워드만 ("anime gacha enemy splash art, sci-fi hostile mecha").
- **절대 금지**: 실존 작품·캐릭터 스타일 지정, 브랜드, 로고, 사람 얼굴, ★ star rating.
- 적 테마: "corrupted / rival / hostile opposition to the Legion" — red/black/dark grey, aggressive spikes/energy, menacing but original.

## 공통 접미 (모든 프롬프트 뒤에 붙이기)
`anime gacha enemy splash art, original sci-fi hostile AI legion rival, aggressive menacing design, dramatic red-black rim lighting, vertical composition, high detail, original design, no real brands or logos, NO stars, no star rating, dark corrupted atmosphere`

## 파일명 매핑 (art/enemy/ 추천)
- 드롭: `art/enemy/drone.png`, `art/enemy/marksman.png` ...
- 보스: `art/enemy/titan.png` 또는 `art/enemy/boss.png`
- 코드에서 `art/enemy/${key}.png` 로 lazy 시도 (없으면 synthetic 강제 업그레이드).

---

## 1. 기본 적 아키타입 (6종)
### e1 | drone | 적 정찰기 (Hostile Scout)
`hostile corrupted drone scout, jagged red energy wings, black armor plates with glowing cracks, aggressive swarm eye, menacing forward lean, sci-fi mecha enemy, dark red accents on matte black`

### e2 | marksman | 적 저격수 (Hostile Sniper)
`hostile long-range sniper unit, red scope visor glowing, elongated barrel with energy lines, crouched aggressive pose, black-red camo plating, sharp angular design, sci-fi enemy marksman`

### e3 | guardian | 적 방벽병 (Iron Wall Hostile)
`hostile heavy guardian defender, massive spiked shield with red energy veins, thick black armor, imposing stance, glowing red core, fortress-like silhouette, sci-fi mecha tank enemy`

### e4 | bruiser | 적 강습병 (Rage Charger)
`hostile bruiser charger, heavy fist with red impact cracks, forward lunging aggressive pose, bulky black-red armor with spikes, battle damaged look, sci-fi berserk enemy`

### e5 | commander | 적 지휘관 (Rival Tactician)
`hostile enemy commander, holo-tactics display in red, cloak with jagged edges, calculating menacing glare, black command armor with red highlights, sci-fi rival leader`

### e6 | titan | 적 거신 (Boss Dragon Hostile) — 최우선 이미지
`massive hostile titan dragon boss, corrupted rival AI colossus, huge black-red scales with energy fissures, glowing red eyes and maw, spiked wings, overwhelming menacing presence, dramatic low angle, sci-fi enemy titan`

## 2. 엘리트/챕터 변형 (고난이도용, 3~4종)
### e7 | elite-drone | 고위 정찰 무리 (High Chapter Swarm)
`elite hostile drone pack leader, multiple red eyes, reinforced jagged armor, pulsing red core, swarm aura, more menacing than basic drone, sci-fi corrupted scout captain`

### e8 | elite-bruiser | 망령 돌격대 (Wraith Charger)
`wraith-like hostile bruiser, semi-transparent red energy edges, heavily spiked, battle scarred black armor, furious charging pose, sci-fi ghost berserker enemy`

### e9 | corrupted-titan | 타락 거신 (Fallen Titan Boss)
`fallen corrupted titan, twisted black-red form with exposed glowing core, broken horns/spikes, rage aura, massive size implied, dramatic rim, ultimate hostile Legion rival`

### e11 | giant-boss / giant-titan (거대 보스 레이드 전용) — REFINED (Da Vinci + anti-square, 2026-07-16)
`massive hostile final titan dragon-mech boss, corrupted rival AI colossus, enormous serpentine dragon body with powerful dynamic torsion contrapposto pose and S-curve neck weight shift, huge layered jagged organic black-red scales and irregular asymmetric protruding mech armor plates + fins that violently break all rectangular/boxy bounds, deep pulsing crimson energy fissures cracking through matte battle-damaged armor, glowing molten red eyes and roaring fanged maw as single clear protagonist focal point, massive spiked wings half-spread with dramatic low-angle foreshortening and perspective distortion, heavy 3D volumetric form with strong cinematic chiaroscuro, low key light carving deep shadows and metallic highlights, overwhelming menacing weight and scale, intricate plasma vents and battle damage, strong red-black rim lighting + internal core plasma glow, premium ultra high-end gacha boss splash art quality, excellent Vitruvian proportions and harmony, no flat panels, no square silhouette whatsoever, highly organic flowing contours with sharp aggressive edges extending dynamically outside frame, vertical emphasis with generous clearance below for health bar UI, exciting epic 간지, dark corrupted hostile atmosphere, original design, anime gacha boss art, original sci-fi mecha Legion enemy, high detail, dramatic rim lighting, vertical composition suitable for UI with health bar space below, no text, no UI elements, no labels, clean illustration only`

**TARGET**: Generate → save as `art/enemy/giant-titan.png` (preferred, transparent nukki) OR overwrite `art/enemy/final-titan-nukki.jpg`
**Install**: `./boss-art-replace.sh /path/to/generated giant-titan`  (or final-titan)
**Code**: giant-titan supported in preload + portraitKey (ch>=55) + drawBoss (jagged clip + torsion + lighting). No extra edits needed.

### e10 | enemy-commander | 그림자 사령 (Shadow Strategist)
`shadow enemy strategist, red holo-map of battlefield, hooded menacing figure, precise angular black-red armor, command presence, sci-fi hostile tactician boss`

> 사용법: 위 프롬프트 + 공통 접미 붙여 image_gen → `art/enemy/파일명.png` 저장.
> 코드 연동: preloadEnemyPortraits() + draw()에서 side==="e" && portraitKey 있으면 clip + **빨간 톱니 테두리** + dark overlay.
> 없으면 강력 synthetic (아래 게임 코드 참고 — spikes, red pulse, level scaling aggression).

**추천 생성 우선순위**: e6 titan (보스전), e1~e5 기본, e9 corrupted-titan.

Phase1: PNG 3~5개만 (보스 중심). 나머지 100% canvas procedural로 "위협적" 표현 (성능 OK).

"유저 입장에서 할말 나오는 적" 완성 목표: 예쁜 내 군단 vs 무시무시한 적 시각 대조 + carried "내 정예가 저 적을 꺾었다" 도파민.

(ENEMY-ART-PROMPTS.md v1 — 2026-06-15. 기존 SSR/SR/GEAR 패턴 따름. Morpheus: gen 후 art/enemy/ drop + 코드 테스트.)