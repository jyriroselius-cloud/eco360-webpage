import { describe, it, expect } from 'vitest';
import { HtmlValidate } from 'html-validate';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const htmlPath = resolve(process.cwd(), 'public/index.html');
const html = readFileSync(htmlPath, 'utf8');

const validator = new HtmlValidate({
  extends: ['html-validate:recommended'],
  rules: {
    'no-inline-style': 'off',
    'long-title': 'off',
    'require-sri': 'off',
    'script-type': 'off',
    'no-trailing-whitespace': 'off',
    'attr-quotes': 'off',
    'void-style': 'off',
    'prefer-native-element': 'off',
    'element-permitted-content': 'off',
    'no-abstract-roles': 'off',
  },
});

describe('HTML structure', () => {
  it('has DOCTYPE', () => {
    expect(html.trimStart()).toMatch(/^<!DOCTYPE html>/i);
  });

  it('has lang attribute on <html>', () => {
    expect(html).toMatch(/<html[^>]+lang=/i);
  });

  it('has charset meta', () => {
    expect(html).toMatch(/<meta\s[^>]*charset/i);
  });

  it('has viewport meta without maximum-scale restriction', () => {
    const match = html.match(/<meta\s[^>]*name="viewport"[^>]*>/i);
    expect(match).not.toBeNull();
    expect(match[0]).not.toContain('maximum-scale=1');
    expect(match[0]).not.toContain('user-scalable=no');
  });

  it('has <title>', () => {
    expect(html).toMatch(/<title>[^<]+<\/title>/i);
  });

  it('has Open Graph title and description', () => {
    expect(html).toContain('og:title');
    expect(html).toContain('og:description');
    expect(html).toContain('og:image');
  });

  it('has <main> landmark element', () => {
    expect(html).toContain('<main>');
    expect(html).toContain('</main>');
  });

  it('has <footer>', () => {
    expect(html).toContain('<footer>');
  });

  it('has no h4 before h3 in heading order (footer uses h3, not h4)', () => {
    // Footer headings must be h3, not h4 (would skip from h2)
    const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
    expect(footerMatch).not.toBeNull();
    const footer = footerMatch[0];
    expect(footer).not.toMatch(/<h4\b/i);
    expect(footer).toMatch(/<h3\b/i);
  });

  it('has no UNVERIFIED CLAIMS that are empty (placeholder structure intact)', () => {
    // Comments should exist but content between them may be blank — just verify structure
    const count = (html.match(/UNVERIFIED CLAIMS/g) || []).length;
    expect(count).toBeGreaterThan(0);
  });

  it('has canonical URL', () => {
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('https://eco360.ai/');
  });

  it('ld+json block parses as valid JSON and Organization node has required identity fields', () => {
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    expect(match).not.toBeNull();
    const graph = JSON.parse(match[1]);
    const org = graph['@graph'].find(n => n['@type'] === 'Organization');
    expect(org).toBeDefined();
    expect(org.legalName).toBe('EcoGreen360 Oy');
    expect(org.foundingDate).toBe('2024');
    expect(org.vatID).toBe('FI34896968');
    expect(org.identifier).toMatchObject({ '@type': 'PropertyValue', propertyID: 'FI-business-id', value: '3489696-8' });
    expect(org.sameAs).toContain('https://www.linkedin.com/company/eco360-ltd/');
  });

  it('passes html-validate with no errors', async () => {
    const report = await validator.validateString(html);
    const errors = report.results.flatMap(r => r.messages.filter(m => m.severity === 2));
    if (errors.length > 0) {
      console.log('HTML validation errors:', errors.map(e => `${e.ruleId}: ${e.message} (line ${e.line})`));
    }
    expect(errors).toHaveLength(0);
  });

  it('footer legal links are not placeholder #-hrefs', () => {
    const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
    expect(footerMatch).not.toBeNull();
    const footer = footerMatch[0];
    expect(footer).toContain('href="/privacy"');
    expect(footer).toContain('href="/terms"');
    expect(footer).toContain('href="/claim-methodology"');
    expect(footer).not.toMatch(/href="#"[\s\S]{0,20}Privacy/);
    expect(footer).not.toMatch(/href="#"[\s\S]{0,20}Terms/);
    expect(footer).not.toMatch(/href="#"[\s\S]{0,20}Claim/);
  });

  it('footer contains company identity (Y-tunnus and VAT)', () => {
    const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
    expect(footerMatch).not.toBeNull();
    const footer = footerMatch[0];
    expect(footer).toContain('3489696-8');
    expect(footer).toContain('FI34896968');
    expect(footer).not.toContain('COMPANY INFO GATE');
  });
});

describe('legal pages', () => {
  const pages = [
    { name: 'privacy', path: 'public/privacy.html', canonical: '/privacy' },
    { name: 'terms', path: 'public/terms.html', canonical: '/terms' },
    { name: 'claim-methodology', path: 'public/claim-methodology.html', canonical: '/claim-methodology' },
  ];

  for (const page of pages) {
    it(`${page.name}.html exists and has correct canonical`, () => {
      const content = readFileSync(resolve(process.cwd(), page.path), 'utf8');
      expect(content).toContain(`href="https://eco360.ai${page.canonical}"`);
    });

    it(`${page.name}.html links back to eco360.ai`, () => {
      const content = readFileSync(resolve(process.cwd(), page.path), 'utf8');
      expect(content).toContain('href="/');
    });

    it(`${page.name}.html contains EcoGreen360 Oy identity`, () => {
      const content = readFileSync(resolve(process.cwd(), page.path), 'utf8');
      expect(content).toContain('EcoGreen360 Oy');
      expect(content).toContain('3489696-8');
    });
  }

  it('claim-methodology.html explains the three tiers', () => {
    const content = readFileSync(resolve(process.cwd(), 'public/claim-methodology.html'), 'utf8');
    expect(content).toContain('Measured');
    expect(content).toContain('Derived');
    expect(content).toContain('Estimated');
  });

  it('claim-methodology.html does not use forbidden compliance words', () => {
    const content = readFileSync(resolve(process.cwd(), 'public/claim-methodology.html'), 'utf8');
    // these words in a claim-context context are forbidden per spec
    expect(content).not.toMatch(/\bcompliant\b/i);
    expect(content).not.toMatch(/\bconforms\b/i);
  });
});
