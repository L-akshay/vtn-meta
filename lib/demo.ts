import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export type DemoWord = { w: string; start: number; end: number };
export type Demo = { src: string; words: DemoWord[] };

/**
 * Build-time loader for the hero audio demo. Renders nothing when public/demo/clip.m4a or
 * public/demo/words.json is missing (see README "Missing assets").
 */
export function loadDemo(): Demo | null {
  const dir = path.join(process.cwd(), "public", "demo");
  const clip = path.join(dir, "clip.m4a");
  const words = path.join(dir, "words.json");
  if (!existsSync(clip) || !existsSync(words)) return null;
  try {
    const parsed = JSON.parse(readFileSync(words, "utf8")) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const list = parsed.filter((w): w is DemoWord => typeof w?.w === "string" && typeof w?.start === "number" && typeof w?.end === "number");
    return list.length ? { src: "/demo/clip.m4a", words: list } : null;
  } catch {
    return null;
  }
}
