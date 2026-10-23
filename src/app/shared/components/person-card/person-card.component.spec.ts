import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PersonCardComponent } from './person-card.component';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../testing/language.service.stub';
import { FULL_FACULTY, MINIMAL_FACULTY, STUDENT } from '../../testing/people.fixtures';
import { FULL_GROUP } from '../../testing/research.fixtures';
import { Person } from '../../models/person.model';

describe('PersonCardComponent', () => {
  let fixture: ComponentFixture<PersonCardComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PersonCardComponent],
      providers: [provideRouter([]), { provide: LanguageService, useValue: new LanguageServiceStub() }]
    });
    fixture = TestBed.createComponent(PersonCardComponent);
    element = fixture.nativeElement;
  });

  const render = (person: Person, groups = [] as typeof FULL_GROUP[]) => {
    fixture.componentRef.setInput('person', person);
    fixture.componentRef.setInput('groups', groups);
    fixture.detectChanges();
  };

  it('links a faculty member to their profile', () => {
    render(FULL_FACULTY);
    expect(element.querySelector('h2 a')?.getAttribute('href')).toBe('/people/faculty/docente-completa');
    expect(element.querySelector('h2')?.textContent).toContain('Docente Completa Ficticia');
  });

  it('does not link people without a profile', () => {
    render(STUDENT);
    expect(element.querySelector('h2 a')).toBeNull();
    expect(element.querySelector('h2')?.textContent).toContain('Estudiante Ficticia');
  });

  it('shows role, research lines and group badges that link to the group', () => {
    render(FULL_FACULTY, [FULL_GROUP]);
    expect(element.textContent).toContain('Profesora ficticia');
    expect(element.textContent?.replace(/\s+/g, ' ')).toContain('Línea ficticia A, Línea ficticia B');
    expect(element.querySelector('.person-groups a')?.getAttribute('href')).toBe('/research/groups/grupo-completo');
  });

  it('shows the short summary, never the long research text', () => {
    render(FULL_FACULTY);
    expect(element.querySelector('.person-summary')?.textContent).toContain('Resumen ficticio.');
    expect(element.textContent).not.toContain('Investigación ficticia detallada.');
  });

  it('hides empty role, lines and groups', () => {
    render(MINIMAL_FACULTY);
    expect(element.textContent).not.toContain('TODO_CONTENIDO');
    expect(element.querySelector('.person-groups')).toBeNull();
    expect(element.querySelectorAll('p').length).toBe(0);
  });

  it('shows the photo with the name as alt text, or a placeholder icon', () => {
    render(FULL_FACULTY);
    const img = element.querySelector('img');
    expect(img?.getAttribute('src')).toBe('assets/images/people/docente-completa.jpg');
    expect(img?.getAttribute('alt')).toBe('Docente Completa Ficticia');

    render(MINIMAL_FACULTY);
    expect(element.querySelector('img')).toBeNull();
    expect(element.querySelector('.bi-person-circle')?.getAttribute('aria-hidden')).toBe('true');
  });
});
