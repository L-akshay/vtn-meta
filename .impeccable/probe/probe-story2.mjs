import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.addScriptTag({ content: 'window.__gsapDebug = 1;' });
const geo = await page.evaluate(() => { const r = document.querySelector('.story').getBoundingClientRect(); return { top: r.top + scrollY, height: r.height, vh: innerHeight }; });
await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), geo.top - geo.vh); await page.waitForTimeout(1200);
const read = () => page.evaluate(() => {
  const st = getComputedStyle;
  const cap = [...document.querySelectorAll('.story-caption')].map(c => { const l = c.querySelector('.story-line'); const r = c.getBoundingClientRect(); return { vis: st(c).visibility, x: Math.round(r.x), w: Math.round(r.width), lineT: l ? st(l).transform : 'nolines', html: c.innerHTML.slice(0, 90) }; });
  const w = document.querySelector('.story-raw .sw');
  const cw = document.querySelector('.story-clean .sw');
  return { y: Math.round(scrollY), pinPos: st(document.querySelector('.story-pin')).position, pinTop: Math.round(document.querySelector('.story-pin').getBoundingClientRect().top),
    wave: document.querySelector('.story-wave path').getAttribute('stroke-dasharray'), rawDisplay: st(document.querySelector('.story-raw')).display, w0: { op: st(w).opacity, tr: st(w).transform },
    cleanVis: st(document.querySelector('.story-clean')).visibility, cw0: { op: st(cw).opacity, pos: st(cw).position, tr: st(cw).transform }, sumOp: st(document.querySelector('.story-summary')).opacity, fmt: document.querySelector('.fmt-label').textContent, cap };
});
console.log('at -1vh', JSON.stringify(await read()));
for (const f of [0, 0.1, 0.2, 0.3, 0.45]) {
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), geo.top + (geo.height - geo.vh) * f);
  await page.waitForTimeout(150);
  console.log('f', f, 'immediate', JSON.stringify(await read()));
  await page.waitForTimeout(900);
  console.log('f', f, 'settled ', JSON.stringify(await read()));
}
await browser.close();
