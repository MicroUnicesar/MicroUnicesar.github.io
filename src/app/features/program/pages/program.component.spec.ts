import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramComponent } from './program.component';
import { flushData, pageTestProviders } from '../../../shared/testing/page-spec.helpers';
import { FULL_PROGRAM, SPARSE_PROGRAM } from '../../../shared/testing/program.fixtures';
import { ProgramData } from '../../../shared/models/program.model';

describe('ProgramComponent', () => {
  let fixture: ComponentFixture<ProgramComponent>;
  let element: HTMLElement;

  const open = (program: ProgramData) => {
    TestBed.configureTestingModule({ imports: [ProgramComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(ProgramComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ program });
    fixture.detectChanges();
  };

  const headings = () => Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim());

  describe('with every section filled', () => {
    beforeEach(() => open(FULL_PROGRAM));

    it('shows one h1 and all the sections', () => {
      expect(element.querySelectorAll('h1').length).toBe(1);
      expect(headings()).toEqual([
        'program-presentation', 'program-mission', 'program-vision', 'program-areas',
        'program-curriculum', 'program-profile', 'program-accreditation', 'program-contact'
      ]);
      expect(element.textContent).toContain('Primer párrafo ficticio.');
      expect(element.textContent).toContain('Misión ficticia.');
      expect(element.textContent).toContain('Perfil ficticio del egresado.');
      expect(element.textContent).toContain('Acreditación ficticia.');
    });

    it('links the curriculum when it has a URL, safely', () => {
      const link = element.querySelector('a[href="https://example.test/plan"]');
      expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('shows the last update date in a time element', () => {
      const time = element.querySelector('time');
      expect(time?.getAttribute('datetime')).toBe('2026-10-21');
      expect(time?.textContent?.trim().length).toBeGreaterThan(0);
    });

    it('highlights the impact card, and only that one, with the shared highlighted-card style', () => {
      const highlighted = Array.from(element.querySelectorAll('.card-highlight'));
      expect(highlighted.length).toBe(1);
      expect(highlighted[0].getAttribute('href')).toBe('/program/impact');
    });

    it('shows the contact email and links to the contact page and to impact in society', () => {
      expect(element.querySelector('a[href="mailto:programa@example.test"]')).not.toBeNull();
      expect(element.querySelector('a[href="/contact"]')).not.toBeNull();
      expect(element.querySelector('a[href="/program/impact"]')).not.toBeNull();
    });
  });

  describe('with only the content that exists today', () => {
    beforeEach(() => open(SPARSE_PROGRAM));

    it('hides the sections that are still TODO_CONTENIDO', () => {
      expect(headings()).toEqual(['program-presentation', 'program-areas', 'program-accreditation', 'program-contact']);
      expect(element.textContent).not.toContain('TODO_CONTENIDO');
      expect(element.querySelector('#program-mission')).toBeNull();
      expect(element.querySelector('#program-curriculum')).toBeNull();
    });
  });

  it('shows the curriculum section when there is only a link', () => {
    open({ ...SPARSE_PROGRAM, curriculum: { summary: SPARSE_PROGRAM.curriculum.summary, url: 'https://example.test/plan' } });
    expect(headings()).toContain('program-curriculum');
    expect(element.querySelector('a[href="https://example.test/plan"]')).not.toBeNull();
  });
});
