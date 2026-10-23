import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleListComponent } from './people-list.component';
import { flushData, pageTestProviders } from '../../../shared/testing/page-spec.helpers';
import { ADMIN, ALL_PEOPLE } from '../../../shared/testing/people.fixtures';
import { GROUPS } from '../../../shared/testing/research.fixtures';
import { Person } from '../../../shared/models/person.model';

describe('PeopleListComponent', () => {
  let fixture: ComponentFixture<PeopleListComponent>;
  let element: HTMLElement;

  const create = (category: Person['category'], people: object = ALL_PEOPLE) => {
    TestBed.configureTestingModule({ imports: [PeopleListComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(PeopleListComponent);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('category', category);
    fixture.componentRef.setInput('titleKey', 'nav-people-faculty');
    fixture.componentRef.setInput('descriptionKey', 'desc-people-faculty');
    fixture.detectChanges();
    flushData({ people, 'research-groups': GROUPS });
    fixture.detectChanges();
  };

  const names = () => Array.from(element.querySelectorAll('app-person-card h2')).map(h => h.textContent?.trim());

  describe('faculty', () => {
    beforeEach(() => create('faculty'));

    it('shows the authorities under the filters, with photo and email, and not in the list', () => {
      const panel = element.querySelector('aside [aria-labelledby="people-admin-title"]') as HTMLElement;
      expect(panel.textContent).toContain('Autoridad Ficticia');
      expect(panel.textContent).toContain('Jefe ficticio');
      expect(panel.querySelector('img')?.getAttribute('src')).toBe('assets/images/people/autoridad-ficticia.jpg');
      expect(panel.querySelector('a[href="mailto:autoridad@example.test"]')).not.toBeNull();
      expect(names()).not.toContain('Autoridad Ficticia');
    });

    it('lists only faculty, sorted, with one h1 and the search and group filters', () => {
      expect(element.querySelectorAll('h1').length).toBe(1);
      expect(names()).toEqual(['Docente Completa Ficticia', 'Docente Mínima Ficticia']);
      expect(element.querySelector('#filter-search')).not.toBeNull();
      expect(element.querySelector('#filter-group')).not.toBeNull();
      expect(element.querySelector('#filter-year')).toBeNull();
    });

    it('puts the cards in a 2/3 column and the filters in a 1/3 side panel', () => {
      expect(element.querySelector('.col-lg-8 app-person-card')).not.toBeNull();
      expect(element.querySelector('aside.col-lg-4 #filter-search')).not.toBeNull();
      expect(element.querySelector('aside.col-lg-4 #filter-group')).not.toBeNull();
    });

    it('links the cards to the profile pages and shows each person\'s groups', () => {
      const hrefs = Array.from(element.querySelectorAll('h2 a')).map(a => a.getAttribute('href'));
      expect(hrefs).toEqual(['/people/faculty/docente-completa', '/people/faculty/docente-minima']);
      expect(element.querySelector('.person-groups a')?.getAttribute('href')).toBe('/research/groups/grupo-completo');
    });

    it('searches by name ignoring accents', () => {
      fixture.componentRef.setInput('q', 'MINIMA');
      fixture.detectChanges();
      expect(names()).toEqual(['Docente Mínima Ficticia']);
    });

    it('filters by group', () => {
      fixture.componentRef.setInput('group', 'grupo-completo');
      fixture.detectChanges();
      expect(names()).toEqual(['Docente Completa Ficticia']);
    });

    it('says so when nothing matches', () => {
      fixture.componentRef.setInput('q', 'zzz');
      fixture.detectChanges();
      expect(names()).toEqual([]);
      expect(element.textContent).toContain('empty-results');
    });
  });

  it('lists students without profile links', () => {
    create('student');
    expect(names()).toEqual(['Estudiante Ficticia']);
    expect(element.querySelector('h2 a')).toBeNull();
  });

  it('shows the bilingual empty state when a category has nobody', () => {
    create('staff');
    expect(element.querySelector('app-coming-soon')).not.toBeNull();
    expect(element.querySelector('#filter-search')).toBeNull();
    expect(element.querySelectorAll('h1').length).toBe(1);
  });

  it('shows the empty state when there are no people at all', () => {
    create('faculty', []);
    expect(element.querySelector('app-coming-soon')).not.toBeNull();
  });
});
