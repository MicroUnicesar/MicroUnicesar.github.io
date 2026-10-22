/** Texto bilingüe. Todo contenido de datos visible al usuario usa este tipo. */
export interface LocalizedText {
  es: string;
  en: string;
}

/** Marcador: el texto existe solo en español y falta la traducción al inglés. */
export const PENDING_TRANSLATION = 'TODO_TRADUCCION';

/** Marcador: el dato no existe en el repositorio y debe aportarlo el responsable del contenido. */
export const PENDING_CONTENT = 'TODO_CONTENIDO';
