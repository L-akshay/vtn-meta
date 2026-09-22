# VoiceToNotes Meta Ads Landing Page — Master Execution Prompt

You are the **senior product designer, conversion designer, frontend engineer, motion designer, analytics engineer and QA owner** for this project.

You have already been given a ZIP containing the complete VoiceToNotes landing-page specification and implementation documents.

Your job is **not to make another plan**.

Your job is to:

1. inspect the entire ZIP,
2. understand the existing VoiceToNotes brand and product,
3. inspect the live reference website and official app listings,
4. prepare/generate/source the required visual assets,
5. design the page,
6. implement the complete production-ready website,
7. test it,
8. fix issues,
9. leave it ready for Cloudflare Pages deployment.

Do not stop after analysis.

Do not ask for confirmation for ordinary implementation decisions.

Make sensible senior-level decisions and continue working.

---

# 1. FIRST: READ THE ENTIRE ZIP

Before writing implementation code, recursively inspect the supplied ZIP/project files.

Read all specification files, especially files equivalent to:

* `00_START_HERE.md`
* `01_PRODUCT_BRIEF.md`
* `02_DESIGN_AND_UX_SPEC.md`
* `03_COPY_AND_CONTENT.md`
* `04_ANALYTICS_AND_ATTRIBUTION.md`
* `05_ASSET_MANIFEST.md`
* `06_FACT_CHECK_AND_CLAIMS.md`
* `07_QA_ACCEPTANCE.md`
* `08_IMPLEMENTATION_PLAN.md`
* `09_CLOUDFLARE_DEPLOYMENT.md`
* `10_VISUAL_ASSET_BRIEF.md`
* `AGENT_MASTER_PROMPT.md`
* `CLAUDE.md`
* `CODEX.md`
* `README.md`

Also inspect any code, assets, screenshots, icons and existing project structure included with the ZIP.

Do not blindly implement one MD file while ignoring the others.

Build a complete mental model first.

### Requirement priority

When requirements conflict, use this priority:

1. This master prompt
2. factual correctness / real product behavior
3. product brief
4. UX/design specification
5. analytics specification
6. implementation plan
7. individual examples/snippets

Do not preserve a weak implementation simply because an older document mentioned it.

---

# 2. PROJECT OBJECTIVE

Build an exceptionally polished **mobile-first conversion landing page for VoiceToNotes**.

This is NOT the main SEO website.

It is a dedicated landing experience for traffic coming primarily from:

* Meta Ads
* Instagram
* Facebook
* Instagram in-app browser
* Facebook in-app browser

Approximately:

* 95% mobile traffic
* 5% desktop traffic

Therefore mobile is the primary product.

Desktop should still look premium, but never compromise mobile to improve desktop.

The main conversion is:

**visitor → VoiceToNotes app**

The visitor should understand the product in approximately 3 seconds.

The experience should communicate:

> Speak naturally → VoiceToNotes turns it into useful written content.

The page must feel closer to a premium native product launch than a generic SaaS landing page.

Think:

* Apple-level restraint
* premium typography
* excellent composition
* real product UI
* beautiful mobile interactions
* generous whitespace
* confident messaging
* extremely obvious CTA
* minimal cognitive load

Do NOT make it look like:

* a Tailwind template
* an AI SaaS template
* a startup dashboard
* a card-grid website
* a WordPress marketing site
* a generic gradient-heavy landing page

---

# 3. LIVE BRAND REFERENCES — INSPECT THEM YOURSELF

Before finalizing visuals, inspect the current live brand.

Primary website:

https://voicetonotes.ai/

Official social accounts:

Facebook:
https://www.facebook.com/people/Voicetonotes/61575570762259/

X:
https://x.com/voicetonotes

YouTube:
https://www.youtube.com/@voicetonotes

LinkedIn:
https://www.linkedin.com/company/voicetonotes-ai/

Official app destinations:

iOS:
https://apps.apple.com/us/app/voicetonotes-ai-voice-to-text/id6747948555

Android:
https://play.google.com/store/apps/details?id=ai.voicetonotes.mobileapp

