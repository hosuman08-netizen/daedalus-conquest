# 🛠️ 장비 아트 20종 (슬롯×등급) — 그록/자비스 생성용
> 120개 전부가 아니라 **슬롯5 × 등급4 = 20장**이면 모든 장비가 이미지로 뜸(로더가 슬롯·등급으로 매핑).
> 저장: art/gear/<slot>-<rarity>.png  (rarity 소문자: n/r/sr/ssr)
> 정사각 512², 아이템 중앙, **투명/어두운 배경**, 별/글자 없음, 오리지널 sci-fi 게임 아이콘.

## 슬롯
- weapon = 검/대검/캐논류 무기 (⚔️)
- armor = 갑주/흉갑/방어구 (🛡️)
- acc = 부츠/망토/가속 장신구 (👟)
- relic = 부적/룬/오브 성물 (🍀)
- core = 에너지 코어/심장/동력원 (💠)

## 등급 = 색·화려함 (N→SSR 갈수록 화려)
- n  (회색, 단순 양산형)
- r  (파랑, 약간 발광)
- sr (자주, 오라/룬 디테일)
- ssr(골드, 화려한 발광·이펙트·최고급)

## 파일 20개 (예시)
art/gear/weapon-n.png ... weapon-ssr.png · armor-n..ssr · acc-n..ssr · relic-n..ssr · core-n..ssr

프롬프트 예: `sci-fi game gear icon, glowing energy sword, SSR gold tier, ornate golden glow and particles, centered, dark transparent background, no text, original`

## 명시 프롬프트 20종 (5슬롯 × 4등급, 2026-06-15 간소화)
> image_gen용. aspect 1:1, 512x512 스타일. 모든 장비는 slot+rarity로 매핑 (tpl 변형은 synth로). Priority: SSR 5 → SR 5 먼저 gen.

### SSR (gold, 화려 발광·파티클·최고급)
- weapon-ssr: sci-fi game gear icon, ornate golden greatsword with glowing energy blade, intricate filigree runes and particle sparks, SSR gold tier premium, dramatic volumetric lighting rim, centered, dark transparent background, no text, original sci-fi design (Warframe/Destiny inspiration, unique)
- armor-ssr: sci-fi game gear icon, ornate golden heavy power armor chestplate with embedded energy conduits and heroic etched filigree, SSR gold tier, metallic sheen glowing highlights, centered, dark transparent background, no text, original
- acc-ssr: sci-fi game gear icon, elegant golden acceleration cloak with thruster wings and jet elements emitting trails, SSR gold tier ornate dynamic aura, flow lines, centered, dark transparent background, no text, original
- relic-ssr: sci-fi game gear icon, radiant golden holy relic floating orb with inscribed ancient runes and ethereal light beams, SSR gold tier mystical particles, centered, dark transparent background, no text, original
- core-ssr: sci-fi game gear icon, luminous golden energy core heart with pulsing plasma and faceted crystalline shards, SSR gold tier intense inner glow effects, centered, dark transparent background, no text, original power source

### SR (purple, 오라/룬 디테일)
- weapon-sr: sci-fi game gear icon, sleek purple energy sword with rune-etched blade and subtle aura, SR purple tier, dynamic glow and particles, centered, dark transparent background, no text, original
- armor-sr: sci-fi game gear icon, reinforced purple chest armor with energy lines and rune accents, SR purple tier, layered plating with aura, centered, dark transparent background, no text, original
- acc-sr: sci-fi game gear icon, purple acceleration boots or cloak with glowing thrusters and speed runes, SR purple tier, motion trails, centered, dark transparent background, no text, original
- relic-sr: sci-fi game gear icon, purple arcane relic orb with floating runes and mystical aura, SR purple tier, subtle particles, centered, dark transparent background, no text, original
- core-sr: sci-fi game gear icon, pulsing purple energy core with crystalline facets and inner light, SR purple tier, controlled glow, centered, dark transparent background, no text, original

### R (blue, 약간 발광)
- weapon-r: sci-fi game gear icon, solid blue steel sword with faint energy glow, R blue tier, clean lines, centered, dark transparent background, no text, original
- armor-r: sci-fi game gear icon, blue reinforced armor plating with minor energy seams, R blue tier, functional design, centered, dark transparent background, no text, original
- acc-r: sci-fi game gear icon, blue accel boots/cloak with light glow accents, R blue tier, simple tech, centered, dark transparent background, no text, original
- relic-r: sci-fi game gear icon, blue rune stone relic with soft glow, R blue tier, modest details, centered, dark transparent background, no text, original
- core-r: sci-fi game gear icon, blue energy core crystal with steady pulse, R blue tier, clean sci-fi, centered, dark transparent background, no text, original

