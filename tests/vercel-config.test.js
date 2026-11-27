// Offline mirror of tests/headers.test.js and tests/redirects.test.js: checks the
// configuration in vercel.json itself, so the build gate (npm run test:build)
// covers headers and redirects without fetching the live site.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf8');
const cfg = JSON.parse(read('vercel.json'));

const rule = cfg.headers.find((h) => h.source === '/(.*)');
const headers = Object.fromEntries((rule?.headers ?? []).map((h) => [h.key.toLowerCase(), h.value]));

describe('vercel.json security headers (offline)', () => {
  it('applies to every path', () => {
    expect(rule).toBeDefined();
  });
  it('X-Frame-Options: DENY', () => expect(headers['x-frame-options']).toBe('DENY'));
  it('X-Content-Type-Options: nosniff', () => expect(headers['x-content-type-options']).toBe('nosniff'));
  it('Referrer-Policy: strict-origin-when-cross-origin', () =>
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin'));
  it('Strict-Transport-Security: >= 2 years, includeSubDomains', () => {
    const hsts = headers['strict-transport-security'] || '';
    expect(hsts).toContain('max-age=');
    expect(parseInt(hsts.match(/max-age=(\d+)/)?.[1] ?? '0')).toBeGreaterThanOrEqual(63072000);
    expect(hsts).toContain('includeSubDomains');
  });
  it('Content-Security-Policy present with default-src self, api.eco360.ai, frame-ancestors none', () => {
    const csp = headers['content-security-policy'];
    expect(csp).toBeTruthy();
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain('https://api.eco360.ai');
    expect(csp).toContain("frame-ancestors 'none'");
  });
  it('Permissions-Policy blocks camera/mic/geo', () => {
    const pp = headers['permissions-policy'] || '';
    expect(pp).toContain('camera=()');
    expect(pp).toContain('microphone=()');
    expect(pp).toContain('geolocation=()');
  });
});

// source → destination (all permanent; Vercel serves permanent:true as 308)
const REDIRECTS = [
  ['/platform', '/#platform'],
  ['/eco360platform', '/#platform'],
  ['/solutions', '/#platform'],
  ['/about-us', '/about'],
  ['/contact', '/#contact'],
  ['/contact-us', '/#contact'],
  ['/pricing', '/#contact'],
  ['/co2-tools', '/#lookup'],
  ['/co2tools', '/#lookup'],
  ['/blog', '/'],
  ['/blog/:path*', '/'],
  ['/post/:path*', '/'],
  ['/home', '/'],
];

describe('vercel.json redirects (offline)', () => {
  it('has exactly the 13 expected redirects', () => {
    expect(cfg.redirects).toHaveLength(REDIRECTS.length);
  });
  for (const [source, destination] of REDIRECTS) {
    it(`${source} → ${destination} (permanent)`, () => {
      expect(cfg.redirects.find((r) => r.source === source)).toMatchObject({ destination, permanent: true });
    });
  }
  it('/about is not a redirect (own page)', () => {
    expect(cfg.redirects.find((r) => r.source === '/about')).toBeUndefined();
  });
});

describe('vercel.json build settings', () => {
  it('cleanUrls on, trailingSlash off', () => {
    expect(cfg.cleanUrls).toBe(true);
    expect(cfg.trailingSlash).toBe(false);
  });
  it('build runs the offline tests, installs from the lockfile, serves public', () => {
    expect(cfg.buildCommand).toBe('npm run test:build');
    expect(cfg.installCommand).toBe('npm ci');
    expect(cfg.outputDirectory).toBe('public');
  });
});
