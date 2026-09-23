"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "./icons";
import { StoreLink } from "./Conversion";

/**
 * A compact desktop companion CTA in the bottom corner. It appears once the hero CTA has scrolled
 * away, steps aside during the pinned story and at the final CTA so the page never shows two
 * competing asks, and can be dismissed for the session.
 */
export function SideCta() {
  const scope = useRef<HTMLElement>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const el = scope.current;
    const hero = document.getElementById("hero-cta");
    const final = document.querySelector<HTMLElement>('[data-store-placement="final"]');
    const story = document.querySelector(".story");
    if (!el || !hero || !final || !("IntersectionObserver" in window)) return;
    let heroGone = false, finalSeen = false, inStory = false;
    const update = () => el.classList.toggle("is-visible", heroGone && !finalSeen && !inStory);
    const heroIo = new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }, { threshold: 0 });
    const finalIo = new IntersectionObserver(([e]) => { finalSeen = e.isIntersecting; update(); }, { threshold: 0 });
    const storyIo = new IntersectionObserver(([e]) => { inStory = e.intersectionRatio > 0.2; update(); }, { threshold: [0, 0.2, 0.5] });
    heroIo.observe(hero); finalIo.observe(final);
    if (story) storyIo.observe(story);
    return () => { heroIo.disconnect(); finalIo.disconnect(); storyIo.disconnect(); };
  }, []);

  if (dismissed) return null;
  return <aside ref={scope} className="side-cta" aria-label="Get VoiceToNotes" data-no-redirect data-global-click-exempt>
    <StoreLink placement="side" className="side-cta-link">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/app-icon.png" width={34} height={34} alt="" loading="lazy" decoding="async" />
      <span className="side-cta-copy">
        <span className="side-cta-name">Get VoiceToNotes free</span>
        <span className="side-cta-note">iPhone and Android</span>
      </span>
    </StoreLink>
    <button type="button" className="side-cta-close" onClick={() => setDismissed(true)} aria-label="Hide this" data-no-redirect><X size={14} /></button>
  </aside>;
}
