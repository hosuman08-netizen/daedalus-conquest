---
name: daedalus-oracle-metrics
description: Oracle(CDO) Phase2/미래 지표 계획 + analytics-worker 확장 + A/B + hype-vs-retention 분석 + data-driven rec. "Oracle metrics", "Project 2 metrics plan", "A/B for new tactics", "extend analytics" 때 사용.
Absolute path: /Users/imhogyun/daedalus-conquest/.claude/skills/daedalus-oracle-metrics/SKILL.md
---

# Oracle (CDO) Metrics & Phase2 Analysis Skill

## 1. Purpose
Oracle 전용: Project X metrics plan 수립, 기존 analytics-worker 확장, A/B 프레임, D7/conv/virality 영향 측정, hype vs retention 리스크 분석, data-backed 추천. 미래 스킬 템플릿 (반복 Oracle 작업).

**Sovereign / Legion 원칙**:
- 정직 > 연기. Data로 증명.
- 미꾸라지: prominent disclosure + reversible + A/B kill switch.
- Sovereign 사상: FOMO/variable/near-miss hooks 적극 but guard + track.
- Reuse broader search (ORACLE-DATA-REPORT.md) + SPEC-metrics.

## 2. When to Use
- Sovereign: "Project 2 metrics plan", "Phase 2 (gear/items/prestige) 도입 후 D7/conv/virality"
- "analytics-worker 확장", "A/B for new tactics"
- "Risk (hype vs retention)", "data-driven recommendation"
- "미래 스킬" 추가 시
- Post-launch cohort review / North Star tracking

## 3. Core Workflow
1. **Baseline 수집** (pre-Phase2):
   - node or fetch /stats?day=YYYY-MM-DD (multiple days)
   - /cohort for rolling D1/D7/D30
   - /export for raw u:

2. **Worker 확장** (Oracle direct edit 영역 — analytics-worker.js + deploy/ sync):
   - ALLOWED Set에 Phase2 이벤트 추가 (gear_obtained, gear_equipped, set_activated, phase2_unlock, prestige_trigger, ab_test ...)
   - Special counters: p2:, ab:day:*
   - /stats proxies: phase2_rate, gear_rate, ab_exposure, p2_unlock
   - A/B: data.ab / variant 파싱 + count
   - D7 impact: u: + phase2 first-date filter 준비 (KV.list)

3. **Metrics Plan 작성** (ORACLE-*-METRICS.md):
   - Reuse ORACLE-DATA-REPORT.md (bench: D7 15-30% idle, FOMO +8-50% conv, TG K 90% ref).
   - Define events, AARRR extension, targets, A/B variants.
   - Pre/post cohort split logic.
   - Guardrails.

4. **A/B + Risk Analysis**:
   - Variants: limited FOMO (scarcity) vs evergreen; near-miss prestige vs plain.
   - Track: exposure vs outcome (D7 delta, conv, share).
   - Hype signal: D1-3 spike but D7 flat/churn = bad.
   - Retention signal: D7+ engaged (gear equip freq + prestige runs) ↑ = good.
   - Kill criteria: D7 -3pp 또는 negative review spike.

5. **Handoff**:
   - game.js emit 추가 (gear/ prestige paths) → daedalus-handoff 스킬 사용 (Morpheus 영역).
   - Client ab random + logEvent({ab, variant}).
   - Update SPEC-metrics / PRD.

6. **Oracle Ops**:
   - Daily: /stats fetch + cohort split by phase2 flag.
   - Report: D7 Engaged-Payer (phase2) + K lift.
   - Future: simple dashboard script or export viz.

## 4. Example Commands
```bash
# Worker test (local)
# (wrangler dev or direct)

# Fetch recent (Oracle side, curl or script)
curl "https://legion-analytics.../stats?day=2026-06-21"
curl ".../cohort"
curl ".../export" | head

# Sim + balance cross check (if prestige/gear)
node balance-sim-prestige.js | head -20
```

## 5. Phase2 Specific (Gear/Items/Prestige)
- Events: gear_obtained (rarity/source), gear_equipped (delta power), set_activated, phase2_unlock, prestige_trigger.
- Impact: D7 lift for phase2 users, gear→purchase funnel, prestige share virality.
- Targets (data-backed): D7 +5-10pp, gear_rate≥0.3, K+0.2.
- A/B copy: "한정 72h gear" (FOMO) / "prestige window scarcity".

## 6. Output Format (Oracle report)
- Executive summary (3-5줄, 결론 first)
- Metrics table (D7/conv/virality + targets)
- A/B plan + variants
- Risk (hype spike vs sustain) + mitigations
- Recs + P0/P1 handoff items
- Provenance (files + date)

## 7. Integration with Legion
- Analytics design: Trinity(CPO) spec, Morpheus(COO) game wiring, Oracle(CDO) analysis + worker.
- 파일 영역: analytics-worker.js (Oracle/Trinity edit OK), game.js (handoff to Morpheus).
- Hand off marker: ~/MacAI_Conversations/Jarvis/handoffs/ (Oracle or Trinity → Morpheus)
- Update ORACLE-DATA-REPORT.md or new ORACLE-*-METRICS.md
- Future skill reuse: daedalus-handoff, daedalus-balance (prestige).

## 8. 가드 (절대)
- prominent 정확 공개 (rates code=UI=docs)
- Reversible (git, no auto money)
- A/B small rollout + kill switch
- Minors/geo compliance
- No kompu / misleading. Fictional framing.

**Oracle sign-off template**:
"Worker 확장 + plan + A/B ready. Handoff drop. Real data D7 확인 후 scale. Sovereign y/n."

**Provenance**: 2026-06-20 Oracle(CDO) Project 2 + future skills. All Legion files. 
