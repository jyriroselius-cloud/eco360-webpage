import { describe, it, expect, beforeAll } from 'vitest';

const BASE = 'https://eco360-webpage.vercel.app';
let headers;

beforeAll(async () => {
  const res = await fetch(BASE);
  headers = res.headers;
});

describe('Security headers', () => {
  it('X-Frame-Options: DENY', () => {
    expect(headers.get('x-frame-options')).toBe('DENY');
  });

  it('X-Content-Type-Options: nosniff', () => {
    expect(headers.get('x-content-type-options')).toBe('nosniff');
  });

  it('Referrer-Policy: strict-origin-when-cross-origin', () => {
    expect(headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
  });

  it('Strict-Transport-Security present with long max-age', () => {
    const hsts = headers.get('strict-transport-security') || '';
    expect(hsts).toContain('max-age=');
    const maxAge = parseInt(hsts.match(/max-age=(\d+)/)?.[1] ?? '0');
    expect(maxAge).toBeGreaterThanOrEqual(63072000); // 2 years
    expect(hsts).toContain('includeSubDomains');
  });

  it('Content-Security-Policy present', () => {
    expect(headers.get('content-security-policy')).toBeTruthy();
  });

  it('CSP has default-src self', () => {
    expect(headers.get('content-security-policy')).toContain("default-src 'self'");
  });

  it('CSP allows connect-src to api.eco360.ai', () => {
    expect(headers.get('content-security-policy')).toContain('https://api.eco360.ai');
  });

  it('CSP has frame-ancestors none', () => {
    expect(headers.get('content-security-policy')).toContain("frame-ancestors 'none'");
  });

  it('Permissions-Policy blocks camera/mic/geo', () => {
    const pp = headers.get('permissions-policy') || '';
    expect(pp).toContain('camera=()');
    expect(pp).toContain('microphone=()');
    expect(pp).toContain('geolocation=()');
  });
});
