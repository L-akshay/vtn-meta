"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { buildDeepLink, DEEP_LINK } from "@/lib/links";
import { ctaLabel, detectOS, type DeviceOS } from "@/lib/device";
import { trackStoreClick, type Placement } from "@/lib/analytics";
import type { Variant } from "@/lib/variants";

const Context = createContext({ os: "unknown" as DeviceOS, href: DEEP_LINK, variant: "default" as Variant });
export const useConversion = () => useContext(Context);
export function ConversionProvider({ variant, children }: { variant: Variant; children: ReactNode }) {
  const [client, setClient] = useState({ os: "unknown" as DeviceOS, href: DEEP_LINK });
  useEffect(() => {
    const sync = () => setClient({ os: detectOS(navigator.userAgent, navigator.maxTouchPoints), href: buildDeepLink(location.search) });
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  return <Context.Provider value={{ ...client, variant }}>{children}</Context.Provider>;
}

export function StoreLink({ placement, children, className = "cta", id, label }: {
  placement: Placement; children?: ReactNode; className?: string; id?: string; label?: string;
}) {
  const { os, href, variant } = useContext(Context);
  return <a id={id} className={className} href={href} aria-label={label} data-store-placement={placement}
    onClick={event => {
      // Read the current query at activation too, including history.replaceState changes.
      event.currentTarget.href = buildDeepLink(window.location.search);
      // Fire the pixel, give Android a tiny haptic, then let the native anchor navigate synchronously.
      trackStoreClick(placement, os, variant);
      if (os === "android") { try { navigator.vibrate?.(8); } catch { /* unsupported */ } }
    }}>{children ?? ctaLabel(os)}</a>;
}



/** Only intentional clicks on marked whitespace; never text, demo, swipe or keyboard. */
export function GlobalStoreClick() {
  const { os, variant } = useContext(Context);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_PAGE_CLICK === "false") return;
    let pointer: { x: number; y: number; scroll: number; time: number; target: EventTarget | null } | null = null;
    const down = (event: PointerEvent) => {
      pointer = event.isPrimary && event.button === 0 ? { x: event.clientX, y: event.clientY, scroll: window.scrollY, time: performance.now(), target: event.target } : null;
    };
    const cancel = () => { pointer = null; };
    const move = (event: PointerEvent) => {
      if (pointer && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 8) pointer = null;
    };
    const click = (event: MouseEvent) => {
      const start = pointer;
      pointer = null;
      if (!start || event.defaultPrevented || event.button !== 0 || event.detail === 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8 || Math.abs(window.scrollY - start.scroll) > 4 || performance.now() - start.time > 500) return;
      if (window.getSelection()?.toString().trim()) return;
      const target = event.target;
      if (!(target instanceof HTMLElement) || target !== start.target || !target.matches("[data-store-space]")) return;
      if (target.closest("a,button,summary,footer,input,select,textarea,label,[role='button'],[data-no-redirect],[data-global-click-exempt]")) return;
      trackStoreClick("page", os, variant);
      window.location.assign(buildDeepLink(window.location.search));
    };
    document.addEventListener("pointerdown", down, { passive: true });
    document.addEventListener("pointercancel", cancel, { passive: true });
    document.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", cancel, { passive: true });
    document.addEventListener("click", click);
    return () => {
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointercancel", cancel);
      document.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", cancel);
      document.removeEventListener("click", click);
    };
  }, [os, variant]);
  return null;
}
