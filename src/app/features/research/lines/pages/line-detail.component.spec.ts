import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { LineDetailComponent } from './line-detail.component';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { flushData, pageTestProviders } from '../../../../shared/testing/page-spec.helpers';
import { GROUPS, LINES, PROJECTS, PUBLICATIONS } from '../../../../shared/testing/research.fixtures';
import { Lab } from '../../../../shared/models/lab.model';
import { ResearchLine } from '../../../../shared/models/research-line.model';

// Datos ficticios, solo para pruebas.
const t = (es: string) => ({ es, en: `${es} (en)` });
const LABS: Lab[] = [
  { id: 'lab-a', abr: 'LA', name: t('Lab A'), description: t('x'), researchLineIds: ['linea-1'], isSemillero: true,
    pi: 'Persona A', contact: 'a@example.test', projectIds: [] },
  { id: 'lab-b', abr: 'LB', name: t('Lab B'), description: t('x'), researchLineIds: ['linea-2'], isSemillero: false,
    pi: 'Persona B', contact: 'b@example.test', projectIds: [] }
];
const RICH_LINE: ResearchLine = {
  ...LINES[0], description: t('palabra '.repeat(60)),
  keywords: [t('Palabra clave uno'), t('Palabra clave dos')], projectIds: ['proyecto-1'], publicationIds: ['articulo-1']
};

describe('LineDetailComponent', () => {
  let fixture: ComponentFixture<LineDetailComponent>;
  let element: HTMLElement;

  const open = (id: string, lines: ResearchLine[] = LINES) => {
    TestBed.configureTestingModule({ imports: [LineDetailComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(LineDetailComponent);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    flushData({ 'research-lines': lines, 'research-groups': GROUPS, labs: LABS, projects: PROJECTS, publications: PUBLICATIONS });
    fixture.detectChanges();
  };

  const headings = () => Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim());

  describe('line with the data that exists today', () => {
    beforeEach(() => open('linea-1'));

    it('shows one h1, the description and the related groups and labs', () => {
      expect(element.querySelectorAll('h1').length).toBe(1);
      expect(element.querySelector('h1')?.textContent).toContain('Línea ficticia uno');
      expect(headings()).toEqual(['line-about', 'nav-research-groups', 'nav-research-labs', 'line-others']);
      expect(element.querySelector('a[href="/research/groups/grupo-completo"]')?.textContent).toContain('GC');
    });

    it('derives the labs from the line ids of each lab, flagging seedbeds', () => {
      const labs = element.querySelector('[aria-labelledby="line-labs"]')!;
      expect(labs.textContent).toContain('Lab A');
      expect(labs.textContent).not.toContain('Lab B');
      expect(labs.textContent).toContain('tag-semillero');
      expect(labs.querySelector('a')?.getAttribute('href')).toBe('/research/labs');
    });

    it('hides the optional sections that have no data', () => {
      for (const id of ['line-keywords', 'line-projects', 'line-publications']) {
        expect(element.querySelector(`#${id}`)).withContext(id).toBeNull();
      }
      expect(element.textContent).not.toContain('TODO_');
    });

    it('links the other lines but not itself', () => {
      const others = Array.from(element.querySelectorAll('nav a')).map(a => a.getAttribute('href'));
      expect(others).toEqual(['/research/lines/linea-2']);
    });

    it('puts the name in the breadcrumb and the page title', () => {
      expect(TestBed.inject(BreadcrumbService).leaf()?.es).toBe('Línea ficticia uno');
      expect(TestBed.inject(Title).getTitle()).toContain('Línea ficticia uno');
    });
  });

  describe('line with all the optional information', () => {
    beforeEach(() => open('linea-1', [RICH_LINE, LINES[1]]));

    it('shows keywords, projects and publications too', () => {
      expect(headings()).toEqual([
        'line-about', 'line-keywords', 'nav-research-groups', 'nav-research-labs',
        'nav-research-projects', 'nav-research-publications', 'line-others'
      ]);
      expect(element.textContent).toContain('Palabra clave dos');
      expect(element.textContent).toContain('Proyecto ficticio uno');
      expect(element.textContent).toContain('Artículo ficticio uno');
      expect(element.querySelector('a[href="https://doi.org/10.0000/ficticio"]')?.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('keeps the meta description short even with a long description', () => {
      const description = document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
      expect(description.length).toBeGreaterThan(50);
      expect(description.length).toBeLessThanOrEqual(155);
      expect(description.endsWith('…')).toBeTrue();
    });
  });

  it('shows the "not found" view for an unknown line, with its own title', () => {
    open('no-existe');
    expect(element.querySelector('app-not-found')).not.toBeNull();
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/research/lines');
    expect(TestBed.inject(Title).getTitle()).toContain('not-found-line-title');
  });
});
