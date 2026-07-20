# SHIFT / RegimeShift 전체 검토 · 전 군단 회의
**일자:** 2026-07-20 · **Chair:** Jarvis  
**자료:**  
1) UI 스크린 (Landing + Dashboard)  
2) `RegimeShift-OKX-Technical-Brief-v3_3.pptx` (13p)  
3) `Shift Institutional IR Deck_.pdf` (18p)  
**선행:** AM Management (amcryptoteam.com) 벤치  
**면책:** 투자 권유 아님. 문서·스크린 분석만. 내부 실적 미감사.

---

## 0. 한 줄 (ADHD)

**기술 브리프는 비교적 정직(룰 기반·MDD·과적합 공개).**  
**마케팅 UI/랜딩 숫자는 기술 문서와 충돌 → 신뢰 리스크 최상.**  
neo가 볼 핵심: **이 제품이 “실전 운용 중 $248M”인지, “백테스트+페이퍼+IR 스토리”인지 먼저 확정.**

---

## 1. 세 자료가 말하는 정체 (정리)

| 레이어 | 이름/톤 | 핵심 주장 |
|--------|---------|-----------|
| **Landing UI** | SHIFT · Adaptive AI Trading | AUM $248M · 일 +2.61% · 구독 18,241 · 승률 72.4% · 3전략 |
| **Dashboard UI** | SHIFT · user KAI KIM | 포트 $112.5k · SPY/QQQ/IWM 주문 · 배분 Bull45/Bear35/Cash20 |
| **Tech Brief** | RegimeShift · FOR OKX | **크립토** BTC/ETH · 1D 룰 기반 국면전환 · 시그널 봇 · **non-custodial** · Paper trading 중 |
| **IR Deck** | SH!FT / RegimeShift | 기관용 운용 자동화 인프라 · B2B/시그널/화이트라벨 · illustrative AUM 성장(억 단위) |

→ **AM Management($200M·OKX 시그널)** 와 **SHIFT/RegimeShift** 는  
같은 “크립토 퀀트+OKX 시그널+non-custodial” **카테고리**이나,  
문서상 브랜드/도메인(regimeshift.ai vs amcryptoteam.com)이 **다름**.  
관계(동일 그룹 / 경쟁 / 파트너)는 **neo 내부에서 확인 필요**.

---

## 2. 기술 실체 (Tech Brief — 가장 신뢰 가능)

### 시스템
- **MetaAllocator:** 매일 1회 (15:00 UTC / cron) 국면 분류  
- **Classifier (룰, 비-ML):**  
  - BULL: close > SMA50 AND slope(20) > 0  
  - BEAR: close < SMA50 AND slope(20) < 0  
  - RANGE: else → **CashHold (거래 안 함)**  
- **3봇:** BullBot(모멘텀 롱온리) / BearBot(MA 12/100 + vol + TP10%) / CashHold  
- **동시 2봇 금지.** 국면 전환 시 기존 포지션 청산  
- **출력:** ENTER_LONG / ENTER_SHORT / EXIT → HTTPS JSON → OKX Signal Bot  
- **자금 접근 없음** (non-custodial). OKX가 유저 계정에서 집행

### 백테스트 (2024-04-01 ~ 2026-04-01, 729일)
| 지표 | 값 | 해석 |
|------|-----|------|
| BTC | **+107.2%** (수수료·슬리피지 후) | HODL ~+85% 대비 우위 주장 |
| ETH | **+42.5%** (동일 파라미터) | cross-asset 통과 |
| OKB | **+38.2%** | 추가 확인 |
| Sharpe | **0.79** | 중간 |
| MDD BTC | **−42.6%** | 큼 — “안전” 아님 |
| MDD ETH | **−66.5%** | 매우 큼 |
| Win rate | **42.7%** | 랜딩 72.4%와 **불일치** |
| Trades | 250 · Avg W/L 2.1× · Exposure 57% | |
| Leverage in BT | **1.5×** (포지션 150% equity) | spot 가정과 병기 — 혼동 주의 |
| Fee | maker 0.02% / taker 0.05% · slip 5bps | 양호한 공개 |

### 과적합 대응 (좋은 점)
- 1,764 조합 스윕 → **4중 검증 통과 7개만 (0.4%)**  
- V2는 BTC +524% / ETH −94% → **과적합 자백** 후 V3 채택  
- 서브피리어드: V3가 3구간 중 1구간만 압도 — **정직**

