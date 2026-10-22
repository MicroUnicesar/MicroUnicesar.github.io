import { LocalizedText } from './localized-text.model';

/** Elemento de texto de una lista: `label` (y/o `title`) en negrita antes del texto. */
export interface GraduationTextItem {
  label?: LocalizedText;
  title?: LocalizedText;
  text?: LocalizedText;
}

/** Bloque de la descripción: un párrafo (con etiqueta opcional, p. ej. "Nota:") o una lista numerada. */
export interface GraduationAboutBlock extends GraduationTextItem {
  items?: GraduationTextItem[];
}

/** Requisitos; `title` agrupa cuando la opción cubre varios casos (p. ej. libro, patente). */
export interface GraduationRequirementGroup {
  title?: LocalizedText;
  items: GraduationTextItem[];
}

export interface GraduationDocument extends GraduationTextItem {
  /** Id de resources.json: si existe, el documento enlaza al formato o formulario real. */
  resourceId?: string;
}

/** Una opción de grado (src/assets/data/graduation-options.json). Una sección vacía no se muestra. */
export interface GraduationOption {
  /** Slug estable de la URL: /students/graduation-options/:id */
  id: string;
  icon: string;
  /** Nombre corto, para la tarjeta. */
  name: LocalizedText;
  /** Título completo de la opción (el que tenía el modal original), para la página de detalle. */
  title: LocalizedText;
  /** Resumen para la tarjeta. */
  description: LocalizedText;
  about: GraduationAboutBlock[];
  requirements: GraduationRequirementGroup[];
  documents: GraduationDocument[];
  /** Ruta para la selección de esta opción, paso a paso. */
  steps: LocalizedText[];
}
