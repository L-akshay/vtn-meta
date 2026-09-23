"use client";
import { useId } from "react";
import { waveBars, barGeometry, WAVE_WIDTH } from "@/lib/wave";

/**
 * A recorder-style waveform.
 *
 * When `tile` is set the pattern has to appear twice side by side so translating by one copy loops
 * seamlessly. The second copy is a `<use>` reference rather than a duplicate set of rects, which
 * keeps the served HTML at half the size for the same picture.
 */
export function WaveBars({ count = 64, height = 40, tile = false, className = "", groupClassName = "" }: {
  count?: number; height?: number; tile?: boolean; className?: string; groupClassName?: string;
}) {
  const id = useId();
  const heights = waveBars(count);
  const { step, width } = barGeometry(count);
  const mid = height / 2;
  return <svg className={className} viewBox={`0 0 ${WAVE_WIDTH} ${height}`} preserveAspectRatio="none" aria-hidden="true">
    <g className={groupClassName} fill="currentColor">
      <g id={id}>
        {heights.map((value, i) => {
          const barHeight = Math.max(width, value * (height - 3));
          return <rect key={i} x={+(i * step + (step - width) / 2).toFixed(2)} y={+(mid - barHeight / 2).toFixed(2)}
            width={+width.toFixed(2)} height={+barHeight.toFixed(2)} rx={+(width / 2).toFixed(2)} />;
        })}
      </g>
      {tile && <use href={`#${id}`} x={WAVE_WIDTH} />}
    </g>
  </svg>;
}