Deep link:

https://links.voicetonotes.ai/s/1f7O6lrt

Study these sources for:

* actual logo treatment
* app icon
* brand color
* typography feel
* screenshots
* UI style
* product capabilities
* wording
* interface shapes
* visual language

Do NOT simply clone the existing main website.

The main site is a **brand/product reference**.

The Meta landing page should be materially better and considerably more focused.

---

# 4. BRAND RULE

Preserve recognizability from the existing VoiceToNotes brand.

Reuse or derive from the actual brand:

* wordmark
* app icon
* accent color
* product UI
* visual tone
* product terminology

Do not randomly redesign VoiceToNotes into another brand.

At the same time, do not inherit weak layout decisions from the existing site.

This new landing page should feel like:

> VoiceToNotes after a world-class consumer product design team redesigned its acquisition experience.

---

# 5. VISUAL ASSETS — IMPORTANT

Visual quality is one of the highest priorities.

Do not use placeholders.

Do not use low-quality stock imagery.

Do not ship grey rectangles saying "screenshot here."

## Asset sourcing order

Use this order:

### First choice — real product assets

Look for usable assets from:

* supplied ZIP
* current repository
* voicetonotes.ai
* official App Store listing
* official Google Play listing
* official VoiceToNotes social accounts

Where possible obtain:

* actual app icon
* actual wordmark/logo
* actual VoiceToNotes UI
* actual application screenshots
* legitimate store badges

Use high-resolution versions.

---

## Second choice — recreate presentation, not product functionality

You may generate or create high-quality visual compositions based on the real product.

Examples:

* beautiful phone presentation
* app screenshot crop composition
* waveform treatment
* visual transcription animation
* abstract voice/audio motif
* supporting section artwork
* tasteful product backdrop
* feature illustration
* promotional social-style composition

These should reference the **real VoiceToNotes visual identity**.

Do NOT introduce a completely unrelated art direction.

---

## Product screenshots must remain credible

Do not fabricate major VoiceToNotes functionality merely to make a pretty screenshot.

For core product demonstrations prefer:

**real VoiceToNotes UI placed inside beautifully composed device frames.**

If a screen must be reconstructed:

* closely follow real VoiceToNotes UI
* use realistic demo content
* do not claim unsupported functionality
* make it clearly representative of the real app

Never use personal/customer data.

---

# 6. HIGH-QUALITY ASSET CREATION

If your environment includes image-generation capabilities, use them where appropriate.

Generate supporting assets at production quality.

But generated artwork must:

* match the VoiceToNotes palette
* feel premium
* avoid obvious AI-art artifacts
* avoid excessive gradients
* avoid glossy 3D SaaS clichés
* avoid random floating objects
* avoid meaningless abstract blobs
* leave sufficient negative space
* support rather than overpower the actual product

Product screenshots and app interface remain the hero.

Prefer:

**real interface + art direction**

over:

**fictional AI illustration + tiny interface**

---

# 7. MOBILE DESIGN FIRST

Design for **390px width first**.

Then validate:

* 360px
* 375px
* 390px
* 430px

Then tablet/desktop.

Do not begin by designing a 1440px desktop page and collapsing it.

The 390px version is the canonical design.

Test inside narrow webview-like conditions representative of Instagram/Facebook in-app browsers.

Handle:

* safe areas
* browser chrome
* dynamic viewport heights
* sticky CTA
* touch ergonomics
* long URLs/query parameters
* keyboard-independent layout
* reduced-motion users

Use:

`100svh`

where viewport-height behavior matters.

Do not rely on `100vh`.

---

# 8. TECHNOLOGY

Use:

* Next.js 15
* App Router
* TypeScript
* static export
* Tailwind CSS v4
* CSS variables for design tokens
* Geist variable font
* lucide-react only where icons are necessary
* `motion/react` ONLY for the major scroll-linked showcase interaction
* CSS for ordinary transitions and animations

Configuration:

```ts
output: "export"

images: {
  unoptimized: true
}
```

Deployment:

**Cloudflare Pages**

