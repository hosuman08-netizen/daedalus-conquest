#!/bin/bash
# deploy-p0-auto.sh — 결제 fail-closed 무중단 자동배포 (봇토큰 불필요 — 워커 내부 __sw로 setWebhook)
# 순서: secret주입 → 배포A(__sw활성) → /__sw로 setWebhook → 배포B(정식,__sw죽음) → 검증
set -euo pipefail
cd ~/daedalus-conquest

export CLOUDFLARE_API_TOKEN="$(cat ~/.cf_token)"
export NODE_EXTRA_CA_CERTS=~/.mac-system-roots.pem
S="$(cat ~/.webhook_secret_tmp)"
W="https://legion-pay.hoyashi95.workers.dev"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "▶ [1/5] WEBHOOK_SECRET 워커 주입"
printf '%s' "$S" | npx wrangler secret put WEBHOOK_SECRET -c wrangler-pay.toml

echo "▶ [2/5] 배포A — __sw 임시라우트 활성(ENABLE_SW=1)"
npx wrangler deploy -c wrangler-pay-A.toml 2>&1 | tail -4

echo "▶ [3/5] /__sw 호출 → 워커가 자기 봇토큰으로 setWebhook(secret_token 주입)"
sleep 3
SW=$(curl -s "$W/__sw?k=$S")
echo "    $SW"
echo "$SW" | grep -q '"ok":true' || { echo "❌ setWebhook 실패 — 중단(배포B 안 함). 위 응답 확인."; exit 1; }

echo "▶ [4/5] 배포B — 정식본(__sw 비활성 + fail-closed)"
npx wrangler deploy -c wrangler-pay.toml 2>&1 | tail -4

echo "▶ [5/5] 검증"
sleep 3
CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$W/" -H 'Content-Type: application/json' -d '{"message":{"successful_payment":{"invoice_payload":"gem1:hack"}}}')
SW2=$(curl -s -o /dev/null -w '%{http_code}' "$W/__sw?k=$S")
echo "    위조 POST: $CODE  (403=방어작동 ✅)"
echo "    __sw 제거확인: $SW2  (4xx/000=제거됨 ✅)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$CODE" = "403" ]; then
  echo "✅ P0 결제 보안패치 배포 완료 — 위조결제 차단. 정상결제는 텔레그램 secret_token으로 통과."
else
  echo "⚠️ 위조 POST가 $CODE — 롤백: git revert + 이전 워커 재배포. 이 출력 모피어스에게."
fi
