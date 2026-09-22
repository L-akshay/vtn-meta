import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const dir = '.impeccable/review/visual/desktop'; await fs.mkdir(dir, { recursive: true });
await page.screenshot({ path: `${dir}/hero.png` });
const geo = await page.evaluate(() => { const r = document.querySelector('.story').getBoundingClientRect(); return { top: r.top + scrollY, height: r.height, vh: innerHeight }; });
for (const f of [0.35, 0.62]) { await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), geo.top + (geo.height - geo.vh) * f); await page.waitForTimeout(1200); await page.screenshot({ path: `${dir}/story-${f}.png` }); }
await browser.close();
