"use client";
import { useEffect, useRef } from "react";
import { wavePath } from "@/lib/wave";
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
  const d = wavePath(320, 28, 60);
  return <div className="inline-cta container" ref={scope} data-inline-cta={id}>
    <svg className="inline-cta-wave" viewBox="0 0 320 28" preserveAspectRatio="none" aria-hidden="true">
      <g className="inline-cta-flow">
        <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path d={d} transform="translate(320 0)" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
    <p className="inline-cta-line">{line}</p>
    <StoreLink placement="inline" className="cta inline-cta-button" />
  </div>;
}
