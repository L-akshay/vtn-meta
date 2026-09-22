"use client";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "../icons";
import { gsap, ScrollTrigger, SplitText, loadStoryPlugins, tiers, useGSAP, type StoryPlugins } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { trackOnce } from "@/lib/analytics";
import { wavePath } from "@/lib/wave";

/* ---------- Content: one words array, two layouts ---------- */
type Token = { id: string; text: string; filler?: boolean; drop?: boolean };
const WORDS: Token[] = [
  { id: "so", text: "So", drop: true }, { id: "um", text: "um", filler: true }, { id: "the1", text: "the", filler: true }, { id: "launch1", text: "launch", filler: true }, { id: "dash", text: "—", filler: true },
  { id: "the2", text: "the" }, { id: "launch", text: "launch" }, { id: "moves", text: "moves" }, { id: "to", text: "to" }, { id: "thursday", text: "Thursday" },
  { id: "uh", text: "uh", filler: true }, { id: "because", text: "because", drop: true }, { id: "design", text: "design" }, { id: "needs", text: "needs" }, { id: "two", text: "two" }, { id: "more", text: "more" }, { id: "days", text: "days" },
  { id: "and", text: "and", drop: true }, { id: "sams", text: "Sam’s" }, { id: "sending", text: "sending" }, { id: "the3", text: "the" }, { id: "deck", text: "deck" }, { id: "by", text: "by" }, { id: "monday", text: "Monday." },
];
const CLEAN = {
  heading: ["the2", "launch", "moves", "to", "thursday"],
  bullets: [["design", "needs", "two", "more", "days"], ["sams", "sending", "the3", "deck", "by", "monday"]],
};
const byId = Object.fromEntries(WORDS.map(w => [w.id, w])) as Record<string, Token>;
const cleanText = (id: string) => byId[id].text.replace(/\.$/, "");

export const BEATS = [
  { key: "a", caption: "You talk." },
  { key: "b", caption: "It writes it down." },
  { key: "c", caption: "Then cleans it up." },
  { key: "d", caption: "And tells you what matters." },
  { key: "e", caption: "In whatever shape you need." },
] as const;

// The card reshapes through each format. Insets stay inside the card's own padding so the
// morph never clips the text; the radius change carries the difference in shape.
const FORMATS = [
  { key: "email", label: "Email", meta: "To: team@company.com · Subject: Launch moves to Thursday", clip: "inset(0% 0% 0% 0% round 10px)" },
  { key: "post", label: "Post", meta: "Sam · Team update · just now", clip: "inset(0% 3% 0% 3% round 28px)" },
  { key: "outline", label: "Outline", meta: "1. Launch · 1.1 Design · 1.2 Deck", clip: "inset(0% 0% 0% 0% round 6px)" },
] as const;

function Word({ token, className = "" }: { token: Token; className?: string }) {
  return <span className={`sw ${token.filler ? "is-filler" : ""} ${token.drop ? "is-drop" : ""} ${className}`.trim()} data-flip-id={token.id}>{token.text}{token.filler && <i className="sw-strike" aria-hidden="true" />}</span>;
}

