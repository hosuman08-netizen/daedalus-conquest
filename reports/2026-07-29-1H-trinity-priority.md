# Trinity CPO priority · 1H 2026-07-29 (CPO judgment · Jarvis interim 덮어씀)

## North Star (이번 주 · 1문장)
**p1 전투 세션에서 가챠/상점 진입이 0이 아닌 실측 전환** — 배포×루프×리텐션×현금구멍 중 **현금구멍(전환)=0**이 병목. 유입·폴리시보다 먼저 깨라.

## Cash pipe #1 (하나만)
**p1 젬→가챠 (fictional)** — 선택 이유: pay worker 200 OK, Stars 배선 존재하나 **유저가 가챠 화면을 안 보면 결제 파이프=0**. 전환 CTA → 그다음 Stars. 금융 트랙과 섞지 말 것.

## p1 conversion success metrics (성공 = 실측만)
| Metric | Pass | Fail / gap now |
|---|---|---|
| `win_gacha_cta_show` | smoke 세션 ≥1 | code local only · Pages ship 전 0 |
| `win_gacha_cta_click` | show 대비 click rate 추적 가능 | ship 전 0 |
| `gacha_pull` (post-CTA 세션) | CTA 노출 세션 중 pull >0 목표 | 7d daedalus/p1 집계 near-zero |
| Guard | odds prominent 유지 · 강제 팝업 금지 | 미꾸라지 유지 |

**스펙 잠금 (Morpheus 실행 범위 · 추가 기능 금지)**  
Trigger: win overlay + `gems ≥ GACHA_COST(8)` → CTA "영웅 소환" → gacha 탭.  
emit: `win_gacha_cta_show` / `win_gacha_cta_click` only. 경제 변경(젬 낙수·무료권) = **neo y/n 별도** — 이번 1H OUT.

## Backlog kill (CPO 칼질)
| Item | Pri | Verdict |
|---|---|---|
| analytics bare `/stats` hang | **P0** | 측정 맹점. 로컬 fix 있음. **wrangler deploy 필수** (push≠deploy 분리, neo/env) |
| p1 win→gacha CTA + emit | **P0** | 코드 존재. **Pages live 전까지 성공 주장 금지**. ship = neo y/n |
| app id 정합 (client POST vs stats `app=`) | **P0** | Oracle: aggregates empty. 전환 이벤트 이름·app 키 1회 대조 |
| boss clip residual | P1 | 코드 jagged 적용분 유지. **전환 P0 후** |
| nukki art 0/4 | **defer** | neo image gen 대기. 엔지니어 시간 투입 금지 |
| ultimate 7 partial | **defer** | 전환·측정 전 polish 금지 |
| TG Stars wire polish | defer | 전환 CTA live + show>0 후 |

## Gaps (정직 · 띄우기 금지)
1. **전환 미배포** — game.js CTA = 로컬. 라이브 유저 영향 0.
2. **측정 미배포** — analytics `/stats` bare hang until deploy. North Star 숫자 주장 불가.
3. **현금 0 known** — Plutus: cash today unknown/0. 파이프 존재 ≠ 유입.
4. **activate near-zero** — 코어 루프 battle-only 패턴 잔존 리스크; CTA만으로 젬 부족 시 막힘(구 스펙 젬낙수 = neo 승인 게이트).

## OUT this hour (CPO)
- Morpheus: **(1)** analytics deploy path 문서화·준비 **(2)** 로컬 smoke에서 `win_gacha_cta_*` 1회 이상 확인. polish/nukki/ultimate 손대지 말 것.
- Jarvis/neo return: Pages ship y/n + wrangler deploy y/n 2문항만.

## 안 할 것
신규 기능 · 궁극기 · 보스 아트 루프 · Stars 확장 · 경제 인플레 패치(승인 전) · 성공 수치 추정.


## Trinity closed 08:01
무엇을: priority overwrite + Morpheus conversion-only handoff + RECEIVED
왜: 현금구멍=전환0 · 측정맹점
검증: 문서 경로 존재 · CTA code local only · analytics deploy pending
다음: Morpheus smoke win_gacha_cta_* · neo y/n Pages+wrangler
⚠️승인: Pages ship · wrangler analytics deploy
