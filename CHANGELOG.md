# Changelog — eco360-webpage

## [2.1.0] — 2026-10-21

### About page and brand signals (kickoff 07 Marketing, SEO audit 18.10.2026)

- New `/about` page (`public/about.html`): Who we are, Team (founder bios verbatim from the site), Company information (Eco360 Ltd / Eco360 Oy, business ID 3482010-3, VAT FI34820103, postal address, sales@eco360.ai, company LinkedIn), links to `/claim-methodology`, `/privacy`, `/terms`
- Structured data on `/about`: one `@graph` with `AboutPage` (about → `#org`) and two `Person` nodes (`worksFor` → `#org`, `sameAs` → LinkedIn); `Organization` is referenced by `@id`, not duplicated
- `Organization` in `index.html`: `address` as full `PostalAddress` (Hovinrinne 13, 37470 Vesilahti, FI) and `founder` → both Person `@id`s
- Footer: "About" under Company; postal address in the legal line
- `vercel.json`: `/about` redirect removed (own page now); `/about-us` → `/about`
- `sitemap.xml` lists `/about` (5 URLs); `llms.txt` gets a Company line pointing to `/about`
- Tests: `tests/about.test.js` (page, company facts, address read from the single JSON-LD source and compared to page and footer, no bracketed placeholders / TODO / lorem, html-validate, structured data, routing, sitemap, llms.txt, footer). `tests/redirects.test.js`: `/about` and `/about-us` now checked against `vercel.json` (the live alias serves the old config until deploy)
- Post-deploy acceptance (not testable before deploy): `/about` returns 200, `/about-us` redirects permanently to `/about`, Rich Results Test parses `Organization` + 2 × `Person`
- Open: VAT FI34820103 is derived from the business ID; Jyri to confirm in the VAT register

## [2.0.1] — 2026-10-19

### SEO quick fixes + V3 regressions restored (SEO audit 18.10.2026)

