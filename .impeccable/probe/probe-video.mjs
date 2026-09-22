// Record what a desktop visitor sees: load, then a slow scroll through the story.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const dir = '.impeccable/review/run/video'; await fs.rm(dir, { recursive: true, force: true }); await fs.mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir, size: { width: 1280, height: 800 } } });
await ctx.route(/clarity\.ms|facebook/, r => r.fulfill({ status: 200, body: '' }));
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(9000);                    // the hero card's two passes
await page.mouse.move(640, 400);
for (let i = 0; i < 90; i++) { await page.mouse.wheel(0, 60); await page.waitForTimeout(45); }  // slow scroll through story
await page.waitForTimeout(1500);
await page.close(); await ctx.close();
const f = (await fs.readdir(dir)).find(x => x.endsWith('.webm'));
console.log('video:', dir + '/' + f, (await fs.stat(dir + '/' + f)).size + ' bytes');
await browser.close();
