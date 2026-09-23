import { chromium, devices } from '@playwright/test';
import sharp from 'sharp';
import fs from 'node:fs/promises';
const dir = '.impeccable/review/wave/live'; await fs.rm(dir, { recursive: true, force: true }); await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const shotOf = async (sel, name) => {
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(900);
  await el.screenshot({ path: `${dir}/${name}.png` });
  const n = await el.locator('rect').count();
  console.log(name.padEnd(12), 'bars:', n);
};
await shotOf('.rail-students .rail-wave', 'rail');
await shotOf('.inline-cta-wave', 'inline');
await shotOf('.final-wave', 'final');

// Story: mid beat a, so the bars are part-filled
const geo = await page.evaluate(() => { const r = document.querySelector('.story').getBoundingClientRect(); return { top: r.top + scrollY, range: r.height - innerHeight }; });
for (const f of [0.04, 0.12]) {
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), geo.top + geo.range * f);
  await page.waitForTimeout(1500);
  await page.locator('.story-wave').screenshot({ path: `${dir}/story-${f}.png` });
}
console.log('story bars :', await page.locator('.story-wave rect').count());
console.log('errors     :', errs.length ? errs : 'none');

const files = ['rail', 'inline', 'final', 'story-0.04', 'story-0.12'];
const comp = []; let top = 0;
for (const f of files) {
  const buf = await sharp(`${dir}/${f}.png`).resize({ width: 760, kernel: 'nearest' }).toBuffer();
  const m = await sharp(buf).metadata();
  comp.push({ input: buf, left: 0, top }); top += m.height + 14;
}
await sharp({ create: { width: 760, height: top, channels: 3, background: '#d8d8de' } }).composite(comp).png().toFile(`${dir}/all.png`);
await browser.close();
