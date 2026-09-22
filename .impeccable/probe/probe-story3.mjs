// Drive the master timeline directly (no scroll) to check that beat states render correctly at each progress.
import { chromium, devices } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
const geo = await page.evaluate(() => { const r = document.querySelector('.story').getBoundingClientRect(); return { top: r.top + scrollY, height: r.height, vh: innerHeight }; });
await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), geo.top); await page.waitForTimeout(1500);
const dir = '.impeccable/review/visual/story-probe3'; await fs.rm(dir, { recursive: true, force: true }); await fs.mkdir(dir, { recursive: true });
const ps = [0.05, 0.16, 0.25, 0.35, 0.45, 0.55, 0.62, 0.7, 0.77, 0.9, 1];
const shots = []; const rows = [];
for (const p of ps) {
  const r = await page.evaluate(p => { const m = window.__story.master; m.progress(p); const st = getComputedStyle; const w = document.querySelector('.story-raw .sw'); return { p, t: +m.time().toFixed(2), w0: st(w).opacity + ' ' + st(w).transform, raw: st(document.querySelector('.story-raw')).display, clean: st(document.querySelector('.story-clean')).visibility, sum: st(document.querySelector('.story-summary')).opacity, fmt: document.querySelector('.fmt-label').textContent, dash: document.querySelector('.story-wave path').style.strokeDasharray }; }, p);
  rows.push(r);
  await page.waitForTimeout(120);
  const file = `${dir}/p-${p}.png`; await page.screenshot({ path: file }); shots.push(file);
}
console.table(rows);
const meta = await sharp(shots[0]).metadata(); const w = 180, h = Math.round(w * meta.height / meta.width);
const tiles = await Promise.all(shots.map(async (f, n) => ({ input: await sharp(f).resize(w, h).toBuffer(), left: (n % 6) * (w + 6), top: Math.floor(n / 6) * (h + 6) })));
await sharp({ create: { width: 6 * (w + 6), height: 2 * (h + 6), channels: 3, background: '#666' } }).composite(tiles).png().toFile(`${dir}/sheet.png`);
await browser.close();
