#!/bin/bash
# P0 결제 웹훅 보안패치 무중단 배포 — neo가 터미널에서 직접 실행
# 배포A(임시 /__sw 라우트, 검증 ON) → 웹훅 secret_token 주입 → 배포B(정식, 라우트 제거) → 검증
set -euo pipefail
cd ~/daedalus-conquest

CERT=~/.mac-system-roots.pem
export CLOUDFLARE_API_TOKEN="$(cat ~/.cf_token)"
export NODE_EXTRA_CA_CERTS="$CERT"
S="$(cat ~/.webhook_secret_tmp)"
W="https://legion-pay.hoyashi95.workers.dev"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "▶ [1/4] 배포 A — 임시 웹훅 리콘실러 라우트"
npx wrangler deploy -c wrangler-pay-A.toml 2>&1 | tail -4

echo "▶ [2/4] 웹훅에 secret_token 주입 (서버사이드)"
sleep 2
SW=$(curl -s "$W/__sw?k=$S")
echo "    $SW"
echo "$SW" | grep -q '"ok":true' || { echo "❌ setWebhook 실패 — 중단(배포B 안 함). 위 응답 확인."; exit 1; }

echo "▶ [3/4] 배포 B — 정식 패치본(검증 ON, 임시라우트 제거)"
npx wrangler deploy -c wrangler-pay.toml 2>&1 | tail -4

echo "▶ [4/4] 검증 — 위조 POST(헤더 없음)는 403이어야 정상"
sleep 2
CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$W/" -H 'Content-Type: application/json' -d '{"message":{"successful_payment":{"invoice_payload":"gem1:hack"}}}')
echo "    위조 POST 응답코드: $CODE  (403 = 방어 작동 ✅ / 200 = 실패 ❌)"
# 임시 라우트 제거 확인
SW2=$(curl -s -o /dev/null -w '%{http_code}' "$W/__sw?k=$S")
echo "    임시 /__sw 제거 확인: $SW2  (404/000/4xx = 제거됨 ✅)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$CODE" = "403" ]; then
  echo "✅ P0 보안패치 배포 완료 — 위조 결제 차단 작동. 정상결제는 텔레그램 secret_token으로 통과."
else
  echo "⚠️ 위조 POST가 $CODE 반환 — 모피어스에게 이 출력 보여줘."
fi
