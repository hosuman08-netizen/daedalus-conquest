# SPEC: 출시 후 지표 설계 (North Star · AARRR · 가드레일)

> CPO 트리니티 · 2026-06-17 · 측정 인프라 구현: 모피어스(COO)
> 제품: 다이달로스 콘퀘스트 (텔레그램 미니앱, 방치형 가챠 RPG, 무·소과금 타겟)

## ⭐ North Star Metric (단 하나의 북극성) — Project 2 업데이트
**D7 Engaged-Payer Rate + K-factor dual** (Oracle 제안 + Sovereign Phase 2 승인).

**정의**:
- Primary: D7 cohort 중 (core loop 1회+ 완주 OR payer) 비율 / installs.
- Dual: K = (invites/user) × (conv rate). TG leverage로 K≥1.0 목표.
**왜**: 리텐션 + revenue + virality 동시 추적. Hooks 극대화하면서 K로 CAC↓. Idle + TG에 최적.
**목표**: D7 Engaged-Payer ≥12-15%, K≥1.0 (D30 payer 8%→15%+).

### North Star를 받치는 핵심 선행지표 (이게 오르면 D7이 오른다)
- **환생 경험률** — 설치 유저 중 환생 1회+ 도달 비율. (환생 = 콘텐츠 절벽 해결책. 경험하면 D14 복귀 ↑가 위험가정)
- **첫 세션 ch5 도달률** — FTUE 성공 = 활성화 관문.

---

## 📊 AARRR 보조지표 — Project 2 (D7 Engaged-Payer + K)

| 단계 | 지표 | 정의 | 초기 목표 (data-backed) |
|---|---|---|---|
| **Acquisition** | 신규 유입 | TG deep link / referral install | CAC 90%↓ (Notcoin precedent) |
| **Activation** | 첫 세션 ch5 도달률 | 신규가 첫 세션에 ch5까지 | ≥ 60% |
| | 첫 가챠 + 첫 share | 가챠 1회+ + dopamine peak share | ≥ 70% / ≥30% |
| **Retention** | D1 / D7 Engaged / D14 | 1·7·14일째 (D7 = engaged-payer) | D1≥35% · **D7 Engaged-Payer ≥12-15%** · D14≥8% |
| | Loyalty loop 완주 | Daily/streak/ritual 1회+ | D7↑ 선행 |
| **Revenue** | 결제 전환율 | 과금 유저 비율 | 2~5% → 6%+ (hooks) |
| | 첫구매율 / ARPPU | first 2x + ARPPU | D7 6%+ / whales uplift |
| **Referral** | K-factor + share_rate | invites × conv. Share at SSR/win/ascend | K≥1.0 · share_rate ≥15% |

---

## 🛡️ 가드레일 (성장 추구하다 깨면 안 되는 것)

| 가드레일 | 기준 | 위반 시 |
|---|---|---|
| 1회차 플레이타임 | 첫 환생 전 플레이타임이 짧아지면 안 됨 (조급한 환생 유도 X) | 환생 게이트·곡선 재검토 |
| 확률 표시 정확성 | 표시 확률 = 실제(N60/R25/SR13/SSR2), 천장 일치 | 즉시 수정 (법적) |
| 미꾸라지 준수 | misleading odds / false scarcity / minors 압박 0. 확률 prominent 정확. | 즉시 수정 |
| 무과금 진행성 | 무과금이 환생 루프로 무한 진행 가능 (P2W 과도 금지) | 밸런스 조정 |
| 크래시율 | 세션당 크래시 < 1% | P0 핫픽스 |
| SSR 희소성 | 무료 SSR 확정 지급처 0 (출석 legend = 15%확률로 수정됨) | 유지 점검 |

---

