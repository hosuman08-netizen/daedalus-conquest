#!/usr/bin/env bash
# Production minify/obfuscate prep before deploy.
# Strips comments, dev code (console.log etc), minifies ws for size.
# Focus files: game.js index.html style.css i18n.js + support js.
# Run: ./minify.sh
# Then: ./verify.sh
# Rebuilds deploy/ from source.
# Pure node (no net/terser). For advanced obf install terser later.
set -euo pipefail
cd "$(dirname "$0")"
echo "🚀 Minify prep for deploy..."
node minify.js
echo "✅ Minify done. Check deploy/ contents."
echo "Next: ./verify.sh  (must pass before TG/deploy)"