### 리스크 6게이트
Kill switch · action whitelist · max positions · notional cap · leverage cap · daily loss stop

### 개발 상태 (중요)
| 단계 | 상태 |
|------|------|
| 구현·백테스트·unit tests 260 | DONE |
| V3 파라미터·과적합 테스트 | DONE |
| **Paper trading 1–3개월** | **NOW** |
| OKX Signal 연동 | NEXT |
| Marketplace 등록 | Q2 |
| 라이브 자본 | Q3 |

→ Tech 문서 기준으로는 **아직 “$248M 실전 AUM” 단계가 아님.**

---

## 3. 마케팅 UI vs Tech — 충돌 표 (Finance-Sentry 레드)

| 항목 | Landing/Dashboard | Tech Brief | 판정 |
|------|-------------------|------------|------|
| 자산 | 암시 일반 AI trading · 대시 **SPY/QQQ/IWM** | **BTC/ETH/OKB 크립토** | **제품 정체성 분열** |
| AUM | **$248M** | 실 AUM 미기재 · Paper 단계 | **강한 과장 가능** |
| 일 수익 | **+2.61% Average Daily** | 없음 (연 +107%면 일≈0.1% 수준 복리) | **비현실 · 치명적** |
| 승률 | **72.4%** | **42.7%** | **직접 모순** |
| Bull YTD | **+107%** | BTC 백테스트 +107.2% | 숫자를 전략 카드에 **재라벨**한 느낌 |
| Bear YTD | **+42%** | ETH +42.5% | 동일 패턴 |
| AI 표현 | “Adaptive **AI**” | **룰 기반 SMA, 블랙박스 ML 없음** | **AI 워싱** |
| 유저/구독 | 18,241 | Paper·심사 전 | 검증 필요 |

**Jarvis:** 랜딩은 **데모/목업 또는 위험한 마케팅**으로 가정하고,  
실무 판단은 **Tech Brief + IR의 illustrative 수치**만 사용.

---

## 4. IR 덱 요약 (기관 스토리)

### 포지션
- “전략이 아니라 **운용 구조/인프라**에 투자”  
- B2B 엔진 · Signal API · White-label  
- 타깃: 거래소, 디지털자산 운용사, 패밀리오피스, 자산관리 플랫폼

### 수익 모델
- 초기: 반복매출(구독/시그널)  
- 중장기: 성과연동·AUM 보수  
- 시나리오(명시 illustrative): 2027 100억 → 2028 300억 → 2029 700억 AUM  
  - **$248M(≈3,400억) 랜딩과 스케일 불일치**

### 비용 절감 마케팅
- Expected ROI 730% · 연 22억 절감 · 인력 80% 감소 등  
- “전통 조직 대비 시나리오” — **보장 아님** 각주 있음

### 연락
- contact@regimeshift.ai · www.regimeshift.ai  
- Tech: contact@regimeshift.io

### Use of funds
제품 30% · BD 20% · 인력 20% · 인프라 16% · 컴플 14%

---

## 5. AM Management 벤치와 비교

| | AM Management | SHIFT/RegimeShift |
|--|---------------|-------------------|
| AUM 스토리 | 사이트 $200M+ · 기사 $70–90M+ 성장 | 랜딩 $248M · IR은 억 단위 시나리오 |
| 채널 | OKX 봇 + Navi API + SPARK | OKX Signal 제안 · B2B 인프라 |
| 전략 투명성 | 사이트 추상적 | **Tech brief 매우 구체** |
| Non-custodial | 강조 | 동일 강조 |
| 성숙도 | 라이브 유저·시그널 랭킹 주장 | Paper → Q2/Q3 로드맵 |
| 위험 공개 | 약함 | MDD·과적합·서브기간 **상대적으로 정직** |
| 마케팅 리스크 | 메트릭 정의 | **일 2.61%·승률 72% 등 치명** |

---

## 6. 군단 좌석 발언

### Jarvis
목적성: OKX/기관에 “설명 가능한 regime-switch 엔진” 판매.  
neo 액션: **UI 숫자가 실적인지 목업인지** 사내 1문장 확정.

