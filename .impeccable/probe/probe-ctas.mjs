import { chromium, devices } from '@playwright/test';
import fs from 'node:fs/promises';
const dir = '.impeccable/review/ctas'; await fs.rm(dir, { recursive: true, force: true }); await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch();

// --- Mobile: inline CTAs + prompt
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
await page.addInitScript(() => { window.__ev = []; window.fbq = (...a) => window.__ev.push(a.slice(1)); });
await page.goto('http://localhost:4173/?utm_source=ig', { waitUntil: 'networkidle' });
console.log('hero href   :', await page.locator('#hero-cta').getAttribute('href'));
console.log('inline CTAs :', await page.locator('.inline-cta').count());
await page.locator('[data-inline-cta="after-story"]').scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
await page.screenshot({ path: `${dir}/m-inline.png` });
// scroll to reviews -> prompt should appear
await page.locator('.reviews').scrollIntoViewIfNeeded(); await page.waitForTimeout(1400);
const p = await page.evaluate(() => ({ open: document.querySelector('.prompt')?.classList.contains('is-open'), sticky: document.querySelector('.sticky-cta')?.classList.contains('is-visible'), hasClass: document.documentElement.classList.contains('has-prompt') }));
console.log('prompt open :', JSON.stringify(p));
await page.screenshot({ path: `${dir}/m-prompt.png` });
console.log('prompt cta  :', await page.locator('.prompt-cta').getAttribute('href'));
// Escape closes, and it does not come back
await page.keyboard.press('Escape'); await page.waitForTimeout(500);
console.log('after Esc   :', await page.evaluate(() => document.querySelector('.prompt').classList.contains('is-open')));
await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(400);
await page.locator('.reviews').scrollIntoViewIfNeeded(); await page.waitForTimeout(1200);
console.log('reopened?   :', await page.evaluate(() => document.querySelector('.prompt').classList.contains('is-open')));
console.log('sticky back :', await page.evaluate(() => document.querySelector('.sticky-cta').classList.contains('is-visible')));
// badges point at real stores
await page.locator('#final-cta').scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
console.log('badges      :', JSON.stringify(await page.locator('.store-badge').evaluateAll(a => a.map(x => x.getAttribute('href')))));
await page.screenshot({ path: `${dir}/m-final.png` });
console.log('errors      :', errs.length ? errs : 'none');
await ctx.close();

// --- Desktop: side CTA
const d = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await d.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const dp = await d.newPage();
await dp.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await dp.waitForTimeout(800);
console.log('side at top :', await dp.evaluate(() => document.querySelector('.side-cta')?.classList.contains('is-visible')));
await dp.evaluate(() => scrollTo({ top: 1600, behavior: 'instant' })); await dp.waitForTimeout(900);
console.log('side mid    :', await dp.evaluate(() => document.querySelector('.side-cta')?.classList.contains('is-visible')));
await dp.screenshot({ path: `${dir}/d-side.png` });
await dp.locator('#final-cta').scrollIntoViewIfNeeded(); await dp.waitForTimeout(900);
console.log('side final  :', await dp.evaluate(() => document.querySelector('.side-cta')?.classList.contains('is-visible')));
await dp.screenshot({ path: `${dir}/d-final.png` });
await d.close();
await browser.close();
