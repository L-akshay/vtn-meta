// Instrument the DESKTOP path (pointer: fine -> Lenis loads). Log each boundary:
// tier resolved? lenis loaded? ScrollTrigger updating? hero card animating? story timeline progressing?
import { chromium } from '@playwright/test';
const browser = await chromium.launch({ headless: !process.env.HEADED });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', e => errs.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
const chunks = [];
page.on('response', r => { if (/_next\/static\/chunks\/\d/.test(r.url())) chunks.push(r.url().split('/').pop()); });

await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

// --- Boundary 1: environment as the browser sees it
console.log('env        :', JSON.stringify(await page.evaluate(() => ({
  pointerFine: matchMedia('(pointer: fine)').matches,
  reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
  deviceMemory: navigator.deviceMemory, cores: navigator.hardwareConcurrency,
  saveData: navigator.connection?.saveData,
}))));

// --- Boundary 2: hero card actually moving? sample the bar transform over 2s
const sample = async (sel, prop) => page.evaluate(([s, p]) => {
  const el = document.querySelector(s); if (!el) return 'MISSING ' + s;
  return p === 'opacity' ? getComputedStyle(el).opacity : getComputedStyle(el).transform;
}, [sel, prop]);
const bars = [];
for (let i = 0; i < 8; i++) { bars.push(await sample('.lc-bar:nth-child(12)', 'transform')); await page.waitForTimeout(250); }
console.log('hero bars  :', new Set(bars).size > 1 ? 'MOVING (' + new Set(bars).size + ' distinct)' : 'STATIC -> ' + bars[0]);
const words = [];
for (let i = 0; i < 6; i++) { words.push(await sample('.lc-word', 'opacity')); await page.waitForTimeout(400); }
console.log('hero words :', new Set(words).size > 1 ? 'ANIMATING' : 'STATIC at opacity ' + words[0]);

// --- Boundary 3: did Lenis load, and is scroll working at all?
await page.waitForTimeout(500);
console.log('lenis chunk:', chunks.some(c => /691/.test(c)) ? 'loaded' : 'NOT loaded', '| chunks:', chunks.join(','));
const geo = await page.evaluate(() => { const r = document.querySelector('.story').getBoundingClientRect(); return { top: Math.round(r.top + scrollY), h: Math.round(r.height), vh: innerHeight }; });
console.log('story geo  :', JSON.stringify(geo));

// --- Boundary 4: wheel-scroll into the story, watch caption + pin + card content change
await page.mouse.move(640, 400);
let last = '';
for (let i = 0; i < 40; i++) {
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(60);
  const state = await page.evaluate(() => ({
    y: Math.round(scrollY),
    pin: getComputedStyle(document.querySelector('.story-pin')).position,
    pinTop: Math.round(document.querySelector('.story-pin').getBoundingClientRect().top),
    cap: [...document.querySelectorAll('.story-caption')].map(c => Math.round(c.querySelector('.story-line')?.getBoundingClientRect().top ?? -999)).join(','),
    dash: document.querySelector('.story-wave path')?.style.strokeDasharray?.slice(0, 18) || 'none',
    raw: getComputedStyle(document.querySelector('.story-raw')).display,
  }));
  const key = JSON.stringify(state);
  if (i % 8 === 0 || key !== last) { console.log('  scroll', String(i).padStart(2), key); last = key; }
}
console.log('errors     :', errs.length ? errs : 'none');
await page.screenshot({ path: '.impeccable/review/run/desktop-story.png' });
await browser.close();
