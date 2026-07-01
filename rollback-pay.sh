#!/bin/bash
# rollback-pay.sh — 긴급: 결제 워커를 배포A 이전 안정본(fail-open)으로 복구 + WEBHOOK_SECRET 제거
# 봇토큰 401로 setWebhook 실패 → fail-closed가 정상결제까지 막은 상황 긴급 복구
set -euo pipefail
cd ~/daedalus-conquest
export CLOUDFLARE_API_TOKEN="$(cat ~/.cf_token)"
export NODE_EXTRA_CA_CERTS=~/.mac-system-roots.pem
W="https://legion-pay.hoyashi95.workers.dev"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "▶ [1/3] 코드 롤백 → 529ef0da (6-28 안정본, fail-open)"
echo "y" | npx wrangler rollback 529ef0da-a9a4-409f-a4d1-13a4f4b8abfe -c wrangler-pay.toml 2>&1 | tail -8

echo "▶ [2/3] WEBHOOK_SECRET 제거 (fail-open 정상화 — 헤더검증 끔)"
echo "y" | npx wrangler secret delete WEBHOOK_SECRET -c wrangler-pay.toml 2>&1 | tail -3

echo "▶ [3/3] 검증 — 정상 결제 webhook 통과 확인"
sleep 3
CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$W/" -H 'Content-Type: application/json' -d '{"message":{"text":"/start"}}')
echo "    헤더없는 POST: $CODE  (200=결제 복구 ✅ / 403=아직 막힘)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
[ "$CODE" = "200" ] && echo "✅ 결제 복구 완료(fail-open). P0 구멍은 임시로 다시 열림 — 봇토큰 고친 뒤 재배포 필요." || echo "⚠️ $CODE — 이 출력 모피어스에게."
