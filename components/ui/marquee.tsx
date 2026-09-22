// Magic UI Marquee. CSS keyframes live in globals.css under .marquee-*.
import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  /** Whether to reverse the animation direction */
  reverse?: boolean;
  /** Whether to pause the animation on hover */
  pauseOnHover?: boolean;
  /** Content to be displayed in the marquee */
  children: ReactNode;
  /** Whether to animate vertically instead of horizontally */
  vertical?: boolean;
  /** Number of times to repeat the content */
  repeat?: number;
}

export function Marquee({ className = "", reverse = false, pauseOnHover = false, children, vertical = false, repeat = 4, ...props }: MarqueeProps) {
  return <div {...props} className={["marquee", vertical ? "marquee-vertical" : "marquee-horizontal", pauseOnHover ? "marquee-pause-hover" : "", className].filter(Boolean).join(" ")}>
    {Array.from({ length: repeat }, (_, i) => <div key={i} className={["marquee-track", reverse ? "marquee-reverse" : ""].filter(Boolean).join(" ")} aria-hidden={i > 0 ? "true" : undefined}>{children}</div>)}
  </div>;
}
