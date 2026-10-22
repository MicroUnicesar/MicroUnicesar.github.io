import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { GraduationOptionDetailComponent } from './graduation-option-detail.component';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { flushData, pageTestProviders } from '../../../../shared/testing/page-spec.helpers';
import { BARE_OPTION, FULL_OPTION, OPTIONS, RESOURCES } from '../../../../shared/testing/graduation.fixtures';
import { GraduationData } from '../../../../shared/models/graduation-data.model';

const DATA: GraduationData = { options: OPTIONS, resourceIds: [], cicles: [], faqs: [] };

describe('GraduationOptionDetailComponent', () => {
  let fixture: ComponentFixture<GraduationOptionDetailComponent>;
  let element: HTMLElement;

  const open = (id: string) => {
    TestBed.configureTestingModule({ imports: [GraduationOptionDetailComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(GraduationOptionDetailComponent);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    flushData({ 'graduation-options': DATA, resources: RESOURCES });
    fixture.detectChanges();
  };

  const headings = () => Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim());

  describe('option with all the information', () => {
    beforeEach(() => open('opcion-completa'));

    it('shows one h1 with the full title, the summary and every section', () => {
      expect(element.querySelectorAll('h1').length).toBe(1);
      expect(element.querySelector('h1')?.textContent).toContain('Título completo de la opción completa');
      expect(element.textContent).toContain('Resumen de la opción completa');
      expect(headings()).toEqual(['grade-about', 'grade-requirements', 'grade-documents', 'grade-route', 'nav-contact', 'grade-other-options']);
    });

    it('shows the description blocks: paragraphs, labelled notes and numbered items', () => {
      expect(element.textContent).toContain('Párrafo introductorio.');
      const note = Array.from(element.querySelectorAll('#grade-about ~ p')).find(p => p.textContent?.includes('Texto con etiqueta.'));
      expect(note?.querySelector('strong')?.textContent).toBe('Nota:');
      const items = element.querySelectorAll('#grade-about ~ ol li');
      expect(items.length).toBe(2);
      expect(items[0].querySelector('strong')?.textContent).toBe('Libro');
      expect(items[0].textContent).toContain('Descripción del libro.');
    });

    it('shows the requirements, with labels and grouped by title', () => {
      expect(element.querySelectorAll('[aria-labelledby="grade-requirements"] li').length).toBe(3);
      expect(element.querySelector('[aria-labelledby="grade-requirements"] h3')?.textContent).toContain('Caso especial');
      expect(element.querySelector('[aria-labelledby="grade-requirements"] strong')?.textContent).toBe('Por promedio:');
    });

    it('links a document to its real form only when the resource exists', () => {
      const docs = element.querySelectorAll('[aria-labelledby="grade-documents"] li');
      expect(docs.length).toBe(3);
      const link = docs[0].querySelector('a');
      expect(link?.getAttribute('href')).toBe('https://example.test/formato.pdf');
      expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link?.getAttribute('target')).toBe('_blank');
      expect(docs[1].querySelector('a')).toBeNull();
      expect(docs[2].querySelector('a')).toBeNull();
    });

    it('lists the route as an ordered list and links to the general procedure', () => {
      const steps = Array.from(element.querySelectorAll('[aria-labelledby="grade-route"] ol li')).map(li => li.textContent?.trim());
      expect(steps).toEqual(['Primer paso', 'Segundo paso', 'Tercer paso']);
      expect(element.querySelector('a[href="/students/graduation-options#procedure"]')).not.toBeNull();
    });

    it('shows the committee contact and links to the other options but not to itself', () => {
      expect(element.querySelector('a[href="mailto:comiteinvestigacionmicro@unicesar.edu.co"]')).not.toBeNull();
      const others = Array.from(element.querySelectorAll('nav a')).map(a => a.getAttribute('href'));
      expect(others).toEqual(['/students/graduation-options/opcion-minima']);
    });

    it('puts the full title in the breadcrumb and the page title/description', () => {
      expect(TestBed.inject(BreadcrumbService).leaf()?.es).toBe('Título completo de la opción completa');
      expect(TestBed.inject(Title).getTitle()).toContain('Título completo de la opción completa');
      expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Resumen de la opción completa');
    });
  });

  describe('option with only a title and summary', () => {
    beforeEach(() => open('opcion-minima'));

    it('hides every section without data', () => {
      expect(element.querySelector('h1')?.textContent).toContain('Título de la opción mínima');
      expect(headings()).toEqual(['nav-contact', 'grade-other-options']);
      for (const id of ['grade-about', 'grade-requirements', 'grade-documents', 'grade-route']) {
        expect(element.querySelector(`#${id}`)).withContext(id).toBeNull();
      }
      expect(element.textContent).not.toContain('TODO_');
    });
  });

  describe('unknown option', () => {
    beforeEach(() => open('no-existe'));

    it('shows the "not found" view with a single h1 and a way back, and sets its own title', () => {
      expect(element.querySelector('app-not-found')).not.toBeNull();
      expect(element.querySelectorAll('h1').length).toBe(1);
      expect(element.querySelector('h1')?.textContent).toContain('not-found-grade-title');
      expect(element.querySelector('a')?.getAttribute('href')).toBe('/students/graduation-options');
      expect(element.querySelector('article')).toBeNull();
      expect(TestBed.inject(Title).getTitle()).toContain('not-found-grade-title');
    });
  });

  it('clears the breadcrumb name when the page is destroyed', () => {
    open('opcion-completa');
    fixture.destroy();
    expect(TestBed.inject(BreadcrumbService).leaf()).toBeUndefined();
  });

  it('exposes the committee address used by FULL_OPTION fixtures consistently', () => {
    expect(FULL_OPTION.id).not.toBe(BARE_OPTION.id);
  });
});
