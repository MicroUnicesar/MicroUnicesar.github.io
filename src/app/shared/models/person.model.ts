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
  category: 'faculty' | 'student' | 'staff' | 'alumni';
  photo?: string;
  email?: string;
  /** Ids de ResearchGroup. */
  groupIds: string[];
  researchLines: LocalizedText[];
  bio: LocalizedText;
  education?: LocalizedText[];
  courses?: LocalizedText[];
  links: PersonLinks;
  featuredPublications?: Publication[];
  teamMembers?: TeamMember[];
}
