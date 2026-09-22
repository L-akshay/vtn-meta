import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";
import { EASE_CURVE } from "./motion";

export type Tier = "full" | "lite" | "reduced";

/** Registered once, client only. Story-only plugins are loaded by loadStoryPlugins(). */
let registered = false;
export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  registered = true;
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase);
  CustomEase.create("vtn.out", EASE_CURVE.out);
  CustomEase.create("vtn.inOut", EASE_CURVE.inOut);
  ScrollTrigger.config({ ignoreMobileResize: true });
  // Text moves by repaint, not by promoting every word to its own compositor layer.
  gsap.config({ force3D: false });
  gsap.ticker.lagSmoothing(500, 33);
}
registerGsap();

export type StoryPlugins = {
  Flip: typeof import("gsap/Flip").Flip;
  ScrambleTextPlugin: typeof import("gsap/ScrambleTextPlugin").ScrambleTextPlugin;
};
let storyPlugins: Promise<StoryPlugins> | null = null;
export function loadStoryPlugins(): Promise<StoryPlugins> {
  storyPlugins ??= Promise.all([import("gsap/Flip"), import("gsap/ScrambleTextPlugin")]).then(([a, b]) => {
    gsap.registerPlugin(a.Flip, b.ScrambleTextPlugin);
    return { Flip: a.Flip, ScrambleTextPlugin: b.ScrambleTextPlugin };
  });
  return storyPlugins;
}

/**
 * Preview override. Some embedded browsers (notably VS Code's Simple Browser) always report
 * prefers-reduced-motion: reduce, which makes the page permanently static and impossible to
 * preview. Adding ?motion=on forces the full tier. Real visitors are unaffected.
 */
export function motionForced(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.motion === "on";
}

/** Safari has no deviceMemory; undefined counts as full. */
export function isLiteDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const n = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (n.deviceMemory !== undefined && n.deviceMemory <= 2) || (n.hardwareConcurrency !== undefined && n.hardwareConcurrency <= 4) || n.connection?.saveData === true;
}
export function currentTier(): Tier {
  if (typeof window === "undefined") return "full";
  if (!motionForced() && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  return isLiteDevice() ? "lite" : "full";
}

/** gsap.matchMedia wrapper so every block resolves one tier and reverts with its context. */
export function tiers(setup: (tier: Tier, ctx: gsap.Context) => void | (() => void)) {
  const mm = gsap.matchMedia();
  // "full" always matches so the callback runs on every device; gsap.matchMedia skips it when nothing matches.
  mm.add({ reduced: motionForced() ? "not all" : "(prefers-reduced-motion: reduce)", lite: isLiteDevice() ? "all" : "not all", full: "all" }, ctx => {
    const c = ctx.conditions as { reduced: boolean; lite: boolean };
    return setup(c.reduced ? "reduced" : c.lite ? "lite" : "full", ctx);
  });
  return mm;
}

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, CustomEase, useGSAP };
