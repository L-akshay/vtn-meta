import { chromium, devices } from '@playwright/test';
import fs from 'node:fs/promises';
const dir = '.impeccable/review/polish'; await fs.rm(dir, { recursive: true, force: true }); await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const shot = async (page, name, sel) => { const el = sel ? page.locator(sel) : null; if (el) await el.scrollIntoViewIfNeeded(); await page.waitForTimeout(900); await page.screenshot({ path: `${dir}/${name}.png` }); };
// mobile
{
  const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
  await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200); await shot(page, 'm1-hero');
  await shot(page, 'm2-rail', '.rail-section');
  await shot(page, 'm3-final', '#final-cta');
  // story final beat
  const geo = await page.evaluate(() => { const r = document.querySelector('.story').getBoundingClientRect(); return { top: r.top + scrollY, range: r.height - innerHeight }; });
  await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), geo.top + geo.range * 0.97);
  await page.waitForTimeout(1600); await page.screenshot({ path: `${dir}/m4-story-end.png` });
  console.log('mobile errors:', errs.length ? errs : 'none');
  await ctx.close();
}
// desktop
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
  const page = await ctx.newPage();
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200); await shot(page, 'd1-hero');
  await shot(page, 'd2-rail', '.rail-section');
  await shot(page, 'd3-final', '#final-cta');
  console.log('rail columns:', await page.evaluate(() => getComputedStyle(document.querySelector('.rail-grid')).gridTemplateColumns));
  console.log('wave animation:', await page.evaluate(() => getComputedStyle(document.querySelector('.rail-wave-flow')).animationName));
  await ctx.close();
}
await browser.close();
