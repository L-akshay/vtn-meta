# Analytics & attribution

## Tools

1. Meta Pixel
2. Microsoft Clarity
3. Cloudflare Web Analytics

### IDs

```env
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=ym4bfkzw5f
```

Do not commit a Meta Pixel ID if it is not yet supplied.

## Cloudflare Web Analytics

For a Cloudflare Pages project, prefer enabling Web Analytics directly in:

**Cloudflare dashboard → Workers & Pages → project → Metrics → Web Analytics → Enable**

Cloudflare can inject the beacon automatically on the next deploy. Avoid adding a duplicate manual beacon unless the project setup requires it.

## Microsoft Clarity

Load Clarity client-side after the page becomes interactive.

Project ID:
`ym4bfkzw5f`

Mask sensitive content by default. This landing page should not collect text inputs anyway.

## Meta Pixel

Load via `next/script` using `afterInteractive`.

On initial load:
- `PageView`

Outbound event:
- `ClickToStore`

Properties:
```ts
{
  placement: "hero" | "sticky" | "final" | "badge" | "page",
  os: "ios" | "android" | "desktop" | "unknown"
}
```

## Attribution preservation

Every smart-link navigation must preserve the current landing-page query params.

Example input:
`/students?utm_source=facebook&utm_campaign=lecture_01&fbclid=abc`

Destination:
`https://links.voicetonotes.ai/s/1f7O6lrt?utm_source=facebook&utm_campaign=lecture_01&fbclid=abc`

Use a URL object rather than string concatenation so future deep-link query parameters are not corrupted.

## Global page click requirement

Team requirement:

A document-level click may navigate to the smart link when the user clicks outside:
- `<a>`
- `<button>`
- footer
- controls
- selected text
- elements explicitly marked `data-global-click-exempt`

### Important risk

This behavior can create accidental store opens and inflate `ClickToStore` counts. It also makes ordinary content feel unexpectedly clickable and can be problematic for keyboard/accessibility expectations.

Keep the requirement, but:
- treat `placement="page"` separately from explicit CTA clicks
- never merge page-click CTR with explicit CTA CTR
- review Clarity recordings/heatmaps after launch
- be ready to feature-flag page-wide clicking off if accidental exits are high

A click on the page should **not** fire both `page` and a CTA placement.

## Suggested analytics events

Required:
- `PageView`
- `ClickToStore`

Useful optional client-side events:
- `HeroDemoComplete`
- `ShowcaseStepViewed` `{step}`
- `FinalCTAViewed`

Do not create dozens of events. The primary optimization metric is explicit store-click rate.

## Reporting

For the first week, compare:

- hero CTA clicks / landing sessions
- sticky CTA clicks / landing sessions
- final CTA clicks / landing sessions
- badge clicks / landing sessions
- page-wide clicks / landing sessions
- bounce / short sessions from Clarity
- route performance by `/`, `/students`, `/meetings`, `/writers`
- campaign parameters

Do not change multiple sections at once during the first baseline week.

## Privacy / consent note

Meta Pixel and Clarity are tracking technologies. The existing VoiceToNotes privacy policy already discusses analytics/advertising and cookies generally, but campaign geography may create additional consent requirements.

Before running EU/UK or other consent-regulated traffic, have the company’s legal/privacy owner confirm whether marketing/analytics scripts must wait for consent. This document is implementation guidance, not legal advice.