Expected:

```text
npm run build
```

output:

```text
out/
```

No server runtime.

No API routes.

No middleware.

No unnecessary dependencies.

No component library.

No UI kit.

No GSAP unless there is a truly unavoidable technical reason—and there should not be.

---

# 9. DESIGN SYSTEM

Core palette:

```css
--bg: #FFFFFF;
--bg-2: #F5F5F7;
--ink: #1D1D1F;
--ink-2: #6E6E73;
--line: #D2D2D7;
```

For `--accent`:

DO NOT guess if an actual VoiceToNotes app icon / source asset is available.

Extract the appropriate brand accent from the real asset.

Only use fallback:

```css
--accent: #0071E3;
```

when the true value cannot reasonably be determined.

### Accent restraint

Accent color should be primarily reserved for:

* main conversion CTA
* voice/waveform/product interaction

Do not paint every heading, icon and section blue.

---

# 10. TYPOGRAPHY

Use Geist variable as the single main family.

Desired feel:

* extremely clean
* calm
* premium
* readable
* consumer-product oriented

Mobile starting points:

```text
h1: 44px / 48px / 600 / -0.03em
h2: 32px / 36px / 600 / -0.02em
body: 17px / 26px / 400
caption: 13px / 18px
```

Desktop hero:

approximately:

```text
72px / 76px
```

Adjust optical sizing intelligently when required.

Do not blindly preserve values if the result looks worse on a specific breakpoint.

Limits:

* headline approximately ≤28 characters where practical
* body copy ≤60 characters per line where practical
* sentence case
* no eyebrow-label abuse
* no ALL CAPS decorative copy
* no random highlighted word in a headline
* no emojis
* no arrow glyph inside primary buttons

---

# 11. PAGE STRUCTURE

Keep the page deliberately focused.

Approximately 6–8 meaningful sections.

Do not turn this into a giant corporate site.

The intended experience is approximately:

1. Hero
2. Compact trust/proof
3. How it works
4. Product showcase
5. Use cases
6. Reviews/trust where genuinely available
7. Privacy reassurance
8. Final CTA
9. Minimal footer

---

# 12. HERO — MAKE THIS EXCEPTIONAL

Hero is the most important component.

Mobile hero should feel like an app launch page.

Minimum height around:

```css
min-height: 100svh;
```

Top:

VoiceToNotes wordmark only.

No normal navigation menu.

No hamburger menu.

No login.

No pricing.

No blog navigation.

No distractions.

Default headline:

# Talk. It's written.

Primary support line should communicate that VoiceToNotes turns speech into useful notes, transcripts, summaries and action items.

Keep it concise.

Primary CTA:

iOS:
**Get it free for iPhone**

Android:
**Get it free on Android**

Desktop/server default:
**Get the app free**

CTA:

* approximately 56px high
* large touch target
* strong accent fill
* white text
* 12px-ish radius
* full-width or near-full-width on mobile
* immediately visible

Below hero copy, the user should see enough of the product phone to want to scroll.

---

# 13. HERO PHONE EXPERIENCE

Use a CSS-drawn phone frame.

No heavy bezel PNG.

No generic iPhone mockup image if CSS can produce a cleaner result.

Approximate frame radius:

44px.

Use the real VoiceToNotes interface wherever possible.

Hero demo sequence:

1. waveform becomes active
2. realistic transcript appears progressively
3. transcript completes
4. AI-generated structured result becomes visible
5. summary/action items appear

The sequence should communicate the product without the user reading paragraphs.

Example demo speech content:

> We need to finish the campaign landing page by Friday. Lakshay will handle implementation and I’ll review analytics before launch.

Then transform visually into:

```text
Summary

Campaign landing page should be completed by Friday.

Action items
• Finish implementation
• Review analytics before launch
```

Use neutral demo data.

Do not use customer information.

---

# 14. HERO ANIMATION

This should be the primary load animation.

Keep it subtle and premium.

Possible flow:

0ms:
phone visible

250ms:
waveform activates

500ms:
transcription begins

