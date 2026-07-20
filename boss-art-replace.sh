#!/bin/bash
# boss-art-replace.sh — ship-craft asset helper (Morpheus)
# For daedalus-conquest boss art fix (final-titan / giant-boss)
#
# Usage:
#   ./boss-art-replace.sh /path/to/new-boss-image.(jpg|png) [final-titan|giant-titan]
#
# - final-titan (default): overwrites art/enemy/final-titan-nukki.jpg + deploy mirror
# - giant-titan: places as giant-titan.png (code support added)
# - Always backs up current. Reversible via backups/.
#
set -euo pipefail

SRC="${1:-}"
KEY="${2:-giant-titan}"

cd "$(dirname "$0")"

if [[ -z "$SRC" || ! -f "$SRC" ]]; then
  echo "❌ Usage: $0 /absolute/path/to/new-image.(jpg|png) [final-titan|giant-titan]"
  echo "   Example: $0 ~/Downloads/boss-new.png giant-titan"
  exit 1
fi

DEST_DIR="art/enemy"
DEPLOY_DIR="deploy/art/enemy"
BACKUP_DIR="backups/art-enemy"
mkdir -p "$BACKUP_DIR" "$DEPLOY_DIR"

TS=$(date +%Y%m%d-%H%M%S)

if [[ "$KEY" == "final-titan" ]]; then
  DEST="$DEST_DIR/final-titan-nukki.jpg"
  DEPLOY_DEST="$DEPLOY_DIR/final-titan-nukki.jpg"
  echo "→ Target: final-titan nukki (preferred, zero code change)"
elif [[ "$KEY" == "giant-titan" ]]; then
  DEST="$DEST_DIR/giant-titan.png"
  DEPLOY_DEST="$DEPLOY_DIR/giant-titan.png"
  echo "→ Target: giant-titan.png (code support added — see plan)"
else
  echo "❌ Unknown key '$KEY'. Use 'final-titan' or 'giant-titan'"
  exit 1
fi

# Backup current if exists
if [[ -f "$DEST" ]]; then
  cp -f "$DEST" "$BACKUP_DIR/$(basename "$DEST" .jpg)-$TS.bak.jpg" 2>/dev/null || cp -f "$DEST" "$BACKUP_DIR/$(basename "$DEST")-$TS.bak"
  echo "✅ Backed up current → $BACKUP_DIR/"
fi

# Copy (preserve user format for giant; force nukki name for final)
echo "📥 Installing $SRC → $DEST"
cp -f "$SRC" "$DEST"

# Mirror to deploy/art (for full static test + prod consistency)
if [[ -f "$DEST" ]]; then
  cp -f "$DEST" "$DEPLOY_DEST" || true
  echo "✅ Mirrored to $DEPLOY_DEST"
fi

echo ""
echo "✅ Boss art replaced."
echo "Next steps (see full test plan):"
echo "  1. Hard refresh browser (⌘⇧R or Ctrl+Shift+R)"
echo "  2. Run local server + force boss (console hack)"
echo "  3. Verify checklist"
if [[ "$KEY" == "giant-titan" ]]; then
  echo "  (giant-titan uses ch>=55 portrait logic — already in game.js/deploy)"
fi
echo "  4. If prod: ./minify.sh && verify.sh"
echo "  Revert: ls $BACKUP_DIR && cp $BACKUP_DIR/... $DEST"
echo "✅ Done. Backups in $BACKUP_DIR/"
echo "Next: cd /Users/imhogyun/daedalus-conquest && python3 -m http.server 8787"
echo "Then in browser: http://localhost:8787  + force: META.chapter=55; META.mode='boss'; saveMeta(); reset(); start();"