### N (gray, 단순 양산형 — research: clean functional Warframe base + Destiny simple module, original)
- weapon-n: sci-fi game gear icon, basic gray steel sword, N gray tier, mass-produced simple, centered, dark transparent background, no text, original
- armor-n: sci-fi game gear icon, basic gray chest plate armor, N gray tier, plain functional, centered, dark transparent background, no text, original
- acc-n: sci-fi game gear icon, basic gray boots or simple cloak, N gray tier, utilitarian, centered, dark transparent background, no text, original
- relic-n: sci-fi game gear icon, plain gray relic talisman or rune, N gray tier, minimal, centered, dark transparent background, no text, original
- core-n: sci-fi game gear icon, basic gray energy core module, N gray tier, standard power unit, centered, dark transparent background, no text, original
(20 full slot-rarity PNGs: code gearArt() maps slot-rarity.png auto → synth cooler fallback on 404. N/R synth volumetric layered for "간지" even without PNG.)

## Jordan Kael 2026 gear "간지" upgrade (N/R volumetric premium)
> N/R synth fallback deeper: Warframe/Destiny layered volumetric lighting + etched filigree + energy conduit veins + floating shards/rim (stronger than current .gear-synth). PNG priority for SSR/SR first; N/R use rich synth (no toy). Prompt upgrades for image_gen:
- weapon-n/r: sci-fi gear icon, [basic gray / solid blue steel] [sword], N/R tier, deeper volumetric rim lighting + subtle energy veins + micro shards, original, centered dark transparent bg, no text.
- armor-n/r: ... chestplate with volumetric metal depth + conduit seams + rim glow.
Same for acc/relic/core. Append "volumetric god-ray host-weave etched filigree energy conduit dramatic rim" for consistency with hero/ULT. 48px+ display in .gxc/.ginv/.gslot/.cp-slot with premium aura/tint on art. Carried % preview on equip for "MY power +X% carried" endowment dopamine. SSR gold shine prominent.

## ULTIMATE RARITY-DIFFERENTIATED PROMPTS (고급일수록 극적으로 다르게! "간지" 단계별 폭발적 차별화)
> **핵심**: N은 심플 기능적 / R은 표준 업그레이드 / SR은 화려한 엘리트 / SSR은 전설 아티팩트. 같은 슬롯이라도 고급일수록 완전히 다른 디자인 언어, 실루엣, 디테일 밀도, 이펙트 강도. "다 똑같이 생기면 안 됨".
> image_gen: 512x512 1:1, centered, dark transparent bg, no text, original premium sci-fi (Warframe + Destiny + HSR icon style, no direct copy). PNG 20종 우선, synth fallback 항상 "더 간지"로.
> 각 등급은 "하위 등급보다 압도적으로 고급지고 독특하게" 강조. 슬롯별 고유 아이덴티티 + rarity escalation.
### SSR — 압도적 전설 아티팩트 (완전히 다른 디자인 언어, 극한 화려함·독창성)
- weapon-ssr: ultra premium sci-fi game gear icon, **legendary unique** ornate golden greatsword with massive glowing energy blade, heavy intricate filigree, orbiting energy shards, multiple layered runes and dramatic god-ray volumetric lighting, exclusive SSR masterwork design (not just upgraded lower tier), intense particles and dramatic shadows, centered, dark transparent background, no text, Warframe+Destiny+HSR god tier icon
- armor-ssr: ultra premium sci-fi game gear icon, **legendary unique** ornate golden heavy power armor chestplate with complex embedded multi-layered energy conduits, heroic massive etched filigree, floating crystalline accents, dramatic volumetric rim and god light, exclusive SSR artifact design, metallic god sheen, centered, dark transparent background, no text
- acc-ssr: ultra premium sci-fi game gear icon, **legendary unique** elegant golden acceleration cloak with large thruster wings, jet trails, intricate speed runes and dynamic flowing energy aura, multiple particle layers, exclusive SSR premium design, dramatic volumetric rim, centered, dark transparent background, no text
- relic-ssr: ultra premium sci-fi game gear icon, **legendary unique** radiant golden holy relic floating orb with dense ancient runes, powerful ethereal beams, orbiting shards and mystical energy storm, exclusive SSR divine artifact, intense inner + outer glow, centered, dark transparent background, no text
- core-ssr: ultra premium sci-fi game gear icon, **legendary unique** luminous golden energy core heart with complex pulsing plasma, faceted multi-layer crystals, energy conduits, dramatic god-tier inner glow and particles, exclusive SSR power source design, centered, dark transparent background, no text

