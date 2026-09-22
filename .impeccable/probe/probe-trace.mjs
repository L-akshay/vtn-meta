// CDP trace during scroll: where does frame time go? Compares the pinned story with a control region (reviews/FAQ).
import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch({ headless: !process.env.HEADED });
const ctx = await browser.newContext({ ...devices['Pixel 7'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.RATE ?? 4) });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
async function measure(label, startY, distance) {
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), startY); await page.waitForTimeout(800);
  const events = [];
  cdp.on('Tracing.dataCollected', d => events.push(...d.value));
  await cdp.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline', transferMode: 'ReportEvents' });
  const t0 = performance.now();
  let scrolled = 0; while (scrolled < distance) { await page.mouse.wheel(0, 60); scrolled += 60; await page.waitForTimeout(16); }
  const wall = performance.now() - t0;
  await page.waitForTimeout(300);
  await cdp.send('Tracing.end');
  await new Promise(r => cdp.once('Tracing.tracingComplete', r));
  const sum = {};
  for (const e of events) { if (e.ph !== 'X' || !e.dur) continue; sum[e.name] = (sum[e.name] || 0) + e.dur / 1000; }
  const keys = ['FunctionCall', 'TimerFire', 'EventDispatch', 'Layout', 'UpdateLayoutTree', 'Paint', 'PrePaint', 'Layerize', 'Commit', 'HitTest', 'RunTask', 'Animation', 'ScrollLayer'];
  const out = {}; keys.forEach(k => { if (sum[k]) out[k] = +sum[k].toFixed(0); });
  const frames = events.filter(e => e.name === 'DrawFrame' || e.name === 'Screenshot').length;
  console.log(label, 'wall ms', Math.round(wall), JSON.stringify(out), 'top:', Object.entries(sum).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k}=${v.toFixed(0)}`).join(' '));
  cdp.removeAllListeners('Tracing.dataCollected');
}
const geo = await page.evaluate(() => { const r = document.querySelector('.story').getBoundingClientRect(); const c = document.querySelector('.reviews').getBoundingClientRect(); return { top: r.top + scrollY, range: r.height - innerHeight, control: c.top + scrollY - 300 }; });
await measure('story  ', geo.top - 100, geo.range + 200);
await measure('control', geo.control, geo.range + 200);
await browser.close();
