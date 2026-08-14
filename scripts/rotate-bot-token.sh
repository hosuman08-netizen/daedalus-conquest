#!/usr/bin/env bash
# 봇 토큰 교체 원샷: 검증 → 워커 secret 갱신 → 웹훅 재설정 → 확인
# 사용법: bash scripts/rotate-bot-token.sh   (토큰은 프롬프트로 입력 — 셸 히스토리/깃에 안 남음)
set -euo pipefail

WORKER_NAME="${WORKER_NAME:-legion-pay}"
CONFIG="${CONFIG:-wrangler-pay.toml}"

printf "봇 토큰 붙여넣기: "
read -rs TOKEN
echo

# 길이 가드 — zsh 치환 노이즈로 토큰이 오염된 과거 사고 방지 (정상 ~46자)
LEN=${#TOKEN}
if [ "$LEN" -lt 40 ] || [ "$LEN" -gt 60 ]; then
  echo "❌ 토큰 길이 이상 (${LEN}자, 정상 ~46자). 복사 다시 확인." >&2
  exit 1
fi

echo "1) getMe 검증..."
ME=$(curl -sf "https://api.telegram.org/bot${TOKEN}/getMe")
echo "$ME" | grep -q '"ok":true' || { echo "❌ 토큰 무효 — BotFather 발급 이력 확인" >&2; exit 1; }
BOT_USER=$(echo "$ME" | sed -n 's/.*"username":"\([^"]*\)".*/\1/p')
echo "   ✅ @${BOT_USER}"

echo "2) 워커 최신버전 deploy (versions 상태면 secret put 거부되는 문제 예방)..."
npx wrangler deploy --config "$CONFIG" 2>&1 | tail -2

echo "3) secret put BOT_TOKEN..."
printf '%s' "$TOKEN" | npx wrangler secret put BOT_TOKEN --name "$WORKER_NAME"

echo "4) 웹훅 재설정..."
WORKER_URL=$(npx wrangler deployments list --name "$WORKER_NAME" 2>/dev/null | grep -o 'https://[^ ]*workers.dev' | head -1 || true)
if [ -z "$WORKER_URL" ]; then
  printf "워커 URL 입력 (https://legion-pay.<계정>.workers.dev): "
  read -r WORKER_URL
fi
curl -sf "https://api.telegram.org/bot${TOKEN}/setWebhook?url=${WORKER_URL}" | grep -q '"ok":true' \
  && echo "   ✅ webhook → ${WORKER_URL}" \
  || { echo "❌ setWebhook 실패" >&2; exit 1; }

echo "5) 웹훅 상태 확인..."
curl -sf "https://api.telegram.org/bot${TOKEN}/getWebhookInfo" | python3 -m json.tool

echo "✅ 완료 — 게임에서 결제 팩 1개 테스트(pre_checkout 승인 확인)까지 해야 진짜 완료."
