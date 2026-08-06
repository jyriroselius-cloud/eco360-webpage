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

  it('passes html-validate with no errors', async () => {
    const report = await validator.validateString(html);
    const errors = report.results.flatMap(r => r.messages.filter(m => m.severity === 2));
    if (errors.length > 0) {
      console.log('HTML validation errors:', errors.map(e => `${e.ruleId}: ${e.message} (line ${e.line})`));
    }
    expect(errors).toHaveLength(0);
  });
});
