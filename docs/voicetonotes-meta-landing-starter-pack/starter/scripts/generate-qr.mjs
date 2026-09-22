import QRCode from "qrcode";
import fs from "node:fs/promises";
import path from "node:path";

const value = "https://links.voicetonotes.ai/s/1f7O6lrt";
const out = path.resolve("public/qr.svg");

await fs.mkdir(path.dirname(out), { recursive: true });
const svg = await QRCode.toString(value, {
  type: "svg",
  margin: 1,
  errorCorrectionLevel: "M",
});
await fs.writeFile(out, svg, "utf8");

console.log(`Wrote ${out}`);