### SR — 화려한 엘리트 (분명한 업그레이드, 강한 개성)
- weapon-sr: premium sci-fi game gear icon with energy shards and aura, sleek purple energy sword with detailed rune-etched blade, strong dynamic glow, energy conduit, layered premium plating, clearly more impressive than R, centered, dark transparent background, no text, original elite design
- armor-sr: premium sci-fi game gear icon with energy shards and aura, reinforced purple chest armor with complex energy lines, rune accents, layered plating and strong aura, visibly higher tier than R, centered, dark transparent background, no text
- acc-sr: premium sci-fi game gear icon with energy shards and aura, purple acceleration boots/cloak with powerful glowing thrusters, speed runes, motion energy trails and strong aura, clearly premium over lower, centered, dark transparent background, no text
- relic-sr: premium sci-fi game gear icon with energy shards and aura, purple arcane relic orb with dense floating runes, powerful mystical aura and energy flow, visibly elite, centered, dark transparent background, no text
- core-sr: premium sci-fi game gear icon with energy shards and aura, pulsing purple energy core with multi faceted crystals, strong inner light and energy conduits, clearly higher grade, centered, dark transparent background, no text

### R — 고급 표준 (기능적이면서 세련됨, R만의 간지)
- weapon-r: sci-fi game gear icon, solid blue high-quality steel sword with clean energy glow accents, premium military tech details, subtle volumetric depth and etched lines, clearly better than N, centered, dark transparent background, no text, original
- armor-r: sci-fi game gear icon, blue high-end reinforced armor plating with clean energy seams and tech details, premium functional design with depth, centered, dark transparent background, no text
- acc-r: sci-fi game gear icon, blue high-quality accel boots/cloak with clean light glow and tech accents, premium utilitarian with subtle motion feel, centered, dark transparent background, no text
- relic-r: sci-fi game gear icon, blue high-quality rune stone relic with soft premium glow and detailed carvings, clearly upgraded, centered, dark transparent background, no text
- core-r: sci-fi game gear icon, blue high-quality energy core crystal with steady strong pulse and clean design, premium standard, centered, dark transparent background, no text

### N — 기본 양산 (심플하지만 "간지" 있는 기본, 장난감처럼 보이지 않게)
- weapon-n: sci-fi game gear icon, basic but cool gray steel sword, mass-produced clean functional design with subtle depth and clean lines (not toy-like), centered, dark transparent background, no text, original
- armor-n: sci-fi game gear icon, basic but solid gray chest plate armor, clean mass-produced functional plating with minor details, centered, dark transparent background, no text
- acc-n: sci-fi game gear icon, basic but stylish gray boots or simple cloak, clean utilitarian design, centered, dark transparent background, no text
- relic-n: sci-fi game gear icon, plain but well-made gray relic talisman or rune, simple clean design, centered, dark transparent background, no text
- core-n: sci-fi game gear icon, basic but reliable gray energy core module, clean standard power unit design, centered, dark transparent background, no text
## PNG 생성 대상 (image_gen 추천 — 고급 차별화 극대화)
**강력 추천**: 위 ULTIMATE RARITY-DIFFERENTIATED PROMPTS 전체로 **20종 전부 재생성**.
- SSR 5종 가장 먼저 (가장 큰 시각 차이)
- SR 5종 (R보다 확실히 고급지게)
- R/N도 "기본이지만 간지있게" 업그레이드
- image_gen: aspect_ratio=1:1, prompt 위에서 복사, dark transparent bg, no text.
- 생성 후 art/gear/ 에 정확히 slot-rarity.png 로 저장 (e.g. weapon-ssr.png)
- synth fallback (game.js + style.css) 도 rarity별로 극적으로 다르게 보이도록 이미 강화함.

이제 N은 "기본이지만 멋진 양산품", SSR은 "전설의 아티팩트" 느낌이 강하게 날 것. 고급일수록 완전히 다른 물건처럼 보이게 설계.

**Verify 2026-06-16 (Morpheus)**: All 20 PNG now present in art/gear/ (list + README COMPLETE). User "12/20 view" likely legacy filter/UI/prior state. Polish: upgraded prompts (volumetric rim veins filigree for 간지 N/R not toy) already baked in prior; gearArt() PNG first + rich synth fallback. No new gen needed for MVP (reversible, quality tier correct fun). If visual low in game, re-gen specific on demand.
