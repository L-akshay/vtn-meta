import type { DeviceOS } from "./device";
import type { Variant } from "./variants";
export type Placement = "hero" | "sticky" | "final" | "badge" | "page" | "popup" | "side" | "inline" | "mic" | "footer";
export type VtnEventName = "DemoPlay" | "DemoComplete" | "StoryBeat" | "ScrollDepth";
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}
export function trackStoreClick(placement: Placement, os: DeviceOS, variant: Variant) {
  const detail = { placement, os, variant };
  // Native anchor navigation must survive a blocked or failed tracking script.
  try { window.fbq?.("trackCustom", "ClickToStore", detail); } catch { /* Non-blocking analytics. */ }
  window.dispatchEvent(new CustomEvent("vtn:store-click", { detail }));
}

const fired = new Set<string>();
/** Custom events fire once per page view, keyed by name plus params (StoryBeat once per beat). */
export function trackOnce(name: VtnEventName, params: Record<string, string | number> = {}): boolean {
  const key = `${name}:${JSON.stringify(params)}`;
  if (fired.has(key)) return false;
  fired.add(key);
  try { window.fbq?.("trackCustom", name, params); } catch { /* Non-blocking analytics. */ }
  window.dispatchEvent(new CustomEvent("vtn:event", { detail: { name, params } }));
  return true;
}
