import { LocalizedText } from './localized-text.model';

export interface GraduationFaq {
  id: string;
  question: LocalizedText;
  /** Respuesta en párrafo (admite HTML). */
  answer?: LocalizedText;
  /** Respuesta en pasos numerados. */
  steps?: LocalizedText[];
}
