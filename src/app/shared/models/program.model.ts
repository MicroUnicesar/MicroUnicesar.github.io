import { LocalizedText } from './localized-text.model';

/** Texto con afirmaciones que el responsable aún debe confirmar (cifras, acreditación). */
export interface ProgramText {
  text: LocalizedText;
  /** Fragmentos literales del texto en español pendientes de confirmar; ver docs/CONTENIDO_PENDIENTE.md. */
  unconfirmed?: string[];
}

export interface SpecializationArea {
  name: LocalizedText;
  description: LocalizedText;
}

/** Estructura de src/assets/data/program.json. `TODO_CONTENIDO` = falta el dato y la sección no se muestra. */
export interface ProgramData {
  /** Fecha ISO (AAAA-MM-DD) de la última revisión del contenido. */
  lastUpdated: string;
  presentation: ProgramText[];
  specializationAreas: SpecializationArea[];
  mission: LocalizedText;
  vision: LocalizedText;
  curriculum: { summary: LocalizedText; url?: string };
  graduateProfile: LocalizedText;
  accreditation: ProgramText;
  contact: { email: string };
}
