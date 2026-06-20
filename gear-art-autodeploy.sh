#!/usr/bin/env bash
# 장비 아트 자동 감시·배포 — 그록이 i*.png 떨구면 자동 커밋·푸시 (결정적, 멱등)
# 진실원천 = git (커밋 안 된 아트가 있으면 배포). state파일 수동조작에 영향 안 받음(자가교정).
set -uo pipefail
cd "$HOME/daedalus-conquest" || exit 1

# git에 미커밋(untracked/modified)인 장비 아트 감지 — 이게 "미배포분"
PENDING=$(git status --porcelain art/gear/i*.png 2>/dev/null | grep -c .)
TOTAL=$(ls art/gear/i*.png 2>/dev/null | grep -c png)
echo "[$(date '+%H:%M')] 총 ${TOTAL}종 · 미배포(미커밋) ${PENDING}종"
if [ "${PENDING:-0}" -eq 0 ]; then echo "새/미배포 아트 없음 — 종료"; exit 0; fi

# 캐시버스터 bump (오늘 날짜 기준, 글자 +1)
TODAY=$(date +%Y%m%d)
CURV=$(grep -oE "\?v=[0-9]{8}[a-z]" index.html | head -1)
CURDATE=$(echo "$CURV" | grep -oE '[0-9]{8}')
CURLET=$(echo "$CURV" | grep -oE '[a-z]$')
if [ "$CURDATE" = "$TODAY" ]; then
  NEXT=$(printf "\\$(printf '%03o' $(( $(printf '%d' "'$CURLET") + 1 )) )")
else
  NEXT="a"
fi
sed -i '' "s/?v=[0-9]\{8\}[a-z]/?v=${TODAY}${NEXT}/g" index.html

git add art/gear/i*.png index.html
git commit -q -m "art(gear): 장비 개별 아트 ${PENDING}종 자동 배포 (그록 드롭, 총 ${TOTAL}/120)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
if git push origin main 2>&1 | tail -1; then
  echo "$TOTAL" > "$HOME/.grok/state/gear-art-count"   # 참고용 기록(진실원천은 git)
  echo "✅ 총 ${TOTAL}/120종 배포 완료 (v=${TODAY}${NEXT})"
else
  echo "⚠️ 푸시 실패 — 다음 주기 재시도"
fi