~1500ms:
transcript complete

~1800ms:
AI summary moves into view

Then stop.

Do not loop aggressively.

Do not create blinking distracting animations.

Do not animate every element on page load.

Respect:

```css
prefers-reduced-motion
```

---

# 15. DESKTOP HERO

Desktop should feel intentionally designed rather than a stretched mobile layout.

Use a balanced composition such as:

* copy/CTA on left
* phone/product presentation on right

Official store badges and QR code can be secondary conversion mechanisms.

QR destination:

```text
https://links.voicetonotes.ai/s/1f7O6lrt
```

Generate QR once during development and store it locally.

Do not generate the QR client-side on every visit.

---

# 16. HOW IT WORKS

Keep the real sequence extremely easy to understand.

### 1. Tap record

Start capturing your thought, lecture, meeting or conversation.

### 2. Speak naturally

Or import supported audio/video if current product behavior supports it.

### 3. Get useful notes

Transcript, formatting, summary and action items where supported.

Each step may include a small REAL screenshot/detail.

Do not make generic illustration cards.

The user should understand the workflow without needing explanation.

---

# 17. MAIN PRODUCT SHOWCASE

This is the visual centerpiece after the hero.

Use the single black section.

Background:

```text
#000000
```

This section may use `motion/react`.

Create a polished scroll-linked experience.

Suggested product states:

### Live transcription

> Words appear as you speak.

### Clean-up

> Turn rough speech into clear, readable notes.

### Summaries

> Long conversation. Short summary. Clear next steps.

### Rephrase

> Turn the same note into the format you need.

Use real product screenshots/screens where available.

Use a sticky phone or highly polished mobile product viewport.

Text should change in synchronization with the displayed product state.

Do not overcomplicate the scroll mechanic.

Scrolling must remain smooth inside mobile in-app browsers.

Reduced motion:

replace the linked animation with a clean static presentation.

---

# 18. USE CASES

Do NOT make four floating cards.

Prefer clean full-width rows or compact editorial sections.

Candidate audiences:

### Students

Record a lecture and revisit the important points later.

### Meetings

Capture discussion and turn it into clear notes and follow-ups.

### Doctors

Only use healthcare-related wording that is supported and does not imply inappropriate medical compliance/security guarantees.

### Writers

Capture ideas while they are still fresh.

If a use case is not supported by the current actual product, revise or remove it.

---

# 19. REVIEWS

Only use REAL reviews.

The current store listings can change by region and over time.

Therefore:

* inspect the store
* verify review text
* verify attribution
* verify platform
* do not invent names
* do not invent review counts
* do not fabricate star scores

Show approximately three reviews only when enough legitimate reviews are available.

No fake avatars.

A clean quote + first name/username + platform is enough.

If sufficient verified reviews cannot be obtained, omit the section.

Do not weaken trust with fake social proof.

---

# 20. PROOF / FEATURED LOGOS

Do not automatically show:

* Product Hunt
* G2
* Capterra

just because an older specification listed them.

Verify that VoiceToNotes genuinely has the corresponding presence/listing/recognition.

If verification exists, use appropriate monochrome assets.

If verification cannot be established, omit them.

Never manufacture "Featured on" credibility.

---

# 21. RATINGS AND DOWNLOAD COUNTS

Do not hardcode outdated ratings.

Store ratings can vary by region.

If displaying proof such as:

```text
4.x ★ · 100K+ downloads
```

verify it from the current relevant store first.

If there is ambiguity or an unattractive/unreliable regional mismatch, simply omit the rating line.

Conversion design does NOT require us to show every available metric.

Trustworthiness is more important.

---

# 22. PRIVACY

Use only claims supported by the current VoiceToNotes privacy policy.

Do not write unsupported claims such as:

* bank-level security
* zero data retention
* nobody can ever access your data
* HIPAA compliant
* end-to-end encrypted

unless there is direct current evidence.

Link the privacy statement to the real policy.

Keep this section concise.

Its purpose is reassurance, not a legal essay.

---

# 23. FINAL CTA

Strong standalone section.

