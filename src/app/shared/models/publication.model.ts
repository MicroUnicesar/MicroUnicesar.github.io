export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year?: number;
  journal?: string;
  doi?: string;
  url?: string;
  /** Una publicación puede asociarse a personas, grupos y labs/semilleros. */
  personIds?: string[];
  groupIds?: string[];
  labIds?: string[];
}
