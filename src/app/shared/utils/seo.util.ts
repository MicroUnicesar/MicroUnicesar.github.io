import { CONTACT_LINK, SITE_SECTIONS } from '../constants/site-map';
import { PageMeta } from '../models/seo.model';

/** Ruta canónica de una URL: sin consulta ni ancla, sin barra final, y `/home` es la portada (`/`). */
export function canonicalPath(url: string): string {
  const path = url.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return path === '/home' ? '/' : path;
}

/** URL absoluta a partir de la URL del sitio y una ruta ("/research" o "assets/x.jpg"). */
export function absoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/+$/, '');
  return path === '/' ? `${base}/` : `${base}/${path.replace(/^\/+/, '')}`;
}

/** Locale de Open Graph de un idioma del sitio. */
export function ogLocale(lang: string): string {
  return lang === 'en' ? 'en_US' : 'es_CO';
}

/**
 * Título y descripción de una página que no los define por su cuenta, tomados del mapa del sitio
 * (los mismos textos del menú y de las tarjetas). Devuelve `undefined` si la ruta no se conoce.
 */
export function defaultPageMeta(path: string): PageMeta | undefined {
  if (path === '/') {
    return { description: { key: 'seo-home-description' } };
  }
  if (path === CONTACT_LINK.path) {
    return { title: { key: CONTACT_LINK.labelKey }, description: { key: 'seo-contact-description' } };
  }
  for (const section of SITE_SECTIONS) {
    if (section.overview?.path === path) {
      return { title: { key: section.labelKey }, description: { key: section.descriptionKey } };
    }
    const page = section.children.find(child => child.path === path);
    if (page) {
      return { title: { key: page.labelKey }, description: { key: page.descriptionKey } };
    }
  }
  return undefined;
}
