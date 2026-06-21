# SPEC: 과금 동기 개편 (군주 — 측정 purchase:0 해결)

> CPO 트리니티 · 구현: 모피어스(game.js 가챠·벽·팩) + 트리니티(units.js featured풀·gear.js)
> **발단**: 측정 `purchase:0`. 과금 동기 부재 — 무과금 후함 + 한정콘텐츠X + 벽X. 군주: "골드복리 없애 + 한정콘텐츠 + 벽."

## 0. 골드 복리 제거 (선행 — 골드 가치 살리기)
- `game.js:713 dividendGold` `legionPower()*0.9` → **제거.** ("복리" 개념 자체가 어색)
- 골드 = 전투보상 + **AFK 고정수익**(시간당 일정, 복리X) + 가챠/제작/분해.
- 효과: 골드 인플레 제거 → 골드 가치↑ → 골드팩·가속 의미 생김.

## 1. 🥇 Featured 한정 배너 (가챠 매출 90% — 최우선)
- **주간 featured SSR 1~2종 pickup** (확률 up — 예: featured SSR 1.5%).
- **7일 한정 + countdown FOMO** ("지금 아니면 못 가져").
- **천장(spark) 90뽑 = featured 확정** — 무과금도 모으면 도달, 과금=즉시.
- **near-miss theater** (빌드업→fake high→drop) + 한정 연출.
- 첫 featured: **Arclight**(이전 확정).

## 2. 🥈 진행 벽 + 가속팩 (페이투패스트)
- **ch 보스 전력벽**: 일정 ch마다 전력 게이트 (막히면 강화 필요).
- **강화/환생/각성 재료 게이트**: 소울·에테르 무과금 느림.
- 막힘 → **속도(2x/4x/8x)·재화 가속팩** 유혹 (FOMO 타이밍).

## 3. 🥉 한정 팩 FOMO
- **창단멤버 팩** (출시 7일한정 — 영구뱃지 + 7일부스트, 나이오비 승인).
- **기간한정 팩** (주간 로테이션 — scarcity).
- near-miss + countdown.

## 🛡️ 미꾸라지 / 가드
- 확률·천장 **정확 prominent 공개**(법) · **minors gate** · fictional codename.
- **무과금 후함 유지**(리텐션 — 무과금=천천히 도달, 과금=특정캐릭·속도). 무과금 죽이면 D7 붕괴.

## 검증 (트리니티)
- balance-sim: 골드복리 제거 후 진행속도 + 과금/무과금 밸런스. featured 천장 무과금 도달일수.

## 형태 고정
골드복리제거 · Featured배너(주간pickup·90천장·7일·FOMO) · 진행벽+가속팩 · 한정팩 = 고정. 수치는 balance-sim·측정.
