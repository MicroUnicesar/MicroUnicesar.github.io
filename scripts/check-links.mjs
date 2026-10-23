#!/usr/bin/env node
// Revisa enlaces rotos sobre el sitio ya compilado (dist/…/browser). Uso:
//   npm run build && npm run links:check              → solo enlaces internos e imágenes (rápido, sin red)
//   npm run build && npm run links:check -- --external → además comprueba las URL externas (necesita internet)
// Sale con código 1 si hay enlaces internos rotos. Los externos solo se informan (pueden fallar por cortes del
// otro sitio o por bloquear a los robots), nunca hacen fallar la ejecución.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { attrValues, idsOf, imageRefsIn, isExternal, orcidUrl, resolveInternal, urlsIn } from './lib/links.mjs';
import { htmlFileOf } from './lib/prerender.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const project = Object.keys(JSON.parse(readFileSync(join(ROOT, 'angular.json'), 'utf8')).projects)[0];
const OUT = join(ROOT, 'dist', project);
const BROWSER = join(OUT, 'browser');
const DATA = join(ROOT, 'src', 'assets', 'data');
const siteUrl = JSON.parse(readFileSync(join(ROOT, 'src', 'site.config.json'), 'utf8')).url;
const withExternal = process.argv.includes('--external');

if (!existsSync(join(OUT, 'prerendered-routes.json'))) {
  console.error('links: primero compila el sitio (npm run build).');
  process.exit(1);
}

const routes = Object.keys(JSON.parse(readFileSync(join(OUT, 'prerendered-routes.json'), 'utf8')).routes);
const pages = new Map();
for (const route of routes) {
  const file = join(BROWSER, htmlFileOf(route));
  if (existsSync(file)) {
    pages.set(route, readFileSync(file, 'utf8'));
  }
}
const isRedirect = html => /<meta http-equiv="refresh"/i.test(html);
const fileExists = path => existsSync(join(BROWSER, path.replace(/^\//, ''))) && statSync(join(BROWSER, path.replace(/^\//, ''))).isFile();

const broken = [];
const external = new Map(); // url → [dónde aparece]
const addExternal = (url, where) => external.set(url, [...(external.get(url) ?? []), where]);

// 1. HTML prerenderizado: enlaces internos, anclajes, imágenes y URL externas.
for (const [route, html] of pages) {
  if (isRedirect(html)) {
    continue;
  }
  const body = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, '');
  for (const href of attrValues(body, 'a', 'href')) {
    if (isExternal(href) && !href.startsWith(siteUrl)) {
      addExternal(href, route);
      continue;
    }
    const target = resolveInternal(href, route, siteUrl);
    if (!target) {
      continue;
    }
    if (target.path !== route && !pages.has(target.path) && !fileExists(target.path)) {
      broken.push(`${route}  →  ${href}  (la ruta no existe)`);
    } else if (target.hash && pages.has(target.path) && !idsOf(pages.get(target.path)).has(target.hash)) {
      broken.push(`${route}  →  ${href}  (el anclaje #${target.hash} no existe en esa página)`);
    }
  }
  for (const src of attrValues(body, 'img', 'src')) {
    if (isExternal(src)) {
      addExternal(src, route);
    } else if (!/^data:/.test(src)) {
      const target = resolveInternal(src, route, siteUrl);
      if (target && !fileExists(target.path)) {
        broken.push(`${route}  →  imagen ${src}  (no existe)`);
      }
    }
  }
}

// 2. Datos JSON: imágenes (con o sin carpeta) y URL externas.
const imageFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    statSync(path).isDirectory() ? walk(path) : imageFiles.push(path.slice(BROWSER.length));
  }
})(join(BROWSER, 'assets', 'images'));
const imagePeople = person => (person.photo && !/^https?:/.test(person.photo) ? [`assets/images/people/${person.photo}`] : []);

for (const name of readdirSync(DATA).filter(file => file.endsWith('.json') && !file.includes('template'))) {
  const data = JSON.parse(readFileSync(join(DATA, name), 'utf8'));
  const refs = new Set(imageRefsIn(data));
  if (name === 'people.json') {
    data.flatMap(imagePeople).forEach(ref => refs.add(ref));
  }
  for (const ref of refs) {
    const exact = ref.startsWith('assets/') ? [`/${ref}`] : imageFiles.filter(file => file.endsWith(`/${ref}`));
    if (!exact.some(file => fileExists(file))) {
      broken.push(`data/${name}  →  imagen ${ref}  (no existe en src/assets/images)`);
    }
  }
  urlsIn(data).forEach(url => addExternal(url, `data/${name}`));
  if (name === 'people.json') {
    data.forEach(person => {
      const orcid = orcidUrl(person.links?.orcid ?? '');
      if (orcid) {
        addExternal(orcid, `data/${name} (${person.id})`);
      }
    });
  }
}

console.log(`links: ${pages.size} páginas revisadas; ${external.size} URL externas distintas.`);
if (broken.length) {
  console.error(`\nlinks: ${broken.length} enlaces internos rotos:`);
  broken.forEach(line => console.error(`  - ${line}`));
}

// 3. Enlaces externos (opcional).
if (withExternal) {
  const results = [];
  const queue = [...external.keys()];
  const check = async url => {
    for (const method of ['HEAD', 'GET']) {
      try {
        const response = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 (link-check)' } });
        if (response.ok || method === 'GET') {
          return response.status;
        }
      } catch (error) {
        if (method === 'GET') {
          return `error: ${error.cause?.code ?? error.name}`;
        }
      }
    }
  };
  await Promise.all(Array.from({ length: 8 }, async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      results.push([url, await check(url)]);
    }
  }));
  const bad = results.filter(([, status]) => typeof status !== 'number' || status >= 400).sort();
  const blocked = bad.filter(([, status]) => [401, 403, 429, 999].includes(status));
  console.log(`\nlinks externos: ${results.length - bad.length} responden bien, ${bad.length - blocked.length} con problema, ${blocked.length} no verificables (el sitio bloquea robots).`);
  for (const [url, status] of bad) {
    console.log(`  - [${status}] ${url}\n      en: ${[...new Set(external.get(url))].slice(0, 3).join(', ')}`);
  }
}

process.exit(broken.length ? 1 : 0);
