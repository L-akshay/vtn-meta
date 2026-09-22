import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.locator('.lc-play').click();
const rows = [];
for (let i = 0; i < 18; i++) {
  rows.push(await page.evaluate(() => ({ ct: document.querySelector('audio').currentTime.toFixed(2), paused: document.querySelector('audio').paused, said: document.querySelectorAll('.lc-word.is-said').length, now: document.querySelector('.lc-word.is-now')?.textContent ?? '-', words: document.querySelectorAll('.lc-word').length })));
  await page.waitForTimeout(200);
}
console.table(rows);
await browser.close();
