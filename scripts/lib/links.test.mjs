import assert from 'node:assert/strict';
import { test } from 'node:test';
import { attrValues, idsOf, imageRefsIn, orcidUrl, resolveInternal, urlsIn } from './links.mjs';

const SITE = 'https://example.test';

test('attrValues lee el atributo de cada etiqueta y decodifica &amp;', () => {
  const html = '<a href="/a">x</a><a class="b" href="/b?x=1&amp;y=2">y</a><a>sin href</a>';
  assert.deepEqual(attrValues(html, 'a', 'href'), ['/a', '/b?x=1&y=2']);
});

test('idsOf devuelve los ids de la página', () => {
  assert.deepEqual([...idsOf('<h2 id="uno"></h2><div id="dos"></div>')], ['uno', 'dos']);
});

test('resolveInternal resuelve rutas absolutas, relativas y anclajes', () => {
  assert.deepEqual(resolveInternal('/people/faculty', '/contact', SITE), { path: '/people/faculty', hash: '' });
  assert.deepEqual(resolveInternal('#procedure', '/students/graduation-options', SITE), { path: '/students/graduation-options', hash: 'procedure' });
  assert.deepEqual(resolveInternal('assets/images/a.webp', '/people/faculty', SITE), { path: '/assets/images/a.webp', hash: '' });
  assert.deepEqual(resolveInternal('/a/b/#x', '/', SITE), { path: '/a/b', hash: 'x' });
  assert.deepEqual(resolveInternal('https://example.test/q', '/', SITE), { path: '/q', hash: '' });
});

test('resolveInternal ignora enlaces externos, mailto y tel', () => {
  assert.equal(resolveInternal('https://otro.test/x', '/', SITE), null);
  assert.equal(resolveInternal('mailto:a@b.co', '/', SITE), null);
  assert.equal(resolveInternal('tel:+570000', '/', SITE), null);
});

test('imageRefsIn y urlsIn recorren estructuras anidadas', () => {
  const data = [{ image: 'a.webp', nested: { photo: 'b.jpg', url: 'https://x.test/y' }, text: 'hola' }];
  assert.deepEqual(imageRefsIn(data), ['a.webp', 'b.jpg']);
  assert.deepEqual(urlsIn(data), ['https://x.test/y']);
});

test('orcidUrl solo convierte identificadores válidos', () => {
  assert.equal(orcidUrl('0000-0002-9428-183X'), 'https://orcid.org/0000-0002-9428-183X');
  assert.equal(orcidUrl('https://orcid.org/0000'), null);
});
