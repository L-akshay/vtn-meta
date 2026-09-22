import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.addInitScript(() => {
  window.__ls = [];
  new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput && e.value > 0.02) window.__ls.push({ t: Math.round(e.startTime), v: +e.value.toFixed(3), y: Math.round(scrollY), src: e.sources.map(s => { const n = s.node; return (n && (n.className?.baseVal ?? n.className) || n?.nodeName || '?') + ' ' + JSON.stringify([s.previousRect.y, s.currentRect.y]); }).slice(0, 3) }); })).observe({ type: 'layout-shift', buffered: true });
});
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const vh = await page.evaluate(() => innerHeight);
for (let i = 1; i < 36; i++) { await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), i * vh * 0.25); await page.waitForTimeout(400); }
console.log(JSON.stringify(await page.evaluate(() => window.__ls), null, 0));
await browser.close();
