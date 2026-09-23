"use client";
import { useEffect, useRef } from "react";
import { Mic } from "./icons";
import { StoreLink } from "./Conversion";

/**
 * A floating mic in the bottom corner on phones, linking to the store.
 *
 * It is a link, not a recorder, so it carries a visible label as well as the icon: this page never
 * records audio and a bare mic button would imply that it does. The sticky bar deliberately has no
 * mic of its own, so the corner never shows two controls for the same action.
 *
 * It appears once the hero CTA has scrolled away and steps aside at the final CTA and while the
 * invitation is open.
 */
export function MicCta() {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scope.current;
    const hero = document.getElementById("hero-cta");
    // Track the final CTA button, not its section: the section can still be on screen after the
    // button has scrolled past, which would hide every CTA at once.
    const final = document.querySelector<HTMLElement>('[data-store-placement="final"]');
    if (!el || !hero || !final || !("IntersectionObserver" in window)) return;
    let heroGone = false, finalSeen = false;
    const update = () => el.classList.toggle("is-visible", heroGone && !finalSeen);
    const heroIo = new IntersectionObserver(([e]) => { heroGone = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }, { threshold: 0 });
    const finalIo = new IntersectionObserver(([e]) => { finalSeen = e.isIntersecting; update(); }, { threshold: 0 });
    heroIo.observe(hero); finalIo.observe(final);
    return () => { heroIo.disconnect(); finalIo.disconnect(); };
  }, []);

  return <div className="mic-cta" ref={scope} data-no-redirect data-global-click-exempt>
    <StoreLink placement="mic" className="mic-cta-link" label="Get VoiceToNotes free">
      <span className="mic-cta-icon" aria-hidden="true">
        <Mic size={19} strokeWidth={2} />
        <span className="mic-cta-bars">{Array.from({ length: 3 }, (_, i) => <i key={i} style={{ animationDelay: `${i * 160}ms` }} />)}</span>
      </span>
      <span className="mic-cta-label">Get the app</span>
    </StoreLink>
  </div>;
}
