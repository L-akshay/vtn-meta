// Verify the diagnostic page itself reports correctly, in a normal browser and in a reduced-motion one.
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
for (const reduced of [false, true]) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 900 }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4173/diagnose.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(7000);
  console.log('--- reducedMotion =', reduced);
  console.log('verdict:', (await page.locator('#verdict').textContent()).replace(/\s+/g, ' ').slice(0, 220));
  console.log('tier   :', await page.locator('#env tr').nth(2).locator('td').textContent());
  console.log('scripts:', await page.locator('#net tr').first().locator('td').textContent());
  console.log('wave   :', await page.locator('#motion tr').filter({ hasText: 'waveform verdict' }).locator('td').textContent().catch(() => 'n/a'));
  await ctx.close();
}
await browser.close();
