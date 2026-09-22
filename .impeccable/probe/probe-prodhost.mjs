// Serve the built out/ under a production-looking origin to prove the localhost motion default
// does NOT leak to real visitors who have reduced motion enabled.
import { chromium, devices } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.json': 'application/json', '.txt': 'text/plain' };
const browser = await chromium.launch();

for (const [label, reduced] of [['reduced motion', true], ['normal', false]]) {
  const ctx = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium', reducedMotion: reduced ? 'reduce' : 'no-preference' });
  await ctx.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname !== 'get.voicetonotes.example') return route.fulfill({ status: 204, body: '' });
    let file = path.join('out', decodeURIComponent(url.pathname));
    try { if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html'); }
    catch { if (!path.extname(file)) file = path.join(file, 'index.html'); }
    try {
      const body = await fs.readFile(file);
      return route.fulfill({ status: 200, body, headers: { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' } });
    } catch { return route.fulfill({ status: 404, body: 'nf' }); }
  });
  const page = await ctx.newPage();
  await page.goto('https://get.voicetonotes.example/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1400);
  const s = await page.evaluate(() => ({
    host: location.hostname,
    flag: document.documentElement.dataset.motion ?? '(none)',
    veil: getComputedStyle(document.querySelector('.h1-veil')).animationName,
    words: document.querySelectorAll('.lc-word').length,
    staticCaptions: getComputedStyle(document.querySelector('.story-reduced-captions')).display,
  }));
  console.log(label.padEnd(15), JSON.stringify(s));
  await ctx.close();
}
await browser.close();
