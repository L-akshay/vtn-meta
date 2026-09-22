import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo({ top: 1200, behavior: 'instant' })); await page.waitForTimeout(500);
const read = () => page.evaluate(() => [...document.querySelectorAll('.sb-bar')].map(b => +getComputedStyle(b).transform.match(/matrix\(([^)]+)\)/)[1].split(',')[3]).map(v => v.toFixed(2)).join(' '));
console.log('rest before:', await read());
for (let i = 0; i < 4; i++) { await page.mouse.wheel(0, 200); await page.waitForTimeout(16); }
console.log("scrollY", await page.evaluate(() => scrollY), "sticky visible", await page.evaluate(() => document.querySelector(".sticky-cta").classList.contains("is-visible")));
console.log('during:', await read());
await page.waitForTimeout(150); console.log('+150ms:', await read());
await page.waitForTimeout(500); console.log('+650ms:', await read());
await page.waitForTimeout(800); console.log('+1450ms:', await read());
await browser.close();
