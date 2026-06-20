#!/usr/bin/env node
/**
 * Minify script for production deploy prep.
 * Strips comments (dev + block/line), basic ws collapse.
 * Focus: game.js, index.html, style.css, i18n.js
 * Also prepares other JS for deploy/.
 * Outputs to deploy/ dir (overwrites raw copies).
 * Pure node, no external deps. Limitations: no var rename/obf (terser needed for that).
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DEPLOY = path.join(ROOT, 'deploy');

function stripComments(src) {
  let out = '';
  let i = 0;
  const len = src.length;
  let inStr = false;
  let strCh = '';
  let inBlock = false;
  let inLine = false;
  // Preserve leading license / Sovereign header block comment
  let header = '';
  if (src.startsWith('/*')) {
    const end = src.indexOf('*/');
    if (end > 0 && /Sovereign|All Rights|Unauthorized|prohibited/i.test(src.slice(0, end + 2))) {
      header = src.slice(0, end + 2) + '\n';
      i = end + 2;
    }
  }
  while (i < len) {
    const ch = src[i];
    const next = i + 1 < len ? src[i + 1] : '';
    if (inBlock) {
      if (ch === '*' && next === '/') { inBlock = false; i += 2; continue; }
      i++; continue;
    }
    if (inLine) {
      if (ch === '\n') { inLine = false; out += ch; }
      i++; continue;
    }
    if (inStr) {
      out += ch;
      if (ch === strCh && src[i - 1] !== '\\') inStr = false;
      i++; continue;
    }
    if (ch === '/' && next === '*') { inBlock = true; i += 2; continue; }
    if (ch === '/' && next === '/') { inLine = true; i += 2; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strCh = ch; out += ch; i++; continue; }
    out += ch; i++;
  }
  // strip dev console.logs (keep console.warn for security/anti-tamper)
  out = out.replace(/console\.(log|debug|info|trace)\s*\([^;]*\)\s*;?/g, '');
  // basic collapse (safe for readability + size; full minify would need parser)
  out = out
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return header + out;
}

function minifyCSS(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '')
    .replace(/\s*([{};:,>+~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function minifyHTML(src) {
  // remove html comments
  let s = src.replace(/<!--[\s\S]*?-->/g, '');
  // remove any remaining js block/line comments in inline scripts (rough)
  s = s.replace(/\/\*[\s\S]*?\*\//g, '');
  s = s.replace(/^\s*\/\/.*$/gm, '');
  // collapse ws (keep structure)
  s = s.replace(/[ \t]+/g, ' ').replace(/\n\s*/g, '\n').trim();
  // bump or strip cache v for prod (keep simple name)
  s = s.replace(/\?v=[^"']+/g, '');
  return s;
}

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }

function copyAsIs(srcFile, destFile) {
  const c = fs.readFileSync(srcFile, 'utf8');
  fs.writeFileSync(destFile, c);
}

function processJS(name) {
  const src = path.join(ROOT, name);
  const dst = path.join(DEPLOY, name);
  if (!fs.existsSync(src)) { console.warn('SKIP missing', name); return; }
  const c = fs.readFileSync(src, 'utf8');
  const m = stripComments(c);
  fs.writeFileSync(dst, m);
  const pct = Math.round(m.length * 100 / c.length);
  console.log('  JS min:', name, c.length, '->', m.length, '(' + pct + '%)');
}

function processCSS() {
  const src = path.join(ROOT, 'style.css');
  const dst = path.join(DEPLOY, 'style.css');
  const c = fs.readFileSync(src, 'utf8');
  const m = minifyCSS(c);
  fs.writeFileSync(dst, m);
  const pct = Math.round(m.length * 100 / c.length);
  console.log('  CSS min:', 'style.css', c.length, '->', m.length, '(' + pct + '%)');
}

function processHTML() {
  const src = path.join(ROOT, 'index.html');
  const dst = path.join(DEPLOY, 'index.html');
  const c = fs.readFileSync(src, 'utf8');
  const m = minifyHTML(c);
  fs.writeFileSync(dst, m);
  const pct = Math.round(m.length * 100 / c.length);
  console.log('  HTML min:', 'index.html', c.length, '->', m.length, '(' + pct + '%)');
}

function main() {
  console.log('=== Minify/Obfuscate prep (prod-ready, comment+dev strip) ===');
  ensureDir(DEPLOY);
  // Focus 4
  processJS('game.js');
  processJS('i18n.js');
  processCSS();
  processHTML();
  // Support files (no focus minify but strip comments for prod cleanliness)
  ['units.js', 'gear.js', 'lore.js'].forEach(f => processJS(f));
  // copy other deploy assets if exist (workers etc) - minimal
  const others = ['analytics-worker.js', 'pay-worker.js'];
  others.forEach(f => {
    const s = path.join(ROOT, f);
    if (fs.existsSync(s)) copyAsIs(s, path.join(DEPLOY, f));
  });
  // ensure art/gear etc already in deploy from prior
  console.log('Minify complete. deploy/ ready for verify + push.');
  console.log('NOTE: No full obfuscation (no terser). For real obf: npm i -D terser (needs net) + add to scripts.');
}

main();
