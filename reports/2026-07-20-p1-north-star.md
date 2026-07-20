# p1 North Star (Trinity CPO · Jarvis 대행 실행)

## North Star
**주간 `first_gacha` 신규 수** — 전투 몰입 유저가 “첫 소환”까지 도달하는 수.

## 왜
- core_loop(battle)만 있고 gacha 0 = 수익 엔진 미접촉 (기존 진단).
- gem drip = 공급, shop_view/gacha_nudge = 퍼널, first_gacha = 활성화 증명.

## 가드레일 지표
| 지표 | 정의 | 건강 |
|------|------|------|
| shop_view / battle_win | 상점 진입률 | ↑ 목표 |
| gacha_nudge → shop_view | 넛지 반응 | 세션당 1 |
| gacha_pull / shop_view | 상점→뽑기 | ↑ |
| first_gacha (unique) | 첫 소환 | **North Star** |
| gem_drip (cap 30/day) | 공급 | 인플레 감시 |

## 실험 상태
- gem_drip + gacha_nudge + shop_view emit: LIVE (3c42801+)
- 다음: LiveOps 일일 목표 1개 (과금 강제 아님)
