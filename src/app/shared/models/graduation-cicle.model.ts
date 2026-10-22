import { LocalizedText } from './localized-text.model';

export interface GraduationCicle {
  number: string;
  reception_from: LocalizedText;
  reception_to: LocalizedText;
  session: LocalizedText;
  eval_from: LocalizedText;
  eval_to: LocalizedText;
  answer: LocalizedText;
}
