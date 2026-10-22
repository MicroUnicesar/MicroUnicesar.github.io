import { LocalizedText } from './localized-text.model';

export interface Lab {
  /** Slug estable (p. ej. "epivete"). */
  id: string;
  abr: string;
  name: LocalizedText;
  description: LocalizedText;
  /** Ids de ResearchLine. */
  researchLineIds: string[];
  /** Investigador/a principal. */
  pi: string;
  contact: string;
  projectIds: string[];
}
