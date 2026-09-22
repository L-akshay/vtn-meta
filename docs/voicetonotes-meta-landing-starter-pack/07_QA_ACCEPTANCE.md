# QA & acceptance criteria

## Core functional

- [ ] `/`, `/students`, `/meetings`, `/writers` export statically.
- [ ] Every primary CTA uses the smart deep link.
- [ ] Query params survive navigation to the smart link.
- [ ] iOS / Android / desktop CTA label detection does not cause layout shift.
- [ ] Footer App Store and Google Play text links use direct store URLs.
- [ ] No API routes.
- [ ] No middleware.
- [ ] No server dependency.

## Index blocking

- [ ] `<meta name="robots" content="noindex,nofollow">`
- [ ] `public/robots.txt` disallows `/`
- [ ] Cloudflare `_headers` sends `X-Robots-Tag: noindex, nofollow`
- [ ] canonical/indexing metadata from a template is not accidentally added

## Analytics

- [ ] Meta `PageView` fires once.
- [ ] `ClickToStore` fires once per outbound action.
- [ ] placement is correct.
- [ ] OS is correct.
- [ ] page-wide clicks are not counted as explicit CTA clicks.
- [ ] Clarity project `ym4bfkzw5f` receives sessions.
- [ ] Cloudflare Web Analytics is enabled once, not duplicated.
- [ ] analytics still works in Instagram/Facebook in-app browser.

## Mobile viewport

Test:
- [ ] 360px
- [ ] 375px
- [ ] 390px
- [ ] 430px

And:
- [ ] iPhone safe area
- [ ] Android browser chrome changes
- [ ] keyboard does not matter because there are no form inputs
- [ ] sticky CTA never covers footer
- [ ] no horizontal scroll
- [ ] `100svh` hero behaves correctly

## In-app browser

Real-device test:
- [ ] Instagram iOS
- [ ] Instagram Android
- [ ] Facebook iOS
- [ ] Facebook Android

Check:
- smart link transition
- scroll-linked showcase
- sticky bar
- focus
- back navigation
- query parameters
- popup/deep-link handling

## Accessibility

- [ ] tap targets at least 48×48px
- [ ] keyboard focus visible
- [ ] page is understandable with CSS animations disabled
- [ ] `prefers-reduced-motion` removes scroll choreography
- [ ] images have meaningful alt or empty alt when decorative
- [ ] contrast passes WCAG AA
- [ ] global click handler does not hijack keyboard activation or selected text

## Visual

- [ ] no broken assets
- [ ] no fake UI screenshots
- [ ] no gradient blobs
- [ ] no generic card grids
- [ ] one black showcase section only
- [ ] accent limited to CTA + hero waveform
- [ ] body copy is short enough for mobile

## Performance

Noindex is not an excuse for a slow ad page.

Practical targets:
- [ ] LCP ≤ ~2.0s on a representative throttled mobile test
- [ ] CLS < 0.05
- [ ] avoid unnecessary third-party JS beyond Meta / Clarity / Cloudflare
- [ ] first view is comfortably under ~700 KB
- [ ] no autoplay video
- [ ] screenshots are responsive and appropriately compressed

Lighthouse targets:
- Performance ≥ 95 where feasible
- Accessibility ≥ 95
- Best Practices ≥ 95
- **SEO is not a KPI** because noindex is intentional.

## Claim safety

- [ ] no 90+ languages unless approved
- [ ] no 1M+ users unless approved
- [ ] no 99% accuracy unless approved
- [ ] no “bank-level”
- [ ] no “zero retention”
- [ ] no publication logos without verified listing/source
- [ ] no unapproved reviews
