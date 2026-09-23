"use client";
import { useRef, useState } from "react";
import { ChevronLeft, Pause, Play, Sparkles } from "../icons";
import { gsap, ScrollTrigger, SplitText, tiers, useGSAP } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { trackOnce } from "@/lib/analytics";
import type { Campaign } from "@/lib/variants";
import type { Demo } from "@/lib/demo";
import { waveBars } from "@/lib/wave";

const BARS = 24;
// Resting heights are the recorded waveform itself, so a transcribed note looks like a take that
// was captured rather than a flat line. Live amplitude modulates this shape instead of replacing it.
const REST = waveBars(BARS);
const rest = (i: number) => REST[i];

type Controls = { enterAudio(): void; exitAudio(): void };

/** Hero demo: a waveform speaks, words type in, a summary chip pops. Runs twice, then rests. */
export function LiveNoteCard({ campaign, demo }: { campaign: Campaign; demo: Demo | null }) {
  const scope = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const controls = useRef<Controls | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const transcript = demo ? demo.words.map(w => w.w).join(" ") : campaign.transcript;

  useGSAP(() => {
    const root = scope.current;
    if (!root) return;
    const bars = gsap.utils.toArray<HTMLElement>(".lc-bar", root);
    const glow = root.querySelector<HTMLElement>(".lc-glow");
    const chip = root.querySelector<HTMLElement>(".lc-chip");
    const summary = root.querySelector<HTMLElement>(".lc-summary");
    const status = root.querySelector<HTMLElement>(".lc-status");
    const text = root.querySelector<HTMLElement>(".lc-transcript");
    if (!chip || !summary || !text || !status) return;

    tiers(tier => {
      if (tier === "reduced") {
        bars.forEach((bar, i) => gsap.set(bar, { scaleY: rest(i) }));
        if (glow) gsap.set(glow, { opacity: 0.2 });
        status.textContent = "Transcribed";
        return;
      }
      const live = { amp: 0, mode: "loop" as "loop" | "audio", words: [] as HTMLElement[], tl: null as gsap.core.Timeline | null, lastIndex: -1 };
      const toY = bars.map(bar => gsap.quickTo(bar, "scaleY", { duration: 0.16, ease: "sine.out" }));
      const glowTo = glow ? gsap.quickTo(glow, "opacity", { duration: 0.3, ease: "sine.out" }) : null;
      const audio = audioRef.current;
      const words = demo?.words ?? [];

      const tick = (time: number) => {
        if (live.mode === "audio" && audio) {
          const now = audio.currentTime;
          let index = -1;
          for (let i = 0; i < words.length && words[i].start <= now; i++) index = i;
          if (index !== live.lastIndex) {
            live.words.forEach((el, i) => { el.classList.toggle("is-said", i < index); el.classList.toggle("is-now", i === index); });
            live.lastIndex = index;
          }
          live.amp = index >= 0 && now < words[index].end ? 0.9 : 0.25;
        }
        const a = live.amp;
        for (let i = 0; i < BARS; i++) {
          const noise = 0.5 + 0.5 * Math.sin(time * 9 + i * 0.8) * Math.sin(time * 3.7 + i * 1.9 + 1.2);
          const shape = REST[i];
          // a = 0 rests on the recorded shape; a = 1 makes that same shape speak.
          toY[i](shape * (1 - a) + shape * (0.4 + 0.75 * noise) * a * 1.1);
        }
        glowTo?.(0.26 + a * 0.74);
      };

      let active = false;
      const wake = () => { if (active) return; active = true; gsap.set(bars, { willChange: "transform" }); gsap.ticker.add(tick); };
      const sleep = () => { if (!active) return; active = false; gsap.ticker.remove(tick); gsap.set(bars, { willChange: "auto" }); };
      const trigger = ScrollTrigger.create({
        trigger: root, start: "top bottom", end: "bottom top",
        onToggle: self => {
          if (self.isActive) { wake(); if (live.mode === "loop") live.tl?.play(); }
          else { if (live.mode === "loop") live.tl?.pause(); if (live.mode !== "audio") sleep(); }
        },
      });

      const split = SplitText.create(text, {
        // SplitText's default aria handling puts aria-label on the element, which is prohibited
        // on <p>. The split words stay in the DOM, so screen readers still read the full sentence.
        aria: "none",
        type: tier === "lite" ? "lines,words" : "words", autoSplit: true, wordsClass: "lc-word", linesClass: "lc-line",
        // SplitText owns the returned timeline (reverted with the split), so no context wrapper is needed here.
        onSplit: (self: SplitText) => {
          live.words = self.words as HTMLElement[];
          const pieces = (tier === "lite" ? self.lines : self.words) as HTMLElement[];
          const tl = gsap.timeline({ paused: true, onComplete: () => { status.textContent = "Transcribed"; } });
          // The resting state is visible at first paint (it is the LCP element); each pass starts by clearing it.
          const pass = () => {
            tl.to([...pieces, chip, summary], { opacity: 0, duration: 0.3, ease: EASE.inOut })
              .set(pieces, { y: 6 }).set(chip, { scale: 0.9 })
              .call(() => { status.textContent = "Listening"; })
              .to(live, { amp: 1, duration: 0.35, ease: "sine.out" })
              .to(pieces, { opacity: 1, y: 0, duration: 0.4, stagger: DUR.word, ease: EASE.out }, "<0.1")
              .to(live, { amp: 0.06, duration: 0.5, ease: "sine.inOut" }, ">-0.1")
              .call(() => { status.textContent = "Transcribed"; })
              .to(chip, { opacity: 1, scale: 1, duration: DUR.ui, ease: EASE.out }, "+=0.25")
              .to(summary, { opacity: 1, duration: DUR.reveal, ease: EASE.out }, "<0.1")
              .to({}, { duration: 1.8 });
          };
          pass();
          pass();
          live.tl = tl;
          if (live.mode === "loop" && trigger.isActive) tl.play();
          return tl;
        },
      });
      if (trigger.isActive) wake();

      controls.current = {
        enterAudio: () => {
          live.mode = "audio";
          live.lastIndex = -1;
          live.tl?.pause();
          gsap.set(live.words, { opacity: 1, y: 0 });
          gsap.set([chip, summary], { opacity: 0 });
          text.classList.add("is-karaoke");
          status.textContent = "Playing";
          wake();
        },
        exitAudio: () => {
          live.mode = "loop";
          live.amp = 0.06;
          text.classList.remove("is-karaoke");
          live.words.forEach(el => el.classList.remove("is-said", "is-now"));
          gsap.set(live.words, { opacity: 1, y: 0 });
          gsap.to(chip, { opacity: 1, scale: 1, duration: DUR.ui, ease: EASE.out });
          gsap.to(summary, { opacity: 1, duration: DUR.reveal, ease: EASE.out });
          status.textContent = "Transcribed";
          if (live.tl) live.tl.pause(live.tl.duration());
          if (!trigger.isActive) sleep();
        },
      };

      // Hovering the card replays the whole sequence, so it can be seen again on demand
      // instead of only in the first few seconds after load.
      const replay = () => { if (live.mode === "loop" && live.tl) { wake(); live.tl.restart(); } };
      const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (hoverable) root.addEventListener("pointerenter", replay);

      return () => {
        if (hoverable) root.removeEventListener("pointerenter", replay);
        sleep(); trigger.kill(); split.revert(); controls.current = null;
      };
    });
  }, { scope, dependencies: [transcript] });

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) { audio.pause(); return; }
    setHint(null);
    const request = audio.play();
    request?.catch(() => { setHint("Audio couldn’t start. Tap again, or turn your volume up."); setPlaying(false); });
  };

  return <div className="hero-card-wrap" ref={scope} data-no-redirect data-global-click-exempt>
    <div className="lc-glow" aria-hidden="true" />
    <div className="live-card" role="group" aria-label="Live demo of a voice note becoming text">
      <div className="lc-toolbar" aria-hidden="true"><ChevronLeft size={18} strokeWidth={2.2} /><span>{campaign.noteTitle}</span></div>
      <div className="lc-recorder">
        <div className="lc-wave" aria-hidden="true">{Array.from({ length: BARS }, (_, i) => <i key={i} className="lc-bar" style={{ transform: `scaleY(${rest(i)})` }} />)}</div>
        <span className="lc-status">Listening</span>
      </div>
      <p className="lc-transcript">{transcript}</p>
      <div className="lc-result">
        <span className="lc-chip"><Sparkles size={14} strokeWidth={2.2} aria-hidden="true" />Summary</span>
        <p className="lc-summary">{campaign.summary}</p>
      </div>
      {demo && <div className="lc-play-row">
        <button type="button" className="lc-play" data-no-redirect aria-pressed={playing} onClick={toggle}>
          {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          <span>{playing ? "Pause" : "Play with sound"}</span>
        </button>
        {hint && <span className="lc-hint" role="status">{hint}</span>}
        <audio ref={audioRef} src={demo.src} preload="none" playsInline
          onPlay={() => { setPlaying(true); trackOnce("DemoPlay"); controls.current?.enterAudio(); }}
          onPause={() => { setPlaying(false); if (audioRef.current && !audioRef.current.ended) controls.current?.exitAudio(); }}
          onEnded={() => { setPlaying(false); trackOnce("DemoComplete"); controls.current?.exitAudio(); }} />
      </div>}
    </div>
  </div>;
}
