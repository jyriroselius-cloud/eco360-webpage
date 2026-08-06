# eco360-webpage

ECO360 company website — static single-file site deployed on Vercel.

## Structure

```
public/
  index.html      — full site (HTML + CSS + JS, no build step)
  og-image.png    — Open Graph image (1200×630)
  robots.txt
  sitemap.xml
api/              — placeholder for Phase 2/3 Vercel functions
vercel.json       — security headers + 301 redirects from old Wix URLs
```

## Local preview

Open `public/index.html` directly in a browser — no server needed.

## Deploy

Push to `main` → Vercel deploys automatically to `eco360.ai`.

## Phases

| Phase | Content |
|---|---|
| 1 | Site live at eco360.ai (Wix migration) |
| 2 | Device search wired to Data API |
| 3 | Forms + calculator data sources |

See `06 Development/ECO360 Platform/Kotisivut-toteutusohje-Jorma.md` in the vault for the full implementation guide.
