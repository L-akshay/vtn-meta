"use client";
import { useEffect } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { trackOnce } from "@/lib/analytics";

type LenisLike = { raf(time: number): void; on(event: "scroll", handler: () => void): void; destroy(): void };

/** Global GSAP setup. Mounted once per page. */
export function MotionRoot() {
  useEffect(() => {
    registerGsap();
    let cancelled = false;
    document.fonts?.ready.then(() => { if (!cancelled) ScrollTrigger.refresh(); });

    // Smooth scrolling only for mouse/trackpad users; touch keeps native scrolling.
    let lenis: LenisLike | null = null;
    let tick: ((time: number) => void) | null = null;
    if (window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      import("lenis").then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({ autoRaf: false }) as unknown as LenisLike;
        lenis.on("scroll", ScrollTrigger.update);
        tick = time => lenis?.raf(time * 1000);
        gsap.ticker.add(tick);
      });
    }

    const depth = [50, 90].map(pct => ScrollTrigger.create({
      trigger: document.body, start: `${pct}% bottom`, once: true,
      onEnter: () => { trackOnce("ScrollDepth", { depth: pct }); },
    }));
    return () => {
      cancelled = true;
      depth.forEach(trigger => trigger.kill());
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);
  return null;
}
