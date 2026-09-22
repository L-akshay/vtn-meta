import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceToNotes — Talk. It's written.",
  description: "Turn what you say into clear notes, transcripts, summaries, and action items. Get VoiceToNotes for iPhone and Android.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  icons: { icon: "/brand/favicon.png", apple: "/brand/apple-touch-icon.png" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#ffffff" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add(\"js\");try{var q=new URLSearchParams(location.search).get(\"motion\"),h=location.hostname,local=h===\"localhost\"||h===\"127.0.0.1\"||h===\"[::1]\"||/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/.test(h);if(q===\"on\"||(local&&q!==\"off\"))document.documentElement.dataset.motion=\"on\"}catch(e){}" }} /><link rel="preload" href="/fonts/geist-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head><body>{children}</body></html>;
}
