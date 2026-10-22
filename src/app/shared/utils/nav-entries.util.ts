import { CONTACT_LINK, HOME_LINK, SITE_SECTIONS, SiteLink, SiteSection } from '../constants/site-map';

export interface NavLinkEntry {
  kind: 'link';
  id: string;
  path: string;
  labelKey: string;
  icon: string;
}

export interface NavDropdownEntry {
  kind: 'dropdown';
  id: string;
  labelKey: string;
  icon: string;
  /** Rutas hijas que dejan activo al padre. */
  items: NavLinkEntry[];
}

export type NavEntry = NavLinkEntry | NavDropdownEntry;

const toEntry = (link: Pick<SiteLink, 'path' | 'labelKey' | 'icon'>, id: string): NavLinkEntry => ({
  kind: 'link', id, path: link.path, labelKey: link.labelKey, icon: link.icon
});

/** Entradas del menú de una sección: solo cuenta lo que ya tiene contenido (`ready`). */
function sectionEntry(section: SiteSection): NavEntry | undefined {
  const items: NavLinkEntry[] = [];
  if (section.overview) {
    items.push({ kind: 'link', id: `${section.id}-overview`, path: section.overview.path, labelKey: 'nav-overview', icon: 'bi-grid' });
  }
  items.push(...section.children.filter(child => child.ready).map(child => toEntry(child, child.path)));

  if (items.length === 0) {
    return undefined;
  }
  // Un desplegable de un solo elemento es solo un enlace.
  if (items.length === 1) {
    return { ...items[0], id: section.id, labelKey: section.labelKey, icon: section.icon };
  }
  return { kind: 'dropdown', id: section.id, labelKey: section.labelKey, icon: section.icon, items };
}

export function buildNavEntries(): NavEntry[] {
  const sections = SITE_SECTIONS.map(sectionEntry).filter((entry): entry is NavEntry => !!entry);
  return [toEntry(HOME_LINK, 'home'), ...sections, toEntry(CONTACT_LINK, 'contact')];
}

/** ¿La URL actual cae dentro de alguna ruta del desplegable? (para marcar el padre como activo). */
export function isDropdownActive(entry: NavDropdownEntry, url: string): boolean {
  const path = url.split(/[?#]/)[0];
  return entry.items.some(item => path === item.path || path.startsWith(`${item.path}/`));
}
