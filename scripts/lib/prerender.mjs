// Funciones puras para revisar el HTML prerenderizado y generar sitemap.xml y robots.txt.
// Sin dependencias: solo expresiones regulares sobre el HTML que genera Angular.

/** Texto visible de <app-root>, sin etiquetas, scripts ni estilos. */
export function visibleText(html) {
  const root = /<app-root[^>]*>([\s\S]*?)<\/app-root>/.exec(html);
  return (root ? root[1] : '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const attr = (html, pattern) => (pattern.exec(html) || [])[1] || '';

/** Lo que importa de una página prerenderizada para el SEO. */
export function parsePage(html) {
  return {
    isRedirect: /<meta http-equiv="refresh"/i.test(html),
    redirectTarget: attr(html, /<meta http-equiv="refresh" content="[^"]*url=([^"]*)"/i),
    lang: attr(html, /<html[^>]*\slang="([^"]*)"/),
    title: attr(html, /<title>([\s\S]*?)<\/title>/).trim(),
    description: attr(html, /<meta name="description" content="([^"]*)"/),
    canonical: attr(html, /<link rel="canonical" href="([^"]*)"/),
    robots: attr(html, /<meta name="robots" content="([^"]*)"/),
    ogTitle: attr(html, /<meta property="og:title" content="([^"]*)"/),
    ogImage: attr(html, /<meta property="og:image" content="([^"]*)"/),
    text: visibleText(html),
    hasHttpError: /ng-localhost|HttpErrorResponse/.test(html)
  };
}

export const isIndexable = page => !page.isRedirect && !/noindex/i.test(page.robots);

/** Ruta del archivo HTML de una ruta prerenderizada, relativa a la carpeta browser/. */
export const htmlFileOf = route => (route === '/' ? 'index.html' : `${route.replace(/^\/+|\/+$/g, '')}/index.html`);

/**
 * Revisa las páginas prerenderizadas y devuelve los problemas encontrados.
 * @param pages  Mapa ruta -> resultado de parsePage (o null si falta el archivo)
 * @param siteUrl URL del sitio, para comprobar los canonical
 */
export function verifyPages(pages, siteUrl, { minText = 300, minThinText = 120 } = {}) {
  const problems = [];
  const titles = new Map();
  const base = siteUrl.replace(/\/+$/, '');
  for (const [route, page] of Object.entries(pages)) {
    if (!page) {
      problems.push(`${route}: no existe su archivo HTML`);
      continue;
    }
    if (page.isRedirect) {
      // Las rutas antiguas son redirecciones a propósito, pero deben llevar a una página que exista.
      const target = page.redirectTarget.replace(/\/+$/, '') || '/';
      const destination = pages[target];
      if (!destination) problems.push(`${route}: redirige a "${page.redirectTarget}", que no es una página prerenderizada`);
      else if (destination.isRedirect) problems.push(`${route}: redirige a "${target}", que a su vez es otra redirección`);
      continue;
    }
    if (page.hasHttpError) problems.push(`${route}: el HTML contiene errores de carga de datos (ng-localhost / HttpErrorResponse)`);
    if (!page.lang) problems.push(`${route}: <html> sin atributo lang`);
    const thin = /noindex/i.test(page.robots);
    const min = thin ? minThinText : minText;
    if (page.text.length < min) problems.push(`${route}: solo ${page.text.length} caracteres de texto (mínimo ${min}); ¿se prerenderizó vacía?`);
    if (!page.title) problems.push(`${route}: sin <title>`);
    if (!page.description && !thin) problems.push(`${route}: sin meta description`);
    const expected = route === '/' ? `${base}/` : `${base}${route}`;
    if (page.canonical !== expected) problems.push(`${route}: canonical "${page.canonical}" (esperado "${expected}")`);
    if (!page.ogTitle || !page.ogImage) problems.push(`${route}: faltan etiquetas Open Graph`);
    if (isIndexable(page)) {
      const key = `${page.lang}|${page.title}`;
      if (titles.has(key)) problems.push(`${route}: título repetido con ${titles.get(key)} ("${page.title}")`);
      else titles.set(key, route);
    }
  }
  return problems;
}

const escapeXml = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** sitemap.xml con las páginas indexables (sin redirecciones ni "noindex"). */
export function buildSitemap(pages, siteUrl) {
  const base = siteUrl.replace(/\/+$/, '');
  const urls = Object.entries(pages)
    .filter(([, page]) => page && isIndexable(page))
    .map(([route]) => (route === '/' ? `${base}/` : `${base}${route}`))
    .sort((a, b) => (a === `${base}/` ? -1 : b === `${base}/` ? 1 : a.localeCompare(b)));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(url => `  <url><loc>${escapeXml(url)}</loc></url>`),
    '</urlset>',
    ''
  ].join('\n');
}

/** robots.txt: todo rastreable (las páginas "noindex" deben poder leerse para respetarse) y el sitemap. */
export function buildRobots(siteUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl.replace(/\/+$/, '')}/sitemap.xml\n`;
}
