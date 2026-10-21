// Brand-signals kickoff (07 Marketing/Kickoff - About page and brand signals).
// Sääntö: ei keksittyjä faktoja. Tämä testi on portti — paikkamerkki ei pääse tuotantoon.
// Osoite luetaan YHDESTÄ lähteestä (index.html:n Organization-JSON-LD) ja sivut
// verrataan siihen; arvoa ei kovakoodata tähän.
import { describe, it, expect } from 'vitest';
import { HtmlValidate } from 'html-validate';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const read = (p) => readFileSync(resolve(process.cwd(), p), 'utf8');
const about = read('public/about.html');
const index = read('public/index.html');

function ldBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
}
const aboutGraph = ldBlocks(about).flatMap((b) => b['@graph'] ?? [b]);
const indexGraph = ldBlocks(index).flatMap((b) => b['@graph'] ?? [b]);
const org = indexGraph.find((n) => n['@type'] === 'Organization');
const persons = aboutGraph.filter((n) => n['@type'] === 'Person');

// Näkyvä teksti + JSON-LD-arvot, ilman <script>/<style>-koodia, paikkamerkkitarkistusta varten
const visible = about.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
const ldStrings = [];
(function walk(v) {
  if (typeof v === 'string') ldStrings.push(v);
  else if (Array.isArray(v)) v.forEach(walk);
  else if (v && typeof v === 'object') Object.values(v).forEach(walk);
})([ldBlocks(about), org]);

describe('/about — sivu ja sisältö', () => {
  it('public/about.html: canonical /about, index,follow, yksilöllinen title', () => {
    expect(about).toContain('<link rel="canonical" href="https://eco360.ai/about">');
    expect(about).toContain('<meta name="robots" content="index,follow">');
    expect(about).toContain('<title>About ECO360 · Eco360 Ltd</title>');
    expect(about).toMatch(/<meta name="description" content="[^"]{40,}">/);
  });

  it('sisältää yritystiedot, sähköpostin ja molemmat perustajat', () => {
    for (const s of ['Eco360 Ltd', 'Eco360 Oy', '3482010-3', 'FI34820103', 'sales@eco360.ai',
                     'https://www.linkedin.com/company/eco360-ltd/', 'Jyri Roselius', 'Kari Ketola']) {
      expect(about, s).toContain(s);
    }
    expect(about).not.toContain('EcoGreen360');
  });

  it('linkittää /claim-methodology, /privacy ja /terms', () => {
    for (const h of ['/claim-methodology', '/privacy', '/terms']) expect(about).toContain(`href="${h}"`);
  });

  it('postiosoite: sama täysi osoite (katu, postinumero, kaupunki) about-sivulla ja footerissa kuin Organization-JSON-LD:ssä', () => {
    const a = org.address;
    expect(a['@type']).toBe('PostalAddress');
    for (const k of ['streetAddress', 'postalCode', 'addressLocality']) {
      expect(typeof a[k], k).toBe('string');
      expect(a[k].trim().length, k).toBeGreaterThan(0);
      expect(about, `about.html: ${k}`).toContain(a[k]);
    }
    const footer = index.match(/<footer[\s\S]*?<\/footer>/i)[0];
    for (const k of ['streetAddress', 'postalCode', 'addressLocality']) expect(footer, `footer: ${k}`).toContain(a[k]);
  });

  it('ei paikkamerkkejä: ei TODO/lorem/EcoGreen360 eikä hakasulkeisiin jätettyä arvoa (sivu eikä JSON-LD)', () => {
    for (const bad of [/TODO/i, /lorem/i, /EcoGreen360/, /\[address\]/i]) expect(visible).not.toMatch(bad);
    const bracket = /\[[A-Za-z][^\]\n]{0,40}\]/;
    expect(visible, 'about.html näkyvä teksti').not.toMatch(bracket);
    for (const s of ldStrings) expect(s, `JSON-LD-arvo ${s}`).not.toMatch(bracket);
    expect(index.match(/<footer[\s\S]*?<\/footer>/i)[0], 'footer').not.toMatch(bracket);
  });

  it('passes html-validate', async () => {
    const v = new HtmlValidate({
      extends: ['html-validate:recommended'],
      rules: { 'no-inline-style': 'off', 'long-title': 'off', 'require-sri': 'off', 'script-type': 'off',
               'no-trailing-whitespace': 'off', 'attr-quotes': 'off', 'void-style': 'off',
               'prefer-native-element': 'off', 'element-permitted-content': 'off', 'no-abstract-roles': 'off' },
    });
    const report = await v.validateString(about);
    expect(report.results.flatMap((r) => r.messages.map((m) => `${m.ruleId}: ${m.message}`))).toEqual([]);
  });
});

describe('/about — structured data', () => {
  it('yksi @graph: AboutPage → #org, ei kopioitua Organization-solmua', () => {
    const page = aboutGraph.find((n) => n['@type'] === 'AboutPage');
    expect(page.about).toEqual({ '@id': 'https://eco360.ai/#org' });
    expect(aboutGraph.some((n) => n['@type'] === 'Organization')).toBe(false);
    expect(ldBlocks(about)).toHaveLength(1);
  });

  it('kaksi Person-solmua: name, jobTitle, worksFor → #org, ei-tyhjä sameAs (https)', () => {
    expect(persons).toHaveLength(2);
    expect(persons.map((p) => p.name).sort()).toEqual(['Jyri Roselius', 'Kari Ketola']);
    for (const p of persons) {
      expect(p.jobTitle, p.name).toBeTruthy();
      expect(p.worksFor, p.name).toEqual({ '@id': 'https://eco360.ai/#org' });
      expect(Array.isArray(p.sameAs) && p.sameAs.length > 0, `${p.name}: sameAs ei saa olla tyhjä`).toBe(true);
      for (const u of p.sameAs) expect(u, p.name).toMatch(/^https:\/\/([a-z]+\.)?linkedin\.com\/in\/[^/\s]+\/?$/);
    }
  });

  it('Organization (index.html) viittaa perustajiin @id:llä ja kantaa PostalAddressin', () => {
    expect(org.founder.map((f) => f['@id']).sort()).toEqual(persons.map((p) => p['@id']).sort());
    expect(org.address['@type']).toBe('PostalAddress');
    expect(org.address.addressCountry).toBe('FI');
  });
});

describe('/about — reititys, sitemap, llms.txt, footer', () => {
  const vercel = JSON.parse(read('vercel.json'));
  it('/about ei ole uudelleenohjaus; /about-us → /about (pysyvä)', () => {
    expect(vercel.redirects.find((r) => r.source === '/about')).toBeUndefined();
    const r = vercel.redirects.find((x) => x.source === '/about-us');
    expect(r).toMatchObject({ destination: '/about', permanent: true });
  });

  it('sitemap listaa /about (yhteensä 5 URLia)', () => {
    const urls = [...read('public/sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(urls).toContain('https://eco360.ai/about');
    expect(urls).toHaveLength(5);
  });

  it('llms.txt osoittaa /about-sivulle', () => {
    expect(read('public/llms.txt')).toContain('https://eco360.ai/about');
  });

  it('footerin Company-sarakkeessa on About → /about', () => {
    const footer = index.match(/<footer[\s\S]*?<\/footer>/i)[0];
    const company = footer.match(/<h3>Company<\/h3>[\s\S]*?<\/ul>/)[0];
    expect(company).toContain('<a href="/about">About</a>');
  });
});
