import sharp from 'sharp';
import fs from 'node:fs/promises';
const clamp = (v, a, b = 1) => Math.max(a, Math.min(b, v));

// E: speech phrasing with a visible floor so quiet passages still read as bars, not dust.
const E = (i, n) => {
  const t = i / n;
  const phrase = Math.abs(Math.sin(t * Math.PI * 3.1 + 0.35)) ** 0.55;
  const detail = 0.4 + 0.6 * Math.abs(Math.sin(i * 2.17) * Math.cos(i * 0.93) + 0.3 * Math.sin(i * 1.61));
  return clamp(0.2 + phrase * detail * 1.25, 0.2);
};
// F: as E but wider dynamic range and a slower phrase cycle.
const F = (i, n) => {
  const t = i / n;
  const phrase = Math.abs(Math.sin(t * Math.PI * 2.3 + 0.9)) ** 0.5;
  const detail = 0.32 + 0.68 * Math.abs(Math.sin(i * 1.93) * Math.cos(i * 1.31) + 0.35 * Math.sin(i * 0.61));
  return clamp(0.16 + phrase * detail * 1.4, 0.16);
};

function svg(fn, W, H, count) {
  const MID = H / 2, gap = W / count, bw = Math.max(1.6, gap * 0.46);
  let out = '';
  for (let i = 0; i < count; i++) {
    const h = Math.max(bw, fn(i, count) * (H - 4));
    out += `<rect x="${(i * gap + (gap - bw) / 2).toFixed(2)}" y="${(MID - h / 2).toFixed(2)}" width="${bw.toFixed(2)}" height="${h.toFixed(2)}" rx="${(bw / 2).toFixed(2)}" fill="#ff1a4d"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${out}</svg>`;
}

const dir = '.impeccable/review/wave'; await fs.mkdir(dir, { recursive: true });
const rows = [];
for (const [label, fn] of [['E', E], ['F', F]]) {
  for (const [w, h, c, tag] of [[320, 44, 60, 'rail 44px'], [320, 24, 64, 'final 24px'], [320, 9, 48, 'side 9px']]) {
    const file = `${dir}/${label}-${tag.split(' ')[0]}.png`;
    await sharp(Buffer.from(svg(fn, w, h, c))).png().toFile(file);
    rows.push({ label: `${label} ${tag}`, file, h });
  }
}
const scale = 2, W = 320 * scale;
let top = 0; const comp = [];
for (const r of rows) { comp.push({ input: await sharp(r.file).resize(W, r.h * scale, { kernel: 'nearest' }).toBuffer(), left: 0, top }); top += r.h * scale + 16; }
await sharp({ create: { width: W, height: top, channels: 3, background: '#dcdce2' } }).composite(comp).png().toFile(`${dir}/refine.png`);
console.log(rows.map(r => r.label).join(' | '));
console.log('->', `${dir}/refine.png`);
