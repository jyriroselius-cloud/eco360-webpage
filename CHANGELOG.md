# Changelog — eco360-webpage

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
