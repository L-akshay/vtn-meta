// Scrub the story forward then backward to the same positions; compose a two-row sheet to compare.
import { chromium, devices } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
if (process.env.LITE) await page.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 4 }); });
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(() => { window.__ev = []; window.fbq = (...a) => window.__ev.push(a.slice(1)); });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
const { top, height, vh } = await page.evaluate(() => { const s = document.querySelector('.story'); const r = s.getBoundingClientRect(); return { top: r.top + scrollY, height: r.height, vh: innerHeight }; });
const range = height - vh;
await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top - vh); await page.waitForTimeout(1200); // preload plugins
const fr = [0.02, 0.17, 0.33, 0.5, 0.66, 0.82, 0.99];
const dir = '.impeccable/review/visual/story-probe' + (process.env.LITE ? '-lite' : ''); await fs.rm(dir, { recursive: true, force: true }); await fs.mkdir(dir, { recursive: true });
const shots = [];
for (const [pass, list] of [['fwd', fr], ['back', [...fr].reverse()]]) {
  for (const f of list) {
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top + range * f);
    await page.waitForTimeout(900);
    const file = `${dir}/${pass}-${f}.png`; await page.screenshot({ path: file }); shots.push({ pass, f, file });
  }
}
const info = await page.evaluate(() => ({ pinned: getComputedStyle(document.querySelector('.story-pin')).position, events: window.__ev.filter(e => e[0] === 'StoryBeat').map(e => e[1].beat) }));
console.log(JSON.stringify({ top, height, vh, info, errors }));
const meta = await sharp(shots[0].file).metadata(); const w = 200, h = Math.round(w * meta.height / meta.width);
const tiles = await Promise.all(shots.map(async (s, n) => ({ input: await sharp(s.file).resize(w, h).toBuffer(), left: (n % fr.length) * (w + 6), top: Math.floor(n / fr.length) * (h + 6) })));
await sharp({ create: { width: fr.length * (w + 6), height: 2 * (h + 6), channels: 3, background: '#666' } }).composite(tiles).png().toFile(`${dir}/sheet.png`);
await browser.close();
