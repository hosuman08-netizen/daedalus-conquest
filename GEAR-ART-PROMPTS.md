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
