import { LocalizedText } from './localized-text.model';

/** Noticia (src/assets/data/news.json). `date` es ISO (AAAA-MM-DD). */
export interface News {
  id?: number;
  title: LocalizedText;
  summary: LocalizedText;
  date: string;
  image: string;
  category?: string;
  isHighlight?: boolean;
}
