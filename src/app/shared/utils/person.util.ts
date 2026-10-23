import { Person } from '../models/person.model';
import { ResearchGroup } from '../models/research-group.model';

/** Solo los docentes tienen ficha propia. */
export function personProfilePath(person: Person): string | null {
  return person.category === 'faculty' ? `/people/faculty/${person.id}` : null;
}

/** `photo` es el nombre de un archivo de src/assets/images/people (o una URL completa). */
export function personPhotoUrl(person: Person): string | null {
  if (!person.photo) {
    return null;
  }
  return person.photo.startsWith('http') ? person.photo : `assets/images/people/${person.photo}`;
}

/** Texto sin tildes ni mayúsculas, para buscar por nombre. */
export function normalizeText(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/**
 * Grupos de una persona, en ambos sentidos: los que ella declara (`groupIds`)
 * más los que la listan como líder o miembro.
 */
export function groupsOfPerson(person: Person, groups: ResearchGroup[]): ResearchGroup[] {
  return groups.filter(group =>
    person.groupIds.includes(group.id) || group.leaderId === person.id || group.memberIds.includes(person.id));
}

export interface PeopleQuery {
  category: Person['category'];
  groups: ResearchGroup[];
  /** Id de grupo. */
  group?: string;
  /** Texto a buscar en el nombre. */
  q?: string;
}

/** Personas de una categoría, filtradas por grupo y nombre, ordenadas alfabéticamente. */
export function queryPeople(people: Person[], query: PeopleQuery): Person[] {
  const text = normalizeText(query.q ?? '');
  return people
    .filter(person => person.category === query.category)
    .filter(person => !query.group || groupsOfPerson(person, query.groups).some(group => group.id === query.group))
    .filter(person => !text || normalizeText(person.fullName).includes(text))
    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'es'));
}
