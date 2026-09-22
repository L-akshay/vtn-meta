import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium', viewport: { width: 390, height: 844 } });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await page.addInitScript(() => {
  window.__lcp = [];
  new PerformanceObserver(list => list.getEntries().forEach(e => window.__lcp.push({ t: Math.round(e.startTime), size: e.size, el: e.element ? (e.element.tagName + '.' + (e.element.className?.baseVal ?? e.element.className) + ' [' + (e.element.textContent || '').slice(0, 20) + ']') : null }))).observe({ type: 'largest-contentful-paint', buffered: true });
});
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);
console.log(JSON.stringify(await page.evaluate(() => window.__lcp), null, 1));
await browser.close();
