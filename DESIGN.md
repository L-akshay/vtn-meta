---
name: VoiceToNotes
description: A bright product demonstration stage for turning speech into useful notes.
colors:
  bg: "#ffffff"
  bg-2: "#f5f5f7"
  ink: "#1d1d1f"
  ink-2: "#6e6e73"
  line: "#d2d2d7"
  action: "#db123f"
  action-hover: "#bc0b33"
  showcase: "#000"
  showcase-muted: "#a2a2a8"
  note-paper: "#f7f7f8"
typography:
  display:
    fontFamily: "Geist, sans-serif"
    fontSize: "54px"
    fontWeight: 600
    lineHeight: 0.99
    letterSpacing: "-.04em"
  display-wide:
    fontFamily: "Geist, sans-serif"
    fontSize: "clamp(64px, 6.8vw, 88px)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Geist, sans-serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-.035em"
  title:
    fontFamily: "Geist, sans-serif"
    fontSize: "19px"
    fontWeight: 550
    lineHeight: "26px"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "26px"
  body-compact:
    fontFamily: "Geist, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "23px"
  label:
    fontFamily: "Geist, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: "24px"
rounded:
  action: "12px"
  product-reference: "22px"
  product-stage: "28px"
  phone: "44px"
  phone-screen: "36px"
  recording-tray: "14px"
spacing:
  compact: "8px"
  small: "12px"
  medium: "20px"
  large: "24px"
  section-mobile: "84px"
  section-wide: "116px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.bg}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "14px 20px"
    width: "100%"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-sticky:
    backgroundColor: "{colors.action}"
    textColor: "{colors.bg}"
    typography: "{typography.label}"
    rounded: "{rounded.action}"
    padding: "10px 20px"
    width: "100%"
  showcase-control:
    backgroundColor: "transparent"
    textColor: "{colors.showcase-muted}"
    padding: "8px 0"
  showcase-control-selected:
    textColor: "{colors.bg}"
  product-reference:
    backgroundColor: "{colors.bg-2}"
    rounded: "{rounded.product-reference}"
  campaign-row:
    textColor: "{colors.ink}"
    padding: "27px 0 31px"
  recording-tray:
    backgroundColor: "{colors.bg}"
    rounded: "{rounded.recording-tray}"
    padding: "10px 14px"
---

# Design System: VoiceToNotes

## Overview

**Creative North Star: "Product demonstration stage"**

VoiceToNotes uses a bright, quiet writing canvas: white and cool-gray surfaces, Geist typography, thin separators, and a restrained red action color. The official waveform and pencil identity and recognizable note editor give the system its product character.

Large sentence-case statements sit beside compact, concrete examples of useful writing. Most surfaces remain flat; depth belongs to the illustrated phone and its small supporting artifacts. A black demonstration surface creates a focused setting for the same product content without introducing a second visual identity.

**Key Characteristics:**
- Bright neutral canvas with a restrained action accent.
- Tight sentence-case headlines and readable supporting prose.
- Product-specific phone, note, and waveform details.
- Thin separators, generous section space, and limited ambient depth.
- Motion has a static, readable reduced-motion alternative.

This record is derived from `app/globals.css`, `app/layout.tsx`, and the shipped LandingPage, Phone, Showcase, and Conversion components. The visual world is established in `.impeccable/landing-brief.md`; product identity commitments are in `PRODUCT.md`.

## Colors

The palette combines cool paper neutrals with a dark raspberry action color.

### Primary
- **Action raspberry** (`action`): download buttons, keyboard focus, and the recording waveform; its deeper hover partner is `action-hover`.

### Neutral
- **White canvas** (`bg`): page background, button lettering, and raised recording surfaces.
- **Cool stage** (`bg-2`): product staging and quiet supporting sections.
- **Charcoal ink** (`ink`): headings and primary prose.
- **Soft gray ink** (`ink-2`): supporting copy, captions, and functional metadata.
- **Hairline gray** (`line`): section and row separators.
- **Black stage** (`showcase`): the product transformation demonstration; `showcase-muted` supports its secondary copy and unselected controls.
- **Note paper** (`note-paper`): the simulated editor's screen surface.

### Named Rules
**The Action Color Rule.** Use raspberry for actions and the voice waveform; let neutral surfaces carry the composition.

## Typography

**Display Font:** Geist, with sans-serif fallback.
**Body Font:** Geist, with sans-serif fallback.

**Character:** A single locally hosted variable family supplies a precise, familiar interface voice. Tight heading tracking and medium weights provide emphasis without uppercase promotional labels.

