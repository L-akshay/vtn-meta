"use client";
import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, loadStoryPlugins, tiers, useGSAP } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { proof } from "@/lib/proof";

/** Only languages the Google Play listing names explicitly (verified 2026-09-22). */
const GREETINGS = [
  { lang: "en", word: "Hello", latin: true },
  { lang: "es", word: "Hola", latin: true },
  { lang: "fr", word: "Bonjour", latin: true },
  { lang: "de", word: "Hallo", latin: true },
  { lang: "ar", word: "مرحبا", latin: false },
];

/** "Works in 20+ languages." A greeting cycles: ScrambleText for Latin scripts, SplitText crossfade for the rest. */
export function Languages() {
  const scope = useRef<HTMLElement>(null);

  useGSAP((_, contextSafe) => {
    const root = scope.current;
    const word = root?.querySelector<HTMLElement>(".greeting-word");
    if (!root || !word || !contextSafe) return;
    tiers(tier => {
      if (tier === "reduced") return;
      let index = 0;
      let timer: gsap.core.Tween | null = null;
      let active = false;
      const show = (next: number) => {
        const from = GREETINGS[index];
        const to = GREETINGS[next];
        index = next;
        const apply = () => { word.setAttribute("lang", to.lang); word.setAttribute("dir", to.latin ? "ltr" : "rtl"); };
        if (from.latin && to.latin) {
          apply();
          return gsap.to(word, { duration: 0.6, scrambleText: { text: to.word, chars: "lowerCase", speed: 0.7 }, ease: "none" });
        }
        // Non-Latin script: split characters, fade out, swap, fade in.
        const out = new SplitText(word, { aria: "none", type: "chars" });
        const tl = gsap.timeline();
        tl.to(out.chars, { opacity: 0, y: -8, duration: DUR.ui, stagger: 0.025, ease: EASE.inOut })
          .call(() => { out.revert(); word.textContent = to.word; apply(); })
          .add(() => {
            const inn = new SplitText(word, { aria: "none", type: "chars" });
            gsap.fromTo(inn.chars, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: DUR.ui, stagger: 0.03, ease: EASE.out, onComplete: () => inn.revert() });
          });
        return tl;
      };
      const step = contextSafe(() => {
        if (!active) return;
        const animation = show((index + 1) % GREETINGS.length);
        timer = gsap.delayedCall(1.6 + animation.duration(), step);
      });
      const start = () => { if (active) return; active = true; loadStoryPlugins().then(() => { if (active) timer = gsap.delayedCall(1.2, step); }); };
      const stop = () => { active = false; timer?.kill(); timer = null; };
      const trigger = ScrollTrigger.create({ trigger: root, start: "top 90%", end: "bottom 10%", onToggle: self => { if (self.isActive) start(); else stop(); } });
      if (trigger.isActive) start();
      return () => { stop(); trigger.kill(); };
    });
  }, { scope });

  return <section ref={scope} className="languages container" aria-labelledby="languages-heading">
    <h2 id="languages-heading">Works in {proof.languages.count} languages.</h2>
    <p className="greeting" aria-hidden="true"><span className="greeting-word" lang="en" dir="ltr">Hello</span></p>
    <p className="languages-note">Including English, Spanish, French, German and Arabic.</p>
  </section>;
}
