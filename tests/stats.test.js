/**
 * Site stats integrity test — Step 3 of backlog #65.
 *
 * Every marketing number must be verified against the live database before
 * publishing. This test ties the HTML values to a verified constant so that
 * a future edit to the HTML trips the test and forces re-verification.
 *
 * TO UPDATE A NUMBER:
 *   1. Re-run the query in the comment.
 *   2. Update BOTH the constant below AND the `data-count` attribute in public/index.html.
 *   3. Update the date in the comment on the same line.
 *
 * The tier claim ("100% of figures carry a tier") is backed by the CI gate
 * test_tier_invariant.py in the eco360-platform repository. That test walks
 * the OpenAPI schema and fails the build if any numeric response field lacks
 * a `{field_name}_tier` companion. The marketing sentence is therefore
 * enforced by the same suite that enforces the product.
 *
 * Source coverage ("and a source") is intentionally NOT claimed. As of
 * 2026-08-18, eco_label_snapshots has 0 rows and co2_manufacture_source_url
 * is nullable — the claim cannot be verified. It was removed per kickoff #65.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const html = readFileSync(resolve(process.cwd(), 'public/index.html'), 'utf8');

// ── Verified stats ──────────────────────────────────────────────────────────
// ECO360 Platform DB (fnrhhzvgghmxuwabcpvk):
//   SELECT COUNT(*) FROM eco_product_categories  →  536  (2026-08-18)
const PRODUCT_CATEGORIES = 536;

// ECO360 Platform DB (fnrhhzvgghmxuwabcpvk):
//   SELECT COUNT(DISTINCT country_code) FROM eco_electricity_factors WHERE valid_to IS NULL  →  47  (2026-08-18)
//   Active sources: Ember 2024 (location) / AIB 2023–2025 (residual) — all Ember 2024, not IEA.
const ELECTRICITY_COUNTRIES = 47;
// ────────────────────────────────────────────────────────────────────────────

describe('Site stats integrity', () => {
  it('tile 1: no 100,000+ device count — replaced with registry names', () => {
    expect(html).not.toContain('data-count="100000"');
    expect(html).not.toContain('100000');
    expect(html).not.toContain('100,000');
    expect(html).not.toContain('100 000');
    expect(html).toContain('EPREL · SCIP · Ember');
  });

  it('tile 2: product category count matches verified value from DB', () => {
    expect(html).toContain(`data-count="${PRODUCT_CATEGORIES}"`);
  });

  it('tile 3: electricity country count matches verified value from DB', () => {
    expect(html).toContain(`data-count="${ELECTRICITY_COUNTRIES}"`);
  });

  it('tile 4: tier claim does not include "and a source" (source coverage unverified)', () => {
    expect(html).toContain('of figures carry a tier');
    expect(html).not.toMatch(/of figures carry a tier and a source/);
  });
});
