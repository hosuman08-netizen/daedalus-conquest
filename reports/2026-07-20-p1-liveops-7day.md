# p1 LiveOps 7일 미니 캘린더 (초안 · 구현 전 스펙)

원칙: 습관 트리거 + FOMO 1하드 데드라인/주. 반복 연장 금지(신뢰).

| Day | 이벤트 | 훅 | 보상(제안) | emit |
|-----|--------|-----|------------|------|
| D1 | 일일 전선 | 로그인 트리거 | 젬+2 (drip 외) 1회 | daily_return |
| D2 | 타워 5층 챌린지 | 진행 Investment | soul 소량 | core_loop tower |
| D3 | 가챠 반값? **NO** — Featured 배너 티저 | scarcity 카피 only | 확률 동일 prominent | featured view |
| D4 | 보스 집중 | 클랜/공유 훅 | share_clicked 보너스 골드 | share |
| D5 | 연승 3 | near-miss 연극 | 젬+3 cap 내 | battle_win streak |
| D6 | 영웅 컬렉션 점검 | endowment | 보유 영웅 UI 하이라이트 | session |
| D7 | **주간 전선 종료** (하드) | FOMO 1회 | 주간 상자(고정표) | week_chest |

구현 순서: D1 daily + D7 week_chest 먼저. 배너 확률 조작 없이 카피/UI만.
미꾸라지: fictional · rates prominent · 18+.
