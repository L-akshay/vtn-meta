# Asset manifest

## Do not fake the product

The strongest visual asset is the real VoiceToNotes UI.

Do **not** use AI-generated screenshots as if they are the application. Generated visuals may be used for ad creative concepts, but the landing page product screens should be exported from the current real app.

## Required before final polish

Place these files in `public/` or provide equivalents.

### Brand

- `brand/app-icon-1024.png`
- `brand/wordmark.svg`
- `brand/app-store-badge.svg` — official current asset
- `brand/google-play-badge.svg` — official current asset

### Screens

At least 8 clean screens, captured with demo data:
- `screens/live-transcription.avif`
- `screens/summary.avif`
- `screens/action-items.avif`
- `screens/cleanup.avif`
- `screens/rephrase.avif`
- `screens/custom-prompt.avif`
- `screens/student.avif`
- `screens/meeting.avif`

Rules:
- no personal data
- consistent light mode unless the design explicitly needs otherwise
- status bar should be clean/consistent
- crop for 390px landing composition
- text must remain readable

### Optional proof

Only after verification:
- source links for Product Hunt / G2 / Capterra
- approved monochrome SVG marks
- approved current store rating/download copy
- approved store reviews supplied directly by the team

If any proof asset is missing, the section disappears.

## Screenshot processing

Prefer source exports at 2× or 3× and generate AVIF/WebP with `sharp`.

Quality rule:
**readability wins over an arbitrary byte target.**

Targets:
- hero product screenshot: ~40–70 KB if possible
- smaller crops: ~20–40 KB if possible

Do not force a detailed text screenshot below 20 KB if it becomes visibly smeared.

## QR code

Generate once from:
`https://links.voicetonotes.ai/s/1f7O6lrt`

File:
`public/qr.svg`

Desktop only.

## Accent extraction

Do not infer the exact brand accent from compressed website screenshots.

Once `app-icon-1024.png` is supplied:
- inspect it at source resolution
- choose the deliberate non-neutral brand accent
- record exact hex
- use it only for primary CTA and hero waveform

## Social references

Use social profiles to understand tone and current product positioning, not as page navigation.

- Facebook: https://www.facebook.com/people/Voicetonotes/61575570762259/
- X: https://x.com/voicetonotes
- YouTube: https://www.youtube.com/@voicetonotes
- LinkedIn: https://www.linkedin.com/company/voicetonotes-ai/

## Missing-assets behavior

Never render:
- broken image boxes
- placeholder gradients
- lorem ipsum
- fake reviews
- fake ratings
- fake publication logos

The component should return `null` when its required asset/content is not configured.
