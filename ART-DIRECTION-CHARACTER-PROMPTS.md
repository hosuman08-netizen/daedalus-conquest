# 🎨 아트 디렉션 마스터 — 등급별 캐릭터 일러스트 생성 프롬프트 템플릿

**목적**: N/R/SR/SSR 4등급 재사용 가능한 영문 템플릿 1개씩 + 공통 네거티브.  
**톤**: 사이버펑크 + 메카 + 판타지 군단 (AI Legion). 모방 OK, 카피 금지. 모든 캐릭터 **오리지널 창작**, IP 안전.  
**공통 규칙**: anime gacha splash art 스타일, vertical portrait, dramatic rim lighting, high detail, original design, no real brands/logos, **NO stars / star rating / text / numbers anywhere in PNG** (UI에서 별도 처리).

## 사용법
1. 템플릿 복사 → {name}, {role/pose/details}, {faction accent} 등 최소 수정.
2. 공통 네거티브 맨 뒤에 append.
3. image_gen (또는 상업 라이선스 툴) 실행 → `art/u{id}.png` (N: 121~ , R/SR/SSR 기존 매핑) 저장.
4. 512~1024px 정사각 또는 vertical crop, 캐릭터 중앙, 투명/단색 배경 권장.
5. units.js ROSTER + codex/gacha artHTML이 자동 연동 (PNG 없으면 synthetic fallback).

## 공통 네거티브 프롬프트 (모든 생성물 끝에 붙이기)
`blurry, lowres, deformed, bad anatomy, extra limbs, mutated hands, fused fingers, malformed face, text, letters, numbers, logos, watermarks, stars, star rating badges, rank icons, real world brands, copyrighted characters, real people faces or likeness, overexposed, underexposed, duplicate subjects, cluttered background, cartoonish chibi, 3d render, photorealistic unless specified, poorly drawn, low quality, artifacts`

---

## N Tier Template (평범한 인간 — 초능력X, 수수)
`plain ordinary human {name} {role}, no superpowers, no aura, no energy glows, no particles, no special effects, mundane realistic everyday face with tired or stoic expression, simple practical cyberpunk legion uniform with light non-powered armor plating, basic helmet or headgear, grounded realistic proportions, ordinary unremarkable appearance, {specific details e.g. "light recon vest, standard rifle, exhausted eyes, subtle dirt on gear"}, minimal {faction} patch only if needed, ordinary industrial barracks or ruined city background, practical and unheroic, anime gacha N splash art, original sci-fi mecha fantasy AI Legion character, gray minimal quality, realistic human recruit, grounded dramatic lighting, vertical portrait, high detail, original design, no real brands or logos, NO stars or star rating at bottom`

**적용 예시 (N drone 정찰)**:  
`plain ordinary human Swarm 정찰기-121, no superpowers... basic drone scout vest and light recon gear, tired eyes holding standard scanner, ...`

---

## R Tier Template (약간 초인적 — 미세 오라)
`slightly superhuman elite soldier {name} {role}, subtle faint aura and minor energy accents, practical but cool detailed metallic armor with light blue glows, sharp angular silhouette, battle-ready dynamic pose with "간지" swagger, solid craft quality, {specific details e.g. "layered obsidian-titanium plating, red energy conduits, menacing horns"}, subtle {faction} sigils, cyberpunk mecha fantasy AI Legion setting, anime gacha R splash art, original sci-fi mecha fantasy Legion character, rare quality, blue accents, solid craft, detailed metallic textures, energy glows, dramatic rim lighting, vertical portrait, high detail, original design, no real brands or logos, NO stars or star rating at bottom`

**적용 예시 (R titan)**:  
`slightly superhuman elite soldier Executor 마룡-076, subtle faint aura... colossal draconic mecha with amber-green accents, practical elite soldier feel, "간지" sharp angular horns and battle scars, ...`

---

