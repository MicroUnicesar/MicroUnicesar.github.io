import { groupsOfPerson, normalizeText, personPhotoUrl, personProfilePath, queryPeople } from './person.util';
import { ALL_PEOPLE, FULL_FACULTY, MINIMAL_FACULTY, STUDENT } from '../testing/people.fixtures';
import { EMPTY_GROUP, FULL_GROUP, GROUPS } from '../testing/research.fixtures';
import { Person } from '../models/person.model';

describe('person.util', () => {
  it('only faculty have a profile page', () => {
    expect(personProfilePath(FULL_FACULTY)).toBe('/people/faculty/docente-completa');
    expect(personProfilePath(STUDENT)).toBeNull();
  });

  it('builds the photo URL from a file name, keeps full URLs and handles no photo', () => {
    expect(personPhotoUrl(FULL_FACULTY)).toBe('assets/images/people/docente-completa.jpg');
    expect(personPhotoUrl({ ...FULL_FACULTY, photo: 'https://example.test/a.jpg' })).toBe('https://example.test/a.jpg');
    expect(personPhotoUrl(MINIMAL_FACULTY)).toBeNull();
  });

  it('normalizes text ignoring accents and case', () => {
    expect(normalizeText('  Rondón MARTÍNEZ ')).toBe('rondon martinez');
    expect(normalizeText('Cañate')).toBe('canate');
  });

  describe('groupsOfPerson', () => {
    it('includes the groups the person declares', () => {
      expect(groupsOfPerson(FULL_FACULTY, GROUPS).map(group => group.id)).toEqual(['grupo-completo']);
    });

    it('includes the groups that list the person as leader or member', () => {
      // FULL_GROUP lista a 'docente-minima' como miembro aunque la persona no declare grupos.
      const listedBy: Person = { ...MINIMAL_FACULTY, id: 'miembro-listado' };
      const group = { ...FULL_GROUP, memberIds: ['miembro-listado'] };
      expect(groupsOfPerson(listedBy, [group, EMPTY_GROUP]).map(g => g.id)).toEqual(['grupo-completo']);
      const leader = { ...group, leaderId: 'miembro-listado', memberIds: [] };
      expect(groupsOfPerson(listedBy, [leader]).map(g => g.id)).toEqual(['grupo-completo']);
    });

    it('does not duplicate a group found both ways', () => {
      expect(groupsOfPerson({ ...FULL_FACULTY, id: 'lider-ficticio' }, [FULL_GROUP]).length).toBe(1);
    });

    it('is empty for a person without groups', () => {
      expect(groupsOfPerson(MINIMAL_FACULTY, GROUPS)).toEqual([]);
    });
  });

  describe('queryPeople', () => {
    const query = (extra: Partial<Parameters<typeof queryPeople>[1]> = {}) =>
      queryPeople(ALL_PEOPLE, { category: 'faculty', groups: GROUPS, ...extra }).map(person => person.id);

    it('keeps only the requested category, sorted by name', () => {
      expect(query()).toEqual(['docente-completa', 'docente-minima']);
      expect(query({ category: 'student' })).toEqual(['estudiante-ficticia']);
      expect(query({ category: 'staff' })).toEqual([]);
    });

    it('searches by name ignoring accents and case', () => {
      expect(query({ q: 'MINIMA' })).toEqual(['docente-minima']);
      expect(query({ q: 'docente' })).toEqual(['docente-completa', 'docente-minima']);
      expect(query({ q: 'nadie' })).toEqual([]);
    });

    it('filters by group', () => {
      expect(query({ group: 'grupo-completo' })).toEqual(['docente-completa']);
      expect(query({ group: 'grupo-vacio' })).toEqual([]);
    });

    it('combines search and group', () => {
      expect(query({ group: 'grupo-completo', q: 'completa' })).toEqual(['docente-completa']);
      expect(query({ group: 'grupo-completo', q: 'minima' })).toEqual([]);
    });
  });
});
