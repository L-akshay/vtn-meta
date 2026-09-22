import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
let step = 'load'; const errs = [];
page.on('pageerror', e => errs.push(step + ': ' + e.message.slice(0, 60)));
await page.goto('http://localhost:4173/?utm_source=x', { waitUntil: 'networkidle' }); await page.waitForTimeout(1000);
step = 'widths'; for (const w of [360, 375, 390, 430, 768, 1024, 1440]) { await page.setViewportSize({ width: w, height: 844 }); await page.waitForTimeout(150); }
await page.waitForTimeout(800);
step = 'back-to-mobile'; await page.setViewportSize(devices['iPhone 15'].viewport); await page.waitForTimeout(800);
step = 'route'; await page.goto('http://localhost:4173/students/?utm_source=x', { waitUntil: 'networkidle' }); await page.waitForTimeout(1000);
step = 'scroll-bottom'; await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })); await page.waitForTimeout(1500);
step = 'reduced-reload'; await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
step = 'reduced-scroll'; await page.locator('.story').scrollIntoViewIfNeeded(); await page.waitForTimeout(1000);
step = 'unreduced'; await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(1500);
console.log(JSON.stringify(errs));
await browser.close();
