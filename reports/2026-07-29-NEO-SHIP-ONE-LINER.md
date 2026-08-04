# NEO SHIP (when ready y)
UPDATED 2026-07-29 21:05:14 · 148m left in 3H

## 한 방 순서
```bash
# 1) daedalus pages
cd ~/daedalus-conquest && git push origin main   # neo y only

# 2) after pages propagate (~1m)
cd ~/daedalus-conquest && npx wrangler@3 deploy -c wrangler-pay.toml

# 3) secrets
cd ~/p2-my-pantheon && npx wrangler@3 secret put WEBHOOK_SECRET -c wrangler-bot.toml
cd ~/legion-analytics-multi && npx wrangler@3 secret put STATS_SECRET

# 4) duo + p2 optional
cd ~/p20-saju-miniapp && git push
cd ~/p21-tarot-app && git push
cd ~/p2-my-pantheon && git push
```

## Verify after
- curl invoice without initData → 401
- curl /__setup → setup-disabled
- verify.sh 4× still green on live