### Plutus
- 백테스트 +107% / MDD −42% = 고변동 롱바이어스 가능  
- 1.5× 레버리지 BT 가정 → 실전 비용·펀딩 미포함 명시  
- 랜딩 일 +2.61%를 그대로 쓰면 **컴플·평판 폭탄**

### Economist
국면 분류 SMA50+slope는 **고전 추세 필터**. 2024–26 불장 구간 성과 민감.  
서브피리어드 V1 우세 구간 존재 → 미래 보장 없음 (문서도 인정).

### Finance-Strategist
상품 형태 = **시그널 공급 / 엔진 라이선스**, 집합투자 펀드 아님.  
라이선스·광고 규정은 관할·고객 유형별로 다름.

### Finance-Sentry
- MDD 40%+ 를 “안정”으로 포장 금지  
- Paper ≠ Live  
- 대시보드 주식 ETF vs 크립토 브리프 = **제품 혼선/데모 데이터**  
- Kill switch 등 6게이트는 가점

### Legal
- “AI” vs 룰 기반 — 허위·오해 유발 가능  
- 성과 표시: 백테스트·YTD·승률 혼용 시 규제 리스크  
- IR “Confidential” vs 공개 랜딩 메트릭 정합성

### Trinity
고객 JTBD: 장세 바뀌어도 전략 갈아타기 귀찮음 → 자동화.  
가치 카피는 좋음. **숫자 신뢰가 깨지면 JTBD 설득 전부 붕괴.**

### Tank / Researcher
검증 질문: live AUM 원장, paper 로그, OKX bot_id, 실체결 슬리피지, 감사.

---

## 7. 목적성 (neo용)

| 질문 | 답 (문서 기준) |
|------|----------------|
| 뭐 하는 회사/제품? | 시장 국면 분류 후 봇 라우팅하는 **자동매매 시그널·운용 인프라** |
| 누구 돈? | 원칙적으로 **고객 거래소 계정** (non-custodial) |
| 지금 단계? | Tech: **Paper trading** · 라이브·마켓플레이스는 로드맵 |
| 우리(neo 회사)와? | 벤치/파트너/경쟁 후보 — **관계 문서로 확인** |
| 2,500억 스토리? | AM 쪽 $200M 밴드와 랜딩 $248M이 유사 리그이나 **동일 회사 단정 금지** |

---

## 8. neo가 할 질문 5 (회의용)

1. SHIFT 랜딩 **$248M / +2.61% daily / 72.4% win** 의 산출 근거·감사 여부?  
2. 대시보드 **SPY/QQQ** 는 데모인가, 주식 상품이 따로 있는가?  
3. Tech Brief **Paper trading** 종료일·실계정 성과 리포트 있나?  
4. AM Management(amcryptoteam) 와 **동일 법인/계열**인가?  
5. 대고객 문구에 **AI** 쓸 때 내부 정의(룰 vs ML) 문서 있나?

### 하지 말 것
- 랜딩 숫자를 투자 팩트로 외부 전파  
- MDD −40%+ 를 숨기고 “안정 수익”  
- 백테스트를 실계좌 수익과 동일시

---

## 9. 용어 (초보)

| 용어 | 뜻 |
|------|-----|
| Regime / 국면 | 상승·하락·횡보 등 시장 상태 |
| Meta-allocator | 국면 보고 어느 봇을 켤지 정하는 상위 로직 |
| Signal Bot | 거래소가 신호 받아 유저 계정에서 주문 |
| Non-custodial | 운용사가 출금·보관 안 함 |
| OOS | Out-of-sample 검증 구간 |
| MDD | 고점 대비 최대 낙폭 |
| Cross-asset | 여러 자산에 같은 파라미터 재사용 |

---

## 10. 결론 등급

| 영역 | 등급 | 메모 |
|------|------|------|
| 기술 설계 투명성 | **B+** | 룰·파라미터·과적합 공개 양호 |
| 리스크 정직성 (Tech) | **B** | MDD·서브기간 공개, 레버리지 가정 주의 |
| 마케팅 정직성 (UI) | **D** | 일수익·승률·AUM·AI 라벨 충돌 |
| 기관 IR 스토리 | **B-** | 포지션 명확, 성장 시나리오는 illustrative |
| 투자/도입 판단 | **보류** | Paper→Live 증적 + 마케팅 숫자 정정 전제 |

**Legion one. 정직 > 연기.**
