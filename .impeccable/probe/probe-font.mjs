import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
await page.addInitScript(() => {
  window.__lcp = []; window.__fontsReady = null;
  new PerformanceObserver(list => list.getEntries().forEach(e => window.__lcp.push({ t: Math.round(e.startTime), size: e.size, el: e.element ? e.element.tagName + '.' + (e.element.className?.baseVal ?? e.element.className) : null }))).observe({ type: 'largest-contentful-paint', buffered: true });
  document.fonts.ready.then(() => { window.__fontsReady = Math.round(performance.now()); });
});
await page.goto('http://localhost:4173/', { waitUntil: 'load' });
await page.waitForTimeout(4000);
console.log(JSON.stringify(await page.evaluate(() => ({
  paint: performance.getEntriesByType('paint').map(e => e.name + '=' + Math.round(e.startTime)),
  lcp: window.__lcp, fontsReady: window.__fontsReady,
  resources: performance.getEntriesByType('resource').filter(r => /woff2|\.js$|\.css$/.test(r.name)).map(r => ({ n: r.name.split('/').pop().slice(0, 26), start: Math.round(r.startTime), end: Math.round(r.responseEnd), kb: Math.round(r.transferSize / 1024) })),
})), null, 1));
await browser.close();
