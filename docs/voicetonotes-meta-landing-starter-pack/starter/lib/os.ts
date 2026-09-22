export type ClientOS = "ios" | "android" | "desktop" | "unknown";

export function detectOS(userAgent: string): ClientOS {
  const ua = userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";
  if (/windows|macintosh|linux|cros/.test(ua)) return "desktop";

  return "unknown";
}

export function ctaLabel(os: ClientOS) {
  if (os === "ios") return "Get it free for iPhone";
  if (os === "android") return "Get it free on Android";
  return "Get the app free";
}
