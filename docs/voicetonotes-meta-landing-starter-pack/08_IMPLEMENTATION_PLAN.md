# Implementation plan

## Phase 0 — inspect repo

Before changing anything:
- inspect current package manager
- inspect current Next/Tailwind versions
- inspect existing Cloudflare config
- inspect existing design tokens/assets
- inspect whether the old landing page lives in the same repo

Do not rewrite working deployment code just to match this document.

## Phase 1 — foundation

Create:
- shared route content config
- link constants
- OS detector
- deep-link/query preservation helper
- analytics wrapper
- noindex metadata
- global CSS/tokens

Build first with no optional proof/reviews.

## Phase 2 — hero

Implement:
- wordmark
- route-specific headline
- subhead
- OS-aware CTA
- CSS-drawn phone
- one-shot transcript/waveform/summary demo
- optional proof line
- desktop QR + store badges

Hero is the highest-priority component. Finish it before building the rest.

## Phase 3 — product explanation

Build:
- three-step “How it works”
- real screenshot slots with missing-asset guards
- black showcase
- scroll-linked motion using `motion/react`
- reduced-motion fallback

## Phase 4 — reassurance

Build:
- use-case rows
- optional reviews
- privacy line
- final CTA
- legal footer
- sticky mobile CTA

## Phase 5 — click routing

Centralize outbound navigation.

Do not put separate URL logic in every button.

One function should:
1. derive OS
2. fire Meta event
3. build deep link with current query params
4. navigate

Global page click must call the same function with `placement="page"`.

## Phase 6 — analytics

- add Meta Pixel
- add Clarity
- enable Cloudflare Web Analytics in Pages
- test duplicate events
- test blocked third-party scripts gracefully

## Phase 7 — asset pass

Once source assets arrive:
- derive exact accent
- process screenshots to AVIF/WebP
- generate QR
- add official store badges
- enable verified proof/reviews only if approved

## Phase 8 — mobile QA

Do not call the page done after Chrome responsive mode.

Test actual:
- Instagram webview
- Facebook webview
- iPhone
- mid-range Android

Fix webview-specific sticky/scroll issues before desktop polish.

## Suggested component map

```text
app/
  layout.tsx
  page.tsx
  students/page.tsx
  meetings/page.tsx
  writers/page.tsx
components/
  LandingPage.tsx
  Hero.tsx
  HeroDemo.tsx
  SmartCTA.tsx
  ProofLine.tsx
  HowItWorks.tsx
  Showcase.tsx
  UseCases.tsx
  Reviews.tsx
  PrivacyLine.tsx
  FinalCTA.tsx
  StickyCTA.tsx
  Footer.tsx
lib/
  links.ts
  campaigns.ts
  analytics.ts
  os.ts
  deepLink.ts
  claims.ts
```

Keep components simple and compositional. Do not create a generic design-system abstraction layer for a single landing page.
