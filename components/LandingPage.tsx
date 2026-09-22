import { campaigns, type Variant } from "@/lib/variants";
import { PRIVACY, TERMS } from "@/lib/links";
import { reviews } from "@/lib/reviews";
import { Analytics } from "./Analytics";
import { ConversionProvider, GlobalStoreClick, StoreLink } from "./Conversion";
import { Hero } from "./hero/Hero";
import { StickyBar } from "./StickyBar";
import { loadDemo } from "@/lib/demo";
import { Story } from "./story/Story";
import { Languages } from "./Languages";
import { Rail } from "./Rail";
import { Reviews } from "./Reviews";
import { Faq } from "./Faq";
import { FinalCta } from "./FinalCta";
import { InlineCta } from "./InlineCta";
import { SideCta } from "./SideCta";
import { DemoPrompt } from "./DemoPrompt";
import { MotionRoot } from "./motion/MotionRoot";

function Wordmark() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/wordmark.svg" alt="VoiceToNotes" width={177} height={28} className="wordmark" fetchPriority="high" decoding="sync" />;
}

export function LandingPage({ variant = "default" }: { variant?: Variant }) {
  const campaign = campaigns[variant];
  const demo = loadDemo();
  return <ConversionProvider variant={variant}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header container"><Wordmark /></header>
    <main id="main">
      <Hero variant={variant} campaign={campaign} demo={demo} />
      <Story />
      <InlineCta id="after-story" line="That was one note. Yours takes a minute." />
      <Languages />
      <Rail />
      {reviews.length > 0 && <Reviews />}
      <InlineCta id="after-reviews" line="Start with the thought you had this morning." />
      <Faq />
      <FinalCta />
    </main>
    <footer className="footer container" data-global-click-exempt><div className="footer-top"><Wordmark /><div className="legal-links"><a href={PRIVACY}>Privacy</a><a href={TERMS}>Terms</a></div></div><div className="footer-bottom"><p>© 2026 VoiceToNotes</p><StoreLink placement="footer" className="footer-cta">Get the app</StoreLink></div></footer>
    <StickyBar /><SideCta /><DemoPrompt /><GlobalStoreClick /><MotionRoot /><Analytics variant={variant} />
  </ConversionProvider>;
}
