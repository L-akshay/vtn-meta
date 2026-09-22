# VoiceToNotes Meta landing

Mobile-first paid-acquisition page for VoiceToNotes, built with Next.js 15 (static export), TypeScript, Tailwind CSS v4 and GSAP. Four routes export as static HTML: `/`, `/students/`, `/meetings/`, `/writers/`. Each has its own headline and hero demo copy; the rest of the page is shared.

One motif runs through every animation: **sound becomes text**. A waveform turns into words, and the words get cleaned into structure. Nothing else moves.

## Local development

Use Node.js 22 or newer.

```sh
npm ci
npm run dev -- --port 4173
```

Production preview:

```sh
npm run build
npm run preview
```

`npm run preview` serves `out/` on http://localhost:4173 with representative noindex headers. It is a local utility, not a deployment dependency.

## Cloudflare Pages

- Framework: **Next.js (Static HTML Export)**. Build command `npm run build`, output directory `out`.
- No Workers adapter, server, API route, middleware or runtime secrets are required.
- `public/_headers` is copied to `out/_headers` (`X-Robots-Tag: noindex, nofollow`, security headers, immutable cache for `/_next/static/*`). Every page also carries robots metadata and `robots.txt` disallows crawling. Verify the response headers on the deployed origin; the local preview does not prove Cloudflare's behaviour.
- Enable Cloudflare Web Analytics in the dashboard and let it inject its own beacon. Do not add a second one.

## Environment and analytics

Copy `.env.example` to `.env.local`. All values are public build-time settings; rebuild after changes.

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | Empty | Real Meta Pixel ID. Blank omits the script entirely. |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | `ym4bfkzw5f` | Microsoft Clarity project. Empty disables it. |
| `NEXT_PUBLIC_ENABLE_PAGE_CLICK` | `true` | `false` disables the limited whitespace-click redirect. |

Meta Pixel loads through `next/script` after hydration and tracks one `PageView`. Custom events, each fired once per page view (`lib/analytics.ts`):

| Event | Params | When |
| --- | --- | --- |
| `ClickToStore` | `placement: hero \| sticky \| mic \| side \| inline \| popup \| final \| badge \| page`, `os`, `variant` | Every CTA tap (one per tap; the tap navigates immediately) |
| `DemoPlay` | | First play of the hero audio demo |
| `DemoComplete` | | Demo audio reaches its end |
| `StoryBeat` | `beat: a \| b \| c \| d \| e` | Once per story beat as the timeline passes its label |
| `ScrollDepth` | `depth: 50 \| 90` | Page depth thresholds |

A CTA tap never waits on an animation: the pixel call fires, Android gets `navigator.vibrate(8)` when available, and the native anchor navigates synchronously. `window` also emits `vtn:store-click` and `vtn:event` DOM events for local QA.

Clarity is injected 3.5 seconds after `load` so its parse never competes with hydration or the hero. Its consent implications for EU/UK traffic still need a decision from the privacy owner.

## Attribution and the whitespace redirect

Every smart-link CTA uses `CTA_DEEP_LINK` in `lib/links.ts` plus the visitor's current query string (repeated keys, Unicode and `fbclid` survive, via `buildDeepLink`). Changing that one constant moves every CTA at once, and the previous link sits beside it as `LEGACY_DEEP_LINK` so it can be restored or compared without hunting for it. QA asserts that every smart-link CTA on the page resolves to the configured link.

**Where the smart link actually goes**, checked against the live service on 2026-09-23:

| Visitor | Destination |
| --- | --- |
| iPhone | `apps.apple.com/app/id6747948555` |
| Android | Google Play, with `referrer=_lid…&clickId…` |
| Desktop | `dashboard.voicetonotes.ai/home`, not a store |

Two consequences worth knowing. A desktop visitor who clicks a CTA lands on the web dashboard, which is why the hero carries a QR code from 1024px: a computer cannot install a phone app. And the service **drops the incoming query string at its first hop**, so `utm_source` and `fbclid` do not survive into the store URL. They reach the smart link and may be recorded there, but do not assume they arrive at the store. Confirm with the link provider before relying on them for attribution.

The two official store badges are the exception, deliberately. They point at their own stores, because a badge reading "Download on the App Store" must not land an Android visitor on Google Play. They still report `placement=badge`.

