import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDeepLink, DEEP_LINK } from '../lib/links.ts';
import { detectOS, ctaLabel } from '../lib/device.ts';

test('retains campaign query values including repeated values and Unicode', () => {
  const url = new URL(buildDeepLink('?utm_source=instagram&utm_campaign=hello%20world&fbclid=XYZ&tag=a&tag=b&q=%E0%A4%A8%E0%A5%8B%E0%A4%9F&empty='));
  assert.equal(url.origin + url.pathname, DEEP_LINK);
  assert.equal(url.searchParams.get('utm_source'), 'instagram');
  assert.equal(url.searchParams.get('utm_campaign'), 'hello world');
  assert.equal(url.searchParams.get('fbclid'), 'XYZ');
  assert.deepEqual(url.searchParams.getAll('tag'), ['a','b']);
  assert.equal(url.searchParams.get('q'), 'नोट');
  assert.equal(url.searchParams.get('empty'), '');
});
test('merges base link query without corrupting it or allowing destination override', () => {
  const url = new URL(buildDeepLink('?utm_source=new&redirect=https://example.com&x=%26%3F%23', DEEP_LINK + '?utm_source=old&source=base'));
  assert.equal(url.hostname, 'links.voicetonotes.ai');
  assert.equal(url.searchParams.get('source'), 'base');
  assert.deepEqual(url.searchParams.getAll('utm_source'), ['new']);
  assert.equal(url.searchParams.get('x'), '&?#');
});
test('recognizes in-app browser platforms and desktop-mode iPad', () => {
  assert.equal(detectOS('Mozilla iPhone Instagram 321'), 'ios');
  assert.equal(detectOS('Mozilla Linux Android FBAN/FB4A'), 'android');
  assert.equal(detectOS('Mozilla Macintosh', 5), 'ios');
  assert.equal(detectOS('Mozilla Macintosh'), 'desktop');
  assert.equal(detectOS(''), 'unknown');
  assert.equal(ctaLabel('ios'), 'Get it free for iPhone');
  assert.equal(ctaLabel('android'), 'Get it free on Android');
});
