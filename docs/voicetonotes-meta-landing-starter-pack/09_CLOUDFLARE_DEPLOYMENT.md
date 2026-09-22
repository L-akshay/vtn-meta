# Cloudflare Pages deployment

## Next config

The project is a static export.

```ts
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

## Cloudflare Pages

Recommended:
- Framework preset: Next.js (Static HTML Export)
- Build command: `npm run build`
- Output directory: `out`
- Production branch: `main` or the team’s actual production branch

Cloudflare’s current Pages docs support static Next.js exports to `out/`.

## Web Analytics

Prefer Pages’ one-click Web Analytics option rather than manually duplicating the beacon.

Dashboard:
`Workers & Pages → project → Metrics → Web Analytics`

## `public/robots.txt`

```txt
User-agent: *
Disallow: /
```

## `public/_headers`

```txt
/*
  X-Robots-Tag: noindex, nofollow
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
```

### Optional security hardening

Add a CSP only after checking:
- Meta Pixel hosts
- Microsoft Clarity hosts
- Cloudflare Analytics beacon
- smart-link navigation
- any required inline Next scripts

Start with `Content-Security-Policy-Report-Only` if the existing project has no CSP. A broken CSP on an ad landing page is worse than no CSP.

## Environment variables

Build-time public variables:

```env
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=ym4bfkzw5f
```

Do not place secrets in `NEXT_PUBLIC_*`.

## Preview deploy

Use a Cloudflare preview URL to test:
- mobile webviews
- noindex headers
- scripts
- deep links
- campaign query strings

Do not send production ad traffic to a preview URL.