### Hierarchy
- **Display:** the default mobile hero uses `display`, widening to `display-wide` at the tablet breakpoint. Audience heroes use a smaller mobile treatment (44px, 1.06 line-height, maximum 13ch); the default mobile headline is actually 54px despite the brief's provisional 44px first-viewport description.
- **Headline:** `headline` is the base section heading. Wide base headings grow to 44px; product and audience sections have observed 39–55px variants. The closing statement is 47px on mobile and 72px on desktop.
- **Title:** `title` describes workflow headings. Linked audience rows use 23px headings on mobile and 27px on desktop, with weight 500 and tighter tracking.
- **Body:** `body` describes section support; compact row prose uses `body-compact`. Hero support is 17px/26px on mobile and 18px/28px on desktop. Copy widths follow the content, commonly 30–50ch.
- **Label:** `label` belongs to primary actions. Small download notes, disclosures, and legal links are functional supporting text. Simulated phone dates, recording duration, and status chrome use 9–11px as scale-specific product detail; these are not a general-purpose text ramp for landing-page content.

### Named Rules
**The Sentence Case Rule.** Keep headings and actions in sentence case; hierarchy comes from size, weight, and spacing.

## Layout

The centered content width is capped at 1120px. Mobile has 20px side gutters; at 768px the gutters become 40px. The mobile layout stacks copy and product; desktop uses paired columns. At 1100px, hero and showcase compositions gain wider gaps and larger phone illustrations.

Recurring content sections use the mobile and wide section-spacing tokens. Thin rules separate capability groups, workflow steps, audience links, and the footer. The layout uses an observed mixture of 8px, 12px, 20px, and 24px gaps rather than a strict universal baseline grid.

The black showcase normally spans 330svh on mobile and 320svh on desktop with a sticky viewport. At viewport heights of 760px or less it becomes normal document flow, retaining manual transformation controls and bottom clearance. Reduced motion replaces the interactive phone sequence with all four readable text examples. Safe-area insets support the header, footer, and mobile fixed action.

## Elevation & Depth

Flat neutral sections and fine borders supply most structure. Soft, negative-spread shadows distinguish the simulated hardware and its desktop annotations; they are not a universal card treatment. The mobile fixed action uses an almost opaque white surface and a fine upper border.

### Shadow Vocabulary
- **Phone:** `0 28px 48px -24px rgb(0 0 0 / 35%)` establishes hardware depth.
- **Voice annotation:** `0 12px 32px -12px rgb(0 0 0 / 13%)` lifts the desktop speech artifact.
- **Result annotation:** `0 12px 32px -12px rgb(0 0 0 / 15%)` lifts the desktop note artifact.

### Named Rules
**The Product Depth Rule.** Reserve ambient lift for product artifacts; keep reading sections and linked rows flat.

## Shapes

Actions and desktop annotations use the action radius. Product media containers use the larger product-reference and product-stage radii. Hardware uses a distinct nested phone/phone-screen silhouette, a fine rim, and clipped internal content. The recording tray has its own soft rectangle. Workflow step numbers are circular; waveform bars are narrow rounded strokes. These roles are specific, not interchangeable card presets.

## Components

### Buttons
Full-width raspberry actions are firm and simple, with white medium-weight lettering and the action radius. The regular minimum height is 56px; the fixed mobile variant has a 48px minimum. Hover deepens the fill over 160ms; pressing scales to .985. Keyboard focus is a 3px action-colored outline with 5px offset. Download terms remain a separate functional note.

### Cards / Containers
Product reference media uses a cool neutral surface, clipped corners, and a bottom caption. The demo phone uses note paper, a toolbar, a note title, transcript or derived writing, and semantic note sections. The recording tray has a fine border, rounded corners, and a meaningful waveform; in the showcase it appears only for live transcription, keeping other writing states clear.

### Navigation
The header presents the official wordmark. Footer navigation uses text links with generous touch height and hover underlines. Audience navigation is a full-width ruled row with a title, explanatory prose, a descriptive link cue, and a vector arrow that shifts slightly on hover. It does not need an audience eyebrow above its title.

### Transformation Controls
Four text buttons sit on a fine separator against the black stage. Selected state uses white text and a white lower rule, reinforced with `aria-pressed`. Controls and scroll position select the same note transformation. Short viewports use controls in normal flow; reduced motion presents the complete sequence as static content.

### Phone and Voice Demonstration
The illustrated phone pairs realistic note structure with an explicit illustrative-demo disclosure. Dates, recording state, and elapsed time are legitimate in-product metadata. The hero has a one-shot word reveal, summary entrance, and waveform movement. This content is demonstration material, not fabricated proof or a promise of a specific person's result.

## Do's and Don'ts

### Do:
- **Do** preserve the official wordmark, app identity, and recognizable note editor.
- **Do** use raspberry for actions and the voice waveform, with neutral reading surfaces.
- **Do** keep visible keyboard focus and the shipped reduced-motion content alternative.
- **Do** disclose illustrative product content and retain meaningful note metadata within its product context.
- **Do** keep short-viewport product content in document flow so the full example remains accessible.

### Don't:
- **Don't** turn small phone metadata into a general landing-page body or heading style.
- **Don't** add decorative eyebrows above section or audience headings.
- **Don't** apply the phone's shadow to every section or navigation row.
- **Don't** replace vector icons or the official identity with text glyph approximations.
- **Don't** treat synthetic examples as testimonials or measured product proof.
