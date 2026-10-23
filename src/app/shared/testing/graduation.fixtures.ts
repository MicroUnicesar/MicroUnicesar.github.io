import { GraduationOption } from '../models/graduation-option.model';
import { Resource } from '../models/resource.model';

/** Datos FICTICIOS, solo para pruebas. */
const t = (es: string) => ({ es, en: `${es} (en)` });

/** Opción con todas las secciones y todas las variantes de contenido. */
export const FULL_OPTION: GraduationOption = {
  id: 'opcion-completa',
  icon: 'bi-star',
  name: t('Opción completa'),
  title: t('Título completo de la opción completa'),
  description: t('Resumen de la opción completa'),
  about: [
    { text: t('Párrafo introductorio.') },
    { label: t('Nota:'), text: t('Texto con etiqueta.') },
    { items: [{ title: t('Libro'), text: t('Descripción del libro.') }, { text: t('Elemento sin título.') }] }
  ],
  requirements: [
    { items: [{ text: t('Requisito general uno') }, { label: t('Por promedio:'), text: t('Requisito con etiqueta') }] },
    { title: t('Caso especial'), items: [{ text: t('Requisito del caso especial') }] }
  ],
  documents: [
    { text: t('Formulario con formato'), resourceId: 'formato-ficticio' },
    { text: t('Documento sin enlace') },
    { text: t('Documento con id desconocido'), resourceId: 'no-existe' }
  ],
  steps: [t('Primer paso'), t('Segundo paso'), t('Tercer paso')]
};

/** Opción solo con título y resumen: las demás secciones deben ocultarse. */
export const BARE_OPTION: GraduationOption = {
  id: 'opcion-minima',
  icon: 'bi-book',
  name: t('Opción mínima'),
  title: t('Título de la opción mínima'),
  description: t('Resumen mínimo'),
  about: [],
  requirements: [],
  documents: [],
  steps: []
};

export const OPTIONS: GraduationOption[] = [FULL_OPTION, BARE_OPTION];

export const RESOURCES: Resource[] = [
  { id: 'formato-ficticio', category: 'grade-formats', type: 'pdf', title: t('Formato ficticio'), url: 'https://example.test/formato.pdf' }
];
