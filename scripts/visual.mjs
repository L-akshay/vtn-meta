// Phase check: scroll the page in 25svh steps on "iPhone 15" and "Pixel 7", record video, screenshot each step, build a contact sheet.
// Usage: node scripts/visual.mjs --phase 1 [--url http://localhost:4173/] [--route /] [--reduced]
import { chromium, devices } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const arg = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? (process.argv[i + 1] ?? true) : fallback; };
const phase = arg('phase', '0');
const base = arg('url', 'http://localhost:4173');
const route = arg('route', '/');
const reduced = process.argv.includes('--reduced');
const outRoot = path.join('.impeccable', 'review', 'visual', `phase-${phase}${reduced ? '-reduced' : ''}`);
const browser = await chromium.launch({ headless: true });
const summary = [];
for (const name of ['iPhone 15', 'Pixel 7']) {
  const device = devices[name];
  const dir = path.join(outRoot, name.replace(/\s+/g, '-').toLowerCase());
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
  const context = await browser.newContext({ ...device, defaultBrowserType: 'chromium', recordVideo: { dir, size: device.viewport }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  await context.route(/https:\/\/(.*\.clarity\.ms|connect\.facebook\.net|www\.facebook\.com)\//, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(() => {
    window.__vtnEvents = [];
    window.fbq = (...args) => window.__vtnEvents.push(args);
    window.__cls = 0;
    new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(base + route + '?utm_source=instagram&utm_campaign=visual', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1600);
  const step = Math.round(device.viewport.height * 0.25);
  const shots = [];
  let i = 0;
  for (;;) {
    const y = i * step;
    await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(700);
    const file = path.join(dir, `step-${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: file });
    const state = await page.evaluate(() => ({ y: Math.round(scrollY), max: Math.round(document.documentElement.scrollHeight - innerHeight), sticky: !!document.querySelector('.sticky-cta.is-visible, .sticky-bar.is-visible') }));
    shots.push({ file, ...state });
    if (state.y >= state.max - 2 || i > 80) break;
    i++;
  }
  const events = await page.evaluate(() => window.__vtnEvents.map(e => e.slice(1)));
  const cls = await page.evaluate(() => window.__cls);
  await page.close();
  await context.close();
  const files = await fs.readdir(dir);
  const video = files.find(f => f.endsWith('.webm'));
  // Contact sheet: 6 columns.
  const thumbW = 220, thumbH = Math.round(thumbW * device.viewport.height / device.viewport.width), cols = 6, gap = 8;
  const rows = Math.ceil(shots.length / cols);
  const tiles = await Promise.all(shots.map(async (s, n) => ({ input: await sharp(s.file).resize(thumbW, thumbH).toBuffer(), left: (n % cols) * (thumbW + gap), top: Math.floor(n / cols) * (thumbH + gap) })));
  await sharp({ create: { width: cols * (thumbW + gap), height: rows * (thumbH + gap), channels: 3, background: '#ddd' } }).composite(tiles).png().toFile(path.join(dir, 'sheet.png'));
  summary.push({ device: name, steps: shots.length, maxScroll: shots.at(-1)?.max, video: video && path.join(dir, video), errors, cls, events });
}
await browser.close();
await fs.writeFile(path.join(outRoot, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
