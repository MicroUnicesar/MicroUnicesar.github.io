#!/usr/bin/env node
// Se ejecuta tras `ng build` (npm lo llama solo por el nombre "postbuild").
//  1. Revisa cada página prerenderizada y FALLA si alguna salió vacía o sin metadatos.
//  2. Genera sitemap.xml y robots.txt.
//  3. Crea 404.html (cascarón del cliente, para GitHub Pages) y .nojekyll.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildRobots, buildSitemap, htmlFileOf, isIndexable, parsePage, verifyPages } from './lib/prerender.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const angularJson = JSON.parse(readFileSync(join(ROOT, 'angular.json'), 'utf8'));
const project = Object.keys(angularJson.projects)[0];
const OUT = join(ROOT, 'dist', project);
const BROWSER = join(OUT, 'browser');
const siteUrl = process.env.SITE_URL || JSON.parse(readFileSync(join(ROOT, 'src', 'site.config.json'), 'utf8')).url;

if (!existsSync(join(OUT, 'prerendered-routes.json'))) {
  console.error('postbuild: no hay prerendered-routes.json. ¿Está activo el prerenderizado (outputMode "static")?');
  process.exit(1);
}

const routes = Object.keys(JSON.parse(readFileSync(join(OUT, 'prerendered-routes.json'), 'utf8')).routes);
const pages = {};
for (const route of routes) {
  const file = join(BROWSER, htmlFileOf(route));
  pages[route] = existsSync(file) ? parsePage(readFileSync(file, 'utf8')) : null;
}

const problems = verifyPages(pages, siteUrl);
if (problems.length) {
  console.error(`postbuild: ${problems.length} problema(s) en el HTML prerenderizado:`);
  problems.forEach(problem => console.error(`  - ${problem}`));
  process.exit(1);
}

writeFileSync(join(BROWSER, 'sitemap.xml'), buildSitemap(pages, siteUrl));
writeFileSync(join(BROWSER, 'robots.txt'), buildRobots(siteUrl));
copyFileSync(join(BROWSER, 'index.csr.html'), join(BROWSER, '404.html'));
writeFileSync(join(BROWSER, '.nojekyll'), '');

const all = Object.values(pages);
const redirects = all.filter(page => page.isRedirect).length;
const noindex = all.filter(page => !page.isRedirect && !isIndexable(page)).length;
const indexable = all.filter(page => isIndexable(page)).length;
console.log(`postbuild: ${routes.length} rutas prerenderizadas = ${indexable} indexables + ${noindex} "noindex" (Próximamente) + ${redirects} redirecciones.`);
console.log(`postbuild: sitemap.xml (${indexable} URL), robots.txt, 404.html y .nojekyll creados en ${BROWSER.replace(ROOT, '')}. Sitio: ${siteUrl}`);
