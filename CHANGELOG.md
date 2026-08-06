# Changelog — eco360-webpage

## [1.0.0] — 2026-08-06

### Phase 1 — Static site deploy (Wix migration)

**Site content**
- Added `public/index.html` — full ECO360 company website in a single file (eco360-site-v1.html, designed by Jorma)
- Added `public/og-image.png` — Open Graph image (1200×630)
- Added `public/robots.txt` + `public/sitemap.xml`

**Infrastructure**
- `vercel.json`: security headers — CSP, HSTS (2 years + preload), X-Frame-Options: DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- `vercel.json`: 301 redirects from Wix-era paths — `/platform`, `/about`, `/blog/*`, `/co2-tools`, etc.
- `cleanUrls: true`, `trailingSlash: false`

**Accessibility (Lighthouse 100/100)**
- Raised `--dim2` CSS variable from `#5E7186` → `#7A92A8` (contrast ratio 4.5:1+ for WCAG AA)
- Added `<main>` landmark element wrapping all page sections
- Changed footer heading levels `<h4>` → `<h3>` (no level skipping from h2)

**Deployment**
- Vercel project: `jyriroselius-clouds-projects/eco360-webpage`
- Live at: https://eco360-webpage.vercel.app
- DNS eco360.ai not yet pointed here — Wix still active

**Pending before DNS migration (Phase 2)**
- UNVERIFIED CLAIMS comments in `index.html` to be reviewed by Jyri
- Safari + Firefox cross-browser testing
- DNS eco360.ai → Vercel via Cloudflare (do NOT cancel Wix first)
