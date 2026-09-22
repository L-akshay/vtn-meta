"use client";
import Script from "next/script";
import { useEffect } from "react";
import { detectOS } from "@/lib/device";
import type { Variant } from "@/lib/variants";

export function Analytics({ variant }: { variant: Variant }) {
  const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
  const clarity = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "ym4bfkzw5f";
  // Clarity is session replay only, so it waits until well after load and never competes with hydration or the hero.
  useEffect(() => {
    if (!/^[a-zA-Z0-9]+$/.test(clarity)) return;
    let timer = 0;
    const inject = () => {
      timer = window.setTimeout(() => {
        const w = window as Window & { clarity?: ((...args: unknown[]) => void) & { q?: unknown[] } };
        if (w.clarity) return;
        const queue: unknown[] = [];
        w.clarity = Object.assign((...args: unknown[]) => { queue.push(args); }, { q: queue });
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://www.clarity.ms/tag/" + clarity;
        script.onload = () => {
          w.clarity?.("set", "landingVariant", variant);
          w.clarity?.("set", "deviceOS", detectOS(navigator.userAgent, navigator.maxTouchPoints));
        };
        document.head.appendChild(script);
      }, 3500);
    };
    if (document.readyState === "complete") inject(); else window.addEventListener("load", inject, { once: true });
    return () => { window.clearTimeout(timer); window.removeEventListener("load", inject); };
  }, [clarity, variant]);
  return <>
    {/^[0-9]+$/.test(pixel) && <Script id="meta-pixel" strategy="afterInteractive">{`
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};n.queue=[];n.loaded=true;n.version='2.0';f._fbq=n;t=b.createElement(e);t.async=true;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init',${JSON.stringify(pixel)});fbq('track','PageView');
    `}</Script>}

  </>;
}
