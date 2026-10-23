import { Person } from './person.model';

describe('Person model', () => {
  it('accepts a minimal person (FICTICIO, solo para pruebas)', () => {
    const person: Person = {
      id: 'persona-ficticia',
      fullName: 'Persona Ficticia',
      role: { es: 'Docente de prueba', en: 'Test lecturer' },
      category: 'faculty',
      groupIds: [],
      researchLines: [],
      research: { es: 'Dato ficticio.', en: 'Fictitious data.' },
      links: {}
    };
    expect(person.category).toBe('faculty');
  });
});
