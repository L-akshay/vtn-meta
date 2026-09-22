/**
 * Social proof shown on the page. Real, verified numbers only.
 * Rating is omitted on purpose: US App Store 3.9/5 (14 ratings) and Google Play 3.7/5 differ and are not
 * attractive proof for a paid landing page (see docs/master-brief.md section 21).
 */
export const proof = {
  rating: null as null | { label: string; source: string; verifiedAt: string },
  downloads: {
    label: "100K+ downloads on Google Play",
    source: "https://play.google.com/store/apps/details?id=ai.voicetonotes.mobileapp",
    verifiedAt: "2026-09-22",
  },
  /** Google Play listing, verified 2026-09-22: "VoiceToNotes AI supports 20+ languages including English, Spanish, French, German, Arabic and more." */
  languages: { count: "20+", source: "https://play.google.com/store/apps/details?id=ai.voicetonotes.mobileapp", verifiedAt: "2026-09-22" },
};
