import { chromium } from '@playwright/test';
const browser = await chromium.launch();
for (const [label, reduced, qs] of [['normal', false, ''], ['reduced', true, ''], ['reduced + ?motion=on', true, '?motion=on']]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 780 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4173/' + qs, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const s = [];
  for (let i = 0; i < 8; i++) { s.push(await page.evaluate(() => getComputedStyle(document.querySelector('.lc-bar:nth-child(12)')).transform)); await page.waitForTimeout(200); }
  const storyH = await page.evaluate(() => ({ h: Math.round(document.querySelector('.story').getBoundingClientRect().height), vh: innerHeight, pin: getComputedStyle(document.querySelector('.story-pin')).position, faq: getComputedStyle(document.querySelector('.faq')).paddingTop }));
  console.log(label.padEnd(22), 'waveform:', (new Set(s).size > 2 ? 'MOVING' : 'static').padEnd(7), '| words:', String(await page.locator('.lc-word').count()).padStart(2), '| story h:', storyH.h, '| pin:', storyH.pin, '| faq pad:', storyH.faq);
  await ctx.close();
}
await browser.close();
