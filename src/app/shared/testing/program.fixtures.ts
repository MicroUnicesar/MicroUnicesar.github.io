import { ProgramData } from '../models/program.model';

/** Datos FICTICIOS, solo para pruebas. */
const text = (es: string) => ({ es, en: `${es} (en)` });
const pending = { es: 'TODO_CONTENIDO', en: 'TODO_CONTENIDO' };

/** Programa con todas las secciones llenas. */
export const FULL_PROGRAM: ProgramData = {
  lastUpdated: '2026-10-21',
  presentation: [{ text: text('Primer párrafo ficticio.') }, { text: text('Segundo párrafo con 99 proyectos ficticios.'), unconfirmed: ['99 proyectos'] }],
  specializationAreas: [{ name: text('Área ficticia uno'), description: text('Descripción del área uno') }],
  mission: text('Misión ficticia.'),
  vision: text('Visión ficticia.'),
  curriculum: { summary: text('Resumen ficticio del plan.'), url: 'https://example.test/plan' },
  graduateProfile: text('Perfil ficticio del egresado.'),
  accreditation: { text: text('Acreditación ficticia.'), unconfirmed: ['Acreditación'] },
  contact: { email: 'programa@example.test' }
};

/** Programa como está hoy en producción: solo presentación, áreas, acreditación y contacto. */
export const SPARSE_PROGRAM: ProgramData = {
  ...FULL_PROGRAM,
  mission: pending,
  vision: pending,
  curriculum: { summary: pending },
  graduateProfile: pending
};
