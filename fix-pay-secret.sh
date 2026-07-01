#!/bin/bash
# fix-pay-secret.sh — WEBHOOK_SECRET 확실 제거해서 fail-open 결제 정상화 (set -e 없이 끝까지)
set -uo pipefail
cd ~/daedalus-conquest
export CLOUDFLARE_API_TOKEN="$(cat ~/.cf_token)"
export NODE_EXTRA_CA_CERTS=~/.mac-system-roots.pem
W="https://legion-pay.hoyashi95.workers.dev"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "▶ 현재 시크릿 목록"
npx wrangler secret list -c wrangler-pay.toml 2>&1 | tail -8

echo "▶ WEBHOOK_SECRET 삭제 (자동확인 yes)"
printf 'y\ny\n' | npx wrangler secret delete WEBHOOK_SECRET -c wrangler-pay.toml 2>&1 | tail -8

echo "▶ 검증 (5초 대기 후)"
sleep 5
CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$W/" -H 'Content-Type: application/json' -d '{"message":{"text":"/start"}}')
echo "    헤더없는 POST: $CODE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$CODE" = "200" ]; then
  echo "✅ 결제 복구 완료 (fail-open). 봇토큰 고친 뒤 보안배포 재시도 필요."
else
  echo "⚠️ 아직 $CODE — 시크릿이 안 지워졌거나 코드가 fail-closed. 이 출력 전부 붙여넣어줘."
fi
