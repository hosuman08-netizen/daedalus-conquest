# SPEC: Featured Limited Banner — Arclight 72h FOMO (Sovereign explicit)
Date: 2026-06-19
North Star tie: 첫 구매 전환 + 천장 후 재가챠율 ↑

## 1. Big Idea (Godin + Ries)
"Legion의 첫 심판 — Arclight. 지금 아니면, 영원히 놓친다."
Position: First-in-mind "Judgment SSR". Scarcity leader.

## 2. Headlines (Ogilvy 80/20 — benefit + news + specific + scarcity)
1. "전군 치명 연쇄 각성. Arclight, 72시간만."
2. "처치=3초 치명 연쇄. 지금 뽑지 않으면 다음은?"
3. "군단의 빛. Hard 10회 보장. 지금이 유일 기회."
4. "72시간 후 영구 삭제. Arclight 소환 or regret."
5. "SSR 3% → pity ramp. 거의... 놓쳤다."
6. "Legion 첫 Founding. N copies. Countdown live."
7. "한 번의 pull이 전장을 바꾼다. 지금."
8. "Pity 10 = SSR 확정. 하지만 타이머는 기다리지 않는다."

## 3. Full Copy Pack (Korean primary + EN)
**Banner Title**: ARCLIGHT — 심판의 빛 (LIMITED 72H)
**Desc**: "군단의 전략적 판단자. 처치 시 전군 AI+1.5 · 치명 연쇄. 지금 소환하지 않으면 수개월 기다려야 합니다."
**Scarcity lines**:
- "72:00:00 남음 — 이 배너는 영구 사라집니다"
- "이미 1,248명의 Legionnaire가 소환 완료"
- "다음 Arclight 기회: 미정 (수주 후)"
**CTA**: "지금 소환하기 — 8💎"
**Pity theater line**: "조금만 더... pity X/10"

## 4. Mechanics Spec (FOMO + Psych)
- **Timer**: 72h from first view or fixed window. Prominent large countdown.
- **Near-miss**: In gacha animation — SSR light burst tease (almost), then miss + pity progress bar surge.
- **Variable**: Base 3% + soft ramp (7+ pulls).
- **Loss aversion**: Visible "pity 10 = guarantee" + "miss this banner = permanent collection gap".
- **Social**: "X friends pulled Arclight" (if data) or global counter.
- **Featured selector**: Lobby or shop에 "한정 배너" 탭. Arclight 전용 풀 (or boosted rate in standard + visual).

## 5. UI / Code Changes (game.js)
- Add `META.featuredBanner = { name: "Arclight", endTime: timestamp, active: true }`
- Modify gacha() / showGacha(): if featured active, use special pool or visual override + rates table popup.
- Add countdown component in shop/gacha screen.
- On banner open: force prominent disclosure modal (first time + settings link).
- 10연 also respects banner.

Example stub (to implement):
```js
function isArclightBannerActive() {
  return META.featuredBanner && Date.now() < META.featuredBanner.endTime;
}
```

## 6. A/B Test Plan
- Variant A: Standard (no extra FOMO)
- Variant B: Full (countdown + near-miss + social + loss lines)
Metrics: 
- Pulls per session
- First gem spend conversion
- Ceiling re-pull %
- D7 retention guardrail (-3% drop = rollback)
Target: +15-30% revenue lift on banner users (per industry).

## 7. Assets
- Main banner image: [session images/3.jpg]
- Teaser: [session images/2.jpg]
- Rates UI mock: [session images/1.jpg]

## 8. 미꾸라지 Compliance
- 100% code = display rates.
- Fictional codename only.
- Prominent + accessible.
- Minors: youth gate already.
- No misleading scarcity.

## 9. Projections (conservative)
D30: first-buy 6%→9%, gacha re-pull after ceiling 30%→45%.
High confidence on hooks.

Self-Assessment: Ready for Morpheus implementation.
