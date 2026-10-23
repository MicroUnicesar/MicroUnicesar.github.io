import { LocalizedText } from './localized-text.model';

export interface ResearchGroup {
  /** Slug estable, usado también en URLs (p. ej. "pam"). */
  id: string;
  abr: string;
  name: LocalizedText;
  image: string;
  gruplac: string;
  category: LocalizedText;
  briefDescription: LocalizedText;
  description: LocalizedText;
  researchLines: LocalizedText[];
  /** Id de Person. Sin dato hasta que el responsable lo aporte (ver docs/CONTENIDO_PENDIENTE.md). */
  leaderId?: string;
  memberIds: string[];
  projectIds: string[];
  publicationIds: string[];
  contact?: string;
}