/** The only pinned sequence: a waveform becomes words, the words get cleaned into structure. */
export function Story() {
  const scope = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const plugins = useRef<StoryPlugins | null>(null);

  // Building this timeline costs roughly 600ms of style and layout on a throttled phone: SplitText
  // over five captions plus a Flip state across 24 words. Doing it during the initial load pushed
  // total blocking time past 700ms, so it waits for intent instead. The first scroll starts it,
  // which is well before the visitor reaches the story a full viewport down, and a visitor who
  // never scrolls never pays for it.
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    let cancelled = false;
    let io: IntersectionObserver | null = null;
    const onScroll = () => start();
    const start = () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
      loadStoryPlugins().then(loaded => { if (cancelled) return; plugins.current = loaded; setReady(true); });
    };
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) start(); });
      io.observe(el);
    } else {
      start();
    }
    return () => { cancelled = true; io?.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  useGSAP((_, contextSafe) => {
    const root = scope.current;
    if (!root || !contextSafe) return;
    const q = gsap.utils.selector(root);
    const pin = q<HTMLElement>(".story-pin")[0];
    const card = q<HTMLElement>(".story-card")[0];
    const wave = q<SVGSVGElement>(".story-wave")[0];
    const wavePathEl = q<SVGPathElement>(".story-wave path")[0];
    const raw = q<HTMLElement>(".story-raw")[0];
    const clean = q<HTMLElement>(".story-clean")[0];
    const summary = q<HTMLElement>(".story-summary")[0];
    const check = q<SVGPathElement>(".story-check-path")[0];
    const fmtLabel = q<HTMLElement>(".fmt-label")[0];
    const captions = q<HTMLElement>(".story-caption");
    if (!pin || !card || !wave || !wavePathEl || !raw || !clean || !summary || !check || !fmtLabel) return;
    const rawWords = gsap.utils.toArray<HTMLElement>(".sw", raw);
    const cleanWords = gsap.utils.toArray<HTMLElement>(".sw", clean);
    const fillers = rawWords.filter(el => el.classList.contains("is-filler"));
    const strikes = q<HTMLElement>(".sw-strike");
    const drops = rawWords.filter(el => el.classList.contains("is-drop"));
    const puncts = q<HTMLElement>(".punct");
    const metas = q<HTMLElement>(".fmt-meta");

    tiers(tier => {
      // Raw, clean and summary share one grid cell, so the layout never changes when they swap.
      gsap.set(clean, { visibility: "hidden" });

      if (tier === "reduced") {
        // Final state, no pin, no scrub.
        gsap.set(wavePathEl, { drawSVG: "100%" });
        gsap.set(raw, { display: "none" });
        gsap.set(clean, { visibility: "visible" });
        gsap.set(summary, { opacity: 1, y: 0 });
        gsap.set(check, { drawSVG: "100%" });
        gsap.set(metas[0], { opacity: 1 });
        fmtLabel.textContent = "Note";
        return;
      }
      if (!ready) return; // Flip and ScrambleText arrive with the story plugins.

      // Build off the critical path: the section is at least a viewport away when the plugins land.
      let cleanup: (() => void) | null = null;
      let cancelled = false;
      const start = contextSafe(() => {
      if (cancelled) return;
      const splits = captions.map(c => SplitText.create(c, { aria: "none", type: "lines", mask: "lines", linesClass: "story-line" }));
      const lines = (i: number) => splits[i].lines;
      const master = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });

      const build = () => {
        master.clear();
        // Rebuilds happen on refresh; wipe inline state first so from-values never target stale values.
        gsap.set([...rawWords, ...cleanWords, ...strikes, ...puncts, ...metas, summary, check, wavePathEl, card, raw, clean], { clearProps: "all" });
        gsap.set(clean, { visibility: "hidden" });
        gsap.set(raw, { display: "block", opacity: 1 });
        // Captions: first visible, the rest waiting below their masks.
        captions.forEach((c, i) => gsap.set(lines(i), { yPercent: i === 0 ? 0 : 100 }));
        gsap.set(captions, { visibility: "visible" });
        gsap.set(wavePathEl, { drawSVG: "0%" });
        gsap.set(summary, { opacity: 0, y: 36 });
        gsap.set(check, { drawSVG: "0%" });
        gsap.set(strikes, { scaleX: 0 });
        gsap.set(puncts, { scale: 0, opacity: 0 });
        gsap.set(metas, { opacity: 0 });
        gsap.set(card, { clipPath: "inset(0% 0% 0% 0% round 24px)" });
        fmtLabel.textContent = "Note";

        const swap = (from: number, to: number, at: string | number) => {
          master.to(lines(from), { yPercent: -100, duration: 0.35, ease: EASE.inOut, stagger: 0.05 }, at)
            .fromTo(lines(to), { yPercent: 100 }, { yPercent: 0, duration: 0.4, ease: EASE.out, stagger: 0.06 }, `${at}+=0.15`);
        };
        const beat = (key: string) => { master.call(() => { trackOnce("StoryBeat", { beat: key }); }, undefined, key); };

        // a) You talk. The waveform draws itself.
        master.addLabel("start")
          .to(wavePathEl, { drawSVG: "100%", duration: 1.2, ease: "none" }, "start+=0.1")
          .addLabel("a");
        beat("a");

        // b) It writes it down. Words fall out of the waveform.
        swap(0, 1, "a");
        // Offsets relative to the card, independent of scroll position and of any transform already applied.
        const cardTop = (el: HTMLElement | SVGElement) => { let y = 0; let node: HTMLElement | null = el as HTMLElement; while (node && node !== card) { y += node.offsetTop; node = node.offsetParent as HTMLElement | null; } return y; };
        const waveMid = cardTop(wave) + wave.getBoundingClientRect().height / 2;
        if (tier === "lite") {
          const rawLines = new SplitText(raw, { aria: "none", type: "lines", linesClass: "story-raw-line" });
          master.fromTo(rawLines.lines, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12 }, "a+=0.2");
        } else {
          master.fromTo(rawWords, { y: (_, el: HTMLElement) => waveMid - (cardTop(el) + el.offsetHeight / 2), opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.55, stagger: 0.028 }, "a+=0.2");
        }
        master.addLabel("b", ">+0.1");
        beat("b");

        // c) Then cleans it up. Strike fillers, collapse them, regroup into structure, pop punctuation.
        swap(1, 2, "b");
        master.to(strikes, { scaleX: 1, duration: 0.3, stagger: 0.04, ease: EASE.out }, "b+=0.15")
          .to(fillers, { scaleX: 0.4, opacity: 0, duration: 0.3, stagger: 0.03, ease: EASE.inOut }, ">-0.05")
          .to(drops, { opacity: 0, duration: 0.25, ease: EASE.inOut }, "<0.1");
        const regroup = master.duration();
        if (tier === "lite") {
          master.to(raw, { opacity: 0, duration: 0.3, ease: EASE.inOut }, regroup)
            .set(raw, { display: "none" }, ">").set(clean, { visibility: "visible" }, "<")
            .fromTo(clean, { opacity: 0 }, { opacity: 1, duration: 0.4 }, "<");
        } else {
          const Flip = plugins.current!.Flip;
          const state = Flip.getState(rawWords);
          gsap.set(raw, { display: "none" });
          gsap.set(clean, { visibility: "visible" });
          const flip = Flip.from(state, { targets: cleanWords, nested: true, absolute: false, scale: true, duration: 0.8, ease: EASE.inOut });
          gsap.set(clean, { visibility: "hidden" });
          gsap.set(raw, { display: "block" });
          master.set(raw, { display: "none" }, regroup).set(clean, { visibility: "visible" }, regroup).add(flip, regroup);
        }
        master.to(puncts, { scale: 1, opacity: 1, duration: DUR.ui, stagger: 0.08, ease: EASE.out }, ">-0.1")
          .addLabel("c", ">+0.1");
        beat("c");

        // d) And tells you what matters. Transcript dims, summary rises, the action item gets its checkmark.
        swap(2, 3, "c");
        master.to(clean, { opacity: 0.25, duration: 0.4, ease: EASE.inOut }, "c+=0.1")
          .to(summary, { opacity: 1, y: 0, duration: DUR.reveal }, "<0.1")
          .to(check, { drawSVG: "100%", duration: 0.4, ease: EASE.inOut }, ">-0.15")
          .addLabel("d", ">+0.1");
        beat("d");

        // e) In whatever shape you need. The card morphs through email, post, outline; the label scrambles.
        swap(3, 4, "d");
        FORMATS.forEach((format, i) => {
          const at = `d+=${0.15 + i * 0.6}`;
          master.to(card, { clipPath: format.clip, duration: 0.5, ease: EASE.inOut }, at)
            .to(fmtLabel, { duration: 0.35, scrambleText: { text: format.label, chars: "lowerCase", speed: 0.6 } }, at);
          if (i > 0) master.to(metas[i - 1], { opacity: 0, duration: 0.2, ease: EASE.inOut }, at);
          master.to(metas[i], { opacity: 1, duration: 0.3 }, `${at}+=0.1`);
        });
        master.addLabel("e", master.duration() + 0.1);
        beat("e");
      };
      build();

      const trigger = ScrollTrigger.create({
        // Finish the timeline before the sticky pin lets go, so the last beat is held on screen
        // instead of landing at the exact moment the card scrolls away.
        trigger: root, start: "top top", end: "bottom-=18% bottom",
        animation: master, scrub: 0.5,
        snap: { snapTo: "labelsDirectional", duration: { min: 0.2, max: 0.5 }, ease: EASE.inOut, inertia: false },
        onRefreshInit: () => { build(); },
        onUpdate: tier === "full" ? self => { velocity = self.getVelocity(); } : undefined,
      });

      // The waveform gets louder when you scroll faster (full tier only).
      let velocity = 0;
      let tick: ((time: number, delta: number) => void) | null = null;
      let gate: ScrollTrigger | null = null;
      if (tier === "full") {
        const scaleTo = gsap.quickTo(wave, "scaleY", { duration: 0.2, ease: "sine.out" });
        tick = () => {
          velocity *= 0.9;
          scaleTo(gsap.utils.clamp(0.55, 1.6, 0.55 + Math.abs(velocity) / 1400));
        };
        gate = ScrollTrigger.create({
          trigger: root, start: "top bottom", end: "bottom top",
          onToggle: self => { if (self.isActive) gsap.ticker.add(tick!); else gsap.ticker.remove(tick!); },
        });
        if (gate.isActive) gsap.ticker.add(tick);
      }
      cleanup = () => { if (tick) gsap.ticker.remove(tick); gate?.kill(); trigger.kill(); master.kill(); splits.forEach(s => s.revert()); };
      });
      const idle = typeof requestIdleCallback === "function" ? requestIdleCallback(start, { timeout: 1200 }) : window.setTimeout(start, 250);
      return () => { cancelled = true; if (typeof cancelIdleCallback === "function") cancelIdleCallback(idle); else clearTimeout(idle); cleanup?.(); };
    });
  }, { scope, dependencies: [ready] });

  return <section ref={scope} className="story" aria-labelledby="story-heading" data-no-redirect data-global-click-exempt>
    <div className="story-pin">
      <div className="story-captions">
        <h2 id="story-heading" className="story-caption" aria-hidden="false">{BEATS[0].caption}</h2>
        {BEATS.slice(1).map(beat => <p key={beat.key} className="story-caption" aria-hidden="true">{beat.caption}</p>)}
      </div>
      <ol className="story-reduced-captions" aria-hidden="true">{BEATS.map(beat => <li key={beat.key}>{beat.caption}</li>)}</ol>
      <div className="story-stage">
        <div className="story-phone">
          <div className="story-card">
            <div className="story-recorder">
              <svg className="story-wave" viewBox="0 0 320 56" preserveAspectRatio="none" aria-hidden="true"><path d={wavePath()} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" /></svg>
            </div>
            <div className="story-text">
              <p className="story-raw">{WORDS.map((token, i) => <span key={token.id}>{i > 0 && " "}<Word token={token} /></span>)}</p>
              <div className="story-clean" aria-hidden="true">
                <h3 className="sc-h">{CLEAN.heading.map((id, i) => <span key={id}>{i > 0 && " "}<Word token={{ ...byId[id], text: cleanText(id), filler: false, drop: false }} className={i === 0 ? "is-cap" : ""} /></span>)}</h3>
                <ul className="sc-list">{CLEAN.bullets.map((bullet, b) => <li key={b}><span className="sc-dot" />{bullet.map((id, i) => <span key={id}>{i > 0 && " "}<Word token={{ ...byId[id], text: cleanText(id), filler: false, drop: false }} className={i === 0 ? "is-cap" : ""} /></span>)}<span className="punct">.</span></li>)}</ul>
              </div>
              <div className="story-summary">
                <span className="lc-chip"><Sparkles size={14} strokeWidth={2.2} aria-hidden="true" />Summary</span>
                <p>Launch moves to Thursday so design gets two more days.</p>
                <div className="story-action">
                  <svg className="story-check" viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="6" fill="none" stroke="currentColor" strokeWidth="1.6" /><path className="story-check-path" d="M7 12.5l3.4 3.4L17.5 8.6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span>{"Sam — send the deck by Monday"}</span>
                </div>
              </div>
            </div>
            <div className="story-format">
              <span className="fmt-label">Note</span>
              <span className="fmt-metas" aria-hidden="true">{FORMATS.map(format => <span key={format.key} className={`fmt-meta fmt-${format.key}`}>{format.meta}</span>)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
