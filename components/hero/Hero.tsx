import type { CSSProperties } from "react";
import { StoreLink } from "../Conversion";
import { LiveNoteCard } from "./LiveNoteCard";
import { proof } from "@/lib/proof";
import type { Campaign, Variant } from "@/lib/variants";
import type { Demo } from "@/lib/demo";

/** Thin accent waveform cursor that rides the veil's edge as it slides off each line. */
function Cursor() {
  return <svg className="h1-cursor" viewBox="0 0 14 24" aria-hidden="true">
    <rect x="0" y="8" width="2.5" height="8" rx="1.25" /><rect x="5.75" y="2" width="2.5" height="20" rx="1.25" /><rect x="11.5" y="6" width="2.5" height="12" rx="1.25" />
  </svg>;
}

export function Hero({ variant, campaign, demo }: { variant: Variant; campaign: Campaign; demo: Demo | null }) {
  const lines = variant === "default" ? ["Talk.", "It’s written."] : campaign.title.split(/(?<=\.)\s+/);
  const proofLine = [proof.rating?.label, proof.downloads?.label].filter(Boolean).join(". ");
  return <section className={`hero container variant-${variant}`} aria-labelledby="hero-heading" data-store-space>
    <div className="hero-copy" data-store-space>
      <h1 id="hero-heading">{lines.map((line, index) => (
        // The veil is a solid block the width of the line. Sliding it right with translateX reveals the
        // text left to right on the compositor, with no per-frame repaint of the text itself.
        <span className="h1-line" key={line} style={{ "--delay": `${index * 140}ms` } as CSSProperties}>
          <span className="h1-text">{line}</span>
          <span className="h1-veil" aria-hidden="true"><Cursor /></span>
        </span>
      ))}</h1>
      <p className="hero-description">{campaign.description}</p>
      <div className="hero-conversion">
        <StoreLink placement="hero" id="hero-cta" />
        <p className="download-note">{proofLine ? `${proofLine}. ` : ""}Free on iPhone and Android.</p>
      </div>
      {/* Desktop visitors need a route to a phone: the smart link sends a computer to the web
          dashboard, not to a store. */}
      <div className="hero-qr">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/qr.svg" width={72} height={72} alt="QR code linking to the VoiceToNotes app" loading="lazy" decoding="async" />
        <p>Point your phone here<span>to get the app on iPhone or Android</span></p>
      </div>
    </div>
    <LiveNoteCard campaign={campaign} demo={demo} />
  </section>;
}
