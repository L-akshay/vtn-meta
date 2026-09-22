"use client";
import { useEffect, useRef } from "react";
import { wavePath } from "@/lib/wave";

type Line = { text: string; speaker?: "a" | "b"; tag?: string; rewritten?: boolean };
type Case = { key: string; title: string; outcome: string; lines: Line[]; speakers?: boolean };

const CASES: Case[] = [
  {
    key: "students", title: "Students",
    outcome: "Capture the lecture without spending the whole class typing.",
    lines: [{ text: "Photosynthesis turns light into chemical energy." }, { text: "Inputs: sunlight, water, CO₂." }, { text: "Review before Thursday.", tag: "To do" }],
  },
  {
    key: "meetings", title: "Meetings",
    outcome: "Stay in the conversation and review the details afterward.",
    speakers: true,
    lines: [{ text: "Launch review moves to Thursday.", speaker: "a" }, { text: "Sam sends the deck by Monday.", speaker: "b" }],
  },
  {
    key: "doctors", title: "Doctors",
    outcome: "Dictate working notes faster where your workflow and privacy requirements allow it.",
    lines: [{ text: "Mild headache since Monday, no fever." }, { text: "Rest, fluids, review in one week.", tag: "Plan" }],
  },
  {
    key: "writers", title: "Writers",
    outcome: "Speak the rough draft, then shape the text.",
    lines: [{ text: "The walk to the coffee shop was the same as always." }, { text: "Today I noticed everything.", rewritten: true }],
  },
];

/** A tiling waveform. The viewBox shows exactly one copy; two copies sit side by side and scroll
 *  by one full copy width, so the window is never empty and the loop is seamless. */
function FlowWave({ second = false }: { second?: boolean }) {
  const d = wavePath(320, 40, 56);
  return <svg className={`rail-wave ${second ? "is-b" : ""}`} viewBox="0 0 320 40" preserveAspectRatio="none" aria-hidden="true">
    <g className="rail-wave-flow">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d={d} transform="translate(320 0)" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </g>
  </svg>;
}

/** Every card is visible at once and reads completely on its own. Only the waveform moves. */
export function Rail() {
  const scope = useRef<HTMLElement>(null);

  // The flowing waveforms only run while the section is on screen.
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    if (!("IntersectionObserver" in window)) { root.classList.add("is-live"); return; }
    const io = new IntersectionObserver(([entry]) => root.classList.toggle("is-live", entry.isIntersecting), { rootMargin: "80px 0px" });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return <section ref={scope} className="rail-section" aria-labelledby="rail-heading" data-no-redirect data-global-click-exempt>
    <div className="container">
      <h2 id="rail-heading">Made for the moments you can&rsquo;t type.</h2>
      <div className="rail-grid">
        {CASES.map(item => <article key={item.key} className={`rail-card rail-${item.key}`}>
          <h3>{item.title}</h3>
          <p className="rail-outcome">{item.outcome}</p>
          <div className="rail-demo">
            <div className="rail-waves" aria-hidden="true">
              <FlowWave />
              {item.speakers && <FlowWave second />}
            </div>
            <div className="rail-lines">
              {item.lines.map(line => <p key={line.text} className={`rail-line ${line.rewritten ? "is-rewritten" : ""}`}>
                {line.speaker && <span className={`rail-speaker is-${line.speaker}`} aria-hidden="true" />}
                {line.tag && <span className="rail-tag">{line.tag}</span>}
                <span className="rail-line-text">{line.text}</span>
              </p>)}
            </div>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
