// Pruebas de scripts/lib/prerender.mjs con el runner de Node (sin dependencias): npm run test:scripts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildRobots, buildSitemap, htmlFileOf, isIndexable, parsePage, verifyPages, visibleText } from './prerender.mjs';

const SITE = 'https://example.test';
const body = text => `<app-root><main>${text}</main></app-root>`;
const page = ({ title = 'Título | Sitio', description = 'Descripción', canonical = `${SITE}/x`, robots = '', text = 'texto '.repeat(80), lang = 'es', og = true } = {}) => `<!DOCTYPE html>
<html lang="${lang}"><head><title>${title}</title>
${description ? `<meta name="description" content="${description}">` : ''}
${robots ? `<meta name="robots" content="${robots}">` : ''}
<link rel="canonical" href="${canonical}">
${og ? '<meta property="og:title" content="T"><meta property="og:image" content="https://example.test/i.jpg">' : ''}
</head><body>${body(text)}<script>var x = "texto oculto en script";</script></body></html>`;
const redirectTo = url => `<!DOCTYPE html><html><head><title>Redirecting</title><meta http-equiv="refresh" content="0; url=${url}"></head><body><pre>Redirecting</pre></body></html>`;
const REDIRECT = redirectTo('/a');

test('visibleText ignores tags, scripts and styles outside app-root', () => {
  assert.equal(visibleText('<html><body><app-root><p>Hola&nbsp;<b>mundo</b></p><style>p{}</style></app-root><script>x</script></body></html>'), 'Hola mundo');
  assert.equal(visibleText('<html></html>'), '');
});

test('parsePage reads the SEO fields and flags redirects and noindex', () => {
  const parsed = parsePage(page({ robots: 'noindex, follow' }));
  assert.equal(parsed.lang, 'es');
  assert.equal(parsed.title, 'Título | Sitio');
  assert.equal(parsed.canonical, `${SITE}/x`);
  assert.equal(parsed.isRedirect, false);
  assert.equal(isIndexable(parsed), false);
  assert.equal(isIndexable(parsePage(page())), true);
  assert.equal(parsePage(REDIRECT).isRedirect, true);
  assert.equal(isIndexable(parsePage(REDIRECT)), false);
});

test('htmlFileOf maps a route to its index.html', () => {
  assert.equal(htmlFileOf('/'), 'index.html');
  assert.equal(htmlFileOf('/research/groups/pam'), 'research/groups/pam/index.html');
});

test('verifyPages accepts good pages and skips redirects', () => {
  const pages = { '/': parsePage(page({ title: 'Inicio', canonical: `${SITE}/` })), '/a': parsePage(page({ title: 'A', canonical: `${SITE}/a` })), '/old': parsePage(REDIRECT), '/home': parsePage(redirectTo('/')) };
  assert.deepEqual(verifyPages(pages, SITE), []);
});

test('verifyPages catches a page that was prerendered empty (the trap of a "successful" build)', () => {
  const pages = { '/a': parsePage(page({ title: 'A', canonical: `${SITE}/a`, text: 'menu' })) };
  const problems = verifyPages(pages, SITE);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /\/a: solo 4 caracteres/);
});

test('verifyPages catches data-loading errors left in the HTML', () => {
  const html = page({ title: 'A', canonical: `${SITE}/a` }).replace('</body>', '<!-- Http failure response for http://ng-localhost/assets/data/x.json --></body>');
  assert.match(verifyPages({ '/a': parsePage(html) }, SITE)[0], /errores de carga de datos/);
});

test('verifyPages catches missing metadata, wrong canonical and repeated titles', () => {
  const pages = {
    '/a': parsePage(page({ title: 'Igual', canonical: `${SITE}/a` })),
    '/b': parsePage(page({ title: 'Igual', canonical: `${SITE}/otra`, description: '', og: false })),
    '/c': null
  };
  const problems = verifyPages(pages, SITE).join('\n');
  assert.match(problems, /\/b: sin meta description/);
  assert.match(problems, /\/b: canonical ".*\/otra" \(esperado ".*\/b"\)/);
  assert.match(problems, /\/b: faltan etiquetas Open Graph/);
  assert.match(problems, /\/b: título repetido con \/a/);
  assert.match(problems, /\/c: no existe su archivo HTML/);
});

test('verifyPages is more lenient with "noindex" pages (coming soon) but still needs some text', () => {
  const thin = page({ title: 'Pronto', canonical: `${SITE}/p`, robots: 'noindex, follow', description: '', text: 'texto de proximamente '.repeat(8) });
  assert.deepEqual(verifyPages({ '/p': parsePage(thin) }, SITE), []);
  const empty = page({ title: 'Pronto', canonical: `${SITE}/p`, robots: 'noindex, follow', description: '', text: 'x' });
  assert.match(verifyPages({ '/p': parsePage(empty) }, SITE)[0], /caracteres de texto/);
});

test('buildSitemap lists only indexable pages, home first, sorted, XML-escaped', () => {
  const pages = {
    '/research': parsePage(page()), '/': parsePage(page()), '/a&b': parsePage(page()),
    '/soon': parsePage(page({ robots: 'noindex, follow' })), '/old': parsePage(REDIRECT), '/missing': null
  };
  const xml = buildSitemap(pages, `${SITE}/`);
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(locs, [`${SITE}/`, `${SITE}/a&amp;b`, `${SITE}/research`]);
  assert.match(xml, /^<\?xml version="1.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
});

test('buildRobots allows crawling and points to the sitemap', () => {
  assert.equal(buildRobots(`${SITE}/`), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
});

test('parsePage reads where a redirect page goes', () => {
  assert.equal(parsePage(redirectTo('/students/graduation-options')).redirectTarget, '/students/graduation-options');
  assert.equal(parsePage(page()).redirectTarget, '');
});

test('verifyPages catches a redirect to a page that does not exist (like /program/about -> /program/program)', () => {
  const pages = { '/program': parsePage(page({ title: 'P', canonical: `${SITE}/program` })), '/program/about': parsePage(redirectTo('/program/program')) };
  const problems = verifyPages(pages, SITE);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /\/program\/about: redirige a "\/program\/program", que no es una página prerenderizada/);
});

test('verifyPages catches chains of redirects', () => {
  const pages = { '/a': parsePage(page({ title: 'A', canonical: `${SITE}/a` })), '/b': parsePage(redirectTo('/a')), '/c': parsePage(redirectTo('/b')) };
  assert.match(verifyPages(pages, SITE)[0], /\/c: redirige a "\/b", que a su vez es otra redirección/);
});
