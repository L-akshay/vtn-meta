/**
 * The page's one waveform. Voice recorders draw discrete bars, not a continuous zigzag: a polyline
 * reads as a line graph, so every waveform here is a bar set with speech-like dynamics.
 *
 * Deterministic, so the server and client render identically and the pattern tiles predictably.
 * Returns normalised bar heights in 0..1.
 */
export function waveBars(count = 64): number[] {
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    // Slow phrase envelope: loud passages separated by quieter ones, like words and pauses.
    const phrase = Math.abs(Math.sin(t * Math.PI * 2.3 + 0.9)) ** 0.5;
    // Per-bar detail so neighbours never match and the texture reads as audio, not a pattern.
    const detail = 0.32 + 0.68 * Math.abs(Math.sin(i * 1.93) * Math.cos(i * 1.31) + 0.35 * Math.sin(i * 0.61));
    // The floor keeps quiet passages as visible bars rather than dust.
    out.push(Math.max(0.16, Math.min(1, 0.16 + phrase * detail * 1.4)));
  }
  return out;
}

/** Geometry shared by every waveform: a 320-unit wide strip so two copies tile seamlessly. */
export const WAVE_WIDTH = 320;
export function barGeometry(count: number) {
  const step = WAVE_WIDTH / count;
  return { step, width: Math.max(1.6, step * 0.46) };
}
