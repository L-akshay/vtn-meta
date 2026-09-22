import { chromium, devices } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const dir = '.impeccable/review/polish/storyend'; await fs.rm(dir, { recursive: true, force: true }); await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
const geo = await page.evaluate(() => { const r = document.querySelector('.story').getBoundingClientRect(); return { top: r.top + scrollY, range: r.height - innerHeight }; });
const fr = [0.55, 0.7, 0.8, 0.88, 0.94, 1];
const shots = [];
for (const f of fr) {
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), geo.top + geo.range * f);
  await page.waitForTimeout(1400);
  const file = `${dir}/p-${f}.png`; await page.screenshot({ path: file }); shots.push(file);
  const s = await page.evaluate(() => ({ pinTop: Math.round(document.querySelector('.story-pin').getBoundingClientRect().top), cardTop: Math.round(document.querySelector('.story-card').getBoundingClientRect().top), fmt: document.querySelector('.fmt-label').textContent }));
  console.log('f', f, JSON.stringify(s));
}
const meta = await sharp(shots[0]).metadata(); const w = 190, h = Math.round(w * meta.height / meta.width);
const tiles = await Promise.all(shots.map(async (f, n) => ({ input: await sharp(f).resize(w, h).toBuffer(), left: n * (w + 5), top: 0 })));
await sharp({ create: { width: fr.length * (w + 5), height: h, channels: 3, background: '#777' } }).composite(tiles).png().toFile(`${dir}/sheet.png`);
await browser.close();
