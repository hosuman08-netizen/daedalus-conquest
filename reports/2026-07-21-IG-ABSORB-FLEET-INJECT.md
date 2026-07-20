# IG 흡수 → 함대 주입 확정 (2026-07-21 · Jarvis)
**소스:** reports/2026-07-20-IG-AI-collection-absorbed.md + legion-discussion-IG-absorption.md  
**명령:** neo "흡수"

---

## 0. 흡수 선언
모피어스가 인스타에서 본 AI 에이전트 컬렉션(42스킬/7크루·34스킬 사업·티어링·풀스택·Loop·CRO/Growth)을  
**Jarvis·전 군단 공식 교본으로 재각인**한다. 아래는 **함대에 더 박을 것** 실행 맵.

---

## 1. 프레임워크 매핑 (이미 있는 것 vs 갭)

### Claude Workforce 42 / 7 Crew
| 크루 | IG 스킬 예 | 우리 로스터 | 상태 |
|------|------------|-------------|------|
| DEV | Superpowers, Context7, MCP, Skill Creator | Tank, Altman, verify.sh | ✅ 부분 · Context7/Evals 갭 |
| DESIGN | frontend-design, ui-ux-pro-max | SENSE 스킬, Sparks | ⚠️ 스킬화 (상근X) |
| MARKETING | seo, GEO, cro, psych | Niobe, Seraph, Sparks, Persephone | ✅ |
| SOCIAL | copy, video, content | Niobe, shorts, video-crafter | ✅ |
| FINANCE | pricing, pitch, model | Plutus, finance-* | ✅ 투명 트랙 |
| OPS | sop, launch, incident | Morpheus, ship-craft | ✅ |
| LEGAL | compliance, risk | legal-expert, 파놉티콘 | ✅ |

### 34 Skill / 7 자율사업
| 사업 | 핵심 스킬 | 함대 주입 |
|------|-----------|-----------|
| SEO/GEO | ai-seo, schema | hub schema.org ✅ · p1/사주 GEO 콘텐츠 ⬜ |
| CRO | paywall-upgrade, onboarding, churn | **체크리스트 신설** ⬇️ |
| CONTENT | copy, social | SEED 훅 ✅ |
| PAID ADS | creative, ab | Sparks 대기 |
| GROWTH | referral K, free-tool, churn | p2 K ✅ · 전 경로 감사 ⬜ |
| SALES/GTM | launch, pricing | p19 Ops ✅ |
| STRATEGY | psych, research | full-cheat · 실사 문서 ✅ |

### 모델 티어링 (공식)
Fable=장기 · Opus=깊은추론 · Sonnet=일상 · Haiku=즉답  
→ 군단 기존 티어링 **확정 유지**.

### 풀스택 1인
Claude+Supabase+Stripe+CF+Playwright+GitHub  
→ 우리: **CF Workers/Pages/D1 우선** (토론: Supabase 강제X). Stripe/결제 구멍 ⬜. verify=Playwright 방향 ✅.

### Loop Engineering
목표 검증가능 + DOER + CHECKER 루프  
→ jarvis-watch · router · verify.sh · 3H 스케줄 = **이미 Loop**.  
갭: **Evals**(품질 점수) · **AI Gateway**(자동 모델 라우팅).

---

## 2. 함대에 지금 더 박을 것 (우선순위)

| Prio | 주입 | 대상 | 상태 |
|------|------|------|------|
| P0 | CRO/Growth 게이트 체크리스트 | 전 pN / 코어 먼저 | **본 문서+체크리스트 파일** |
| P0 | 서버권위 정산 스펙 (D1/DO) | K·초대·보상 | 스펙 파일 |
| P1 | GEO 스키마+피처 콘텐츠 | hub·사주·p1 | hub 일부 ✅ |
| P1 | Design 스킬 게이트 (SENSE+3초) | 신규 미니앱 | 체크리스트 |
| P1 | paywall/소액 구멍 1 | p1 or p19 or 사주 | ⬜ neo 결제 경로 |
| P2 | Skill Creator 루프 | 스킬 양산 | create-skill 있음 ✅ |
| P2 | Evals 미니 (에이전트 출력 1~5점) | 핸드오프 | ⬜ |
| P2 | Context7 / 문서 정확도 | DEV | ⬜ MCP |
| P3 | Remotion/영상 자동화 | shorts | 후보 |
| P3 | Claude Mem 장기기억 | 세션 간 | lessons/ARSENAL ✅ 부분 |

---

## 3. CRO/Growth 함대 게이트 (정식)

모든 코어 앱 배포 전:
1. **onboarding-cro** — 첫 가치 60초 이내?
2. **paywall-upgrade-cro** — 무료→유료 구멍 1개? (또는 후원/Stars)
3. **churn-prevention** — 복귀 이유 (daily/streak/focus)?
4. **referral-program** — 공유=귀속 전 경로?
5. **free-tool-strategy** — 무료 훅이 유료로 이어지나?
6. **GEO** — title/desc/schema AI 인용 가능?

---

## 4. Loop Engineering 함대 계약

```
GOAL (측정 가능) → DOER (구현) → CHECKER (verify/smoke/emit) → 루프
```
- DOER: 구현 에이전트  
- CHECKER: verify.sh · Pages 200 · emit 목록  
- 실패 시 재루프, “했다고 침” 금지 (정직>연기)

---

## 5. 흡수 완료 스탬프
- [x] 42/7 · 34/7 로스터 매핑  
- [x] 모델 티어링 권위 확인  
- [x] Loop = 군단 본명 인정  
- [x] CRO/Growth 게이트 문서화  
- [x] 함대 주입 우선순위 P0–P3  
- [ ] 서버권위 정산 구현 (다음 실행)  
- [ ] 코어 앱 CRO 전수 스코어카드  

**Sovereign 1줄:** IG 흡수 완료. 함대에 CRO게이트·Loop계약·GEO/결제구멍 우선 주입. Design=스킬. 금융투명 유지.