Headline:

# Stop typing. Start talking.

Primary button:

same OS-aware CTA.

Include official:

* App Store badge
* Google Play badge

Use official assets and reasonable clear space.

No additional competing conversion.

---

# 24. MOBILE STICKY CTA

The sticky conversion bar is important.

Show after the main hero CTA leaves the viewport.

Hide while final CTA is visible.

Must not obscure footer legal links.

Account for:

```css
env(safe-area-inset-bottom)
```

Approximate base height:

64px plus safe area.

Keep visually calm.

White/translucent treatment is acceptable.

CTA remains the dominant element.

---

# 25. ROUTE VARIANTS

Create static variants sharing the same system/components:

```text
/
 /students
 /meetings
 /writers
```

Default:

```text
Talk. It's written.
```

Students:

```text
Record the lecture. Read the notes.
```

Meetings:

```text
Every meeting, minuted by AI.
```

Writers:

```text
Draft at the speed of speech.
```

The rest of each page can adapt slightly:

* showcase ordering
* first supporting example
* use-case emphasis

Do not duplicate four independent codebases.

Use shared components and structured variant configuration.

---

# 26. HEADLINE / AD MATCHING

These routes exist for paid-ad message matching.

Do not make them decorative route aliases.

A student ad should land on the student message.

A meeting ad should land on the meeting message.

A writer ad should land on the writer message.

Keep campaign query parameters intact.

---

# 27. DEEP LINK HANDLING

Define centrally:

```ts
export const DEEP_LINK =
  "https://links.voicetonotes.ai/s/1f7O6lrt";

export const APP_STORE =
  "https://apps.apple.com/us/app/voicetonotes-ai-voice-to-text/id6747948555";

export const PLAY_STORE =
  "https://play.google.com/store/apps/details?id=ai.voicetonotes.mobileapp";
```

Every major CTA should go to `DEEP_LINK`.

Preserve the current page query string.

For example:

Landing URL:

```text
/students?utm_source=instagram&utm_campaign=student1&fbclid=XYZ
```

CTA destination must preserve:

```text
utm_source=instagram
utm_campaign=student1
fbclid=XYZ
```

Do not drop attribution.

App Store / Google Play direct URLs are secondary fallback destinations.

---

# 28. GLOBAL PAGE CLICK REQUIREMENT

The project requires a global page-click behavior.

A click on otherwise non-interactive page space may navigate to the deep link.

However DO NOT trigger it when the click is:

* inside `<a>`
* inside `<button>`
* inside another explicitly interactive control
* within footer
* while selecting text
* part of a swipe/drag
* part of product-showcase scrolling
* likely to cause accidental navigation

Implement defensively.

Track these clicks separately as:

```text
placement: "page"
```

Do not mix them with deliberate CTA clicks.

This distinction is important when evaluating paid-campaign conversion quality.

Document the behavior and its accidental-click risk in README.

---

# 29. OS DETECTION

Detect client platform from user agent.

Use it only to adapt CTA copy.

Examples:

iOS:

```text
Get it free for iPhone
```

Android:

```text
Get it free on Android
```

Other/SSR fallback:

```text
Get the app free
```

The initial server/static version must occupy equivalent dimensions to avoid layout shift.

Do not build a complicated device-detection framework.

---

# 30. META PIXEL

Environment variable:

```text
NEXT_PUBLIC_META_PIXEL_ID
```

Load using `next/script` appropriately.

Track:

```text
PageView
```

Then track:

```text
ClickToStore
```

with metadata:

```ts
{
  placement:
    | "hero"
    | "sticky"
    | "final"
    | "badge"
    | "page",
  os:
    | "ios"
    | "android"
    | "desktop"
    | "unknown",
  variant:
    | "default"
    | "students"
    | "meetings"
    | "writers"
}
```

Avoid duplicate events from event bubbling.

---

# 31. MICROSOFT CLARITY

Required Clarity Project ID:

```text
ym4bfkzw5f
```

Integrate Microsoft Clarity correctly.

Load it once.

Do not block rendering.

Verify it initializes in production.

