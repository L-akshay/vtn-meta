import sharp from 'sharp';
import QRCode from 'qrcode';
import fs from 'node:fs/promises';

const source = JSON.parse(await fs.readFile('docs/apple-listing.json', 'utf8')).results[0];
const html = await fs.readFile('docs/reference-site.html', 'utf8');
const wordmark = html.match(/<svg width="708" height="112"[\s\S]*?<\/svg>/)?.[0];
if (!wordmark) throw new Error('Official wordmark not found');
await fs.writeFile('public/brand/wordmark.svg', wordmark.replace(/class="[^"]*"/g, '').replace(/currentColor/g, '#1d1d1f'));
const iconUrl = source.artworkUrl512.replace('512x512bb.jpg', '1024x1024bb.png');
const icon = await fetch(iconUrl).then(r => { if (!r.ok) throw new Error('Icon download failed'); return r.arrayBuffer(); });
await fs.writeFile('docs/source-assets/apple-icon.png', Buffer.from(icon));
const provenance = origin => ({ IFD0: { ImageDescription: origin, Copyright: 'VoiceToNotes; official product asset' } });
await sharp(Buffer.from(icon)).resize(256).withExif(provenance(iconUrl)).png().toFile('public/brand/app-icon.png');
await sharp(Buffer.from(icon)).resize(64).png().toFile('public/brand/favicon.png');
await sharp(Buffer.from(icon)).resize(180).png().toFile('public/brand/apple-touch-icon.png');
for (const [name, index] of [['transcription', 4], ['editor', 2]]) {
  const origin = source.screenshotUrls[index];
  for (const width of [480, 800]) {
    await sharp(`docs/source-assets/apple-${index}.png`).resize({width}).withExif(provenance(origin)).avif({quality: 60}).toFile(`public/screens/${name}-${width}.avif`);
  }
}
const badge = await sharp('public/store/google-play.png').trim().toBuffer();
await sharp(badge).resize({height: 144}).webp({quality: 90}).toFile('public/store/google-play.webp');
await fs.writeFile('public/qr.svg', await QRCode.toString('https://links.voicetonotes.ai/s/1f7O6lrt', {type:'svg', margin: 2, errorCorrectionLevel:'M', color:{dark:'#1d1d1f',light:'#ffffff'}}));
await fs.mkdir('public/fonts', {recursive:true});
await fs.copyFile('node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2', 'public/fonts/geist-latin.woff2');
console.log('Official assets, compressed screenshots, local font and QR ready.');
