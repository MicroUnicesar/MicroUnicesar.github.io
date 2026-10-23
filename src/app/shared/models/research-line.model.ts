import { LocalizedText } from './localized-text.model';

export interface ResearchLine {
  /** Slug estable, usado en la URL: /research/lines/:id */
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  /** Ids de ResearchGroup. */
  groupIds: string[];
  /**
   * Información adicional, opcional: la página de la línea muestra cada sección solo si tiene datos.
   * Los grupos y los labs/semilleros relacionados se calculan solos a partir de `groupIds` y de
   * `researchLineIds` de cada lab; no hay que repetirlos aquí.
   */
  keywords?: LocalizedText[];
  /** Ids de Project (projects.json). */
  projectIds?: string[];
  /** Ids de Publication (publications.json). */
  publicationIds?: string[];
}
