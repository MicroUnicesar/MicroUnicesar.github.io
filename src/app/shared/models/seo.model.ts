import { LocalizedText } from './localized-text.model';

/** Un texto de metadatos: una clave i18n o un texto bilingüe de los datos. */
export type MetaText = { key: string } | LocalizedText;

export interface PageMeta {
  /** Sin título solo se muestra el nombre del sitio (portada). */
  title?: MetaText;
  /** Una lista son alternativas: se usa la primera que tenga contenido (p. ej. biografía, si no cargo). */
  description?: MetaText | MetaText[];
}
