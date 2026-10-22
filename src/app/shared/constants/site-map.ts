/**
 * Mapa único del sitio: lo usan el menú, las páginas landing y el footer.
 * Una subsección con `ready: false` existe como URL (muestra "Próximamente"),
 * pero no aparece en menús desplegables ni se enlaza desde las landing.
 */
export interface SiteLink {
  path: string;
  labelKey: string;
  descriptionKey: string;
  icon: string;
  ready: boolean;
}

export type SectionId = 'program' | 'research' | 'people' | 'students' | 'news-events';

export interface SiteSection {
  id: SectionId;
  labelKey: string;
  descriptionKey: string;
  icon: string;
  /** Página principal de la sección (landing o página existente). Ausente si la sección no tiene una. */
  overview?: Pick<SiteLink, 'path'>;
  children: SiteLink[];
}

export const HOME_LINK = { path: '/home', labelKey: 'nav-home', icon: 'bi-house' };
export const CONTACT_LINK = { path: '/contact', labelKey: 'nav-contact', icon: 'bi-envelope' };

export const SITE_SECTIONS: SiteSection[] = [
  {
    id: 'program',
    labelKey: 'nav-program',
    descriptionKey: 'desc-program',
    icon: 'bi-mortarboard',
    overview: { path: '/program' },
    children: [
      { path: '/program/about', labelKey: 'nav-program-about', descriptionKey: 'desc-program-about', icon: 'bi-info-circle', ready: false },
      { path: '/program/labs', labelKey: 'nav-program-labs', descriptionKey: 'desc-program-labs', icon: 'bi-flask', ready: true }
    ]
  },
  {
    id: 'research',
    labelKey: 'nav-research',
    descriptionKey: 'desc-research',
    icon: 'bi-search',
    overview: { path: '/research' },
    children: [
      { path: '/research/groups', labelKey: 'nav-research-groups', descriptionKey: 'desc-research-groups', icon: 'bi-diagram-3', ready: true },
      { path: '/research/lines', labelKey: 'nav-research-lines', descriptionKey: 'desc-research-lines', icon: 'bi-list-ul', ready: true },
      { path: '/research/projects', labelKey: 'nav-research-projects', descriptionKey: 'desc-research-projects', icon: 'bi-folder', ready: false },
      { path: '/research/publications', labelKey: 'nav-research-publications', descriptionKey: 'desc-research-publications', icon: 'bi-journal-text', ready: false }
    ]
  },
  {
    id: 'people',
    labelKey: 'nav-people',
    descriptionKey: 'desc-people',
    icon: 'bi-people',
    overview: { path: '/people' },
    children: [
      { path: '/people/faculty', labelKey: 'nav-people-faculty', descriptionKey: 'desc-people-faculty', icon: 'bi-person-badge', ready: false },
      { path: '/people/students', labelKey: 'nav-people-students', descriptionKey: 'desc-people-students', icon: 'bi-backpack', ready: false },
      { path: '/people/staff', labelKey: 'nav-people-staff', descriptionKey: 'desc-people-staff', icon: 'bi-person-gear', ready: false }
    ]
  },
  {
    id: 'students',
    labelKey: 'nav-students',
    descriptionKey: 'desc-students',
    icon: 'bi-backpack',
    overview: { path: '/students' },
    children: [
      { path: '/students/graduation-options', labelKey: 'nav-options', descriptionKey: 'desc-students-graduation', icon: 'bi-mortarboard', ready: true },
      { path: '/students/wellness', labelKey: 'nav-wellness', descriptionKey: 'desc-students-wellness', icon: 'bi-heart', ready: true },
      { path: '/students/resources', labelKey: 'nav-students-resources', descriptionKey: 'desc-students-resources', icon: 'bi-folder2-open', ready: false },
      { path: '/students/faq', labelKey: 'nav-faq', descriptionKey: 'desc-students-faq', icon: 'bi-question-circle', ready: false }
    ]
  },
  {
    id: 'news-events',
    labelKey: 'nav-news-events',
    descriptionKey: 'desc-news-events',
    icon: 'bi-newspaper',
    children: [
      { path: '/news', labelKey: 'news', descriptionKey: 'desc-news', icon: 'bi-newspaper', ready: true },
      { path: '/events', labelKey: 'events', descriptionKey: 'desc-events', icon: 'bi-calendar-event', ready: true }
    ]
  }
];

export function findSection(id: SectionId): SiteSection | undefined {
  return SITE_SECTIONS.find(section => section.id === id);
}
