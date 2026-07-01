#!/bin/bash
# deploy-p0-failclosed.sh — 결제 웹훅 fail-closed 무중단 배포 (정공법, __sw 우회 불필요)
# 실행: BOT_TOKEN='8123456:AAH...' bash deploy-p0-failclosed.sh
#   (봇토큰은 군주만 다루는 비밀 — 코드/깃에 넣지 말 것. 이 변수로 1회만 주입)
# 순서: secret주입 → setWebhook → 정식배포 → 검증. 각 단계 무중단(라이브본은 setWebhook까지 헤더 무시).
set -euo pipefail
cd ~/daedalus-conquest

export CLOUDFLARE_API_TOKEN="$(cat ~/.cf_token)"
export NODE_EXTRA_CA_CERTS=~/.mac-system-roots.pem
: "${BOT_TOKEN:?❌ BOT_TOKEN 필요 — 실행: BOT_TOKEN='봇토큰' bash deploy-p0-failclosed.sh}"
S="$(cat ~/.webhook_secret_tmp)"
W="https://legion-pay.hoyashi95.workers.dev"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "▶ [1/4] WEBHOOK_SECRET 워커에 주입"
printf '%s' "$S" | npx wrangler secret put WEBHOOK_SECRET -c wrangler-pay.toml

echo "▶ [2/4] setWebhook secret_token 주입 (텔레그램 → 이후 모든 웹훅에 헤더 동봉)"
RESP=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${W}&secret_token=${S}")
echo "    $RESP"
echo "$RESP" | grep -q '"ok":true' || { echo "❌ setWebhook 실패 — 중단(배포 안 함). 봇토큰 확인."; exit 1; }

echo "▶ [3/4] fail-closed 정식본 배포"
npx wrangler deploy -c wrangler-pay.toml 2>&1 | tail -4

echo "▶ [4/4] 검증 — 헤더 없는 위조 POST는 403이어야 정상"
sleep 2
CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$W/" -H 'Content-Type: application/json' -d '{"message":{"successful_payment":{"invoice_payload":"gem1:hack"}}}')
echo "    위조 POST 응답: $CODE  (403=방어작동 ✅ / 200=실패 ❌)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$CODE" = "403" ]; then
  echo "✅ P0 결제 보안패치 배포 완료 — 위조결제 차단. 정상결제는 텔레그램 secret_token으로 통과."
  echo "   (시크릿 백업: ~/.webhook_secret_tmp — 보관 후 삭제는 군주 판단)"
else
  echo "⚠️ 위조 POST가 $CODE — 이 출력 모피어스에게 보여줘(롤백: git revert + 이전 워커 재배포)."
fi
