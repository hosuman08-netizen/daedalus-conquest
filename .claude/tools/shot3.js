const { chromium } = require('playwright');
const app = process.argv[2];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  const base = { saju:'http://localhost:8820', tarot:'http://localhost:8821', meme:'http://localhost:8822' }[app];
  await page.goto(base + '/index.html', { waitUntil: 'networkidle' }).catch(e => errs.push('GOTO '+e.message));
  await page.waitForTimeout(1500);
  const out = '/tmp/shot-' + app + '-';
  if (app === 'saju') {
    await page.click('button.primary-cta.wide').catch(e=>errs.push('gen '+e.message));
    await page.waitForTimeout(1800);
    await page.screenshot({ path: out+'chart.png', fullPage:true });
  } else if (app === 'tarot') {
    await page.screenshot({ path: out+'home.png', fullPage:true });
    // try to draw a reading
    const btn = await page.$('button');
    if (btn) { await btn.click().catch(()=>{}); await page.waitForTimeout(1500); }
    await page.screenshot({ path: out+'spread.png', fullPage:true });
  } else {
    await page.screenshot({ path: out+'board.png', fullPage:true });
  }
  console.log('ERRORS:', errs.length ? JSON.stringify(errs) : 'none');
  await browser.close();
})();
