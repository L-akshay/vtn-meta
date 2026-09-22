# Master coding prompt

You are the senior frontend engineer responsible for rebuilding the VoiceToNotes paid-traffic landing page.

Your goal is not to create a generic SaaS website. Build a highly polished, mobile-first app-install landing page for Meta ad traffic.

## Before writing code

Read every `.md` file in this starter pack.

Then inspect the repository before editing:
- framework/version
- package manager
- current build scripts
- Cloudflare Pages config
- existing landing-page implementation
- existing assets
- current lint/typecheck/test setup

Preserve working infrastructure unless there is a concrete reason to change it.

## Non-negotiable product goal

The visitor should understand:
1. this is VoiceToNotes,
2. they can speak instead of type,
3. the app turns speech into useful written notes,
4. tapping the CTA opens the smart app link.

Do not add secondary conversion goals.

## Stack

- Next.js 15 App Router
- TypeScript
- static export
- Tailwind CSS v4
- `motion/react` only for the scroll-linked showcase
- CSS for all other animation
- Geist variable
- lucide-react only when an icon is genuinely needed
- no UI kit
- no API routes
- no middleware
- no server runtime

## Build order

1. infrastructure + content model
2. hero
3. CTA/deep-link behavior
4. how-it-works
5. showcase
6. use cases
7. optional reviews/proof
8. final CTA/footer/sticky CTA
9. analytics
10. mobile QA

## Visual bar

Use restraint. Product UI is the hero.

Do not:
- create a dashboard collage
- add gradient blobs
- add generic feature cards
- add decorative 3D objects
- add per-section fade-up animations
- use fake product screenshots
- use stock photography
- use multiple accent colors
- use excessive shadows

## Claims

`06_FACT_CHECK_AND_CLAIMS.md` is authoritative for what may be shown.

If a claim or asset is not approved:
- omit it
- do not invent a replacement
- add it to the Missing Assets section of README

## Assets

If real screenshots are absent, build the layout with a neutral internal placeholder component that is hidden in production output. Do not ship visible fake screenshots.

When real screenshots are added:
- process with the repository’s image script
- preserve text readability
- use AVIF and WebP fallback where practical

## Interactions

- OS-aware CTA label, no CLS
- preserve all current query params into smart link
- centralize outbound tracking/navigation
- sticky CTA only after hero CTA leaves view
- sticky CTA hides at final CTA/footer
- reduced-motion behavior must be complete

Global page click behavior is required, but implement exclusions exactly as documented and track it separately as `placement="page"`.

## Analytics

- Meta Pixel: `PageView`
- Meta custom event: `ClickToStore`
- Microsoft Clarity project: `ym4bfkzw5f`
- Cloudflare Web Analytics via Pages setting

Do not double-fire store click events.

## Noindex

Implement all three:
- metadata robots
- robots.txt
- X-Robots-Tag header

## Quality

Optimize for real paid mobile traffic.

The page is non-indexed, but performance still matters for conversion.

Do not chase an SEO Lighthouse score.

## Final engineering response

When done, report:
1. files changed
2. routes created
3. analytics implementation
4. missing assets
5. claims intentionally omitted
6. test/build results
7. any remaining risks in Instagram/Facebook webviews
