import { LocalizedText } from './localized-text.model';

/** Un tema de la página de Bienestar (src/assets/data/wellness.json). */
export interface WellnessItem {
  icon: string;
  name: LocalizedText;
  description: LocalizedText;
}
