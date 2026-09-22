# VoiceToNotes Meta Ads Landing Page — Start Here

This folder is the coding handoff for a **mobile-first, conversion-only landing page** for VoiceToNotes.

## Objective

Build a premium landing page for paid Meta traffic whose only meaningful conversion is:

> **Open VoiceToNotes through the smart deep link and continue to the correct app store.**

The page is deliberately **not an SEO site**. It must be non-indexable and should not reproduce the full content architecture of voicetonotes.ai.

## What to build

Static Next.js 15 + TypeScript + Tailwind v4, exported to `out/` and deployed to Cloudflare Pages.

Routes:

- `/` — `Talk. It's written.`
- `/students` — `Record the lecture. Read the notes.`
- `/meetings` — `Every meeting, minuted by AI.`
- `/writers` — `Draft at the speed of speech.`

All routes share components and differ only in campaign copy and showcase ordering.

## Read these files before coding

1. `01_PRODUCT_BRIEF.md`
2. `02_DESIGN_AND_UX_SPEC.md`
3. `03_COPY_AND_CONTENT.md`
4. `04_ANALYTICS_AND_ATTRIBUTION.md`
5. `05_ASSET_MANIFEST.md`
6. `06_FACT_CHECK_AND_CLAIMS.md`
7. `07_QA_ACCEPTANCE.md`
8. `08_IMPLEMENTATION_PLAN.md`
9. `09_CLOUDFLARE_DEPLOYMENT.md`
10. `AGENT_MASTER_PROMPT.md`

Agent-specific helpers:
- `CLAUDE.md`
- `CODEX.md`

## Important corrections from the earlier draft

- **Noindex does not make performance irrelevant.** Paid mobile traffic still bounces when the first screen is slow, especially inside Instagram/Facebook webviews. Keep a lean performance budget, but do not optimize for search indexing.
- Do **not** target Lighthouse SEO ≥95. `noindex,nofollow` is intentional and can lower SEO audits. Target Performance / Accessibility / Best Practices instead.
- Current public VoiceToNotes sources conflict on marketing claims. Do not hardcode `90+ languages`, `1M+ users`, `99% accuracy`, `bank-level encryption`, or “Featured on G2/Capterra/Product Hunt” without an approved source.
- Store ratings are region-specific and change. The proof line must be content-config driven and **render nothing by default** until the team approves the numbers.
- The “click almost anywhere to go to store” behavior is retained because it is a team requirement, but it is a conversion-quality and accessibility risk. See `04_ANALYTICS_AND_ATTRIBUTION.md`.

## Definition of done

A build is done when:

- All 4 static routes export successfully.
- All CTA paths preserve `utm_*`, `fbclid`, and other query parameters.
- Meta Pixel, Microsoft Clarity, and Cloudflare Web Analytics are wired as documented.
- No unverified proof claims are visible.
- Missing screenshots/reviews/logos cause sections to disappear cleanly.
- Mobile widths 360 / 375 / 390 / 430 look intentional.
- Instagram/Facebook in-app browser is tested on a real phone.
- `robots.txt`, `<meta name="robots">`, and `X-Robots-Tag` all block indexing.
