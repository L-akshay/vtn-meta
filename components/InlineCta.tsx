"use client";
import { useEffect, useRef } from "react";
import { WaveBars } from "./WaveBars";
import { StoreLink } from "./Conversion";

/** A contextual CTA band placed where interest peaks: right after the story and after the reviews. */
export function InlineCta({ line, id }: { line: string; id: string }) {
  const scope = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (!("IntersectionObserver" in window)) { root.classList.add("is-live"); return; }
    const io = new IntersectionObserver(([entry]) => root.classList.toggle("is-live", entry.isIntersecting), { rootMargin: "60px 0px" });
    io.observe(root);
    return () => io.disconnect();
  }, []);
  return <div className="inline-cta container" ref={scope} data-inline-cta={id}>
    <WaveBars count={52} height={26} tile className="inline-cta-wave" groupClassName="inline-cta-flow" />
    <p className="inline-cta-line">{line}</p>
    <StoreLink placement="inline" className="cta inline-cta-button" />
  </div>;
}
