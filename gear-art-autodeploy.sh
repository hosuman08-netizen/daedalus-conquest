#!/usr/bin/env bash
# 장비 아트 자동 감시·배포 — 그록이 i*.png 떨구면 자동 커밋·푸시 (결정적, 멱등)
set -uo pipefail
cd "$HOME/daedalus-conquest" || exit 1
STATE="$HOME/.grok/state/gear-art-count"
mkdir -p "$(dirname "$STATE")"
LAST=$(cat "$STATE" 2>/dev/null || echo 0)
NOW=$(ls art/gear/i*.png 2>/dev/null | grep -c png)
echo "[$(date '+%H:%M')] 이전 ${LAST}종 → 현재 ${NOW}종"
if [ "$NOW" -le "$LAST" ]; then echo "새 아트 없음 — 종료"; exit 0; fi
# 새 아트 발견 → 캐시버스터 bump + 커밋 + 푸시
CUR=$(grep -oE '\?v=20260619[a-z]' index.html | head -1 | grep -oE '[a-z]$')
NEXT=$(printf "\\$(printf '%03o' $(( $(printf '%d' "'$CUR") + 1 )) )")
sed -i '' "s/?v=20260619${CUR}/?v=20260619${NEXT}/g" index.html
git add art/gear/i*.png index.html
git commit -q -m "art(gear): 장비 개별 아트 ${LAST}→${NOW}종 자동 배포 (그록 드롭)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
if git push origin main 2>&1 | tail -1; then
  echo "$NOW" > "$STATE"
  echo "✅ ${NOW}종까지 배포 완료 (v=20260619${NEXT})"
else
  echo "⚠️ 푸시 실패 — 다음 주기 재시도"
fi
