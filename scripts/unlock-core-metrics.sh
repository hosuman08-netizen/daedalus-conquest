#!/usr/bin/env bash
# 코어 숫자 잠금 해제 — analytics 워커에 STATS_SECRET 을 심고 실제 수치를 읽어온다.
#
# 왜 필요한가 (2026-08-14 Morpheus 실측):
#   GET https://legion-analytics.hoyashi95.workers.dev/stats
#   → {"ok":false,"reason":"stats-auth-not-configured"}
#   readAuth() 가 fail-closed 라서 STATS_SECRET 이 없으면 401 이전에 503 으로 막힌다.
#   이벤트는 /ev 로 계속 쌓이는데 **읽을 방법이 없다.**
#   CEO-NOW P0 #5 "코어 숫자 1줄"이 안 나오던 물리적 원인이 이것이다.
#   (fail-closed 자체는 옳다 — 과거 fail-open 이라 무인증 덤프가 열려 있었다. 키를 심는 게 답이지 게이트를 여는 게 아니다.)
#
# 사용법: bash scripts/unlock-core-metrics.sh
# 안전: 시크릿은 레포에 안 남는다. ~/.legion/stats_secret (chmod 600) 에만 저장.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
SECRET_FILE="$HOME/.legion/stats_secret"
WORKER_URL="https://legion-analytics.hoyashi95.workers.dev"
CONFIG="wrangler-analytics.toml"

# ── 1) 시크릿 확보 (있으면 재사용, 없으면 생성)
mkdir -p "$HOME/.legion"
if [ -s "$SECRET_FILE" ]; then
  echo "1) 기존 시크릿 재사용: $SECRET_FILE"
else
  openssl rand -hex 32 > "$SECRET_FILE"
  echo "1) 새 시크릿 생성 → $SECRET_FILE"
fi
chmod 600 "$SECRET_FILE"
SECRET="$(cat "$SECRET_FILE")"

# 길이 가드 — zsh 치환 오염으로 토큰이 늘어난 과거 사고(7/9 결제 401) 재발 방지
LEN=${#SECRET}
[ "$LEN" -eq 64 ] || { echo "❌ 시크릿 길이 이상 (${LEN}자, 정상 64자)" >&2; exit 1; }

# ── 2) 워커에 심기
echo "2) wrangler secret put STATS_SECRET ..."
printf '%s' "$SECRET" | npx --yes wrangler secret put STATS_SECRET -c "$CONFIG"

# ── 3) 실제로 읽히는지 확인 (가정 말고 측정)
echo "3) /stats 조회 검증 ..."
sleep 3
RESP="$(curl -sS --max-time 20 -H "X-Stats-Secret: $SECRET" "$WORKER_URL/stats?app=daedalus-conquest")"
echo "$RESP" | head -c 1200
echo

case "$RESP" in
  *stats-auth-not-configured*) echo "❌ 아직 미반영 — 30초 뒤 재시도(전파 지연)" >&2; exit 1 ;;
  *'"reason":"stats-auth"'*)   echo "❌ 시크릿 불일치 — 워커에 심긴 값과 로컬 값이 다르다" >&2; exit 1 ;;
  *kv-not-set*)                echo "❌ EVENTS KV 미바인딩 — $CONFIG 확인" >&2; exit 1 ;;
esac

# ── 4) 코어 1줄 (neo 보고용)
INSTALL=$(echo "$RESP" | sed -n 's/.*"install":\([0-9]*\).*/\1/p')
PURCH=$(echo "$RESP"  | sed -n 's/.*"purchase":\([0-9]*\).*/\1/p')
echo "──────────────"
echo "🟢 코어 1줄: p1 오늘 install=${INSTALL:-?} · purchase=${PURCH:-?}"
echo "   (0 이면 그게 답이다 — 병목은 기능이 아니라 유입.)"
echo "   전체 원본은 위 JSON. 시크릿: $SECRET_FILE"
