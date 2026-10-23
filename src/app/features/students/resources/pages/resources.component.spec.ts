import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourcesComponent } from './resources.component';
import { flushData, pageTestProviders } from '../../../../shared/testing/page-spec.helpers';
import { Resource } from '../../../../shared/models/resource.model';

// Datos ficticios, solo para pruebas.
const text = (es: string) => ({ es, en: `${es} (en)` });
const RESOURCES: Resource[] = [
  { id: 'enlace', category: 'institutional-links', type: 'link', title: text('Enlace ficticio'), url: 'https://example.test/enlace' },
  { id: 'formato', category: 'grade-formats', type: 'doc', title: text('Formato ficticio'), description: text('Descripción ficticia'), url: 'https://example.test/formato' },
  { id: 'reglamento', category: 'regulations', type: 'pdf', title: text('Reglamento ficticio'), url: 'https://example.test/reglamento' }
];

describe('ResourcesComponent', () => {
  let fixture: ComponentFixture<ResourcesComponent>;
  let element: HTMLElement;

  const create = (resources: object) => {
    TestBed.configureTestingModule({ imports: [ResourcesComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(ResourcesComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ resources });
    fixture.detectChanges();
  };

  it('groups resources by category in the defined order, hiding empty categories', () => {
    create(RESOURCES);
    expect(element.querySelectorAll('h1').length).toBe(1);
    const headings = Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim());
    // Sin calendario ni guías de laboratorio: no tienen recursos y no se muestran.
    expect(headings).toEqual(['resources-cat-grade-formats', 'resources-cat-regulations', 'resources-cat-institutional-links']);
  });

  it('opens each resource in a new tab, safely, with a description when it has one', () => {
    create(RESOURCES);
    const link = element.querySelector('a[href="https://example.test/formato"]');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link?.textContent).toContain('Formato ficticio');
    expect(link?.textContent).toContain('Descripción ficticia');
    expect(link?.querySelector('.visually-hidden')?.textContent).toContain('opens-new-tab');
    expect(element.querySelector('a[href="https://example.test/reglamento"] .bi-filetype-pdf')).not.toBeNull();
  });

  it('shows the bilingual empty state when there are no resources at all', () => {
    create([]);
    expect(element.querySelector('app-coming-soon')).not.toBeNull();
    expect(element.querySelectorAll('h1').length).toBe(1);
  });
});
