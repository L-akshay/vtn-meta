import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

async function findChrome(dir) {
  for (const entry of await fs.readdir(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if (entry.name === 'chrome.exe') return file;
    if (entry.isDirectory()) { const found = await findChrome(file); if (found) return found; }
  }
}
const browser = await chromium.launch({headless:true, executablePath:await findChrome(path.join(process.env.USERPROFILE,'.agent-browser/browsers/chrome-153.0.8010.52'))});
const page = await browser.newPage({viewport:{width:390,height:844}});
const events = [];
const destinations = [];
await page.exposeFunction('recordStoreEvent', data => events.push(data));
await page.addInitScript(()=>window.addEventListener('vtn:store-click', event=>window.recordStoreEvent(event.detail)));
await page.route(/https:\/\/.*clarity\.ms\//, r=>r.fulfill({status:200,body:''}));
await page.route('https://links.voicetonotes.ai/**', r=>{destinations.push(r.request().url()); return r.fulfill({status:200,contentType:'text/html',body:'<p>Intercepted smart-link handoff</p>'});});
try {
  await page.goto('http://localhost:4173/?utm_source=instagram&tag=a&tag=b');
  await page.waitForFunction(()=>document.querySelector('#hero-cta').href.includes('utm_source'));
  const point = await page.evaluate(()=>{
    for(let y=100;y<420;y+=5) for(let x=5;x<385;x+=5) {
      if(document.elementFromPoint(x,y)?.matches('[data-store-space]')) return {x,y};
    }
    throw new Error('No marked whitespace in viewport');
  });
  await page.mouse.move(point.x,point.y);
  await page.mouse.down();
  await page.mouse.move(point.x+25,point.y);
  await page.mouse.move(point.x,point.y);
  await page.mouse.up();
  await page.waitForTimeout(150);
  assert.equal(destinations.length,0,'Out-and-back drag must not navigate');
  assert.equal(events.length,0);
  await page.keyboard.down('Control');
  await page.mouse.click(point.x,point.y);
  await page.keyboard.up('Control');
  assert.equal(destinations.length,0,'Modified whitespace click must not navigate');
  await Promise.all([page.waitForURL('https://links.voicetonotes.ai/**'),page.mouse.click(point.x,point.y)]);
  assert.equal(destinations.length,1);
  assert.deepEqual(new URL(destinations[0]).searchParams.getAll('tag'),['a','b']);
  assert.equal(new URL(destinations[0]).searchParams.get('utm_source'),'instagram');
  assert.equal(events.length,1);
  assert.equal(events[0].placement,'page');
  await fs.writeFile('docs/qa-gestures.json',JSON.stringify({status:'pass',checks:['Out-and-back drag does not navigate or track.','Modified whitespace click does not navigate.','Intentional whitespace click navigates once, preserves attribution and emits one page-placement event.']},null,2));
  console.log('Gesture and actual smart-link navigation checks pass (external destination intercepted).');
} finally { await browser.close(); }
