import { LocalizedText } from './localized-text.model';

export interface Project {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  groupIds: string[];
  status: 'active' | 'finished';
  startYear?: number;
  endYear?: number;
}
