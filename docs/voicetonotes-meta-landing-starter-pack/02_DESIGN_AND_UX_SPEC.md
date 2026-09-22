# Design & UX specification

## Visual direction

Premium, restrained, mobile-first product storytelling. Think Apple-level compositional discipline without copying Apple layouts or assets.

The page should feel:
- precise
- calm
- tactile
- modern
- app-native
- trustworthy

Avoid:
- glassmorphism
- gradient blobs
- card grids
- floating decorative shapes
- fake dashboards
- excessive shadows
- autoplay video
- per-section fade-up animations
- noisy icon rows

## Tokens

```css
:root {
  --bg: #ffffff;
  --bg-2: #f5f5f7;
  --ink: #1d1d1f;
  --ink-2: #6e6e73;
  --line: #d2d2d7;

  /* Temporary fallback only. Replace after sampling the supplied app icon. */
  --accent: #0071e3;

  --radius-button: 12px;
  --radius-phone: 44px;
}
```

### Brand accent rule

Do not guess the permanent accent color from screenshots.

When the team supplies the original 1024px app icon:
1. inspect the source asset,
2. identify the intended brand accent,
3. record the exact hex in `src/app/globals.css`,
4. remove the fallback comment.

The accent is deliberately scarce:
- primary CTA
- hero waveform

Do not use it for random headings, icons, chips, backgrounds, or links.

## Typography

One family: Geist variable.

Mobile:
- H1: 44px / 48px, 600, tracking -0.03em
- H2: 32px / 36px, 600, tracking -0.02em
- body: 17px / 26px, 400
- caption: 13px / 18px

Desktop:
- H1: 72px / 76px

Limits:
- H1 ≤ 28ch
- body ≤ 60ch
- sentence case
- no eyebrow labels
- no all-caps marketing labels
- no single colored word in headlines
- no emoji
- no arrow glyph inside CTA text

## Layout

Mobile:
- content width: `calc(100% - 40px)`
- 20px side gutter
- section spacing: approximately 88–96px, adjusted when a section visually needs less
- 8px spacing grid

Desktop:
- max content width: 1120px
- section spacing: approximately 144–160px

Use `100svh`, never `100vh`, for full-height mobile composition.

Respect:
- `env(safe-area-inset-top)`
- `env(safe-area-inset-bottom)`

## Hero

Minimum height: `100svh`.

Order:
1. small VoiceToNotes wordmark
2. H1
3. one short supporting paragraph
4. primary CTA
5. optional proof line
6. phone/product visual

Mobile:
- CTA full width
- height 56px
- top ~35–45% of the phone visible before first viewport ends
- product visual should visually “continue” into the next screen

### Hero live moment

Inside a CSS-drawn phone:
- waveform animates once for ~1.5s
- 3 lines of transcript type in
- AI summary with 3 short bullets reveals
- no loop
- no video
- no fake complex application chrome

Use realistic demo text, not lorem ipsum.

Recommended demo:

Transcript:
> We should move the launch review to Thursday morning. I’ll update the deck today and Priya can send the customer notes before lunch.

Summary:
- Launch review: Thursday morning
- Update deck today
- Priya sends customer notes before lunch

## Proof strip

Conditional.

Only render if there are verified source URLs for the named platforms. Do not display G2, Capterra or Product Hunt just because logo files exist.

## How it works

Three steps are allowed because this is a genuine process.

1. Tap record.
2. Talk, or import audio/video when the supplied app build actually supports the displayed workflow.
3. Get a clean note with transcript, summary and actions.

Each step uses one real app crop. Do not create a generic card grid.

## Black showcase

The only black section.

Desktop/tablet:
- sticky phone around 60svh
- 4 product screens
- scroll position changes displayed screenshot and caption

Mobile:
- keep sticky behavior only if it feels stable inside Instagram/Facebook webviews
- otherwise prefer an accessible vertical snap/step sequence

Screens:
1. live transcription
2. clean-up / formatting
3. summary + action items
4. rephrase / custom prompt

`prefers-reduced-motion`:
- no scroll-linked transforms
- static screenshot layout

## Use cases

Plain rows, not cards:
- Students — capture lectures without splitting attention between listening and typing.
- Meetings — keep the conversation while VoiceToNotes captures the details.
- Doctors — capture dictated working notes only where use is appropriate and compliant with the user’s workflow.
- Writers — turn spoken ideas into an editable first draft.

Avoid medical-compliance claims unless separately verified.

## Reviews

Conditional. Only use store reviews supplied/approved by the team. Do not invent, paraphrase into quotation marks, or scrape random testimonials.

## Privacy line

Use wording from `03_COPY_AND_CONTENT.md`.

## Sticky bottom CTA

Mobile only.

Show after hero CTA leaves viewport.
Hide when final CTA enters viewport.
Never cover footer legal links.

Height:
- 64px + safe area

Use one primary button and optional small proof text only if approved.

## Desktop

Do not turn desktop into a different website.

Enhancements allowed:
- two-column hero composition
- QR code next to phone
- official store badges
- larger typography
- more whitespace

The content hierarchy must stay identical.
