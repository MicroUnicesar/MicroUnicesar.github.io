import { LocalizedText } from './localized-text.model';

/**
 * Lab de un/a docente (cada docente puede tener el suyo). Un lab que además es
 * semillero de investigación se marca con `isSemillero` y se muestra en esa sección.
 */
export interface Lab {
  /** Slug estable (p. ej. "epivete"). */
  id: string;
  abr: string;
  name: LocalizedText;
  description: LocalizedText;
  /** Ids de ResearchLine. */
  researchLineIds: string[];
  /** Los semilleros son labs: este campo los distingue (figura colombiana de formación investigativa). */
  isSemillero: boolean;
  /** Investigador/a principal (docente responsable del lab). */
  pi: string;
  /** Id de Person del docente responsable, para enlazar a su ficha. */
  piId?: string;
  contact: string;
  projectIds: string[];
}