## 측정 인프라 (모피어스 구현)
- 텔레그램 미니앱 → 이벤트를 analytics-worker ( /ev ) 로 전송 (fire-and-forget, PAY 독립).
- **MVP 6종 이벤트**: `install` · `battle_win` · `gacha_pull` · `ascend` (d.fromCh 포함) · `purchase` · `growth_moment`. (SPEC 일치)
- Worker: 일일 cnt + dau + u:anon(first/last) + c18:특수. /stats → D1/D7 proxy, gacha_conv, ch18_reach_rate, purchase_rate 즉시 산출.
- Client: ANALYTICS_BACKEND 별도 설정 (PAY와 분리). localStorage daedalus_anon + META.lastSeen 병행.
- **출시일엔 최소 이벤트만** (console + worker), 대시보드/코호트 Oracle side 집계. D7 정확 cohort는 KV.list 또는 D1 업그레이드 필요.

## 🔥 "세지는 게 보이는" 도파민 지표 (그록 요청 — 정체성 측정)
정체성("매 순간 군단이 세지는 게 *보이는* 게임")이 실제로 작동하는지 측정. North Star(D7)의 핵심 선행 가설.

| 지표 | 정의 | 의미 / 목표 |
|---|---|---|
| **성장 체감 빈도** | 세션당 "세짐" 모먼트 수 (강화·레벨업·SSR·환생·돌파) | 첫 10분 ≥5회 (도파민맵 규칙). 낮으면 = 밋밋 |
| **carried delta 인지** | 강화/환생 직후 전력 상승폭이 화면에 노출된 비율 | 모든 성장이 숫자로 "보여야" — 100% 목표(안 보이면 도파민0) |
| **데미지 팝업 노출률** | 데미지 숫자 팝업을 본 전투 비율 (구현 후) | ~100% (현재 0 = 최대 누수, 수정 1순위) |
| **환생 재돌파 속도** | 환생 직후 *이전 벽* 재도달까지 걸린 시간/전투수 | 짧을수록 "녹이는" 체감↑. 시그니처 검증 |
| **시너지 visual pop율** | 편성 시 시너지 카드 달성(골드글로우) 발생률 | 조합 욕구 작동 여부 |
| **전력 N배 도달률** | "시작보다 N배 강해짐" 가시화 본 유저 | 누적 성장 체감 |

**핵심 가설**: 위 지표(특히 데미지팝업·환생재돌파)가 높은 유저의 **D7 리텐션이 유의하게 높다.** 이게 사실이면 정체성이 맞은 것 → 도파민에 더 투자. 아니면 정체성 재검토.

**MVP 측정**: 기존 6종 + growth_moment. client ANALYTICS_BACKEND 설정 + worker /ev 매칭 완료 (2026-06-20 Oracle).

### D7 Retention / ch18 reach / gacha conversion 측정 (Oracle 제안)
- **D7 Retention**: u:anon first/last 기반. 출시 후 /stats?day=... 연속 8일 fetch → first= D0 유저 중 last >= D0+7 비율. Proxy: dau 추이 + lastSeen. 정확은 Oracle 배치 쿼리 (KV.list prefix u:).
- **ch18 reach rate**: ascend(fromCh>=18) / install . Worker c18: 카운트 + /stats ch18_reach_rate 즉시. 목표: 무과금 70%+ ch18 도달 (P0-3 가드).
- **gacha conversion**: gacha_pull / install (또는 unique gacha user / install). /stats gacha_conv. North Star 선행: ≥70% 첫세션.
- 활성화: battle_win + ch5+ (ch 데이터), first gacha 등 AARRR 퍼널.
- Guard: 출시 후 D1~D7 코호트 즉시 리뷰 → FTUE/환생 이탈점 수정.

## 운영 리듬 (CPO)
- 출시 D1·D3·D7 코호트 체크 → 가장 큰 이탈 구간이 다음 개선 1순위.
- North Star(D7) 단일 기준으로 우선순위 판단. 보조지표는 "왜"를 설명.

**Oracle(CDO) 2026-06-20 확장**: ORACLE-DATA-REPORT.md 참조. North Star 제안 = D7 Engaged-Payer + K dual. analytics-worker 확장 완료 (ch5/share proxy). AARRR targets + 시장 벤치 + FOMO/viral 데이터 통합. Morpheus: 추가 emit 구현 핸드오프.
