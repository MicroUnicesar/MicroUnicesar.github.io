import { LocalizedText } from './localized-text.model';

/** Categorías de la página de recursos, en el orden en que se muestran. */
export const RESOURCE_CATEGORIES = [
  'grade-formats',
  'regulations',
  'academic-calendar',
  'lab-guides',
  'institutional-links'
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export type ResourceType = 'pdf' | 'doc' | 'form' | 'link';

export interface Resource {
  /** Slug estable, para poder citar el recurso desde otros datos. */
  id: string;
  category: ResourceCategory;
  type: ResourceType;
  title: LocalizedText;
  description?: LocalizedText;
  /** Dirección real del recurso (https://...). Nunca se inventa. */
  url: string;
  /** Nombre sugerido del archivo, si es una descarga. */
  file?: string;
}
