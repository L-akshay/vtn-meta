/**
 * Conversion destination. Every CTA uses CTA_DEEP_LINK; the smart link routes the visitor to the
 * right store for their device. Swap this one constant to move every CTA at once.
 */
export const CTA_DEEP_LINK = "https://links.voicetonotes.ai/s/UIitUJQV";

/** The earlier smart link, kept so it can be restored or A/B compared without hunting for it. */
export const LEGACY_DEEP_LINK = "https://links.voicetonotes.ai/s/1f7O6lrt";

/** Default base used by buildDeepLink. */
export const DEEP_LINK = CTA_DEEP_LINK;

export const APP_STORE = "https://apps.apple.com/us/app/voicetonotes-ai-voice-to-text/id6747948555";
export const PLAY_STORE = "https://play.google.com/store/apps/details?id=ai.voicetonotes.mobileapp";
export const PRIVACY = "https://voicetonotes.ai/privacy-policy/";
export const TERMS = "https://voicetonotes.ai/terms/";

/** Preserve repeated parameters, Unicode and future query values on the base link. */
export function buildDeepLink(search: string, base = DEEP_LINK): string {
  const destination = new URL(base);
  const incoming = new URLSearchParams(search);
  for (const key of new Set(incoming.keys())) destination.searchParams.delete(key);
  for (const [key, value] of incoming) destination.searchParams.append(key, value);
  return destination.toString();
}
