import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearchLinesComponent } from './lines.component';
import { flushData, pageTestProviders } from '../../../../shared/testing/page-spec.helpers';
import { GROUPS, LINES } from '../../../../shared/testing/research.fixtures';

describe('ResearchLinesComponent', () => {
  let fixture: ComponentFixture<ResearchLinesComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ResearchLinesComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(ResearchLinesComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ 'research-lines': LINES, 'research-groups': GROUPS });
    fixture.detectChanges();
  });

  const cardTitles = () => Array.from(element.querySelectorAll('.line-card h2')).map(h => h.textContent?.trim());

  it('shows one h1 and a card per line, each linking to its own page', () => {
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(cardTitles()).toEqual(['Línea ficticia uno', 'Línea ficticia dos']);
    const hrefs = Array.from(element.querySelectorAll('a.line-link')).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/research/lines/linea-1', '/research/lines/linea-2']);
  });

  it('shows an excerpt and links the related groups without nesting links', () => {
    const card = element.querySelector('.line-card')!;
    expect(card.textContent).toContain('Descripción');
    expect(card.querySelector('a[href="/research/groups/grupo-completo"]')?.textContent).toContain('GC');
    expect(card.querySelectorAll('a a').length).toBe(0);
  });

  it('filters by group', () => {
    fixture.componentRef.setInput('group', 'grupo-vacio');
    fixture.detectChanges();
    expect(cardTitles()).toEqual(['Línea ficticia dos']);
  });

  it('shows a message when the filter matches nothing', () => {
    fixture.componentRef.setInput('group', 'otro');
    fixture.detectChanges();
    expect(cardTitles()).toEqual([]);
    expect(element.textContent).toContain('empty-results');
  });

  it('offers a select with every group and no year filter', () => {
    const options = Array.from(element.querySelectorAll('#filter-group option')).map(o => o.getAttribute('value'));
    expect(options).toEqual(['', 'grupo-completo', 'grupo-vacio']);
    expect(element.querySelector('#filter-year')).toBeNull();
  });
});