If sensible, add useful custom tags such as:

```text
landingVariant
deviceOS
```

but do not over-engineer analytics.

---

# 32. CLOUDFLARE WEB ANALYTICS

This site is deployed on Cloudflare Pages.

Use Cloudflare Web Analytics.

If enabling it through the Cloudflare dashboard automatically injects the beacon, document the required deployment step.

If a token is required and has not been supplied:

DO NOT invent one.

Put the exact required action in the deployment README.

Do not break the site waiting for an unavailable token.

---

# 33. NOINDEX — CRITICAL

This paid landing site should NOT be indexed.

Use multiple layers.

Metadata:

```html
<meta name="robots" content="noindex,nofollow">
```

`robots.txt`:

```text
User-agent: *
Disallow: /
```

Cloudflare header:

```text
X-Robots-Tag: noindex, nofollow
```

Also ensure static deployment preserves this header.

Do not accidentally expose an indexable variant route.

---

# 34. CLOUDFLARE HEADERS

Provide:

```text
/*
  X-Robots-Tag: noindex, nofollow
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

and immutable caching for framework static resources where appropriate.

Check Cloudflare Pages `_headers` compatibility.

---

# 35. PERFORMANCE

The site being noindex does NOT mean performance can be ignored.

This is paid acquisition.

A visitor who waits unnecessarily is wasted ad spend.

Prioritize:

* instant useful first viewport
* fast LCP
* minimal JS
* compressed images
* responsive source sizes
* no huge video download
* no unnecessary hydration
* no render-blocking analytics
* no giant animation library

Targets should approximately remain:

```text
LCP <= 1.8–2.0 seconds on good simulated mobile conditions
CLS < 0.05
first-view payload ideally <= 600 KB
JS ideally <= 90 KB gzip
```

These are targets, not excuses to damage visual quality.

Optimize sensibly.

---

# 36. IMAGES

Use an asset-processing pipeline.

Where appropriate:

* start from high-resolution masters
* crop deliberately
* output AVIF
* provide WebP fallback where valuable
* compress visually, not destructively
* preserve high-DPR sharpness
* lazy-load below-fold imagery

Do not make an app screenshot unreadable merely to reach an arbitrary kilobyte number.

Visual clarity matters.

---

# 37. DESKTOP

Only about 5% of traffic is expected to be desktop.

Still make it excellent.

Desktop should:

* use space intelligently
* preserve mobile design language
* show product larger
* add QR where useful
* avoid giant empty whitespace
* not become a separate enterprise site

Do not spend disproportionate effort on desktop-specific decorations.

---

# 38. ACCESSIBILITY

Despite being a conversion page, basic accessibility is mandatory.

Include:

* visible focus states
* semantic buttons/links
* appropriate headings
* sensible contrast
* alt text where images communicate information
* touch targets >= 48×48
* reduced motion
* keyboard access
* no information communicated through color alone

---

# 39. MOTION PRINCIPLE

Motion should explain the product.

Not decorate the page.

Allowed high-impact moments:

1. hero transcription sequence
2. scroll-linked showcase
3. very subtle micro-interactions

Do NOT implement repetitive:

```text
opacity: 0 → 1
translateY: 30px → 0
```

on every section.

No endless reveal animations.

No bouncing CTA.

No parallax circus.

---

# 40. CONTENT PRINCIPLE

Outcome before technology.

Prefer:

> Your thoughts, already written.

over:

> AI-powered neural transcription architecture.

Prefer:

> Record the lecture. Read the notes.

over:

> Intelligent educational voice capture.

Keep copy conversational, short and concrete.

---

# 41. DO NOT INCLUDE

Do not add:

* pricing table
* authentication
* blog
* newsletter
* giant navigation
* testimonial carousel
* FAQ unless a genuinely important conversion objection requires it
* stories/novels feature
* random AI chat section
* comparison table
* company history
* team section
* enterprise sales form
* floating chatbot
* cookie-wall style interruptions unless legally required
* unrelated VoiceToNotes features just because the main site has them

This page has one objective:

**get the visitor into the app.**

---

# 42. USE THE EXISTING MAIN WEBSITE CAREFULLY

The existing website contains broader product areas.

This Meta landing page should focus almost entirely on:

* voice capture
* speech-to-text
* notes
* clean formatting
* summaries
* action items
* practical productivity

Do not copy unrelated stories/novels content into this acquisition page.

---

# 43. FACT CHECK EVERYTHING

Before adding measurable marketing claims, verify them.

Especially:

* user count
* download count
* rating
* number of ratings
* languages
* transcription accuracy
* security statements
* review text
* featured-on statements

A statement on an old marketing page is not sufficient evidence if a stronger current official source contradicts it.

When verification is uncertain:

**omit the claim.**

The page is strong enough without invented numbers.

---

# 44. CODE QUALITY

Act like a senior engineer.

Requirements:

* strict TypeScript
* good component boundaries
* minimal client components
* central configuration
* reusable analytics wrapper
* central link handling
* shared campaign variants
* clean CSS tokens
* no duplicated giant JSX sections
* no unused packages
* no console errors
* no hydration errors
* no accessibility warnings that could reasonably be fixed
* no fragile setTimeout spaghetti
* proper cleanup for observers/listeners
* no unnecessary global state

Keep implementation understandable by another senior engineer.

---

# 45. RECOMMENDED COMPONENT ORGANIZATION

You may improve this if there is a better architecture.

Something approximately like:

```text
app/
  layout.tsx
  page.tsx
  students/page.tsx
  meetings/page.tsx
  writers/page.tsx

