// Ask the page itself, from inside a Lighthouse run, whether reduced motion is being forced.
import fs from 'node:fs';
const r = JSON.parse(fs.readFileSync('.lighthouseci/lhr-1.json', 'utf8'));
const items = r.audits['long-tasks']?.details?.items ?? [];
console.log('long tasks in the plain run:', items.length, items.slice(0, 3).map(i => Math.round(i.duration) + 'ms').join(', '));
