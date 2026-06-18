---
name: daedalus-balance
description: 다이달로스 밸런스 검증. balance-sim 실행 + 가챠 확률 합·SSR>N 보장·천장 EV·환생 곡선 sanity 체크. "밸런스 체크/확인", 밸런스 조정 후 재검증 때 사용.
---

# 다이달로스 밸런스 검증

## 1. sim 실행
```bash
cd /Users/imhogyun/daedalus-conquest
node balance-sim.js 2>&1 | head -45
node balance-sim-prestige.js 2>&1 | head -30
```

## 2. 체크리스트 (sim 결과 + 코드 대조)
- **유닛 가성비**: 평균 ±30% 벗어난 OP/쓰레기 유닛 있나.
- **상성 매트릭스**: 5승 무상성(OP) / 0승 쓰레기. 순수 파워사다리면 전략 단조(방치형은 허용, 출시후 상성·시너지).
- **장비 스탯**: 스탯간 가치격차 1.5배 넘으면 한 스탯 몰빵이 정답(나쁨).
- **확률 합**: `RARITY` p 합 = **정확히 1.000** (코드=표시, 확률공개법). UR/EX 비활성이면 p:0.
- **SSR>N 보장**: 교차 아키타입에서도 SSR>SR>R>N. **역전 = 과금동기 붕괴 P0.** (archetype 격차 vs RARITY_MUL 격차 비교)
- **천장 EV**: 10연 천장 SSR 보장 작동(SR 강등 버그 없나).
- **환생 곡선**: 환생마다 직전벽 "즉시 재돌파"(녹이는 쾌감) + 복리배율 runaway 아님.

## 3. 이슈 → P0/P1 분류
밸런스 코드(game.js/units.js)는 모피어스 영역 → `daedalus-handoff`로 위임. 수치·설계 근거는 트리니티가 명세.
