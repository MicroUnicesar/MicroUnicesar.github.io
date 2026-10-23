import { LocalizedText } from './localized-text.model';

/** Una iniciativa de impacto en la sociedad / extensión (src/assets/data/impact.json). */
export interface ImpactInitiative {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  /** Nombre de un archivo de src/assets/images/impact (opcional). */
  image?: string;
  /** Más información (https://...), opcional. */
  url?: string;
}
