// Funciones puras para revisar enlaces. Sin dependencias.

/** Valores de un atributo en todas las etiquetas dadas: attrValues(html, 'a', 'href'). */
export function attrValues(html, tag, name) {
  const values = [];
  for (const match of html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, 'gi'))) {
    const value = new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(match[0]);
    if (value) {
      values.push(value[1].replace(/&amp;/g, '&'));
    }
  }
  return values;
}

/** Ids declarados en una página (destinos de los anclajes #id). */
export function idsOf(html) {
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));
}

export const isExternal = url => /^https?:\/\//i.test(url);
export const isIgnorable = url => /^(mailto:|tel:|javascript:|data:|#?$)/i.test(url);

/**
 * Resuelve un enlace interno (relativo a la página `fromRoute`) a { path, hash }.
 * Devuelve null si el enlace es externo o no es comprobable.
 */
export function resolveInternal(url, fromRoute, siteUrl) {
  if (isIgnorable(url) && !url.startsWith('#')) {
    return null;
  }
  // El sitio usa <base href="/">: las URL relativas se resuelven desde la raíz, no desde la página; solo #anclajes dependen de ella.
  const base = new URL(url.startsWith('#') ? fromRoute : '/', siteUrl);
  const target = new URL(url, base);
  if (target.origin !== new URL(siteUrl).origin) {
    return null;
  }
  return { path: target.pathname.replace(/\/+$/, '') || '/', hash: decodeURIComponent(target.hash.slice(1)) };
}

/** Textos que parecen un archivo de imagen dentro de un JSON de datos (recursivo). */
export function imageRefsIn(value, found = []) {
  if (typeof value === 'string') {
    if (/\.(png|jpe?g|webp|svg|gif)$/i.test(value) && !/^https?:/i.test(value)) {
      found.push(value);
    }
  } else if (Array.isArray(value)) {
    value.forEach(item => imageRefsIn(item, found));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(item => imageRefsIn(item, found));
  }
  return found;
}

/** URL http(s) dentro de un JSON de datos (recursivo). */
export function urlsIn(value, found = []) {
  if (typeof value === 'string') {
    if (/^https?:\/\//i.test(value)) {
      found.push(value);
    }
  } else if (Array.isArray(value)) {
    value.forEach(item => urlsIn(item, found));
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(item => urlsIn(item, found));
  }
  return found;
}

/** ORCID guardado como "0000-0000-0000-0000" (sin URL) → URL de perfil. */
export const orcidUrl = id => (/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(id) ? `https://orcid.org/${id}` : null);
