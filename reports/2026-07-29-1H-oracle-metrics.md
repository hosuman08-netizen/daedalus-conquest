# Oracle metrics 1H
## Live sample (with app param)
- saju-miniapp 7d: sparse DAU (1–2 days), activate few, share 0
- daedalus 7d: mostly zeros
- p1 1d: zeros

## Status
birth/cross/K: **UNKNOWN** at fleet level — emit present in code (logEvent) but remote aggregates near-empty.
North Star cannot be claimed; conversion instrumentation (`win_gacha_cta_*`) added client-side pending Pages ship.

## Gap
1. Deploy analytics worker fix ✓ (2026-07-29 08:03 Morpheus: wrangler@4.115.0 deploy v99b78493)
2. Confirm client POST /ev app ids match stats app= names — VERIFY EMIT E2E
3. No false growth claims

---

## ORACLE_RECEIVED [2026-07-29 09:15:12]
analytics worker /stats timeout FIXED (app-required, no bare hang); emit E2E (p1 core_loop/gacha/shop/p2 share) still UNKNOWN → SYNTHETIC TEST REQUIRED within 1H to validate backend ingestion OR declare D7 cohort D-loss permanent.


