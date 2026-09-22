// Sample the flowing waveform across a full loop and check it always spans the card.
import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.locator('.rail-meetings').scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
console.log('is-live:', await page.evaluate(() => document.querySelector('.rail-section').classList.contains('is-live')));
console.log('animation:', await page.evaluate(() => getComputedStyle(document.querySelector('.rail-wave-flow')).animationName));
const seen = new Set();
for (let i = 0; i < 10; i++) { seen.add(await page.evaluate(() => getComputedStyle(document.querySelector('.rail-wave-flow')).transform)); await page.waitForTimeout(250); }
console.log('distinct transforms over 2.5s:', seen.size, seen.size > 3 ? 'FLOWING' : 'STUCK');
// the drawn path must always reach both edges of its svg
const cover = await page.evaluate(() => {
  const svg = document.querySelector('.rail-meetings .rail-wave.is-b');
  const g = svg.querySelector('g');
  const sb = svg.getBoundingClientRect(), gb = g.getBoundingClientRect();
  return { svgLeft: Math.round(sb.left), svgRight: Math.round(sb.right), gLeft: Math.round(gb.left), gRight: Math.round(gb.right) };
});
console.log('coverage:', JSON.stringify(cover), cover.gLeft <= cover.svgLeft && cover.gRight >= cover.svgRight ? 'SPANS FULL WIDTH' : 'GAP AT EDGE');
await browser.close();
