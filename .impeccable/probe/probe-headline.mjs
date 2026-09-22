// Frame intervals during the headline reveal, with CPU throttling to expose jank.
import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
for (const rate of [1, 4]) {
  const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
  await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await page.addInitScript(() => {
    window.__f = []; let last = performance.now();
    const tick = t => { window.__f.push(t - last); last = t; if (t < 3000) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3200);
  const s = await page.evaluate(() => {
    const f = window.__f.filter(d => d > 0 && d < 500).slice(2);
    const sorted = [...f].sort((a, b) => a - b);
    return { frames: f.length, avg: +(f.reduce((a, b) => a + b, 0) / f.length).toFixed(1), p95: +sorted[Math.floor(sorted.length * .95)].toFixed(1), over33: f.filter(d => d > 33).length };
  });
  console.log('CPU x' + rate, JSON.stringify(s), 'fps ~' + (1000 / s.avg).toFixed(0));
  await ctx.close();
}
await browser.close();
