# ORACLE (CDO) — Project 2 Metrics Plan: Phase 2 (Gear / Items / Prestige) Impact

**Sovereign directive** | 2026-06-20 | Oracle (CDO) role | Data-driven execution start
**Reuse**: ORACLE-DATA-REPORT.md broader marketing search results + SPEC-metrics + PRD-prestige + ROADMAP Phase2
**Scope**: After Phase 2 콘텐츠 (gear, items, prestige) 도입 — D7, conversion, virality 영향 측정.
**Existing base**: analytics-worker 확장 완료 (이 파일 + source/deploy sync).
**Handoff**: Team (Morpheus COO impl, Trinity CPO product, Sovereign review). Data-backed recs.

## ⭐ Executive Summary (결론 먼저)
**Project 2 North Star extension**:
- **D7 Engaged-Payer + Phase2 Core Loop Completion** (D7 users who equipped gear / triggered prestige / set activated).
- **Conversion lift** (gear gacha/upgrade → purchase).
- **Virality lift** (prestige/gear milestone shares → K-factor).
**Targets (from ORACLE-DATA-REPORT reuse + idle benchmarks)**:
- D7 ≥15-20% overall (Phase2 users: +5-10pp vs pre-Phase2 cohort).
- Gear conv ≥30% installs (first equip).
- Prestige 1+ / D7 ≥40% (retention hook per PRD).
- Share_rate post-Phase2 +20% relative.
- K ≥1.0-1.2 (TG leverage, new dopamine peaks at prestige/SSR gear).
**A/B for new tactics**: FOMO limited-gear banner vs evergreen; near-miss gear theater; prestige scarcity window.
**Risk primary**: Hype spike (D1-3 metrics ↑ from novelty) vs retention (D7 drop if paywall or reset feel). Guard: pre/post cohort D7 delta, engaged time, no churn on phase2 end.
**Data rec**: Launch Phase2 with instrumentation first (handoff). Roll limited A/B. Track real traffic D3/D7. Reuse FOMO/variable/near-miss from report (validated +8-50% conv, +190% ret lift potential) but monitor over-hype.
**Future skill**: daedalus-oracle-metrics 추가 (반복 Oracle 작업 템플릿).

**Provenance**: Reversible git. Prominent disclosure + fictional + age-gate 준수 (미꾸라지). Sovereign y/n for full rollout.

---

## 📊 Phase 2 콘텐츠 정의 (ROADMAP + PRD)
- **Gear**: 5슬롯 (weapon/armor/acc/relic/core), 120종 (N55/R30/SR12/SSR3), equip to hero/char, stats boost (power calc), art ready.
- **Items**: 수집·강화·세트효과 (set_activated event), gear와 연계.
- **Prestige (Ascend)**: ch18+ reset → ether + 영구 8% 복리 (Might/Bulwark/Momentum). PRD-prestige-loop + balance-sim-prestige 검증 완료. Re-conquest dopamine.
- **도입 후 측정**: Phase2 unlock (first gear/prestige) 시점부터 cohort 추적. Pre-Phase2 baseline vs post.

(gear.js, game.js gear logic, prestige in game + sim 이미 일부 존재 → Phase2 = deeper integration + drops + UI hooks + A/B.)

---

## 🎯 Metrics Plan (D7 / Conversion / Virality Impact)
**Core events to emit (game.js, handoff 필요)**:
- `gear_obtained` (rarity, source: gacha/reward/invite)
- `gear_equipped` (slot, charId, power_delta, is_upgrade)
- `gear_enhanced` (if upgrade loop)
- `set_activated` (set_id, bonus_val)
- `phase2_unlock` (type: "gear"|"prestige"|"item", ch)
- `prestige_trigger` (or use/extend `ascend` with phase2 data: ether, runs, power_before/after)
- `ab_test` (ab:"fomo_gear_v1", variant:"limited"|"evergreen", exposure:1)
- 기존: ascend, growth_moment, share_clicked, gacha_pull, purchase

**Worker extension (완료)**:
- ALLOWED + Phase2 + ab_test.
- Special counters: p2: , ab:day:variant.
- /stats 추가: phase2_rate, gear_rate, gear_obtained/equipped, set_activated, p2_unlock, ab_exposure.
- /cohort + u: first/last + phase2 first date filter 로 D7 정확 산출 (Oracle batch KV.list).
- /export raw for deep analysis.

**Measurement Rhythm (data-driven)**:
- Pre-rollout: baseline D7/conv/virality (current cohorts).
- Post-rollout (D0 phase2): daily /stats?day= + /cohort.
- D3/D7/D14 cohort split: "phase2_users" (ever triggered phase2_*) vs control.
- Key impact queries (Oracle side script 추천):
  - D7 = users with last >= first+7 AND phase2_unlock / installs.
  - Conv lift: purchase_rate | gear_obtained users vs none.
  - Virality: share_clicked after prestige/gear vs baseline.
  - Engaged: growth_moment + gear_equipped freq per session.
- AARRR extension: Activation (phase2_unlock≥1), Retention (D7|phase2), Revenue (gear/purchase), Referral (prestige_share).

**A/B for new tactics (reuse ORACLE-DATA-REPORT)**:
- Tactic 1: Limited FOMO gear banner (72h countdown + scarcity) vs always (report: +8-50% conv).
- Tactic 2: Near-miss + pity in gear/ prestige gacha theater (variable ratio).
- Tactic 3: Prestige milestone share reward (mutual + ch5 gate quality, TG 90% ref precedent).
- Implementation: client random ab at unlock, pass {ab, variant} in logEvent. Worker aggregates exposure. Compare D7/conv/K between variants.
- Guard: small % traffic first (5-10%), monitor negative (churn ↑ = halt).