components/
  landing/
    LandingPage.tsx
    Hero.tsx
    HeroPhone.tsx
    HowItWorks.tsx
    Showcase.tsx
    UseCases.tsx
    Reviews.tsx
    PrivacyNote.tsx
    FinalCTA.tsx
    StickyCTA.tsx
    Footer.tsx

  analytics/
    Analytics.tsx
    MetaPixel.tsx
    Clarity.tsx

lib/
  links.ts
  variants.ts
  analytics.ts
  device.ts
  campaign.ts
  claims.ts

public/
  brand/
  screens/
  generated/
  store/
  qr.svg
  robots.txt
  _headers
```

Do not follow this blindly if the repository already has a better structure.

---

# 46. ASSET MANIFEST

Create and maintain an explicit asset manifest.

For every visual asset record:

* filename
* origin
* whether original/generated/reconstructed
* source URL where applicable
* intended section
* dimensions
* output format

Example:

```text
brand/app-icon.png
Source: official VoiceToNotes asset
Usage: metadata / brand reference

screens/live-transcription.avif
Source: real app screenshot
Usage: showcase
390-ish mobile composition

generated/voice-waveform.svg
Source: locally generated SVG
Usage: hero
```

Do not lose track of where visuals came from.

---

# 47. IF AN ASSET CANNOT BE OBTAINED

Do not block the entire project.

Use this order:

1. find another legitimate VoiceToNotes source
2. reconstruct from verified UI references
3. generate a high-quality supporting asset
4. omit the asset if it would require fabrication

Document remaining unavailable assets under:

```text
Missing / replace before campaign launch
```

But continue implementing the rest.

---

# 48. SOCIAL MEDIA AS VISUAL REFERENCE

Inspect official VoiceToNotes social channels when accessible.

Use them to understand:

* current marketing imagery
* icon treatment
* brand voice
* product screenshots
* promotional composition

Do not automatically import social-media images into the site.

Use them as visual research unless the asset is suitable for production.

---

# 49. DO NOT OVERDESIGN

"Best possible experience" does NOT mean adding more elements.

Quality should come from:

* spacing
* typography
* hierarchy
* product imagery
* interaction
* pacing
* responsiveness
* clarity
* visual storytelling

If a section does not improve confidence or conversion, remove it.

---

# 50. WORKFLOW — START NOW

Use the following execution sequence.

## Phase 1 — Project inspection

* unzip/read all supplied docs
* inspect current repository
* inspect package dependencies
* inspect existing assets
* inspect project configuration

## Phase 2 — Brand research

Inspect:

* voicetonotes.ai
* app icon
* App Store
* Play Store
* VoiceToNotes social profiles

Determine:

* real accent
* usable product screenshots
* supported product features
* legitimate proof

## Phase 3 — Asset preparation

Prepare:

* wordmark
* icon
* phone screenshots
* showcase imagery
* store badges
* QR
* waveform
* generated supporting artwork if valuable

Compress/export appropriately.

## Phase 4 — Design implementation

Build at 390px first:

* hero
* phone demo
* supporting sections
* showcase
* sticky conversion
* final CTA

Then adapt other breakpoints.

## Phase 5 — Analytics

Implement:

* query propagation
* Meta Pixel
* ClickToStore
* Clarity `ym4bfkzw5f`
* variant metadata
* Cloudflare analytics deployment instructions

## Phase 6 — Variants

Implement:

* `/`
* `/students`
* `/meetings`
* `/writers`

## Phase 7 — noindex/deployment

Implement:

* robots metadata
* robots.txt
* X-Robots-Tag
* Cloudflare headers
* static export configuration

## Phase 8 — QA

Test at minimum:

```text
360px
375px
390px
430px
768px
1024px
1440px
```

Check:

* overflow
* safe-area handling
* text wrapping
* sticky CTA
* final CTA collision
* scroll showcase
* reduced motion
* query propagation
* OS CTA
* analytics events
* console
* build
* static export

## Phase 9 — Refine

Do at least one visual-polish pass after the page is technically complete.

Ask yourself:

> Does this look like an expensive consumer product, or like somebody completed a frontend task?

If it looks like a frontend assignment, improve it.

Pay special attention to:

* hero composition
* typography
* product scale
* section transitions
* whitespace
* CTA hierarchy
* screenshot cropping
* mobile scrolling rhythm

## Phase 10 — Production verification

Run:

```bash
npm run build
```

Fix all relevant errors.

Ensure:

```text
out/
```

is generated and deployable.

---

# 51. FINAL DELIVERABLES

By the end of your work I expect:

### Production implementation

The complete functioning website.

### Assets

Production-quality visual assets in the repository.

### Four routes

```text
/
 /students
 /meetings
 /writers
