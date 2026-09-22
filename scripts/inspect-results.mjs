import fs from 'node:fs';
const reportPath = process.argv[2] || 'docs/lighthouse-final.report.json';
if (fs.existsSync(reportPath)) {
  const r=JSON.parse(fs.readFileSync(reportPath,'utf8'));
  console.log(JSON.stringify({scores:Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','total-byte-weight'].map(k=>[k,r.audits[k].displayValue])},null,2));
}
const html=fs.readFileSync('out/index.html','utf8');
console.log({preload:html.includes('href="/fonts/geist-latin.woff2"'),disclosure:html.includes('Illustrative VoiceToNotes demo')});
