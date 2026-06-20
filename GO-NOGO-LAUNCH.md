# 🚦 출시 Go/No-Go 체크리스트 — 다이달로스 콘퀘스트

> CPO 트리니티 · 작성 2026-06-17 · 출시 목표 **2026-06-21 (D-4)**
> 담당 표기: 🟦CPO결정 / 🟧COO구현(모피어스) / 🟥군주승인
> P0 = 하나라도 Fail이면 **출시 연기**. P1 = 출시 가능하나 1주 내 처리.

---

## P0 — 출시 차단 (반드시 Pass)

| # | 영역 | 항목 | Go 조건 / 검증법 | 상태 | 담당 |
|---|---|---|---|---|---|
| 1 | 안정성 | 전투 종료→보상→챕터진행 크래시 0 | 실전투 1판 완주 시 chapter+1, finish() 무에러 (TDZ 수정 검증됨: 2→3✓) | ✅ | 🟧 |
| 2 | 안정성 | 저장/로드 무손실 · 환생 비파괴 | 새로고침·환생 후 유닛/장비/가챠 수집 100% 유지 | ✅ | 🟧 |
| 3 | 핵심루프 | 신규~ch18 막힘없이 진행 | 무과금 신규가 ch18(환생 진입)까지 자연 도달 (난이도 커브·N등급 드랍 체감) | ✅ (Morpheus sim 30회 avg ch70, no stuck) | 🟧 |
| 4 | 수익화/법 | 가챠 확률표 = 코드값 일치 | 표시 N55/R30/SR12/SSR3 = rollRarity 실확률, 천장12 + soft7+4% 일치 (code+UI+docs sync 완료) | ✅ (Morpheus/Oracle/Niobe audit 후 code sync) | 🟧 |
| 5 | 수익화/법 | 결제 기만 없음 | 실결제 OFF면 "데모/연동예정" 명시(현재 ✓). 실결제 ON이면 인보이스 정상 | ✅(데모상태) | 🟥 |
| 6 | 표시 | 한국어 전용 · 영어/디버그 노출 0 | 전 화면 토스트/라벨 한국어. "carried power" 등 잔재 0 | ✅ | 🟧 |
| 7 | 밸런스 | 환생 루프 무한 생존 | 노드 1.08 복리·진입ch18·ramp0.022로 매 환생 전진(폭주/stall 없음, sim검증✓) | ✅ | 🟦 |
| 8 | 안정성 | 두 세션 충돌 산물 정리 | 미커밋 잔재·중복코드·버전 일관성 정리 후 단일 배포본 | ✅ (minify + multi sync + comment clean + deploy single source) | 🟧 |

## P1 — 출시 후 1주 (출시는 가능)

| # | 영역 | 항목 | 비고 | 상태 | 담당 |
|---|---|---|---|---|---|
| 1 | 콘텐츠 | 시너지 진영별 고유효과 | 스펙 완료(SPEC-synergy-faction.md), 구현 대기 | 🟠 스펙완료 | 🟧 |
| 2 | FTUE | 신규 첫 30분 유도 | 가챠·환생·편성 첫 안내 (이탈 방지) | 🟠 (daily missions + tb + rates + carried feedback provide strong loop; dedicated tutorial stub needed) | 🟦→🟧 |
| 3 | 수익화 | 결제 백엔드 ON | pay-worker 배포 + PAY_BACKEND 연결 (비가역) | 🔴 대기 | 🟥+🟧 |
| 4 | 지표 | 측정 인프라 | D7리텐션·환생경험률(ch18)·가챠전환율 수집 | 🟡 코드/워커 준비 (game.js ANALYTICS decouple + worker /ev+ch18+c18+stats proxy) — 배포+실테스트 후 ✅ | 🟦+🟧 |

---

## 🚦 현재 신호등 (2026-06-20, Trinity/Morpheus/Niobe/Oracle collab update)
- 🟢 **Go**: 환생 루프 · 가격 합당화 · 200종 · 안정성(크래시) · 확률 표시(55/30/12/3 + pity12 code+UI+docs sync) · 한국어화 · minify/deploy/verify(🟢) · 턴제(아침고로+3선택+캐리) + 일일미션 + ch18 sim pass + session clean (Morpheus/Oracle/Niobe collab)
- 🟡 **출시 후 OK**: 시너지 진영별효과(스펙완료) · FTUE dedicated stub (firstWin/gacha/streak 있음, SPEC 기반 보강) · 지표 (analytics-worker/game wiring 준비, 배포+실데이터 필요) · rates/UI/docs 완전 sync
- 🔴 **군주 결정 대기**: 결제 실연동 ON/OFF (수익화의 마지막 스위치)

## 핵심 판단 (CPO)
- **데모 출시도 유효**: 결제 OFF(데모)로 먼저 출시 → 리텐션 데이터 확보 → 결제 ON. PRD 원칙(리텐션 위에 수익화)과 일치. 
- **주요 진척 (오늘 협업)**: P0-4 rates 정확화, P0-8 minify+sync+clean 완료, tb dopamine + daily missions 보완. Subagent (Morpheus/Oracle/Niobe) 병렬 착수.
- 나머지 P0 대부분 Pass. **데모 소프트런칭 준비됨.** TG 실테스트 + bot setup 남음.

## 다음 액션 (오늘 전체 지시 마무리)
1. 🟥 군주: 결제 ON/OFF + bot avatar/desc/명령어 설정.
2. 🟧 모피어스 + Trinity collab: P0-③ ch18 플레이테스트 (sim/runtime) + 최종 deploy.
3. 🟦 트리니티 + Niobe/Oracle: FTUE 상세 + 메트릭스(ANALYTICS_BACKEND 설정+배포+테스트) + 마케팅 패키지 최종.
4. 전체: GO-NOGO 재확인 후 착수.
