import { LocalizedText } from './localized-text.model';
import { Publication } from './publication.model';

export interface PersonLinks {
  orcid?: string;
  googleScholar?: string;
  cvlac?: string;
  scopus?: string;
  researchGate?: string;
  website?: string;
}

export interface TeamMember {
  personId?: string;
  name: string;
  role: LocalizedText;
  status: 'current' | 'alumni';
}

export interface Person {
  /** Slug: "nombre-apellido". */
  id: string;
  fullName: string;
  role: LocalizedText;
  /** `admin`: autoridades que se muestran aparte (jefe de departamento, decanatura); no tienen listado propio. */
  category: 'faculty' | 'student' | 'staff' | 'alumni' | 'admin';
  photo?: string;
  email?: string;
  /** Teléfono de contacto, tal como debe mostrarse (p. ej. "+57 605 584 5555"). */
  phone?: string;
  /** Ids de ResearchGroup. */
  groupIds: string[];
  researchLines: LocalizedText[];
  /** "Nuestra investigación": descripción detallada de en qué trabaja; se muestra en la ficha del docente. */
  research: LocalizedText;
  /** Texto breve (2-3 líneas) sobre en qué trabaja; es el que muestra la tarjeta del listado. */
  summary: LocalizedText;

  education?: LocalizedText[];
  courses?: LocalizedText[];
  links: PersonLinks;
  featuredPublications?: Publication[];
  teamMembers?: TeamMember[];
}