The desktop QR in the hero encodes `CTA_DEEP_LINK` and is not rebuilt automatically. Regenerate `public/qr.svg` whenever that constant changes, or the QR will point at the old destination.

The global click redirect (`GlobalStoreClick` in `components/Conversion.tsx`) only fires on a deliberate tap on explicitly marked whitespace (`[data-store-space]`, the hero and final section backgrounds). It ignores `a`, `button`, `summary`, inputs, labels, `[role=button]`, `[data-no-redirect]`, the footer, active text selections, modifier keys, keyboard activation, drags, long presses and scrolls. The live note card, story, rail, FAQ and reviews are all marked `data-no-redirect`, so tapping Play, a FAQ item or a use-case card never leaves the page. Keep `placement=page` separate from explicit CTA CTR when reporting.

Without JavaScript the static page, the transcript and the default smart-link CTA remain usable; OS labels and query propagation need JavaScript.

## Motion architecture

GSAP is the only animation engine (`motion/react` was removed). Everything is registered once in `lib/gsap.ts`; tokens live in `lib/motion.ts`.

- **Eases** `vtn.out` (`0.22,1,0.36,1`) and `vtn.inOut` (`0.65,0,0.35,1`) via CustomEase; durations press 0.12s, ui 0.24s, reveal 0.6s, word stagger 0.035s. Only `transform`, `opacity`, `clip-path` and stroke (DrawSVG) animate.
- **Load strategy** The hero entrance (wordmark, headline reveal with the waveform cursor) is pure CSS keyframes and runs before hydration. CTA, subhead and proof line are visible at first paint and never fade in. `gsap` core, ScrollTrigger, SplitText, DrawSVG and CustomEase ship with the page; Flip and ScrambleText load, and the story timeline is built, on the first scroll or when the story enters view, whichever comes first (`loadStoryPlugins`). That build is deliberately kept out of the initial load; see the results section for why. Lenis loads only under `(pointer: fine)` and is synced with `lenis.on("scroll", ScrollTrigger.update)` plus `gsap.ticker`; touch keeps native scrolling.
- **Global setup** `ScrollTrigger.config({ ignoreMobileResize: true })`, `document.fonts.ready.then(ScrollTrigger.refresh)`, `gsap.ticker.lagSmoothing(500, 33)`, `force3D: false` so word-level text moves by repaint instead of one compositor layer per word. All GSAP code runs inside `useGSAP({ scope })` and reverts on unmount.
- **Device tiers** (`tiers()` in `lib/gsap.ts`, built on `gsap.matchMedia`): `full` by default (Safari reports no `deviceMemory`, so undefined counts as full); `lite` when `deviceMemory <= 2`, `hardwareConcurrency <= 4` or `saveData` (no velocity-driven waveform, SplitText by lines, Flip regroup replaced by a crossfade); `reduced` for `prefers-reduced-motion` (no pin, no scrub, no loops; every block renders its final state).

Never call a `useGSAP` `contextSafe` wrapper synchronously inside the `tiers()` callback: GSAP would link the parent context into the matchMedia child and recurse on revert. Wrappers are only invoked asynchronously (idle callbacks, observers, timers).

### Previewing motion in an embedded browser

Some embedded browsers always report `prefers-reduced-motion: reduce` regardless of the OS setting. VS Code's Simple Browser is one of them, so the page is permanently static in that panel and the motion cannot be reviewed there. Add `?motion=on` to force the full tier:

```
http://localhost:4173/?motion=on
```

**Local previews animate by default.** The same inline script treats `localhost`, `127.0.0.1` and private LAN addresses as full-motion unless `?motion=off` is passed, so the VS Code panel and a phone on the same Wi-Fi both animate without a flag. Deployed origins are untouched and still honour a real reduced-motion preference, which is verified by serving the built page under a production hostname.

The flag is read once before first paint by the inline script in `app/layout.tsx`, which sets `data-motion="on"` on the root element. Every reduced-motion CSS rule is written as `:root:not([data-motion="on"]) …` so the stylesheet agrees with the JavaScript, and `tiers()` and `currentTier()` check `motionForced()`. This is a preview affordance only. A visitor who has reduced motion enabled and no flag still gets the fully static page.

### Page flow (mobile 390×844, about seven screens)

