// Render candidate waveform patterns side by side so the choice is made by looking, not guessing.
import sharp from 'sharp';
import fs from 'node:fs/promises';

const W = 320, H = 44, MID = H / 2;

const clamp = (v, a = 0.08, b = 1) => Math.max(a, Math.min(b, v));

const candidates = {
  // A: current zigzag polyline, for reference
  'A current (zigzag line)': () => {
    const pts = [];
    for (let i = 0; i < 72; i++) {
      const x = (i / 71) * W;
      const env = Math.sin((i / 71) * Math.PI) ** 0.6;
      const n = Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.37) * 0.8 + Math.sin(i * 0.53) * 0.3);
      const amp = 2 + n * env * (MID - 3);
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${(i % 2 ? MID - amp : MID + amp).toFixed(1)}`);
    }
    return `<path d="${pts.join(' ')}" fill="none" stroke="#ff1a4d" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  },
  // B: even bars, pure noise
  'B bars, plain noise': () => bars(56, i => clamp(0.5 + 0.5 * Math.sin(i * 2.399) * Math.cos(i * 1.117))),
  // C: bars with syllable grouping + breaths
  'C bars, speech shape': () => bars(56, (i, n) => {
    const t = i / n;
    const syl = 0.55 + 0.45 * Math.sin(t * Math.PI * 6.2 + 0.7);
    const detail = 0.45 + 0.55 * Math.abs(Math.sin(i * 2.17) * Math.cos(i * 0.93));
    const breath = 0.3 + 0.7 * Math.abs(Math.sin(t * Math.PI * 2.1 + 0.4));
    return clamp(syl * detail * breath * 1.5);
  }),
  // D: denser bars, stronger dynamics
  'D bars, dense dynamic': () => bars(72, (i, n) => {
    const t = i / n;
    const word = Math.abs(Math.sin(t * Math.PI * 3.1 + 0.35)) ** 0.7;
    const detail = 0.35 + 0.65 * Math.abs(Math.sin(i * 1.93) * Math.cos(i * 1.31) + 0.35 * Math.sin(i * 0.61));
    return clamp(word * detail * 1.55);
  }),
};

function bars(count, fn) {
  const gap = W / count;
  const bw = Math.max(1.8, gap * 0.42);
  let out = '';
  for (let i = 0; i < count; i++) {
    const h = fn(i, count) * (H - 6);
    const x = i * gap + (gap - bw) / 2;
    out += `<rect x="${x.toFixed(2)}" y="${(MID - h / 2).toFixed(2)}" width="${bw.toFixed(2)}" height="${h.toFixed(2)}" rx="${(bw / 2).toFixed(2)}" fill="#ff1a4d"/>`;
  }
  return out;
}

const dir = '.impeccable/review/wave'; await fs.rm(dir, { recursive: true, force: true }); await fs.mkdir(dir, { recursive: true });
const tiles = [];
for (const [name, make] of Object.entries(candidates)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${make()}</svg>`;
  const file = `${dir}/${name.split(' ')[0]}.png`;
  await sharp(Buffer.from(svg)).png().toFile(file);
  tiles.push({ name, file });
  console.log(name);
}
const scale = 2;
const composite = [];
for (const [n, t] of tiles.entries()) {
  composite.push({ input: await sharp(t.file).resize(W * scale, H * scale, { kernel: 'nearest' }).toBuffer(), left: 0, top: n * (H * scale + 18) });
}
await sharp({ create: { width: W * scale, height: tiles.length * (H * scale + 18), channels: 3, background: '#e9e9ee' } })
  .composite(composite).png().toFile(`${dir}/compare.png`);
console.log('->', `${dir}/compare.png`);
