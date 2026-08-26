import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Regulations the BoM engine actively assesses for EEA-market products (#223)
const ASSESSED = ['PFAS', 'REACH SVHC', 'RoHS'];

// In scope but structurally not_applicable for EEA-market products
const NOT_APPLICABLE_EEA = ['TSCA', 'Prop 65'];

// EU frameworks/registries the engine reads or exposes data for (not substance screening rules)
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
