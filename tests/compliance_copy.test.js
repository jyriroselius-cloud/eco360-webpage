import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Regulations the BoM engine actively assesses for EEA-market products (#223, #224)
// Source: eco360-platform api/app/workbook/compliance.py ALL_THEMES[:3]
//   ("pfas" → PFAS, "svhc" → REACH SVHC, "rohs" → RoHS)
// Recorded: 2026-08-27. When ALL_THEMES changes, update both repos together.
// The platform repo test test_all_themes_invariant() will fail on the other end.
const ASSESSED = ['PFAS', 'REACH SVHC', 'RoHS'];

// In scope but structurally not_applicable for EEA-market products (#224)
// Source: eco360-platform api/app/workbook/compliance.py ALL_THEMES[3:]
//   ("tsca" → TSCA, "prop65" → Prop 65)
// Basis: 2026-08-24 scope decision in platform Decisions.md — TSCA and Prop 65 rules
//   are defined in the engine but flagged not_applicable for EEA-market products.
const NOT_APPLICABLE_EEA = ['TSCA', 'Prop 65'];

// EU frameworks/registries the engine reads or exposes data for — not substance screening (#224)
// SCIP: engine queries ECHA SCIP notifications API (eco360-platform routers/scip.py + auto_enrich.py)
// WEEE: engine derives weee_category + weee_recovery_pct per device (routers/resolve.py)
// These are not in ALL_THEMES (which covers substance screening only).
const EU_FRAMEWORKS = ['SCIP', 'WEEE'];

const APPROVED = new Set([...ASSESSED, ...NOT_APPLICABLE_EEA, ...EU_FRAMEWORKS]);

// Ordered longest-first so compound names ("UK REACH", "REACH SVHC") match before their substrings.
// Bare "SVHC" is omitted — it is shorthand for "REACH SVHC" and safe to use as an abbreviation.
const REGULATION_RE = /\b(UK REACH|REACH SVHC|RoHS|PFAS|POPs|REACH|TSCA|Prop\s65|WEEE|SCIP)\b/g;

const rawHtml = readFileSync(resolve(process.cwd(), 'public/index.html'), 'utf8');
// Strip <script> blocks — demo data (e.g. decaBDE — POPs at line 1146) lives there and is not marketing copy
const indexHtml = rawHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const llmsTxt = readFileSync(resolve(process.cwd(), 'public/llms.txt'), 'utf8');

function extractRegulations(text) {
  return new Set([...text.matchAll(REGULATION_RE)].map(m => m[0].replace(/\s+/g, ' ').trim()));
}

describe('BoM copy capability accuracy (#223)', () => {
  it('every regulation named in marketing copy and llms.txt is approved', () => {
    const found = new Set([
      ...extractRegulations(indexHtml),
      ...extractRegulations(llmsTxt),
    ]);
    for (const reg of found) {
      expect(
        APPROVED.has(reg),
        `"${reg}" appears in marketing copy but is not in ASSESSED or NOT_APPLICABLE_EEA — update the approved list or fix the copy`,
      ).toBe(true);
    }
  });

  it('all ASSESSED regulations appear in marketing copy or llms.txt', () => {
    const combined = indexHtml + llmsTxt;
    for (const reg of ASSESSED) {
      expect(combined, `ASSESSED regulation "${reg}" is absent from all marketing copy — add it or remove it from ASSESSED`).toContain(reg);
    }
  });
});
