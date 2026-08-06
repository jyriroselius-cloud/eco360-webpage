import { describe, it, expect } from 'vitest';

const BASE = 'https://eco360-webpage.vercel.app';

async function getRedirect(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
  return { status: res.status, location: res.headers.get('location') };
}

// Vercel permanent:true → 308 (not 301)
describe('301/308 redirects from Wix-era paths', () => {
  it('/platform → /#platform', async () => {
    const r = await getRedirect('/platform');
    expect(r.status).toBe(308);
    expect(r.location).toContain('/#platform');
  });

  it('/solutions → /#solutions', async () => {
    const r = await getRedirect('/solutions');
    expect(r.status).toBe(308);
    expect(r.location).toContain('/#solutions');
  });

  it('/about → /#team', async () => {
    const r = await getRedirect('/about');
    expect(r.status).toBe(308);
    expect(r.location).toContain('/#team');
  });

  it('/about-us → /#team', async () => {
    const r = await getRedirect('/about-us');
    expect(r.status).toBe(308);
    expect(r.location).toContain('/#team');
  });

  it('/contact → /#contact', async () => {
    const r = await getRedirect('/contact');
    expect(r.status).toBe(308);
    expect(r.location).toContain('/#contact');
  });

  it('/contact-us → /#contact', async () => {
    const r = await getRedirect('/contact-us');
    expect(r.status).toBe(308);
    expect(r.location).toContain('/#contact');
  });

  it('/pricing → /#pricing', async () => {
    const r = await getRedirect('/pricing');
    expect(r.status).toBe(308);
    expect(r.location).toContain('/#pricing');
  });

  it('/co2-tools → /#device-search', async () => {
    const r = await getRedirect('/co2-tools');
    expect(r.status).toBe(308);
    expect(r.location).toContain('/#device-search');
  });

  it('/co2tools → /#device-search', async () => {
    const r = await getRedirect('/co2tools');
    expect(r.status).toBe(308);
    expect(r.location).toContain('/#device-search');
  });

  it('/blog → /', async () => {
    const r = await getRedirect('/blog');
    expect(r.status).toBe(308);
    expect(r.location).toMatch(/\/$/);
  });

  it('/blog/some-post → /', async () => {
    const r = await getRedirect('/blog/some-post');
    expect(r.status).toBe(308);
    expect(r.location).toMatch(/\/$/);
  });

  it('/post/some-article → /', async () => {
    const r = await getRedirect('/post/some-article');
    expect(r.status).toBe(308);
    expect(r.location).toMatch(/\/$/);
  });

  it('/home → /', async () => {
    const r = await getRedirect('/home');
    expect(r.status).toBe(308);
    expect(r.location).toMatch(/\/$/);
  });

  it('root / returns 200 (no redirect loop)', async () => {
    const res = await fetch(BASE);
    expect(res.status).toBe(200);
  });
});
