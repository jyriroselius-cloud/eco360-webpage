# eco360-webpage

ECO360 company website — static single-file site deployed on Vercel.

**Live:** https://eco360-webpage.vercel.app → (future) https://eco360.ai

## Stack

- Pure HTML + CSS + JS — no framework, no build step
- Vercel (static hosting, security headers, 301 redirects)
- Single file: `public/index.html` (~99 KB)

## Structure

```
public/
  index.html      — full site (HTML + CSS + JS, no build step)
  og-image.png    — Open Graph image (1200×630)
  robots.txt
  sitemap.xml
api/              — placeholder for Phase 2/3 Vercel serverless functions
vercel.json       — security headers (CSP, HSTS, X-Frame…) + 301 redirects
README.md
CHANGELOG.md
```

## Local preview

Open `public/index.html` directly in a browser — no server needed.

## Deploy

Push to `main` → Vercel deploys automatically.

```bash
git add .
git commit -m "..."
git push origin main
```

## Lighthouse (eco360-webpage.vercel.app)

| Category | Score |
|---|---|
| Performance | 100 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

## Phases

| Phase | Status | Content |
|---|---|---|
| 1 | ✅ Done | Static site live at eco360-webpage.vercel.app |
| 2 | ⏳ Pending | DNS eco360.ai → Vercel (after Jyri clears UNVERIFIED CLAIMS + Safari/Firefox test) |
| 3 | ⏳ Pending | Device search wired to ECO360 Platform Data API |
| 4 | ⏳ Pending | Contact forms + CO₂ calculator data sources |

## Pre-production gates before DNS switch (Phase 2)

- [ ] UNVERIFIED CLAIMS in `index.html` reviewed and cleared by Jyri
- [ ] Safari + Firefox cross-browser testing passed
- [ ] Wix NOT cancelled until DNS is live on Vercel

## Redirects (from Wix-era URLs)

| Old path | Target |
|---|---|
| `/platform` | `/#platform` |
| `/solutions` | `/#solutions` |
| `/about`, `/about-us` | `/#team` |
| `/contact`, `/contact-us` | `/#contact` |
| `/pricing` | `/#pricing` |
| `/co2-tools`, `/co2tools` | `/#device-search` |
| `/blog`, `/blog/*`, `/post/*` | `/` |
| `/home` | `/` |

## Security headers

CSP · HSTS · X-Frame-Options: DENY · X-Content-Type-Options: nosniff · Referrer-Policy · Permissions-Policy

Full policy in `vercel.json`.

## Implementation guide

See vault: `06 Development/ECO360 Platform/Kotisivut-toteutusohje-Jorma.md`
