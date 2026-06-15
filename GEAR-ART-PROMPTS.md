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

## REFINED PREMIUM PROMPTS (업그레이드: "멋져" 간지 max — etched filigree + energy conduit + dramatic volumetric rim + original craft, Warframe/Destiny/HSR E7 premium sci-fi icon style, not toy)
> 기존 20종 + 누락 N/R (acc/core/relic + weapon-r/armor-r) 업그레이드 버전. image_gen으로 art/gear/<slot>-<rar>.png 생성 (512x512 1:1, centered, dark trans bg, no text). PNG 우선, synth fallback strict TG perf.
### Upgraded SSR (gold filigree rim + etched + volumetric energy conduit)
- weapon-ssr: premium etched filigree sci-fi game gear icon, ornate golden greatsword with glowing energy blade and intricate rune conduits, SSR gold tier dramatic volumetric rim lighting dramatic shadows, original craft Warframe Destiny inspiration, centered, dark transparent background, no text
- armor-ssr: premium etched filigree sci-fi game gear icon, ornate golden heavy power armor chestplate with embedded energy conduits heroic etched filigree, SSR gold tier metallic sheen dramatic volumetric rim, centered, dark transparent background, no text, original
- acc-ssr: premium etched filigree sci-fi game gear icon, elegant golden acceleration cloak with thruster wings jet elements emitting energy trails, SSR gold tier ornate dynamic aura dramatic volumetric rim, centered, dark transparent background, no text, original
- relic-ssr: premium etched filigree sci-fi game gear icon, radiant golden holy relic floating orb inscribed ancient runes energy conduits ethereal beams, SSR gold tier mystical particles dramatic volumetric rim, centered, dark transparent background, no text, original
- core-ssr: premium etched filigree sci-fi game gear icon, luminous golden energy core heart pulsing plasma faceted crystalline shards energy conduits, SSR gold tier intense inner glow dramatic volumetric rim, centered, dark transparent background, no text, original power source
### Upgraded SR (energy shards + aura conduit)
- weapon-sr: sci-fi game gear icon with premium energy shards, sleek purple energy sword rune-etched blade subtle aura energy conduit, SR purple tier dynamic glow particles dramatic rim, centered, dark transparent background, no text, original
- armor-sr: sci-fi game gear icon with premium energy shards, reinforced purple chest armor energy lines rune accents energy conduit, SR purple tier layered plating aura dramatic rim, centered, dark transparent background, no text, original
- acc-sr: sci-fi game gear icon with premium energy shards, purple acceleration boots or cloak glowing thrusters speed runes energy conduit motion trails, SR purple tier dramatic rim, centered, dark transparent background, no text, original
- relic-sr: sci-fi game gear icon with premium energy shards, purple arcane relic orb floating runes mystical aura energy conduit, SR purple tier subtle particles dramatic rim, centered, dark transparent background, no text, original
- core-sr: sci-fi game gear icon with premium energy shards, pulsing purple energy core crystalline facets inner light energy conduit, SR purple tier controlled glow dramatic rim, centered, dark transparent background, no text, original
### Upgraded R (deeper shadows/rim/veins for 간지)
- weapon-r: sci-fi game gear icon, solid blue steel sword with faint energy glow deeper volumetric shadows premium etched rim veins, R blue tier clean lines dramatic depth, centered, dark transparent background, no text, original
- armor-r: sci-fi game gear icon, blue reinforced armor plating minor energy seams deeper shadows premium rim veins, R blue tier functional dramatic depth, centered, dark transparent background, no text, original
- acc-r: sci-fi game gear icon, blue accel boots/cloak light glow accents deeper shadows premium rim veins, R blue tier simple tech dramatic depth, centered, dark transparent background, no text, original
- relic-r: sci-fi game gear icon, blue rune stone relic soft glow deeper shadows premium rim veins, R blue tier modest details dramatic depth, centered, dark transparent background, no text, original
- core-r: sci-fi game gear icon, blue energy core crystal steady pulse deeper shadows premium rim veins, R blue tier clean sci-fi dramatic depth, centered, dark transparent background, no text, original
### Upgraded N (deeper shadows/rim/veins for even N "간지" not toy)
- weapon-n: sci-fi game gear icon, basic gray steel sword with subtle volumetric shadows premium etched rim energy veins, N gray tier mass-produced dramatic depth functional cool, centered, dark transparent background, no text, original
- armor-n: sci-fi game gear icon, basic gray chest plate armor subtle volumetric shadows premium rim veins, N gray tier plain functional dramatic depth, centered, dark transparent background, no text, original
- acc-n: sci-fi game gear icon, basic gray boots or simple cloak subtle volumetric shadows premium rim veins, N gray tier utilitarian dramatic depth, centered, dark transparent background, no text, original
- relic-n: sci-fi game gear icon, plain gray relic talisman or rune subtle volumetric shadows premium rim veins, N gray tier minimal dramatic depth, centered, dark transparent background, no text, original
- core-n: sci-fi game gear icon, basic gray energy core module subtle volumetric shadows premium rim veins, N gray tier standard power unit dramatic depth, centered, dark transparent background, no text, original
## PNG 생성 대상 (image_gen 추천 — 누락 8종 + 업글 전체 커버 위해 재gen)
- 누락 PNG: weapon-r.png, armor-r.png, acc-n.png, acc-r.png, core-n.png, core-r.png, relic-n.png, relic-r.png
- 우선순위: R 5종 (전체 R 완성) → N acc/core/relic (acc-n 등) → 기존 12종 업글 재gen (premium filigree 등 적용)
- image_gen 호출 예: aspect_ratio=1:1 prompt=위 refined 중 하나. synth fallback 항상 유지 (TG perf). Jordan clean gallery 스타일 통합.
