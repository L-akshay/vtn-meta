// Mid-range Android proxy: 4x CPU throttle, scroll through the story with wheel steps, record long tasks and frame times.
import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch({ headless: !process.env.HEADED, args: process.env.HEADED ? [] : ['--enable-gpu'] });
const ctx = await browser.newContext({ ...devices['Pixel 7'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.RATE ?? 4) });
await page.addInitScript(() => {
  window.__long = []; window.__frames = [];
  new PerformanceObserver(list => list.getEntries().forEach(e => window.__long.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) }))).observe({ type: 'longtask', buffered: true });
  let last = performance.now(); const tick = t => { window.__frames.push(t - last); last = t; requestAnimationFrame(tick); }; requestAnimationFrame(tick);
});
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const geo = await page.evaluate(() => { const r = document.querySelector('.story').getBoundingClientRect(); return { top: r.top + scrollY, height: r.height, vh: innerHeight }; });
await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), geo.top - 200); await page.waitForTimeout(800);
await page.evaluate(() => { window.__long.length = 0; window.__frames.length = 0; });
const t0 = Date.now();
const total = geo.height - geo.vh + 400; let scrolled = 0;
while (scrolled < total) { await page.mouse.wheel(0, 60); scrolled += 60; await page.waitForTimeout(16); }
await page.waitForTimeout(600);
const stats = await page.evaluate(() => {
  const f = window.__frames.filter(d => d > 0 && d < 1000); const avg = f.reduce((a, b) => a + b, 0) / f.length;
  const sorted = [...f].sort((a, b) => a - b); const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const slow = f.filter(d => d > 33).length;
  return { frames: f.length, avgMs: +avg.toFixed(1), fps: +(1000 / avg).toFixed(1), p95Ms: +p95.toFixed(1), framesOver33ms: slow, longTasks: window.__long, longOver50: window.__long.filter(t => t.dur > 50).length };
});
console.log('scroll duration ms', Date.now() - t0);
console.log(JSON.stringify(stats, null, 1));
await browser.close();
