// Use the machine's real Chrome (not Playwright's Chromium) to see what it reports.
import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--window-size=1280,900'] });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 820 } });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
console.log('chrome version :', await page.evaluate(() => navigator.userAgent.match(/Chrome\/[\d.]+/)[0]));
console.log('reduced-motion :', await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches));
const samples = [];
for (let i = 0; i < 10; i++) { samples.push(await page.evaluate(() => getComputedStyle(document.querySelector('.lc-bar:nth-child(12)')).transform)); await page.waitForTimeout(220); }
console.log('waveform       :', new Set(samples).size > 2 ? 'MOVING (' + new Set(samples).size + ' distinct)' : 'STATIC -> ' + samples[0]);
console.log('lc-word count  :', await page.locator('.lc-word').count());
await browser.close();
