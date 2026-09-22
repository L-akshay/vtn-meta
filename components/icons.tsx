// Inline icons (paths from Lucide, ISC licence) so the icon runtime never ships.
import type { SVGProps } from "react";
type IconProps = Omit<SVGProps<SVGSVGElement>, "strokeWidth"> & { size?: number; strokeWidth?: number };
const base = (size: number, strokeWidth: number, props: IconProps) => ({
  xmlns: "http://www.w3.org/2000/svg", width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const, ...props,
});
export const ChevronLeft = ({ size = 24, strokeWidth = 2, ...props }: IconProps) => <svg {...base(size, strokeWidth, props)}><path d="m15 18-6-6 6-6" /></svg>;
export const ChevronDown = ({ size = 24, strokeWidth = 2, ...props }: IconProps) => <svg {...base(size, strokeWidth, props)}><path d="m6 9 6 6 6-6" /></svg>;
export const Play = ({ size = 24, strokeWidth = 2, ...props }: IconProps) => <svg {...base(size, strokeWidth, props)}><polygon points="6 3 20 12 6 21 6 3" fill="currentColor" /></svg>;
export const Pause = ({ size = 24, strokeWidth = 2, ...props }: IconProps) => <svg {...base(size, strokeWidth, props)}><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" /><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" /></svg>;
export const Sparkles = ({ size = 24, strokeWidth = 2, ...props }: IconProps) => <svg {...base(size, strokeWidth, props)}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /></svg>;
export const Star = ({ size = 24, strokeWidth = 0, fill = "currentColor", ...props }: IconProps) => <svg {...base(size, strokeWidth, props)} fill={fill}><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></svg>;
export const Mic = ({ size = 24, strokeWidth = 2, ...props }: IconProps) => <svg {...base(size, strokeWidth, props)}><path d="M12 19v3" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><rect x="9" y="2" width="6" height="13" rx="3" /></svg>;
export const X = ({ size = 24, strokeWidth = 2, ...props }: IconProps) => <svg {...base(size, strokeWidth, props)}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
