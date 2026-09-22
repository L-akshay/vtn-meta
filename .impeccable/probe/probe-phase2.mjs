import { chromium, devices } from '@playwright/test';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
await page.addInitScript(() => { window.__ev = []; window.fbq = (...a) => window.__ev.push(a.slice(1)); });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
// --- Audio demo
const play = page.locator('.lc-play');
console.log('play button present:', await play.count());
const before = page.url();
await play.click();
await page.waitForTimeout(600);
const mid = await page.evaluate(() => ({ karaoke: document.querySelector('.lc-transcript').classList.contains('is-karaoke'), said: document.querySelectorAll('.lc-word.is-said').length, now: document.querySelector('.lc-word.is-now')?.textContent, status: document.querySelector('.lc-status').textContent, label: document.querySelector('.lc-play span').textContent, chip: getComputedStyle(document.querySelector('.lc-chip')).opacity }));
console.log('during play:', JSON.stringify(mid));
await page.waitForTimeout(3400);
const after = await page.evaluate(() => ({ karaoke: document.querySelector('.lc-transcript').classList.contains('is-karaoke'), said: document.querySelectorAll('.lc-word.is-said').length, status: document.querySelector('.lc-status').textContent, label: document.querySelector('.lc-play span').textContent, chip: getComputedStyle(document.querySelector('.lc-chip')).opacity, ended: document.querySelector('audio').ended }));
console.log('after end:', JSON.stringify(after));
console.log('url unchanged:', page.url() === before);
// tap Play twice -> DemoPlay once
await play.click(); await page.waitForTimeout(300); await play.click(); await page.waitForTimeout(300);
console.log('events:', JSON.stringify(await page.evaluate(() => window.__ev)));
// --- Sticky bar
await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
await page.waitForTimeout(400);
const s1 = await page.evaluate(() => { const b = document.querySelector('.sticky-cta'); return { visible: b.classList.contains('is-visible'), hidden: b.getAttribute('aria-hidden'), inert: b.inert, h: b.getBoundingClientRect().height }; });
console.log('sticky after scroll:', JSON.stringify(s1));
// fast scroll -> bars should rise
for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 260); await page.waitForTimeout(16); }
const bars = await page.evaluate(() => [...document.querySelectorAll('.sb-bar')].map(b => +getComputedStyle(b).transform.match(/matrix\(([^)]+)\)/)[1].split(',')[3]).map(v => v.toFixed(2)));
console.log('sticky bars during fast scroll:', bars.join(' '));
await page.waitForTimeout(900);
const barsRest = await page.evaluate(() => [...document.querySelectorAll('.sb-bar')].map(b => +getComputedStyle(b).transform.match(/matrix\(([^)]+)\)/)[1].split(',')[3]).map(v => v.toFixed(2)));
console.log('sticky bars at rest:', barsRest.join(' '));
await page.locator('#final-cta').scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
console.log('sticky at final:', JSON.stringify(await page.evaluate(() => ({ visible: document.querySelector('.sticky-cta').classList.contains('is-visible') }))));
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(400);
console.log('sticky at top:', JSON.stringify(await page.evaluate(() => ({ visible: document.querySelector('.sticky-cta').classList.contains('is-visible') }))));
console.log('errors:', JSON.stringify(errors));
await browser.close();