- Footer legal links `#` → `/privacy`, `/terms`, `/claim-methodology`; footer headings h4 → h3
- `<main>` landmark restored; unclosed `.stats` div closed; raw `&` encoded; `type="button"` on buttons; mobile nav gets its own aria-label
- HTML 1.14 MB → 0.12 MB: base64 WebM fallback removed, poster moved to `assets/eco360-hero-poster.jpg`
- Stats render 536 / 47 in static HTML (crawlers and no-JS readers saw 0)
- JSON-LD Organization: vatID, business ID, LinkedIn sameAs; logo → square `icon-512.png`
- "Deepest in electronics" → "Built for electronics" in meta, Twitter and footer (#218 regression)
- Company identity → **Eco360 Ltd** (Eco360 Oy), business ID 3482010-3, VAT FI34820103 across footer, JSON-LD, privacy, terms, claim-methodology and llms.txt (Jyri 2026-10-19; supersedes Decisions.md 2026-09-06)
- `sitemap.xml` lists /claim-methodology, /privacy, /terms; branded `404.html`
- html-validate: `no-autoplay` off (decorative muted hero video, by design)
- Cost estimator: unsourced "~€400,000" Before-card figure replaced with "a recurring six-figure line item"; €320k IFO/BDI anchor dropped from the model note; `UNVERIFIED CLAIMS` marker cleared (#218, Jyri 2026-10-19)

## [2.0.0] — 2026-10-12

### V3-design live — uusi kotisivu tuotantoon (PR #5)

- Uusi V3-design: Instrument Sans + IBM Plex Mono, hero-taustavideo, platform API widget
- `assets/eco360-hero-1080p.{mp4,webm}` hero-taustalle
- CSP: lisätty `fonts.googleapis.com` (style-src), `fonts.gstatic.com` (font-src), `media-src 'self'`
- Kaikki 301-redirectit ja security-headerit säilytetty
- PR #5: https://github.com/jyriroselius-cloud/eco360-webpage/pull/5
- Jyrin päätös 12.10.2026

## [1.7.0] — 2026-10-10

### One headline per promise, third card at 1100px (#365, #366)

- **#365**: `#bom h2` vaihdettu — "Send the file as it is." → "Every article, against the **list in force**." — `#platform` omistaa "Send us the file" -lupauksen; body text koskematta
- **#366**: vaihtoehto (b) — `@media(max-width:1200px) and (min-width:641px){.surfaces .surf:last-child{grid-column:1/-1}}` — orphan kortti kasvaa täyteen leveyteen 641–1200px-bandissa
- PR #4: https://github.com/jyriroselius-cloud/eco360-webpage/pull/4

## [1.6.0] — 2026-10-10

### Sell the service, not the surfaces — Excel in, workbook out (#364)

- **#platform -osio uudelleenjärjestetty:** 4 korttia → 3 korttia (ostopolku)
  - Kortti 1 "Start here — Send us the file": 5 bulletia (7 sheettia, 71 saraketta, 4 reittiä, 12kk/6v säilytys)
  - Kortti 2 "Console": päivitetty lede + 3 bulletia
  - Kortti 3 "API · product card · agent": konsolidoi 3 aiempaa korttia yhdeksi
- **CSS grid:** `.surfaces{repeat(4,1fr)}` → `repeat(3,1fr)`, breakpoint 1200px → 2-kolumni
- **H2:** "Send us the file. Get a **workbook** back."
- **Eyebrow:** "Three ways to start · one engine"
- **Stack caption:** "One engine, six layers. Send a file, drive the console, or build on the API."
- **CTA "Send us a file"** lisätty heroön ja contact-osioon (mailto:sales@eco360.ai)
- Ei kosketa: #bom, tier-väitteet, kattavuusprosentit
- PR #3: https://github.com/jyriroselius-cloud/eco360-webpage/pull/3

## [1.5.0] — 2026-10-10

### Logo swap + Compliance Radar + brand fonts (#225)

- **Logo:** ECO360°-wordmark (`eco360-wordmark-on-dark.svg`) korvaa vanhan pilvilogon nav+footer
- **Favicons:** brand-kitti (ico/svg/apple-touch-icon/icon-192/icon-512/site.webmanifest) korvaa inline data: URI
- **OG-kuva:** `og-image-1200x630.png` (uusi brändikuva)
- **Fontit:** Instrument Sans 700, IBM Plex Mono 400+600, Inter variable self-hostattu woff2:ina — ei CDN-riippuvuuksia
- **Compliance Radar:** korvaa 27.9.2026 vanhentunut EmpCo-countdown
  - Otsikko "are now illegal", eyebrow "in force since 27 September 2026"
  - EmpCo count-up chippi + FI-siirtymächippi (HE 47/2026 ✓ EV 97/2026 vp, 9.6.2026)
  - Seuraava kohde: akkupassi 18.2.2027 (tarkka laskuri)
  - ESPR ~2027/~2029/~2030 = "expected YYYY" (ei sekuntilaskuria)
  - 6-pisteen aikajana, self-advancing
- **`#pricing` → `#contact`** ("Estimate your saving" -linkki)
- +6 testiä (`tests/laws.test.js`, 67 yhteensä): LAWS-vakiokuri

## [1.4.0] — 2026-08-26

### Legal pages + footer identity (#222)

- `public/privacy.html` — GDPR Art. 13–14 privacy notice (data controller, retention, rights, supervisory authority)
- `public/terms.html` — Terms of use (permitted use, IP, limitation of liability, governing law: Finland)
- `public/claim-methodology.html` — Claim methodology: three-tier system (Measured/Derived/Estimated), uncertainty bounds (≥±20% floor), emission factor sources and versions, scope boundary, reproducibility record, claims not made
- `index.html` footer: dead links `/privacy`, `/terms`, `/claim-methodology` replace `href="#"` placeholders
- `index.html` footer: company identity line — "EcoGreen360 Oy · Business ID 3489696-8 · VAT FI34896968 · Finland" replaces COMPANY INFO GATE comment
- +13 tests (58 total): footer link validity, Y-tunnus presence, legal page existence + canonical + back-link + identity + tier explanation + forbidden-word guard

## [1.3.0] — 2026-08-26

### BoM copy accuracy + capability test + /eco360platform redirect (#223)

**Background:** ALL_THEMES in eco360-platform compliance.py is `pfas, svhc, rohs, tsca, prop65`. The page
claimed `RoHS, REACH, POPs and UK REACH` — two regulations the engine does not handle (POPs, UK REACH)
and two it handles as `not_applicable` for EEA-market products (TSCA, Prop 65). PFAS (78% §7 agreement)
was entirely absent from the copy.

**Changes:**
- `public/index.html:791`: "screens every article against RoHS, REACH, POPs and UK REACH" →
  "assesses every article for PFAS, REACH SVHC and RoHS. TSCA and Prop 65 are in scope; for
  EEA-market products they return not_applicable."
- `public/llms.txt:9`: "screening for RoHS, REACH and POPs" → "screening for PFAS, REACH SVHC
  and RoHS (TSCA and Prop 65 in scope; not_applicable for EEA-market products)"
- `vercel.json`: added redirect `/eco360platform → /#platform` (permanent 308). Fragment `#platform`
  exists in index.html — passes the redirect-fragment-resolves-to-an-id test from #215.
- `tests/compliance_copy.test.js` (new): capability-accuracy test — every regulation named in
  marketing copy and llms.txt must appear in ASSESSED, NOT_APPLICABLE_EEA, or EU_FRAMEWORKS.
  Catches future POPs/UK REACH drift without touching the vocabulary test.
- `tests/redirects.test.js`: added live test case for `/eco360platform → /#platform`.

**Tests:** 41 → 43 (+2: BoM regulation accuracy ×2 in compliance_copy.test.js)

## [1.2.0] — 2026-08-26

### SEO head audit — tier-only copy (#214) + offers removal (#216)

**Background:** kickoff #210 rule: no assertion in the head that is not supported in the body.
- `eco_label_snapshots`: 0 rows confirmed (ECO360 Platform DB query 2026-08-26) — "and a source" claim is FALSE.
- Offers array (5700/9120/14820 EUR): prices not visible on page → Google Structured Data policy violation.

**Changes:**
- `meta[description]`: removed "and a source", "Cut EU reporting costs by up to 90%.", "Deepest in electronics."
- `og:description`: removed "and a source"
- `twitter:description`: removed "and a source", "Cut EU reporting costs by up to 90%."
- JSON-LD `SoftwareApplication.description`: removed "and a source"
- JSON-LD `offers` array: removed entirely (Starter/Growth/Professional prices)
- Hero lede (body): "and a source on every figure, cutting EU reporting costs by up to 90%" → "on every figure"
- H2 tiers section: "tier and a source" → "tier"
- `tests/stats.test.js`: comment updated — claim is FALSE (0 rows 2026-08-26)

**Tests:** 39 → 41 (+2: source-claim full-file scan, offers-visibility guard)

## [1.1.0] — 2026-08-18

### Stats row correction (backlog #65)

**Problem:** Three of four hero stats were wrong.
- `100,000+` devices: overstated by >10× (actual universe ~4 000–5 000 PCF documents, DB has 10)
- `452+` categories: stale (actual: 536 via `SELECT COUNT(*) FROM eco_product_categories`)
- `46` electricity grids: off by one (actual: 47 distinct countries with `valid_to IS NULL`)
- `100% of figures carry a tier and a source`: source coverage unverifiable (0 label snapshots; `co2_manufacture_source_url` nullable)

**Changes to stats row:**
- Tile 1: replaced `100,000+ devices in the CO₂ database` with `EPREL · SCIP · Ember / EU registries the engine reads directly — not data you type in` (no numeral)
- Tile 2: corrected `452+` → `536+` product categories
- Tile 3: corrected `46` → `47` national electricity grids
- Tile 4: narrowed to `100% of figures carry a tier` (removed "and a source" — unverifiable)

**Step 4 sweep:** Only one occurrence of `100000` found in the repo — the corrected stat tile. No occurrences in meta, OG tags, sitemap, or any other file.

**Step 3 — drift prevention:** Added `tests/stats.test.js` (4 tests) that ties HTML `data-count` values to verified constants with inline SQL queries and dates. Any HTML edit to those values now trips the test suite.

**Tests:** 35 → 39 (+4 stats integrity tests)

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

**Tests (35 Vitest)**
- `tests/html.test.js` (12): DOCTYPE, lang, viewport, OG tags, `<main>`, heading order, html-validate errors
- `tests/headers.test.js` (9): CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy
- `tests/redirects.test.js` (14): kaikki Wix-era 308-ohjaukset + root 200
- HTML validity fixes: 7× raaka `&` → `&amp;`, `<button type="button">`

**Pending before DNS migration (Phase 2)**
- UNVERIFIED CLAIMS comments in `index.html` to be reviewed by Jyri
- Safari + Firefox cross-browser testing
- DNS eco360.ai → Vercel via Cloudflare (do NOT cancel Wix first)
