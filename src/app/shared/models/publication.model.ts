export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year?: number;
  journal?: string;
  doi?: string;
  url?: string;
  groupIds: string[];
  personIds?: string[];
}
