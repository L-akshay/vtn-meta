import { chromium, devices } from '@playwright/test';
import fs from 'node:fs/promises';
const dir = '.impeccable/review/run'; await fs.rm(dir, { recursive: true, force: true }); await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
page.on('requestfailed', r => { if (!/clarity|facebook/.test(r.url())) errors.push('failed: ' + r.url()); });

await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3200);                       // hero sequence settles
await page.screenshot({ path: `${dir}/1-hero.png` });
console.log('hero CTA      :', JSON.stringify(await page.locator('#hero-cta').textContent()));
console.log('CTA href      :', (await page.locator('#hero-cta').getAttribute('href')));
console.log('transcript    :', JSON.stringify((await page.locator('.lc-transcript').textContent()).slice(0, 48)));

// Drive the story to a middle beat.
const geo = await page.evaluate(() => { const r = document.querySelector('.story').getBoundingClientRect(); return { top: r.top + scrollY, range: r.height - innerHeight }; });
await page.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), geo.top + geo.range * 0.55);
await page.waitForTimeout(1400);
await page.screenshot({ path: `${dir}/2-story.png` });
console.log('story caption :', JSON.stringify((await page.locator('.story-caption').allTextContents()).join(' / ')));

// Tap a rail dot, then open a FAQ item — neither may navigate.
const before = page.url();
await page.locator('.rail').scrollIntoViewIfNeeded(); await page.waitForTimeout(900);
await page.evaluate(() => document.querySelectorAll('.rail-dot')[2].click()); await page.waitForTimeout(900);
await page.screenshot({ path: `${dir}/3-rail.png` });
await page.locator('.faq').scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
await page.locator('.accordion-trigger').nth(3).click(); await page.waitForTimeout(600);
await page.screenshot({ path: `${dir}/4-faq.png` });
console.log('faq answer    :', JSON.stringify((await page.locator('.accordion-item[data-state="open"] .accordion-body p').textContent()).slice(0, 52)));
console.log('stayed on page:', page.url() === before);

await page.locator('#final-cta').scrollIntoViewIfNeeded(); await page.waitForTimeout(2400);
await page.screenshot({ path: `${dir}/5-final.png` });
console.log('errors        :', errors.length ? errors : 'none');
await browser.close();