1. **Hero** (`components/hero/`) Headline lines reveal with a CSS mask sweep (550ms each, second line 150ms later, a thin accent waveform cursor rides the edge then fades). Below the CTA a live note card peeks a fixed 232px above the fold: a 24-bar `quickTo` waveform with noise, the transcript typing in word by word, a Summary chip popping in. It runs twice, rests on its final state, pauses off screen, and starts from the visible resting state (which is the LCP element). Hovering the card replays the whole sequence, so it can be seen again without a reload. The headline reveal is a solid veil the width of each line that slides off with `translateX`; both it and its fade-out animate only `transform` and `opacity`, so the reveal stays on the compositor and does not stutter while React hydrates. `.h1-line` uses `overflow: clip` with a clip margin so the parked veil never adds horizontal overflow and no glyph is cut. When `public/demo/clip.m4a` and `public/demo/words.json` exist, a 48px "Play with sound" button plays the clip through an `<audio>` element (no Web Audio, so the iOS silent switch behaves) and highlights words karaoke-style from `words.json` `[{ w, start, end }]` in `gsap.ticker`; the `play()` promise rejection shows a hint instead of failing silently.
2. **Story** (`components/story/Story.tsx`) The only pinned sequence: a CSS-sticky 100svh container inside a 380svh section (sticky instead of a fixed-position pin, which scored a layout-shift of 3.8), scrubbed at 0.5 with `snapTo: "labelsDirectional"` (0.2–0.5s, `vtn.inOut`, inertia off so a flick lands on a finished beat). Beats: the waveform draws (DrawSVG, amplitude follows scroll velocity), words fall out of it into a raw transcript with fillers in `--ink-2`, fillers get a strike then collapse, one words array with stable `data-flip-id`s regroups into heading plus bullets via `Flip.from(state, { nested: true, scale: true })` (transform-only, because `absolute: true` glitched on backward scrub), punctuation pops, the transcript dims to 0.25 while a summary card rises and the action item draws its checkmark, then the card morphs through email, post and outline with `clip-path` while the label scrambles. Mobile shows a full-width note card at 17px; from 1024px the same card sits in a CSS phone frame. The timeline is rebuilt on refresh with inline state cleared first.
3. **Languages** "Works in 20+ languages." with a greeting that cycles only while in view: ScrambleText for Latin scripts, SplitText character crossfade for Arabic.
4. **Who it's for** (`components/Rail.tsx`) All four cards are shown at once: stacked on phones, two across from 560px, four across from 1100px. There is no horizontal slider, so nothing is hidden off screen and there are no dots to chase. Every card renders its outcome sentence and its demo text unconditionally, which is what stops a card from ever appearing blank because its animation had not run yet. The motif lives in a waveform that never stops: two copies of the same path tile inside a one-copy-wide viewBox and scroll by exactly one copy width, so the loop is seamless and animates only `transform`. The whole section pauses when it leaves the viewport.
5. **Reviews** Magic UI Marquee, two rows in opposite directions, paused on hover and touch. Real App Store reviews only (`lib/reviews.ts`). Empty the array to omit the section.
6. **FAQ** shadcn Accordion (Radix). Answers come only from the store listings and the privacy policy.
6b. **Conversion surfaces** Beyond the hero, sticky bar and final CTA there are three more, each reporting its own placement so their contribution can be read separately.

   - **Inline bands** (`components/InlineCta.tsx`) sit where interest peaks: directly after the story and after the reviews. They look like part of the page rather than an advert, and carry the flowing waveform.
   - **A desktop companion pill** (`components/SideCta.tsx`) in the bottom-right corner from 1024px. It appears once the hero CTA has scrolled away, steps aside during the pinned story and at the final CTA so the page never shows two competing asks, and can be dismissed for the session. Its position and size are chosen so it never overlaps a use-case card at 1024, 1280 or 1440px, which an earlier vertically-centred version did.
   - **A floating mic on phones** (`components/MicCta.tsx`), sitting clear of the sticky bar. It carries a visible "Get the app" label as well as the icon, deliberately: the page never records audio and a bare mic button would imply that it does. It appears once the hero CTA has scrolled away and steps aside at the final CTA.
   - **One invitation** (`components/DemoPrompt.tsx`), shown at most once per session when the visitor reaches the reviews, so it follows engagement rather than interrupting arrival. A mic, a live waveform, and a "Start transcribing" button that is a real anchor, so the tap navigates without waiting on script. It closes on Escape, on the backdrop, on its close button, and by itself when the final CTA comes into view so it can never sit on top of it. The sticky bar steps aside while it is open, and the invitation carries its own CTA, so a call to action is still on screen. Dismissal is remembered in `sessionStorage`, which is per tab, so reloading the same tab will not show it again. Add `?prompt=on` to re-arm it on every load while reviewing:

