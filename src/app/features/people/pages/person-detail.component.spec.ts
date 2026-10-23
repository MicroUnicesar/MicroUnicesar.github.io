import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonDetailComponent } from './person-detail.component';
import { flushData, pageTestProviders } from '../../../shared/testing/page-spec.helpers';
import { ALL_PEOPLE } from '../../../shared/testing/people.fixtures';
import { GROUPS, PUBLICATIONS } from '../../../shared/testing/research.fixtures';
import { Lab } from '../../../shared/models/lab.model';
import { Publication } from '../../../shared/models/publication.model';

// Datos ficticios, solo para pruebas.
const LABS: Lab[] = [
  { id: 'lab-ficticio', abr: 'LF', name: { es: 'Lab Ficticio', en: 'Fictitious Lab' }, description: { es: 'x', en: 'x' },
    researchLineIds: [], isSemillero: true, pi: 'Docente Completa Ficticia', piId: 'docente-completa', contact: 'x@example.test', projectIds: [] },
  { id: 'otro-lab', abr: 'OL', name: { es: 'Otro Lab', en: 'Other Lab' }, description: { es: 'x', en: 'x' },
    researchLineIds: [], isSemillero: false, pi: 'Otra Persona', piId: 'otra-persona', contact: 'y@example.test', projectIds: [] }
];
const LINKED_PUBLICATIONS: Publication[] = [
  ...PUBLICATIONS,
  { id: 'enlazada-1', title: 'Publicación enlazada ficticia', authors: ['Docente Completa'], year: 2021, personIds: ['docente-completa'] },
  { id: 'destacada-1', title: 'Duplicada con la destacada', authors: ['X'], personIds: ['docente-completa'] }
];

