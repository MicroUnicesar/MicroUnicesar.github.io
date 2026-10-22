import { ResearchGroup } from '../models/research-group.model';
import { ResearchLine } from '../models/research-line.model';
import { Person } from '../models/person.model';
import { Project } from '../models/project.model';
import { Publication } from '../models/publication.model';

/** Datos FICTICIOS, solo para pruebas. */
const text = (es: string) => ({ es, en: `${es} (en)` });

export const FULL_GROUP: ResearchGroup = {
  id: 'grupo-completo', abr: 'GC', name: text('Grupo Completo Ficticio'), image: 'x.png',
  gruplac: 'https://example.test/gruplac', category: text('Categoría ficticia'),
  briefDescription: text('Breve'), description: text('Descripción ficticia'),
  researchLines: [text('Línea ficticia A'), text('Línea ficticia B')],
  leaderId: 'lider-ficticio', memberIds: ['lider-ficticio', 'docente-ficticio', 'estudiante-ficticio', 'sin-registro'],
  projectIds: ['proyecto-1'], publicationIds: ['articulo-1'], contact: 'grupo@example.test'
};

export const EMPTY_GROUP: ResearchGroup = {
  id: 'grupo-vacio', abr: 'GV', name: text('Grupo Vacío Ficticio'), image: 'y.png',
  gruplac: 'https://example.test/gruplac-2', category: text('Otra categoría'),
  briefDescription: text('Breve'), description: { es: 'TODO_CONTENIDO', en: 'TODO_CONTENIDO' },
  researchLines: [], memberIds: [], projectIds: [], publicationIds: []
};

export const GROUPS: ResearchGroup[] = [FULL_GROUP, EMPTY_GROUP];

const person = (id: string, name: string, category: Person['category']): Person => ({
  id, fullName: name, role: text(`Rol de ${name}`), category, groupIds: [], researchLines: [], bio: text('x'), links: {}
});

export const PEOPLE: Person[] = [
  person('lider-ficticio', 'Líder Ficticia', 'faculty'),
  person('docente-ficticio', 'Docente Ficticio', 'faculty'),
  person('estudiante-ficticio', 'Estudiante Ficticia', 'student')
];

export const PROJECTS: Project[] = [
  { id: 'proyecto-1', title: text('Proyecto ficticio uno'), description: text('Descripción del proyecto'),
    groupIds: ['grupo-completo'], status: 'active', startYear: 2024 },
  { id: 'proyecto-2', title: text('Proyecto ficticio dos'), description: text(''),
    groupIds: ['grupo-vacio'], status: 'finished', startYear: 2020, endYear: 2021 }
];

export const PUBLICATIONS: Publication[] = [
  { id: 'articulo-1', title: 'Artículo ficticio uno', authors: ['Autora A', 'Autor B'], year: 2024,
    journal: 'Revista Ficticia', doi: '10.0000/ficticio', groupIds: ['grupo-completo'] },
  { id: 'articulo-2', title: 'Artículo ficticio dos', authors: ['Autora C'], year: 2022, groupIds: ['grupo-vacio'] }
];

export const LINES: ResearchLine[] = [
  { id: 'linea-1', name: text('Línea ficticia uno'), description: text('Descripción'), icon: 'bi-dna', groupIds: ['grupo-completo'] },
  { id: 'linea-2', name: text('Línea ficticia dos'), description: text('Descripción'), icon: 'bi-virus', groupIds: ['grupo-vacio'] }
];