```

### Analytics

Working:

* Meta Pixel integration
* ClickToStore instrumentation
* Microsoft Clarity
* Cloudflare Web Analytics deployment setup/instructions

### Attribution

Query parameters survive conversion navigation.

### noindex

Implemented at multiple layers.

### Documentation

Update README with:

* local development
* build
* Cloudflare deployment
* environment variables
* analytics
* generated/source assets
* missing assets
* Meta page-click concern
* replacement instructions for screenshots/reviews if needed

---

# 52. DEFINITION OF DONE

The project is NOT complete when:

* components exist
* layout roughly matches
* build passes

It is complete when all three are true:

## 1. Product correctness

The page accurately represents VoiceToNotes.

## 2. Engineering correctness

The static site functions reliably.

## 3. Visual quality

The landing page genuinely feels premium on a real phone.

The third requirement is equally important.

---

# 53. FINAL QUALITY QUESTION

Before declaring completion, open the site at 390px.

Imagine arriving through an Instagram ad with no previous knowledge of VoiceToNotes.

Within the first screen the visitor must understand:

1. what VoiceToNotes does,
2. why it is useful,
3. what the real product looks like,
4. what to tap next.

Then scroll the complete page.

It should feel like one intentionally directed story—not nine unrelated React sections stacked vertically.

---

# 54. IMPORTANT BEHAVIOUR FOR THIS TASK

Do not respond with only:

* an architecture proposal
* TODOs
* wireframes
* design recommendations
* sample components
* pseudocode

Those can be part of your internal process.

The requested outcome is the **implemented product**.

Inspect the supplied files and repository and begin making the actual changes now.

Continue until the landing page is built, assets are prepared, analytics/noindex behavior is implemented, the static build succeeds, and the experience has received a final mobile visual-polish pass.

Start now.
