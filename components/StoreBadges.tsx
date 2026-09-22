"use client";
/* eslint-disable @next/next/no-img-element */
import { APP_STORE, PLAY_STORE } from "@/lib/links";
import { trackStoreClick } from "@/lib/analytics";
import { useConversion } from "./Conversion";

/**
 * Both platforms, shown with equal weight. Each badge goes to its own store rather than the smart
 * link, so an "App Store" badge never lands an Android visitor on Google Play.
 */
export function StoreBadges() {
  const { os, variant } = useConversion();
  const track = () => trackStoreClick("badge", os, variant);
  return <div className="store-badges">
    <a className="store-badge" data-store-placement="badge" href={APP_STORE} rel="noopener" aria-label="Download VoiceToNotes on the App Store" onClick={track}>
      <img src="/store/app-store.svg" width={120} height={40} alt="Download on the App Store" loading="lazy" decoding="async" />
    </a>
    <a className="store-badge" data-store-placement="badge" href={PLAY_STORE} rel="noopener" aria-label="Get VoiceToNotes on Google Play" onClick={track}>
      <img src="/store/google-play.webp" width={134} height={40} alt="Get it on Google Play" loading="lazy" decoding="async" />
    </a>
  </div>;
}
