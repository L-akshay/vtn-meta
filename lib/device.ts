export type DeviceOS = "ios" | "android" | "desktop" | "unknown";
export function detectOS(userAgent: string, maxTouchPoints = 0): DeviceOS {
  if (/iPhone|iPad|iPod/i.test(userAgent) || (/Macintosh/i.test(userAgent) && maxTouchPoints > 1)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  if (/Windows|Macintosh|Linux|CrOS/i.test(userAgent)) return "desktop";
  return "unknown";
}
export function ctaLabel(os: DeviceOS) {
  return os === "ios" ? "Get it free for iPhone" : os === "android" ? "Get it free on Android" : "Get the app free";
}
