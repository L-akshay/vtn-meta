import { chromium } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const browser = await chromium.launch();
const dir = '.impeccable/review/visual/widths'; await fs.mkdir(dir, { recursive: true });
const shots = [];
for (const w of [360, 375, 390, 430]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
  const page = await ctx.newPage();
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' }); await page.waitForTimeout(4500);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const file = `${dir}/hero-${w}.png`; await page.screenshot({ path: file }); shots.push({ file, w, overflow });
  await ctx.close();
}
console.log(JSON.stringify(shots.map(s => ({ w: s.w, overflow: s.overflow }))));
const tiles = await Promise.all(shots.map(async (s, n) => ({ input: await sharp(s.file).resize({ height: 800 }).toBuffer(), left: n * 440, top: 0 })));
await sharp({ create: { width: 4 * 440, height: 800, channels: 3, background: '#666' } }).composite(tiles).png().toFile(`${dir}/sheet.png`);
await browser.close();
