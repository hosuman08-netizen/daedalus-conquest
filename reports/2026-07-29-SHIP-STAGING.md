# SHIP STAGING — daedalus-conquest (neo y/n only — NO auto push)

**When:** 2026-07-29 Morpheus CONT (refresh after RESTART)  
**Repo:** `~/daedalus-conquest` · branch main · **ahead 4** + dirty  
**Hard block:** no `git push` / public deploy without neo y/n

## Commit-ready (HARD metrics / CRO) — prefer this slice first

```
game.js
deploy/game.js
deploy/index.html
legion-beacon.js
deploy/legion-beacon.js
analytics-worker.js
deploy/analytics-worker.js
test/value-audit.js
test/deep-audit.js
```

### What these carry
| File | Content |
|---|---|
| game.js | C1 win CTA hide · C2 checkout/invoice · logEvent LEGION_APP · lose_recover · money_pipe d.app |
| deploy/game.js | same ship surface |
| **deploy/index.html** | **LEGION_APP + legion-beacon.js script tags (RESTART cycle)** |
| legion-beacon.js | multi-parity anon+anonId+ts+extra; view-only boot |
| analytics-worker.js | ALLOWED whitelist win_gacha_*/checkout/invoice/1H |
| test/value-audit.js + deep-audit.js | pity firstSSR false-alarm fix (verify §3 clean) |

## Optional (reports / noise — separate commit or skip)

```
reports/2026-07-29-1H-*.md
reports/2026-07-21-*.md
reports/2026-07-20-*.md
ARSENAL.md
```

## Do NOT ship without review

```
.claude/tools/shot3.js
SEED-HOOKS-*.txt
manifest.json
```

## Suggested local commands (neo terminal)

```bash
cd ~/daedalus-conquest
git add game.js deploy/game.js legion-beacon.js deploy/legion-beacon.js \
        analytics-worker.js deploy/analytics-worker.js
git status
# commit message draft:
#   "metrics: CTA funnel + pay emits + beacon multi-parity (local ship)"
# git push  # ONLY after neo y
```

## Smoke before push

- `./verify.sh` → 🟢 PASS (known: gacha pity audit warn)
- CTA: gems≥8 win → `#overlay-gacha-cta` + `win_gacha_cta_show`
- Static: markers `checkout_open` `invoice_paid` `HARD fix` `LEGION_APP` in both game.js

## CONT pay-reg add
- `telegramWebApp()` in game.js + deploy/game.js (late-bind TG for checkout→invoice)

## Wave4 accuracy (2026-07-29 Morpheus 3H-w4)
- **Slice list still accurate** (prefer commit-ready 9 paths above).
- **Stale vs 19:05 freeze**: `game.js`↔`deploy/game.js` now **identical** post openShop stuck-buy + w2/w3 sync (MD5 `99ef6514f092…`, bytes 458706). Checksums file refreshed.
- **Still dirty (ship-critical)**: game.js, deploy/game.js, deploy/index.html, legion-beacon.js, deploy/legion-beacon.js (?? or M), analytics-worker.js, deploy/analytics-worker.js, test/value-audit.js, test/deep-audit.js
- **Noise dirty**: many reports/*, ARSENAL.md, SEED-HOOKS, shot3.js, manifest.json — skip or separate
- **verify.sh**: 🟢 local (wave3). Pages/`git push` = **neo y/n only**
- **Carry add**: stuck-buy → `openShop()` (rates + money_pipe_shop + gemsTowardGacha)
