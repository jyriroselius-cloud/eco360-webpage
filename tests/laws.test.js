import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const html = readFileSync(resolve(process.cwd(), 'public/index.html'), 'utf8');

// Directive (EU) 2024/825, Art. 1 · https://eur-lex.europa.eu/eli/dir/2024/825
const EMPCO_DATE = '2026-09-27T00:00:00+02:00';
// Regulation (EU) 2023/1542, Art. 77 · https://eur-lex.europa.eu/eli/reg/2023/1542
const BATTERY_PASSPORT_DATE = '2027-02-18T00:00:00+01:00';

describe('LAWS array integrity', () => {
  it('EmpCo exact date present in LAWS array', () => {
    expect(html).toContain(EMPCO_DATE);
  });
  it('Battery passport exact date present in LAWS array', () => {
    expect(html).toContain(BATTERY_PASSPORT_DATE);
  });
  it('approx:true entries show ~ prefix in dl, never exact YYYY-MM-DD', () => {
    // Match complete LAWS objects that contain approx:true, then check their dl: value
    const objects = [...html.matchAll(/\{[^{}]*approx:true[^{}]*\}/gs)];
    expect(objects.length).toBeGreaterThan(0);
    for (const obj of objects) {
      const dlMatch = obj[0].match(/dl:'([^']+)'/);
      if (dlMatch) {
        expect(dlMatch[1], `approx:true entry has precise date: ${dlMatch[1]}`).toMatch(/^~/);
      }
    }
  });
  it('LAWS array present in HTML with required entries', () => {
    expect(html).toContain('var LAWS=');
    expect(html).toContain("n:'EmpCo — green claims'");
    expect(html).toContain("n:'Battery passport'");
  });
  it('countdown section no longer shows expired EmpCo countdown cells', () => {
    expect(html).not.toContain('Counting down to 27 Sep 2026');
  });
  it('EmpCo headline reflects in-force status', () => {
    expect(html).toContain('are now');
    expect(html).not.toContain('are about to become');
  });
});
