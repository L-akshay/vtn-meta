"use client";
import { useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { gsap, tiers, useGSAP } from "@/lib/gsap";
import { DUR, EASE } from "@/lib/motion";
import { PRIVACY } from "@/lib/links";

/** Answers come only from the store listings and the privacy policy (verified 2026-09-22). */
const FAQ = [
  { id: "free", q: "Is it free?", a: "Yes. VoiceToNotes is free to download on the App Store and Google Play. In-app purchases are available." },
  { id: "import", q: "Can I import recordings?", a: "VoiceToNotes transcribes your voice live as you speak, so there is nothing to upload. You can also import photos and turn the text in them into editable notes." },
  { id: "languages", q: "Which languages?", a: "VoiceToNotes supports 20+ languages, including English, Spanish, French, German and Arabic." },
  { id: "privacy", q: "Is my audio private?", a: "Your recordings and transcripts are processed only to deliver the features you use. VoiceToNotes does not sell your notes, recordings or personal content, and does not use private recordings or transcripts to train public AI models without your explicit consent. You can delete your account and its data from Settings in the app.", link: { href: PRIVACY, label: "Read the privacy policy" } },
];

export function Faq() {
  const scope = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string>("");

  useGSAP(() => {
    const body = scope.current?.querySelector<HTMLElement>('.accordion-item[data-state="open"] .accordion-body');
    if (!body) return;
    tiers(tier => {
      if (tier === "reduced") return;
      gsap.fromTo(body, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: DUR.ui, ease: EASE.out });
    });
  }, { scope, dependencies: [open] });

  return <section ref={scope} className="faq container" aria-labelledby="faq-heading" data-no-redirect data-global-click-exempt>
    <h2 id="faq-heading">Good to know</h2>
    <Accordion type="single" collapsible value={open} onValueChange={setOpen} className="accordion">
      {FAQ.map(item => <AccordionItem key={item.id} value={item.id}>
        <AccordionTrigger>{item.q}</AccordionTrigger>
        <AccordionContent>
          <p>{item.a}</p>
          {item.link && <a href={item.link.href} rel="noopener">{item.link.label}</a>}
        </AccordionContent>
      </AccordionItem>)}
    </Accordion>
  </section>;
}
