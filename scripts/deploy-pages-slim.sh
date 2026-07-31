#!/usr/bin/env bash
# ONE-DEEP: publish slim site to gh-pages (not full main)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUB=$(mktemp -d)
trap 'rm -rf "$PUB"' EXIT
cd "$ROOT"
for f in index.html game.js style.css i18n.js units.js gear.js lore.js legion-beacon.js sw.js manifest.json; do
  [ -f "$f" ] && cp "$f" "$PUB/"
done
mkdir -p "$PUB/art"
if command -v rsync >/dev/null; then
  rsync -a --exclude='_backup' --exclude='.DS_Store' art/ "$PUB/art/" 2>/dev/null || true
else
  cp -R art/* "$PUB/art/" 2>/dev/null || true
  rm -rf "$PUB/art/_backup" 2>/dev/null || true
fi
touch "$PUB/.nojekyll"
cd "$PUB"
git init -b gh-pages
git config user.email "hosuman08-netizen@users.noreply.github.com"
git config user.name "hosuman08-netizen"
git add -A
git commit -m "deploy: slim pages $(date -u +%Y%m%d-%H%M)"
git remote add origin https://github.com/hosuman08-netizen/daedalus-conquest.git
git push -f origin gh-pages
echo "OK forced gh-pages"
