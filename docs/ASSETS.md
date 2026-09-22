# Asset provenance

Verified 2026-09-22. The source pack contains no raster assets. Downloaded masters live in `docs/source-assets/` (excluded from Git); production assets live in `public/`. No customer data was used.

| Asset | Origin / kind | Dimensions | Usage |
| --- | --- | --- | --- |
| `brand/wordmark.svg` | Original vector extracted from the official https://voicetonotes.ai/ footer SVG; presentation classes removed | 708×112 | Header and footer |
| `brand/app-icon.png` | Official Apple icon, downloaded via https://itunes.apple.com/lookup?id=6747948555&country=us; resized | 256×256 | Final CTA and brand reference |
| `brand/favicon.png` | Same official Apple icon | 64×64 | Browser tab |
| `brand/apple-touch-icon.png` | Same official Apple icon | 180×180 | Saved bookmark |
| `screens/transcription-800.avif` | Official Apple screenshot 5, compressed; no fictional interface | 800×1731 | How-it-works product image |
| `screens/transcription-480.avif` | Same official screenshot, smaller export | 480×1039 | Available responsive source |
| `screens/editor-800.avif`, `editor-480.avif` | Official Apple screenshot 3, compressed | 800×1731 / 480×1039 | Reference/replacement asset |
| `screens/official-home.avif` | https://voicetonotes.ai/assets/Home/iphone-17.avif | 280×580 | Reference only; not displayed because it emphasizes unrelated novels |
| `store/app-store.svg` | https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg | 120×40 | Official download badge |
| `store/google-play.png` | https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png | Original master | Official badge master |
| `store/google-play.webp` | Same official badge with outer transparent padding removed; no artwork alterations | 144px high | Final store badge |
| `qr.svg` | Generated with qrcode from CTA_DEEP_LINK (regenerated 2026-09-23 for links.voicetonotes.ai/s/UIitUJQV) | Vector | Desktop QR in the hero |
| `fonts/geist-latin.woff2` | @fontsource-variable/geist package; SIL Open Font License | Variable Latin font | Local font for site and Remotion |
| Phone/editor presentation | Reconstructed DOM/CSS based on official App Store editor and transcription screens | Responsive | Hero and showcase; visibly labeled illustrative demo |
| Waveform | Deterministic SVG polyline (lib/wave.ts) and CSS bars; synthetic visual signal | Responsive | Hero card, story, rail, final CTA underline |
| Reviews | Verbatim 4- and 5-star written reviews from Apple's public RSS feed for app id 6747948555 (US), fetched 2026-09-22; see lib/reviews.ts | Text | Reviews marquee |
| Icons | Inline SVG paths from Lucide (ISC) in components/icons.tsx | Vector | Card, story, FAQ, reviews |

## Brand color

The Android icon is black and white. The official website SVG explicitly uses `#FF1A4D` for its accent stars; App Store artwork uses the same red/pink family. `--accent: #ff1a4d` preserves that source value. Primary controls use a darker related `--action: #db123f` to meet text contrast, rather than guessing an unrelated blue. The black/white/red wordmark is the actual website vector.

## Product demonstrations

The source-quality store images are promotional compositions with tilted devices. The hero and showcase therefore reconstruct the editor's light background, simple back/title/more toolbar, typography hierarchy and bottom waveform using semantic HTML, with synthetic campaign examples. Their summaries and actions illustrate supported product outcomes; they are not represented as untouched app captures. The how-it-works image is official. No invented product screens were produced by image generation.

The requested Imagegen skill was evaluated: the brief prioritizes real UI and code-native phone/waveform geometry, so generated raster art would add no needed content. Assets follow that sourcing priority.

## Missing / replace before campaign launch

- Direct, clean 3x screenshots of the note editor, summary and action-item screens are still missing; only tilted promotional App Store compositions exist. The page renders no screenshot until they are supplied.
- public/demo/clip.m4a and public/demo/words.json (hero "Play with sound" demo) are missing; the button renders only when both exist.
- Meta Pixel ID must be supplied at build time.
- Star ratings are omitted (US App Store 3.9/5 from 14 ratings and Google Play 3.7/5 on 2026-09-22 are inconsistent and weak proof). The "100K+ downloads on Google Play" line and the reviews carry their source and verification date in lib/proof.ts and lib/reviews.ts; confirm the exact review wording with the team before launch.
- Social profiles were checked for reference; Facebook and YouTube did not provide accessible content, X returned no useful content, LinkedIn was readable. No social assets are used.

Run `npm run assets` when the downloaded official masters and `docs/apple-listing.json` are available. It generates optimized local assets, the QR and the font copy. Normal builds use committed production assets and do not depend on external asset downloads.
