import { Person } from '../models/person.model';

/** Datos FICTICIOS, solo para pruebas. */
const text = (es: string) => ({ es, en: `${es} (en)` });

/** Docente con todos los campos. */
export const FULL_FACULTY: Person = {
  id: 'docente-completa',
  fullName: 'Docente Completa Ficticia',
  role: text('Profesora ficticia'),
  category: 'faculty',
  photo: 'docente-completa.jpg',
  email: 'docente.completa@example.test',
  groupIds: ['grupo-completo'],
  researchLines: [text('Línea ficticia A'), text('Línea ficticia B')],
  bio: text('Biografía ficticia.'),
  education: [text('Doctorado ficticio, 2010')],
  courses: [text('Curso ficticio uno'), text('Curso ficticio dos')],
  links: {
    orcid: '0000-0000-0000-0001',
    googleScholar: 'https://scholar.example.test/1',
    cvlac: 'https://cvlac.example.test/1',
    scopus: 'https://scopus.example.test/1',
    researchGate: 'https://researchgate.example.test/1',
    website: 'https://example.test/docente'
  },
  featuredPublications: [
    { id: 'destacada-1', title: 'Publicación destacada ficticia', authors: ['Docente Completa'], year: 2023, doi: '10.0000/destacada' }
  ],
  teamMembers: [
    { name: 'Estudiante Actual Ficticia', role: text('Tesista'), status: 'current' },
    { personId: 'docente-minima', name: 'Docente Mínima Ficticia', role: text('Colaboradora'), status: 'current' },
    { name: 'Egresado Ficticio', role: text('Exestudiante'), status: 'alumni' }
  ]
};

/** Docente con solo los datos que existen hoy en producción (nombre y correo). */
export const MINIMAL_FACULTY: Person = {
  id: 'docente-minima',
  fullName: 'Docente Mínima Ficticia',
  role: { es: 'TODO_CONTENIDO', en: 'TODO_CONTENIDO' },
  category: 'faculty',
  email: 'docente.minima@example.test',
  groupIds: [],
  researchLines: [],
  bio: { es: 'TODO_CONTENIDO', en: 'TODO_CONTENIDO' },
  links: {}
};

export const STUDENT: Person = {
  id: 'estudiante-ficticia',
  fullName: 'Estudiante Ficticia',
  role: text('Estudiante de prueba'),
  category: 'student',
  groupIds: ['grupo-vacio'],
  researchLines: [],
  bio: text('x'),
  links: {}
};

export const ALL_PEOPLE: Person[] = [FULL_FACULTY, MINIMAL_FACULTY, STUDENT];