## SR Tier Template (확실한 초인/엘리트)
`clear superhuman elite unit {name} {role}, visible strong energy aura and dramatic effects, confident powerful stance, high-impact armor with purple/violet frame energy glow, intricate details and dynamic action pose, 80% flashy of god-tier, {specific details e.g. "twin energy gauntlets, hexagonal barrier projectors, calculating gaze"}, strong {faction} accent colors, cyberpunk mecha fantasy AI Legion, anime gacha SR splash art, original sci-fi mecha unit, purple/violet SR frame energy, dramatic rim lighting, vertical portrait, high detail, original design, no real brands or logos, NO stars or star rating at bottom`

**적용 예시 (SR archetype base)**:  
`clear superhuman elite unit 와스프, visible strong energy aura... agile recon drone-knight with sleek slim frame and hovering nano-wings, scout visor, ...` (아키타입별 base는 SR-ART-PROMPTS의 drone/marksman 등 참조해 결합)

---

## SSR Tier Template (신급/드라마틱 — God-tier)
`godlike dramatic supreme {name} {title}, intense volumetric god-rays and majestic powerful aura, regal black-gold regalia with glowing crown-circuit halo or equivalent signature, absolute authoritative or overwhelming presence, cinematic god-pose, heavy dramatic effects and host-weave energy tethers, the most prestigious unit, {specific details e.g. "floating data orbs, judgment scales erupting, repair-field aura mending allies"}, premium etched filigree and energy conduits, cyberpunk mecha fantasy AI Legion, anime gacha SSR splash art, original sci-fi "AI Legion" character, dramatic rim lighting, vertical portrait, glowing gold SSR frame, high detail, original design, no real brands or logos, NO stars or star rating at bottom`

**적용 예시 (SSR Arclight)**:  
`godlike dramatic supreme Arclight 심판의 빛, intense volumetric god-rays... black-gold regalia with floating data orbs and circuit halo, confident knowing expression, holographic judgment scales, ... MY LEGION ULT judgment light god-pose variant with stronger god-ray + Host Weave fusion tethers (선택)`

---

## 추가 지침 (전 등급 공통)
- **"MY LEGION ULT" / premium variants (SSR/SR 중심)**: god-pose + volumetric god-ray burst from crown/eyes + Host Weave overlay (golden effervescence tethers / fusion threads linking to allied silhouettes) + etched filigree + energy conduit veins + dramatic rim. Per-hero tint 적용 (Arclight gold-judgment, Ignis crimson rage 등).
- **Hero / ULT portrait**: 512px bust crop safe, close-bust elegant command, per-tier rim (SSR gold, SR purple, R blue, N gray), no small emoticons/icons/symbols/badges on character.
- **아키타입 차별화**: drone=agile recon hovering, marksman=long rifle scope-eye, guardian=heavy shield barrier, bruiser=energy fists charger, commander=holo-tactics cloak, titan=colossal draconic/golem. Faction accent color (Strategist 청+금, Executor 주황+강철, Swarm 호박+녹, Guardian 은+청, Intel 보라+청록).
- **저작권 안전 (반드시)**: 상업 라이선스 툴 사용. "in the style of XXX" 절대 금지. 특정 작품·캐릭터·작가 직접 베끼지 말 것. 실존 인물/브랜드/로고 금지. 모든 이름·디자인 오리지널.
- **품질 체크**: 중앙 캐릭터, 얼굴/포즈 명확, tier-appropriate aura 강도 (N=0, R=미세, SR=확실, SSR=신급), UI에 붙였을 때 128px 아이콘으로도 읽히는지 확인.
- **Fallback**: PNG 없으면 game.js synthetic (rarity color + glyph + glow) 사용. N/R 대량은 synthetic 우선, codex 풀아트 필요 시에만 PNG.

## 파일 매핑 참고
- N: art/u121.png ~ art/u170.png (170종 목표 시)
- 기존: SSR u1~u9 (또는 slug), SR u10~u64, R u65~u120 (R-ART-PROMPTS 스타일 "간지" blue solid craft)
- Heroicons: art/heroicon-*.png (별도 HERO-ART-PROMPTS)
- Gear: GEAR-ART-PROMPTS.md 별도

(2026-06-16 · Grok CEO 창작 — Morpheus 코드 작업과 병렬. 기존 SSR/SR/R 프롬프트 완전 호환 + N 신규 완성)