describe('PersonDetailComponent', () => {
  let fixture: ComponentFixture<PersonDetailComponent>;
  let element: HTMLElement;

  const open = (id: string) => {
    TestBed.configureTestingModule({ imports: [PersonDetailComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(PersonDetailComponent);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    flushData({ people: ALL_PEOPLE });
    flushData({ 'research-groups': GROUPS, labs: LABS, publications: LINKED_PUBLICATIONS });
    fixture.detectChanges();
  };

  const headings = () => Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim());

  describe('faculty with all data', () => {
    beforeEach(() => open('docente-completa'));

    it('shows the header: photo, name, role and academic profiles', () => {
      expect(element.querySelectorAll('h1').length).toBe(1);
      expect(element.querySelector('h1')?.textContent).toContain('Docente Completa Ficticia');
      expect(element.querySelector('img')?.getAttribute('src')).toBe('assets/images/people/docente-completa.jpg');
      expect(element.querySelector('img')?.getAttribute('alt')).toBe('Docente Completa Ficticia');
      expect(element.textContent).toContain('Profesora ficticia');
      expect(element.querySelectorAll('app-person-links a').length).toBe(6);
    });

    it('splits the research text into one paragraph per blank line', () => {
      const paragraphs = Array.from(element.querySelectorAll('[aria-labelledby="person-research"] p')).map(p => p.textContent);
      expect(paragraphs).toEqual(['Investigación ficticia detallada.', 'Segundo párrafo ficticio.']);
    });

    it('puts category, phone and email in the contact card, next to education and groups', () => {
      const card = element.querySelector('aside [aria-labelledby="person-contact"]') as HTMLElement;
      expect(card.textContent).toContain('Profesora ficticia');
      expect(card.textContent).toContain('+57 000 000 0000');
      expect(card.querySelector('a[href="tel:+570000000000"]')).not.toBeNull();
      expect(card.querySelector('a[href="mailto:docente.completa@example.test"]')).not.toBeNull();
      expect(element.querySelector('header a[href^="mailto:"]')).toBeNull();
    });

    it('shows every section', () => {
      expect(headings()).toEqual([
        'person-research', 'research-lines', 'person-publications', 'person-courses', 'person-team', 'person-alumni',
        'person-contact', 'nav-research-groups', 'person-lab', 'person-education'
      ]);
      expect(element.textContent).toContain('Investigación ficticia detallada.');
      expect(element.textContent).toContain('Línea ficticia B');
      expect(element.textContent).toContain('Curso ficticio dos');
      expect(element.textContent).toContain('Doctorado ficticio, 2010');
    });

    it('links to the groups and labs of the person', () => {
      expect(element.querySelector('a[href="/research/groups/grupo-completo"]')).not.toBeNull();
      expect(element.querySelector('a[href="/research/labs"]')?.textContent).toContain('LF');
      expect(element.textContent).toContain('tag-semillero');
      expect(element.textContent).not.toContain('Otro Lab');
    });

    it('shows featured and linked publications without duplicates', () => {
      const text = element.textContent ?? '';
      expect(text).toContain('Publicación destacada ficticia');
      expect(text).toContain('Publicación enlazada ficticia');
      expect(text).not.toContain('Duplicada con la destacada');
      expect(element.querySelector('a[href="https://doi.org/10.0000/destacada"]')?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('splits the team into current members and alumni, linking registered faculty', () => {
      const current = element.querySelectorAll('[aria-labelledby="person-team"] li');
      expect(current.length).toBe(2);
      expect(current[0].querySelector('a')).toBeNull();
      expect(current[1].querySelector('a')?.getAttribute('href')).toBe('/people/faculty/docente-minima');
      const alumni = element.querySelectorAll('[aria-labelledby="person-alumni"] li');
      expect(alumni.length).toBe(1);
      expect(alumni[0].textContent).toContain('Egresado Ficticio');
    });
  });

  describe('faculty with only name and email (what production has today)', () => {
    beforeEach(() => open('docente-minima'));

    it('hides every section without data', () => {
      expect(element.querySelector('h1')?.textContent).toContain('Docente Mínima Ficticia');
      expect(headings()).toEqual(['person-contact']);
      const card = element.querySelector('[aria-labelledby="person-contact"]') as HTMLElement;
      expect(card.querySelector('dt')?.textContent).toContain('person-email');
      expect(card.querySelector('a[href^="tel:"]')).toBeNull();
      expect(element.textContent).not.toContain('TODO_CONTENIDO');
      expect(element.querySelector('app-person-links ul')).toBeNull();
      expect(element.querySelector('img')).toBeNull();
      expect(element.querySelector('.bi-person-circle')).not.toBeNull();
      expect(element.querySelector('a[href="mailto:docente.minima@example.test"]')).not.toBeNull();
    });
  });

  describe('groups in both directions', () => {
    it('lists a group that names the person even if the person does not declare it', () => {
      TestBed.configureTestingModule({ imports: [PersonDetailComponent], providers: pageTestProviders() });
      fixture = TestBed.createComponent(PersonDetailComponent);
      element = fixture.nativeElement;
      fixture.componentRef.setInput('id', 'docente-minima');
      fixture.detectChanges();
      const group = { ...GROUPS[0], leaderId: 'docente-minima', memberIds: [] };
      flushData({ people: ALL_PEOPLE });
      flushData({ 'research-groups': [group], labs: [], publications: [] });
      fixture.detectChanges();

      expect(element.querySelector('a[href="/research/groups/grupo-completo"]')).not.toBeNull();
      expect(element.textContent).toContain('group-leader');
    });
  });

  describe('not found', () => {
    it('shows the "not found" view for an unknown id', () => {
      open('nadie');
      expect(element.querySelector('app-not-found')).not.toBeNull();
      expect(element.querySelectorAll('h1').length).toBe(1);
      expect(element.querySelector('h1')?.textContent).toContain('not-found-person-title');
      expect(element.querySelector('a')?.getAttribute('href')).toBe('/people/faculty');
      expect(element.querySelector('article')).toBeNull();
    });

    it('does not open a profile for people who are not faculty', () => {
      open('estudiante-ficticia');
      expect(element.querySelector('app-not-found')).not.toBeNull();
    });
  });
});
