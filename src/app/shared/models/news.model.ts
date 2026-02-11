export interface News {
  id?: number;
  title: string;
  summary: string;
  content?: string;
  date: string;
  image: string;
  category?: string;
  isHighlight?: boolean;
}
