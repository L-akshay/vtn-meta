import type { ClientOS } from "./os";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type StorePlacement = "hero" | "sticky" | "final" | "badge" | "page";

export function trackClickToStore(
  placement: StorePlacement,
  os: ClientOS,
) {
  window.fbq?.("trackCustom", "ClickToStore", { placement, os });
}
