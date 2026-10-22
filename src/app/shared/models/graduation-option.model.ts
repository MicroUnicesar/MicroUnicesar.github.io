import { LocalizedText } from './localized-text.model';

export interface GraduationOption {
  icon: string;
  name: LocalizedText;
  description: LocalizedText;
  /** Id del modal que muestra el detalle. */
  modal: string;
}
