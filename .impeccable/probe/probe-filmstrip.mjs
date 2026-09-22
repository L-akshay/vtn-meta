// What does a desktop visitor actually SEE in the first 10s without scrolling?
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const dir = '.impeccable/review/run/filmstrip'; await fs.rm(dir, { recursive: true, force: true }); await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
const shots = [];
for (let i = 0; i < 12; i++) {
  const f = `${dir}/t-${String(i).padStart(2, '0')}.png`;
  await page.screenshot({ path: f, clip: { x: 640, y: 120, width: 620, height: 620 } });
  shots.push(f);
  await page.waitForTimeout(700);
}
// Is the audio demo button present at all?
console.log('play button     :', await page.locator('.lc-play').count());
console.log('audio element   :', await page.locator('.live-card audio').count());
console.log('video elements  :', await page.locator('video').count());
console.log('demo assets     :', JSON.stringify(await page.evaluate(async () => {
  const r = await Promise.all(['/demo/clip.m4a', '/demo/words.json'].map(u => fetch(u).then(x => u + '=' + x.status).catch(() => u + '=ERR')));
  return r;
})));
const meta = await sharp(shots[0]).metadata(); const w = 200, h = Math.round(w * meta.height / meta.width);
const tiles = await Promise.all(shots.map(async (f, n) => ({ input: await sharp(f).resize(w, h).toBuffer(), left: (n % 6) * (w + 4), top: Math.floor(n / 6) * (h + 4) })));
await sharp({ create: { width: 6 * (w + 4), height: 2 * (h + 4), channels: 3, background: '#999' } }).composite(tiles).png().toFile(`${dir}/sheet.png`);
await browser.close();
