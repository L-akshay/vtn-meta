/** Deterministic waveform polyline, shared by every waveform on the page. */
export function wavePath(width = 320, height = 56, points = 72) {
  const mid = height / 2;
  const parts: string[] = [];
  for (let i = 0; i < points; i++) {
    const x = (i / (points - 1)) * width;
    const env = Math.sin((i / (points - 1)) * Math.PI) ** 0.6;
    const n = Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.37) * 0.8 + Math.sin(i * 0.53) * 0.3);
    const amp = 2 + n * env * (mid - 3);
    parts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${(i % 2 ? mid - amp : mid + amp).toFixed(1)}`);
  }
  return parts.join(" ");
}
