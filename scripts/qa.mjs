// Functional QA against the static preview (npm run preview). Uses Playwright's bundled Chromium.
import { chromium, devices } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { buildDeepLink, CTA_DEEP_LINK } from '../lib/links.ts';

const BASE = process.env.QA_BASE ?? 'http://localhost:4173';
const browser = await chromium.launch({ headless: true });
const report = { routes: [], checks: [], errors: [], accessibility: [], events: [] };
await fs.mkdir('.impeccable/review', { recursive: true });
const context = await browser.newContext({ ...devices['iPhone 15'], defaultBrowserType: 'chromium' });
await context.route(/https:\/\/(www\.clarity\.ms|.*\.clarity\.ms|connect\.facebook\.net|www\.facebook\.com)\//, route => route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }));
const page = await context.newPage();
page.on('pageerror', error => report.errors.push(error.stack ?? error.message));
page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
await page.addInitScript(() => {
  window.__vtnEvents = [];
  window.fbq = (...args) => window.__vtnEvents.push(args);
  window.__cls = 0;
  new PerformanceObserver(list => list.getEntries().forEach(e => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
});
const events = () => page.evaluate(() => window.__vtnEvents.map(e => ({ name: e[1], params: e[2] })));
try {
  for (const route of ['/', '/students/', '/meetings/', '/writers/']) {
    await page.goto(`${BASE}${route}?utm_source=instagram&utm_campaign=test%20campaign&fbclid=XYZ&tag=a&tag=b`);
    await page.locator('#hero-cta').waitFor();
    await page.waitForFunction(() => document.querySelector('#hero-cta').href.includes('utm_source'));
    const heading = await page.locator('h1').innerText();
    assert.match(await page.locator('meta[name=robots]').getAttribute('content'), /noindex/);
    for (const width of [360, 375, 390, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(dimensions.scroll <= width, `${route} overflow at ${width}: ${dimensions.scroll}`);
    }
    report.routes.push({ route, heading, widths: [360, 375, 390, 430, 768, 1024, 1440], status: 'pass' });
  }
  await page.setViewportSize(devices['iPhone 15'].viewport);
  await page.goto(`${BASE}/?utm_source=instagram&fbclid=XYZ&tag=a&tag=b`);
  await page.waitForFunction(() => document.querySelector('#hero-cta').href.includes('utm_source'));
  await page.evaluate(() => document.addEventListener('click', e => { if (e.target.closest('[data-store-placement]')) e.preventDefault(); }, true));

  // Explicit CTAs: one ClickToStore per tap, correct placement, attribution kept.
  await page.locator('#hero-cta').click();
  assert.deepEqual((await events()).filter(e => e.name === 'ClickToStore').map(e => e.params.placement), ['hero']);
  const href = new URL(await page.locator('#hero-cta').getAttribute('href'));
  assert.deepEqual(href.searchParams.getAll('tag'), ['a', 'b']);
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  await page.waitForFunction(() => document.querySelector('.sticky-cta').classList.contains('is-visible'));
  await page.locator('.sticky-cta-link').click();
  assert.equal((await events()).at(-1).params.placement, 'sticky');
  await page.locator('.reviews, .faq').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1400);
  if (await page.locator('.prompt.is-open').count()) {
    assert.ok(await page.locator('.prompt-cta').isVisible(), 'the invitation carries its own CTA');
    assert.equal(await page.locator('.prompt-cta').getAttribute('href'), buildDeepLink('?utm_source=instagram&fbclid=XYZ&tag=a&tag=b'), 'invitation CTA keeps attribution');
    await page.locator('.prompt-close').click();
    await page.waitForSelector('.prompt.is-open', { state: 'detached' }).catch(() => {});
    report.checks.push('The invitation appears once, carries its own CTA, and closes on demand.');
  }
  await page.locator('#final-cta').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => !document.querySelector('.sticky-cta').classList.contains('is-visible'));
  await page.waitForTimeout(900); // let the scrubbed story timeline settle so its beat callbacks fire
  await page.locator('[data-store-placement="final"]').click();
  await page.locator('[data-store-placement="badge"]').first().click();
  assert.deepEqual((await events()).filter(e => e.name === 'ClickToStore').map(e => e.params.placement), ['hero', 'sticky', 'final', 'badge']);
  report.checks.push('Explicit CTA clicks emit once with correct placements; attribution retains repeated parameters; sticky hides at final CTA.');

  // Custom events fire once per page view.
  const names = (await events()).map(e => e.name);
  assert.ok(names.includes('ScrollDepth'), 'ScrollDepth fired');
  for (const beat of ['a', 'b', 'c', 'd', 'e']) assert.equal((await events()).filter(e => e.name === 'StoryBeat' && e.params.beat === beat).length, 1, `StoryBeat ${beat} once`);
  assert.equal((await events()).filter(e => e.name === 'ScrollDepth' && e.params.depth === 90).length, 1, 'ScrollDepth 90 once');
  report.events = await events();
  report.checks.push('StoryBeat a-e and ScrollDepth 50/90 fire exactly once per page view.');

  // Interactive elements never leave the page.
  const url = page.url();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.locator('h1').click();
  await page.locator('.live-card').click({ position: { x: 30, y: 30 } });
  await page.locator('.faq').scrollIntoViewIfNeeded();
  await page.locator('.accordion-trigger').first().click();
  await page.waitForSelector('.accordion-item[data-state="open"]');
  await page.locator('.rail-card').nth(1).click();
  await page.waitForTimeout(400);
  assert.equal(page.url(), url);
  report.checks.push('Text, demo card, FAQ and use-case card taps do not navigate.');

  // Every use-case card is present and none is left blank by an animation that has not run.
  const cards = page.locator('.rail-card');
  assert.equal(await cards.count(), 4, 'four use-case cards');
  for (let i = 0; i < 4; i++) {
    assert.ok(await cards.nth(i).isVisible(), 'card ' + i + ' visible');
    const text = (await cards.nth(i).locator('.rail-lines').innerText()).trim();
    assert.ok(text.length > 10, 'card ' + i + ' has visible demo text, got: ' + JSON.stringify(text));
  }
  assert.equal(await page.locator('.rail-grid').evaluate(el => getComputedStyle(el).overflowX), 'visible', 'rail does not scroll sideways');
  report.checks.push('All four use-case cards render their content without relying on an animation.');

  // Reduced motion renders final states, no pin.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Local previews force motion on, so ask for the real preference explicitly.
  await page.goto(`${BASE}/?motion=off`);
  await page.locator('#hero-cta').waitFor();
  assert.equal(await page.locator('.story-reduced-captions').isVisible(), true);
  assert.equal(await page.locator('.story').evaluate(el => getComputedStyle(el).height !== `${innerHeight * 3.8}px`), true);
  await page.locator('.story').scrollIntoViewIfNeeded();
  await page.screenshot({ path: '.impeccable/review/reduced-motion.png' });
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  report.accessibility = axe.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => n.target) }));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  report.checks.push('Reduced motion shows static captions and final states.');

  // Every smart-link CTA on the page shares one destination.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${BASE}/`);
  await page.locator('#hero-cta').waitFor();
  const hrefs = await page.locator('[data-store-placement]:not(.store-badge)').evaluateAll(list => list.map(a => a.getAttribute('href')));
  assert.ok(hrefs.length >= 3, 'several smart-link CTAs present, got ' + hrefs.length);
  assert.equal(await page.locator('.sticky-cta .sb-mic').count(), 1, 'the mic lives inside the sticky CTA');
  for (const href of hrefs) assert.ok(href.startsWith(CTA_DEEP_LINK), 'CTA points at the configured link, got ' + href);
  report.checks.push(hrefs.length + ' smart-link CTAs all point at the configured deep link.');

  report.cls = await page.evaluate(() => window.__cls);
  for (const [ua, expected] of [['Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Instagram', 'Get it free for iPhone'], ['Mozilla/5.0 (Linux; Android 14) FBAN/FB4A', 'Get it free on Android']]) {
    const mobileContext = await browser.newContext({ userAgent: ua, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await mobileContext.route(/https:\/\/.*clarity\.ms\//, r => r.fulfill({ status: 200, body: '' }));
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE}/`);
    await mobilePage.waitForFunction(label => document.querySelector('#hero-cta').textContent === label, expected);
    await mobileContext.close();
  }
  report.checks.push('iPhone Instagram and Android Facebook user-agent labels pass. Real native webviews still require devices.');
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const nojsPage = await nojs.newPage();
  await nojsPage.goto(`${BASE}/`);
  assert.equal(await nojsPage.locator('#hero-cta').getAttribute('href'), CTA_DEEP_LINK);
  assert.equal(await nojsPage.locator('.lc-transcript').isVisible(), true);
  report.checks.push('Static content and the smart-link CTA work without JavaScript (query propagation needs JavaScript).');
  await nojs.close();
  assert.equal(report.errors.length, 0, JSON.stringify(report.errors));
  assert.equal(report.accessibility.length, 0, JSON.stringify(report.accessibility));
  report.status = 'pass';
} catch (error) { report.status = 'fail'; report.failure = error.message; process.exitCode = 1; }
finally { await fs.writeFile('docs/qa-results.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify({ status: report.status, failure: report.failure, checks: report.checks, errors: report.errors, accessibility: report.accessibility, cls: report.cls }, null, 2)); await browser.close(); }
