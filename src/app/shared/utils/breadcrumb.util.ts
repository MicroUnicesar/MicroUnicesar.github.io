import { SITE_SECTIONS } from '../constants/site-map';
import { LocalizedText } from '../models/localized-text.model';

export interface BreadcrumbItem {
  /** Clave i18n de la etiqueta. */
  labelKey?: string;
  /** Etiqueta ya redactada (nombre de un grupo o persona). */
  text?: LocalizedText;
  /** Sin ruta = el elemento actual. */
  path?: string;
}

/**
 * Migas de pan de una URL según el mapa del sitio:
 * Inicio > Sección > Página > (detalle). No hay para páginas de primer nivel ni URLs desconocidas.
 * `leaf` es el nombre del detalle (grupo, persona) cuando la URL tiene un tercer tramo.
 */
export function buildBreadcrumb(url: string, leaf?: LocalizedText): BreadcrumbItem[] {
  const segments = url.split(/[?#]/)[0].split('/').filter(Boolean);
  if (segments.length < 2) {
    return [];
  }

  const root = `/${segments[0]}`;
  const section = SITE_SECTIONS.find(candidate =>
    candidate.overview?.path === root || candidate.children.some(child => child.path.startsWith(`${root}/`)));
  const page = section?.children.find(child => child.path === `${root}/${segments[1]}`);
  if (!section || !page) {
    return [];
  }

  const hasDetail = segments.length > 2;
  const trail: BreadcrumbItem[] = [
    { labelKey: 'nav-home', path: '/home' },
    { labelKey: section.labelKey, path: section.overview?.path },
    { labelKey: page.labelKey, path: hasDetail ? page.path : undefined }
  ];
  if (hasDetail && leaf) {
    trail.push({ text: leaf });
  }
  return trail;
}
