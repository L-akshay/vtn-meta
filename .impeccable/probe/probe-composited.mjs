import { chromium, devices } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const dir = '.impeccable/review/polish/composited'; await fs.rm(dir, { recursive: true, force: true }); await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'commit' });
// Kick off a 400ms main-thread block from inside the page, without awaiting it.
page.evaluate(() => { const end = performance.now() + 400; while (performance.now() < end) Math.sqrt(Math.random()); }).catch(() => {});
const clip = { x: 0, y: 150, width: 393, height: 300 };
const shots = [];
for (let i = 0; i < 4; i++) { const f = `${dir}/s${i}.png`; await page.screenshot({ path: f, clip }); shots.push(f); }
const bufs = [];
for (const f of shots) bufs.push(await sharp(f).greyscale().raw().toBuffer());
let moved = 0;
for (let i = 1; i < bufs.length; i++) { let d = 0; for (let p = 0; p < bufs[0].length; p++) if (Math.abs(bufs[i - 1][p] - bufs[i][p]) > 10) d++; console.log('frame', i, 'changed px', d); if (d > 300) moved++; }
console.log(moved > 0 ? 'HEADLINE ADVANCED WHILE MAIN THREAD BLOCKED -> compositor driven' : 'no movement detected');
const meta = await sharp(shots[0]).metadata(); const w = 260, h = Math.round(w * meta.height / meta.width);
await sharp({ create: { width: 4 * (w + 4), height: h, channels: 3, background: '#999' } })
  .composite(await Promise.all(shots.map(async (f, n) => ({ input: await sharp(f).resize(w, h).toBuffer(), left: n * (w + 4), top: 0 }))))
  .png().toFile(`${dir}/sheet.png`);
await browser.close();
