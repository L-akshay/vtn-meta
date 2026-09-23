"use client";
import { useEffect, useRef } from "react";
import { WaveBars } from "./WaveBars";
import { StoreLink } from "./Conversion";
import { StoreBadges } from "./StoreBadges";

/** The waveform underline never settles into a dead line; it keeps flowing while in view. */
export function FinalCta() {
  const scope = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (!("IntersectionObserver" in window)) { root.classList.add("is-live"); return; }
    const io = new IntersectionObserver(([entry]) => root.classList.toggle("is-live", entry.isIntersecting), { rootMargin: "80px 0px" });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return <section ref={scope} className="final-section container" id="final-cta" aria-labelledby="final-heading" data-store-space>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="final-icon" src="/brand/app-icon.png" width={80} height={80} alt="" loading="lazy" decoding="async" />
    <h2 id="final-heading"><span>Stop typing.</span><span>Start talking.</span></h2>
    <WaveBars count={58} height={22} tile className="final-wave" groupClassName="final-wave-flow" />
    <p className="final-lead">Your next good idea is one voice note away.</p>
    <StoreLink placement="final" />
    <p className="download-note">Free on iPhone and Android, with in-app purchases.</p>
    <p className="final-platforms">Choose your store</p>
    <StoreBadges />
  </section>;
}
