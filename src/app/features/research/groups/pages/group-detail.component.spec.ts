import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { GroupDetailComponent } from './group-detail.component';
import { LanguageService } from '../../../../core/services/language.service';
import { LanguageServiceStub } from '../../../../shared/testing/language.service.stub';
import { GROUPS, PEOPLE, PROJECTS, PUBLICATIONS } from '../../../../shared/testing/research.fixtures';

describe('GroupDetailComponent', () => {
  let fixture: ComponentFixture<GroupDetailComponent>;
  let http: HttpTestingController;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupDetailComponent],
      providers: [
        provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
        { provide: LanguageService, useValue: new LanguageServiceStub() }
      ]
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(GroupDetailComponent);
    element = fixture.nativeElement;
  });

  /** Abre la página de un grupo y responde todas las peticiones de datos. */
  const open = (id: string) => {
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    http.expectOne('assets/data/research-groups.json').flush(GROUPS);
    const others = [['people', PEOPLE], ['projects', PROJECTS], ['publications', PUBLICATIONS]] as const;
    for (const [file, data] of others) {
      for (const request of http.match(`assets/data/${file}.json`)) {
        request.flush(data);
      }
    }
    fixture.detectChanges();
  };

  const headings = () => Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim());

  describe('group with data', () => {
    beforeEach(() => open('grupo-completo'));

    it('shows the header with a single h1 and the GrupLAC link', () => {
      expect(element.querySelectorAll('h1').length).toBe(1);
      expect(element.querySelector('h1')?.textContent).toContain('Grupo Completo Ficticio');
      expect(element.querySelector('.group-abr')?.textContent).toContain('GC');
      const gruplac = element.querySelector('a[href="https://example.test/gruplac"]');
      expect(gruplac?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('shows description, lines, projects and publications', () => {
      expect(headings()).toEqual(jasmine.arrayContaining([
        'group-about', 'research-lines', 'nav-research-projects', 'nav-research-publications', 'group-info', 'group-members'
      ]));
      expect(element.textContent).toContain('Descripción ficticia');
      expect(element.textContent).toContain('Línea ficticia B');
      expect(element.textContent).toContain('Proyecto ficticio uno');
      expect(element.textContent).toContain('Artículo ficticio uno');
      expect(element.querySelector('a[href="https://doi.org/10.0000/ficticio"]')).not.toBeNull();
    });

    it('links the group projects and publications to the filtered lists', () => {
      const hrefs = Array.from(element.querySelectorAll('a')).map(a => a.getAttribute('href'));
      expect(hrefs).toContain('/research/projects?group=grupo-completo');
      expect(hrefs).toContain('/research/publications?group=grupo-completo');
    });

    it('lists the leader first and links only faculty to their profile', () => {
      const members = element.querySelectorAll('#group-members ~ ul li, [aria-labelledby="group-members"] li');
      expect(members.length).toBe(3);
      expect(members[0].textContent).toContain('Líder Ficticia');
      expect(members[0].textContent).toContain('group-leader');
      expect(element.querySelector('a[href="/people/faculty/lider-ficticio"]')).not.toBeNull();
      expect(element.querySelector('a[href="/people/faculty/docente-ficticio"]')).not.toBeNull();
      expect(element.querySelector('a[href="/people/faculty/estudiante-ficticio"]')).toBeNull();
      expect(element.textContent).toContain('Estudiante Ficticia');
    });

    it('omits member ids that have no registered person', () => {
      expect(element.textContent).not.toContain('sin-registro');
    });

    it('shows the contact email', () => {
      expect(element.querySelector('a[href="mailto:grupo@example.test"]')).not.toBeNull();
    });
  });

  describe('group without data', () => {
    beforeEach(() => open('grupo-vacio'));

    it('renders only the sections that have data', () => {
      expect(headings()).toEqual(['group-info']);
      expect(element.querySelector('[aria-labelledby="group-members"]')).toBeNull();
      expect(element.querySelector('#group-about')).toBeNull();
      expect(element.querySelector('#group-lines')).toBeNull();
      expect(element.querySelector('#group-projects')).toBeNull();
      expect(element.querySelector('#group-publications')).toBeNull();
      expect(element.textContent).not.toContain('TODO_CONTENIDO');
      expect(element.querySelector('a[href^="mailto:"]')).toBeNull();
    });

    it('still shows the header and category', () => {
      expect(element.querySelector('h1')?.textContent).toContain('Grupo Vacío Ficticio');
      expect(element.textContent).toContain('Otra categoría');
    });
  });

  describe('unknown group', () => {
    beforeEach(() => open('no-existe'));

    it('shows the "not found" view with one h1 and a way back', () => {
      expect(element.querySelector('app-not-found')).not.toBeNull();
      expect(element.querySelectorAll('h1').length).toBe(1);
      expect(element.querySelector('h1')?.textContent).toContain('not-found-group-title');
      expect(element.querySelector('a')?.getAttribute('href')).toBe('/research/groups');
      expect(element.querySelector('article')).toBeNull();
    });
  });

  it('loads the new group when the id changes', () => {
    open('grupo-completo');
    expect(element.querySelector('h1')?.textContent).toContain('Grupo Completo Ficticio');

    fixture.componentRef.setInput('id', 'grupo-vacio');
    fixture.detectChanges();
    fixture.detectChanges();
    expect(element.querySelector('h1')?.textContent).toContain('Grupo Vacío Ficticio');
  });
});
