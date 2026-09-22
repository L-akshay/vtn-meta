import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.locator('.rail').scrollIntoViewIfNeeded(); await page.waitForTimeout(800);
console.log(JSON.stringify(await page.evaluate(() => {
  const r = s => { const b = document.querySelector(s).getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom), Math.round(b.left), Math.round(b.right)]; };
  const dot = document.querySelectorAll('.rail-dot')[2].getBoundingClientRect();
  const hit = document.elementFromPoint(dot.left + dot.width / 2, dot.top + dot.height / 2);
  return { rail: r('.rail'), card: r('.rail-students'), demo: r('.rail-students .rail-demo'), dots: r('.rail-dots'), dot2: [Math.round(dot.top), Math.round(dot.left)], hit: hit && (hit.className || hit.tagName), railOverflowY: getComputedStyle(document.querySelector('.rail')).overflowY, cardH: document.querySelector('.rail-students').offsetHeight, railH: document.querySelector('.rail').offsetHeight };
})));
await browser.close();
