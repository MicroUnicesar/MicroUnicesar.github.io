import { LocalizedText } from './localized-text.model';

export interface Faq {
  id: string;
  question: LocalizedText;
  /** Respuesta (admite HTML). `TODO_CONTENIDO` mientras no exista una respuesta real. */
  answer: LocalizedText;
}
