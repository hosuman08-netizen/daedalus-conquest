// 트리니티 전용 — 게임 스크린샷 + 콘솔에러 도구 (Playwright)
// 사용: node .claude/tools/shot.js [url] [outPath]
const { chromium } = require('playwright');
(async () => {
  const url = process.argv[2] || 'http://localhost:8731/index.html';
  const out = process.argv[3] || '/tmp/dae-pw-shot.png';
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 880 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  await page.goto(url, { waitUntil: 'networkidle' }).catch(e => errs.push('GOTO: ' + e.message));
  await page.waitForTimeout(2500);
  await page.screenshot({ path: out });
  console.log('SHOT:', out);
  console.log('CONSOLE_ERRORS:', errs.length ? JSON.stringify(errs, null, 1) : 'none');
  await browser.close();
})();
