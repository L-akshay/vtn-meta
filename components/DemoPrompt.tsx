"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, X } from "./icons";
import { StoreLink } from "./Conversion";

const SEEN_KEY = "vtn:prompt-seen";
const BARS = 14;

/**
 * One invitation, shown once per session after the visitor has seen the story and reached the
 * reviews. It never blocks: it is dismissible, Escape closes it, the backdrop closes it, and it
 * carries its own CTA so a call to action is still on screen while it is open.
 */
export function DemoPrompt() {
  const [open, setOpen] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    document.documentElement.classList.remove("has-prompt");
    try {
      if (new URLSearchParams(location.search).get("prompt") !== "on") sessionStorage.setItem(SEEN_KEY, "1");
    } catch { /* private mode */ }
    if (opener.current instanceof HTMLElement) opener.current.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    // ?prompt=on re-arms the invitation on every load so it can be reviewed without a fresh tab.
    let forced = false;
    try { forced = new URLSearchParams(location.search).get("prompt") === "on"; } catch { /* malformed query */ }
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* private mode */ }
    if (seen && !forced) return;
    // Wait until the visitor has come through the story and reached the reviews.
    const anchor = document.querySelector(".reviews") ?? document.querySelector(".faq");
    if (!anchor || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      opener.current = document.activeElement;
      setOpen(true);
      document.documentElement.classList.add("has-prompt");
    }, { threshold: 0.35 });
    io.observe(anchor);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    card.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    // Never compete with, or sit on top of, the final call to action.
    const final = document.getElementById("final-cta");
    const io = final && "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => { if (entry.isIntersecting) close(); }, { threshold: 0 })
      : null;
    if (final && io) io.observe(final);
    return () => { document.removeEventListener("keydown", onKey); io?.disconnect(); };
  }, [open, close]);

  // Always mounted so the dismissal never causes a layout jump; visibility is a class.
  return <div className={`prompt ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
    <button type="button" className="prompt-scrim" tabIndex={-1} aria-label="Close" data-no-redirect onClick={close} />
    <div className="prompt-card" role="dialog" aria-modal="false" aria-labelledby="prompt-title" tabIndex={-1} ref={card} data-no-redirect data-global-click-exempt>
      <button type="button" className="prompt-close" onClick={close} aria-label="Close" data-no-redirect><X size={18} /></button>
      <div className="prompt-mic" aria-hidden="true">
        <span className="prompt-mic-ring"><Mic size={26} strokeWidth={1.9} /></span>
        <span className="prompt-wave">{Array.from({ length: BARS }, (_, i) => <i key={i} style={{ animationDelay: `${i * 70}ms` }} />)}</span>
      </div>
      <h2 id="prompt-title">Try it on your own voice.</h2>
      <p>Talk for a minute and read it back as a clean note.</p>
      <StoreLink placement="popup" className="cta prompt-cta">Start transcribing</StoreLink>
      <p className="prompt-note">Free on iPhone and Android.</p>
    </div>
  </div>;
}