```
http://localhost:4173/?prompt=on
```

7. **Final CTA** A live waveform runs as the underline beneath "Stop typing. Start talking." rather than settling into a flat line. Below it: the OS-aware primary CTA, a note reading "Free on iPhone and Android", an explicit link to the other store (an iPhone visitor sees "Also on Android" pointing at Google Play, and the reverse on Android), and both official badges. Footer unchanged.

**Sticky bar** appears after the hero CTA leaves the viewport and hides while the final CTA is visible (ScrollTrigger); 64px plus `env(safe-area-inset-bottom)`; a 5-bar mini waveform follows scroll velocity. A CTA is on screen at every scroll position.

## Content sources and proof

- `lib/proof.ts`: "100K+ downloads on Google Play" (Play listing, 2026-09-22). Ratings are omitted on purpose: US App Store 3.9/5 from 14 ratings and Google Play 3.7/5 are inconsistent and weak proof (see the brief's section 21). `LANG_COUNT` is "20+", the figure the Play listing states; the listing names English, Spanish, French, German and Arabic.
- `lib/reviews.ts`: seven verbatim 4- and 5-star written reviews from Apple's public RSS feed (US), with names, platform, stars and dates. The project's fact-check gate asks for team approval of exact review wording before launch.
- FAQ answers quote the Play/App Store listings (free with in-app purchases, 20+ languages, photo import) and the privacy policy (live transcription with no uploads, no selling of content, no training on private content without consent, in-app deletion).

## Missing assets

Never invented. Where an asset or number is missing the page renders nothing for it.

| Asset | Status |
| --- | --- |
| App icon | Present: official Apple icon (`public/brand/app-icon.png`). |
| Brand hex | Verified: `#FF1A4D` from the official site SVG (`--accent`), `#DB123F` for controls. |
| Screenshots | **Missing.** Only tilted promotional App Store compositions exist; clean 3× exports (AVIF + WebP, demo data, 9:41 status bar) were not supplied, so no screenshot is rendered. |
| `public/demo/clip.m4a` + `words.json` | **Missing.** The Play button and karaoke render only when both exist. `words.json` is `[{ "w": "So", "start": 0.15, "end": 0.35 }, ...]` in seconds. |
| Rating | Omitted (unattractive and inconsistent across stores; snapshot above). |
| Downloads | Present: "100K+" from Google Play, dated in `lib/proof.ts`. |
| Reviews | Present: real App Store reviews; team sign-off on wording pending. |
| `LANG_COUNT` | Present: "20+" (Play listing). Only five language names are verifiable, so the greeting cycles five languages instead of eight. |
| Meta Pixel ID | Must be supplied at build time. |

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run preview          # in a second terminal
npm run qa               # Playwright functional checks -> docs/qa-results.json
npm run visual           # iPhone 15 + Pixel 7, 25svh steps, video + contact sheet -> .impeccable/review/visual/
npm run visual:reduced
npm run lhci             # Lighthouse CI (see note on Windows below)
```

`scripts/visual.mjs` scrolls each device profile in 25svh steps with `recordVideo` on, screenshots every step and composes a contact sheet. Ad-hoc probes used during the build (story scrub forward/backward, karaoke timing, CLS sources, CPU-throttled frame trace) live in `.impeccable/probe/`.

### Measuring this page correctly

**Lighthouse's Chrome forces `prefers-reduced-motion: reduce`.** Confirmed by auditing a probe page that printed the media query: it reports `true`. Without a flag, Lighthouse therefore measures the *reduced* tier, which skips almost every animation, and reports a score no real visitor sees. `lighthouserc.json` requests `?motion=on` so the audit always exercises the animated page. Any ad-hoc run should do the same.

The figures below are the animated page. Earlier revisions of this file quoted scores in the low 90s that had been measured, unknowingly, on the static version.

### Results (2026-09-23, local static preview, Clarity enabled)

Lighthouse 13.5, mobile, simulated throttling, median of three runs (`docs/lighthouse-v2.report.json`):

| | Baseline | Final |
| --- | --- | --- |
| Performance (animated page) | 96 (static tier) | 94 |
| Accessibility | 100 | 100 |
| Best practices | 77 | 100 |
| SEO | 66 | 66 (fails only `is-crawlable`, by design: the page is noindex) |
| LCP (simulated) | 2.2s | 2.6s (see note) |
| TBT | 190ms | 200ms |
| CLS | 0 | 0 |
| Initial JS, gzipped, modern browsers | 126 KB | 184 KB |
| Story-only plugins, lazy | | 13 KB (Flip, ScrambleText) |
| Lenis, desktop only | | 5 KB |
| CSS, gzipped | 7.3 KB | 8.5 KB |
| First-view weight (HTML, CSS, JS, font, wordmark, icon) | | about 253 KB |

LCP note: the LCP element is the hero transcript, painted at first paint. Under real emulated 4G (150ms RTT, 1.6 Mbps) with 4× CPU throttling, first paint and LCP both land at 1.1s. Lighthouse's Lantern simulation reports 2.7s because its pessimistic model charges the whole initial JavaScript download and hydration to any element painted after scripts start. Reducing that number further means shipping less initial JavaScript than the mandated stack allows.

Other checks:

- **The story timeline is built on scroll intent, not on load.** Creating it costs roughly 600ms of style and layout on a throttled phone, because SplitText runs over five captions and Flip captures a state across 24 words. Building it during load pushed total blocking time past 700ms and the score to 78. It now starts on the first scroll, or when the story enters view, whichever comes first. A visitor reaches the story a full viewport later, so it is ready by then, and a visitor who never scrolls never pays for it. The measured effect: blocking time fell from about 800ms to about 200ms and the score rose from 78 to 94.
- Every scroll position on a phone has at least one call to action on screen, checked by sweeping the page in quarter-viewport steps. The hide rules key off the final CTA *button*, not its section: the section can still be on screen after the button has scrolled past, which briefly left the footer with no CTA at all.
- `npm run qa` passes: four routes at 360, 375, 390, 430, 768, 1024 and 1440px with no horizontal overflow; noindex meta; one `ClickToStore` per tap with correct placements and preserved query parameters; sticky bar timing; `StoryBeat` a–e and `ScrollDepth` 50/90 once each; taps on text, the demo card, the FAQ and the rail never navigate; reduced motion renders static captions and final states; axe (WCAG 2.1 AA) has no violations; Instagram/Facebook user-agent labels; no-JS fallback; no console errors; CLS 0.
- Visual passes on iPhone 15 and Pixel 7 (standard and reduced motion) run with no errors and CLS 0 across the whole scroll.
- Scroll performance proxy (desktop Chrome, GPU, 4× CPU throttle, wheel-driven scroll through the pinned story): no long task over 50ms, 42 fps average, p95 frame 50ms; unthrottled 58 fps. This is below the 55 fps bar in the proxy harness. A remote-debug trace on a real Pixel 6a / Redmi Note class device is still required to confirm or refute it.
- Total JavaScript for a mobile visitor who reaches the story is about 204 KB gzipped against the 200 KB target. The remaining weight is React/Next runtime (101 KB), GSAP core plus ScrollTrigger, SplitText and DrawSVG (about 60 KB), Radix accordion and the page code.

Not verifiable here: real iOS/Android Instagram and Facebook in-app browsers, actual Meta and Clarity ingestion, Cloudflare response headers and Lenis feel on a physical trackpad. Check these on devices after deployment.

### Lighthouse CI on Windows

`lhci autorun` collects successfully but Lighthouse's Chrome launcher then fails to delete its temporary profile (`EPERM`) and LHCI treats the run as failed. The workaround used here: run `npx lighthouse` three times into `.lighthouseci/lhr-*.json`, then `npx @lhci/cli assert` with `lighthouserc.json`. On Linux CI `npm run lhci` works as is. The assertion set expects performance ≥ 0.9, accessibility ≥ 0.95, best practices ≥ 0.95, CLS ≤ 0.05 and LCP ≤ 2.0s (currently failing on Lantern LCP only), with the SEO category and `is-crawlable` switched off because the page is intentionally noindex.

## Design record

Tokens are unchanged (`app/globals.css` `:root`). The black story section is the only dark area. Depth is one soft shadow under the note card and phone plus an accent glow behind the hero card whose opacity follows the waveform amplitude; nothing else glows. `DESIGN.md` and `.impeccable/design.json` describe the pre-upgrade system; the motion principles above supersede their motion section.
