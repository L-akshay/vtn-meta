"use client";
import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ctaLabel } from "@/lib/device";
import { StoreLink, useConversion } from "./Conversion";

/**
 * The mobile sticky CTA. The mic lives in the floating button in the corner (components/MicCta.tsx),
 * not in here, so the two never show the same icon twice.
 */
export function StickyBar() {
  const scope = useRef<HTMLElement>(null);
  const { os } = useConversion();

  useGSAP(() => {
    const bar = scope.current;
    const hero = document.getElementById("hero-cta");
    const final = document.querySelector<HTMLElement>('[data-store-placement="final"]');
    if (!bar || !hero || !final) return;
    let heroGone = false, finalSeen = false;
    // An inline band already shows the same button; two identical CTAs at once reads as spam.
    const inlineOnScreen = new Set<Element>();
    const update = () => {
      const visible = heroGone && !finalSeen && inlineOnScreen.size === 0;
      bar.classList.toggle("is-visible", visible);
      bar.inert = !visible;
      bar.setAttribute("aria-hidden", String(!visible));
    };
    ScrollTrigger.create({ trigger: hero, start: "bottom top", onEnter: () => { heroGone = true; update(); }, onLeaveBack: () => { heroGone = false; update(); } });
    // Track the final CTA button, not its section: the section can still be on screen after the
    // button has scrolled past, which would hide every CTA at once.
    ScrollTrigger.create({ trigger: final, start: "top bottom", end: "bottom top", onToggle: self => { finalSeen = self.isActive; update(); } });
    const io = "IntersectionObserver" in window
      ? new IntersectionObserver(entries => {
          // isIntersecting is true for a single overlapping pixel, so compare the ratio instead.
          entries.forEach(entry => { if (entry.intersectionRatio >= 0.2) inlineOnScreen.add(entry.target); else inlineOnScreen.delete(entry.target); });
          update();
        }, { threshold: [0, 0.2, 0.5] })
      : null;
    document.querySelectorAll(".inline-cta").forEach(el => io?.observe(el));
    update();
    return () => io?.disconnect();
  }, { scope });

  return <aside ref={scope} className="sticky-cta" aria-label="Get VoiceToNotes" aria-hidden="true">
    <StoreLink placement="sticky" className="cta sticky-cta-link">
      <span>{ctaLabel(os)}</span>
    </StoreLink>
  </aside>;
}
