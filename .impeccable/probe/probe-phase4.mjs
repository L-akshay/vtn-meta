import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
const url = page.url();
// Languages: greeting cycles while in view
await page.locator('.languages').scrollIntoViewIfNeeded(); await page.waitForTimeout(600);
const g1 = await page.locator('.greeting-word').textContent();
await page.waitForTimeout(2600);
const g2 = await page.locator('.greeting-word').textContent();
await page.waitForTimeout(2600);
const g3 = await page.locator('.greeting-word').textContent();
console.log('greeting cycle:', JSON.stringify([g1, g2, g3]));
// Rail: dots + loops
await page.locator('.rail').scrollIntoViewIfNeeded(); await page.waitForTimeout(1500);
const rail1 = await page.evaluate(() => ({ active: [...document.querySelectorAll('.rail-dot')].findIndex(d => d.classList.contains('is-active')), dash: document.querySelector('.rail-students .rail-wave path').style.strokeDasharray, snap: getComputedStyle(document.querySelector('.rail')).scrollSnapType }));
await page.evaluate(() => document.querySelectorAll('.rail-dot')[2].click()); await page.waitForTimeout(1200);
const rail2 = await page.evaluate(() => ({ active: [...document.querySelectorAll('.rail-dot')].findIndex(d => d.classList.contains('is-active')), scrollLeft: Math.round(document.querySelector('.rail').scrollLeft) }));
console.log('rail:', JSON.stringify({ rail1, rail2 }), 'url unchanged:', page.url() === url);
// Reviews: marquee moving, paused on touch
await page.locator('.reviews').scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
const t1 = await page.evaluate(() => getComputedStyle(document.querySelector('.marquee-track')).transform);
await page.waitForTimeout(500);
const t2 = await page.evaluate(() => getComputedStyle(document.querySelector('.marquee-track')).transform);
const box = await page.locator('.reviews-row').first().boundingBox();
await page.mouse.move(box.x + 100, box.y + 40); await page.mouse.down(); await page.waitForTimeout(100);
const p1 = await page.evaluate(() => ({ cls: document.querySelector('.reviews').classList.contains('is-touching'), state: getComputedStyle(document.querySelector('.marquee-track')).animationPlayState }));
await page.mouse.up();
console.log('marquee moving:', t1 !== t2, 'touch pause:', JSON.stringify(p1), 'url unchanged:', page.url() === url);
// FAQ: open/close, no navigation
await page.locator('.faq').scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
await page.locator('.accordion-trigger').nth(3).click(); await page.waitForTimeout(500);
const faq = await page.evaluate(() => ({ open: document.querySelectorAll('.accordion-item[data-state="open"]').length, text: document.querySelector('.accordion-item[data-state="open"] .accordion-body p')?.textContent.slice(0, 40), op: getComputedStyle(document.querySelector('.accordion-item[data-state="open"] .accordion-body')).opacity }));
console.log('faq:', JSON.stringify(faq), 'url unchanged:', page.url() === url);
// Final CTA: wave draws then flattens
await page.locator('#final-cta').scrollIntoViewIfNeeded(); await page.waitForTimeout(2600);
const d = await page.evaluate(() => document.querySelector('.final-wave path').getAttribute('d'));
console.log('final path flat:', /^M2 12 ?L318 12$/.test(d.replace(/,/g, ' ')) || d.length < 40, d.slice(0, 60));
console.log('sticky at final hidden:', await page.evaluate(() => !document.querySelector('.sticky-cta').classList.contains('is-visible')));
console.log('errors:', JSON.stringify(errors));
await browser.close();