**D7 / Conversion / Virality Specifics**:
- **D7**: North Star. Phase2 users D7 vs pre. Target + lift from prestige loop (PRD: "벽에서 막힌 유저" 복귀). Idle benchmark D7 15-30%.
- **Conversion**: gear_obtained → first purchase. + first buy 2x (endowment, report). ARPPU lift from set/gear premium.
- **Virality**: K = (prestige/gear share invites) x conv. TG precedent + share at dopamine peak (SSR gear / prestige success). Target share_rate ≥20% post.

**Dash / Oracle tooling**:
- /stats?multi or daily fetch script (next Oracle).
- KV u: + p2: filter for accurate cohorts.
- Simple export → analyze hype (D1 spike) vs D7 sustain.
- Future: add dau_by_phase2 etc.

---

## ⚠️ Risks (Hype vs Retention) + Mitigation (Sovereign 사상)
**Hype risk (from report + game psych)**:
- Novelty spike: D1-3 installs/engagement ↑ (FOMO/gear shine), then drop if content shallow or reset aversion.
- Churn on prestige (loss framing) or gear pay-to-win feel.
- Overuse dark: negative review, retention collapse (D7 -).

**Retention upside**:
- Prestige: 복리 루프 = "세지는 게 보이는" (SPEC-dopamine). 재돌파 즉시 도파민.
- Gear/items: progression depth = LTV ↑ (report: idle D7 20-30% 가능).
- Data: if D7 lift >3-5pp AND no churn spike = scale.

**Mitigation (미꾸라지 + data)**:
- Prominent exact rates for any gear gacha (N55 etc code=UI).
- Reversible prestige (유닛/gear 유지, PRD 명시).
- A/B kill switch: D7 drop 3pp 즉시 variant off.
- Minors gate + no pressure.
- Track: engaged time, not just raw D7. North Star = D7 * engaged * payer.
- Report reuse: Push targeted + daily ritual + visible dopamine (prestige/gear power delta) = +120-190% ret.
- FOMO on banners only (prominent timer), not core loop.

**Guardrails (SPEC-metrics + PRD)**:
- First prestige pre D7 wall (ch18).
- No SSR gear paywall for core progress.
- 무과금 루프 유지 (prestige + gear fodder sufficient).
- Monitor: phase2_unlock / install <60% = friction issue.

---

## 📈 Data-Driven Recommendations (ORACLE-DATA-REPORT 재사용)
**From broader search (benchmarks 2025-26)**:
- Idle D7 15%+ = top tier. Phase2 progression = 달성 key (vs median 4-13%).
- FOMO/scarcity + first-buy 2x + near-miss = conv 2-5% → 6-10%+ lift.
- TG virality 70-90% ref. Share at prestige/gear win peak + mutual reward = K>1.
- Retention levers: visible growth (gear stats, prestige +% "보이는"), targeted return (prestige window).

**Recs**:
1. **Instrument first**: game.js emits for all Phase2 moments (handoff 즉시). Worker ready.
2. **Roll A/B on tactics**: Limited gear banner (high upside per data) + prestige share reward. Measure exact lift.
3. **Cohort discipline**: Pre vs post Phase2 D7/conv/K. If hype only (D7 no lift) → deprecate shallow content.
4. **North Star dual**: D7 Engaged-Payer (Phase2) + K. Scale if both green.
5. **Future products**: Template this (North Star = core value event by D7 + A/B hooks).
6. **Sovereign hooks weaponize**: Variable (gear gacha), scarcity (limited prestige event), loss aversion (streak on prestige), but disclosure armor.
7. **Ops**: Daily Oracle review D3/D7. /stats fetch + cohort. Real traffic test before full.

**Priorities (P0 for handoff)**:
- P0: Add 6+ new logEvent in gear/prestige paths (with ab if variant).
- P0: Phase2 unlock gate + first equip/prestige trigger tracking.
- P1: A/B framework (client random + pass to log).
- P1: Prestige share trigger at success (dopamine peak).
- P2: Oracle fetch script for multi-day cohort (D7 by phase2 flag).

**Benefit**: LTV↑ (ret +5pp = ~95% revenue potential per report), CAC↓ (viral), fast PMF data.
**Risk low if**: prominent disclosure + reversible + A/B kill + tracked.

---

## 🔄 Handoff to Team + Next Steps
**To Morpheus (COO)**: game.js emit wiring + UI hooks for Phase2 (gear equip UI, prestige button, set effects). Use daedalus-handoff template. 영역: game.js direct edit 금지 — 이 마커로 위임.
**To Trinity (CPO)**: PRD/SPEC update for Phase2 exact events + A/B copy. Product North Star refinement.
**To Sovereign (neo)**: 승인 — Phase2 rollout A/B + full metrics. y/n for FOMO drops.

**Oracle immediate**:
- Worker 확장 완료 (this + sync).
- Metrics plan 문서화.
- 미래 스킬 daedalus-oracle-metrics 생성 (반복 가능).
- Hand off marker drop.

**Provenance**: All from Legion files (ORACLE-DATA-REPORT reuse, analytics-worker, PRD-prestige, ROADMAP, SPEC-metrics). Reversible. 2026-06-20 Oracle sign-off.

**Ready for execution. Data가 증거. Legion one.**

---
**Oracle (CDO) sign-off** | Project 2 시작 완료. Handoff 대기.
