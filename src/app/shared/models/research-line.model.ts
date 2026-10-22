import { LocalizedText } from './localized-text.model';

export interface ResearchLine {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  icon: string;
  /** Ids de ResearchGroup. */
  groupIds: string[];
}
