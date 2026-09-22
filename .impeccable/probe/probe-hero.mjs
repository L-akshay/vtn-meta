import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
const t0 = Date.now();
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
const rows = [];
for (let i = 0; i < 44; i++) {
  const r = await page.evaluate(() => {
    const q = s => document.querySelector(s);
    const st = getComputedStyle;
    const words = [...document.querySelectorAll('.lc-word')];
    const bar = q('.lc-bar:nth-child(12)');
    const m = bar && st(bar).transform.match(/matrix\(([^)]+)\)/);
    return {
      h1mask: q('.h1-text') ? st(q('.h1-text')).maskPosition || st(q('.h1-text')).webkitMaskPosition : null,
      cursorOp: q('.h1-cursor') ? st(q('.h1-cursor')).opacity : null,
      status: q('.lc-status')?.textContent,
      chip: q('.lc-chip') ? st(q('.lc-chip')).opacity : null,
      words: words.length, w0: words[0] ? st(words[0]).opacity : null, wLast: words.at(-1) ? st(words.at(-1)).opacity : null,
      bar12: m ? (+m[1].split(',')[3]).toFixed(2) : null,
      glow: q('.lc-glow') ? st(q('.lc-glow')).opacity : null,
    };
  });
  rows.push({ t: ((Date.now() - t0) / 1000).toFixed(2), ...r });
  await page.waitForTimeout(250);
}
console.table(rows);
await browser.close();
