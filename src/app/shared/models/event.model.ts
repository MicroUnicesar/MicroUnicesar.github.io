import { LocalizedText } from './localized-text.model';

export type EventType = 'deadline' | 'seminar' | 'evaluation' | 'defense';

/** Evento (src/assets/data/events.json). `date` es ISO (AAAA-MM-DD) y `time` es HH:mm (24 h). */
export interface Event {
  id?: number;
  title: LocalizedText;
  date: string;
  time: string;
  type: EventType;
  description: LocalizedText;
  location: LocalizedText;
  registration_link?: string;
  more_info?: string;
}
