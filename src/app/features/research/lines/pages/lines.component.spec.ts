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

  const lineTitles = () => Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim());

  it('lists all lines with links to their groups', () => {
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(lineTitles()).toEqual(['Línea ficticia uno', 'Línea ficticia dos']);
    expect(element.querySelector('a[href="/research/groups/grupo-completo"]')?.textContent).toContain('GC');
  });

  it('filters by group', () => {
    fixture.componentRef.setInput('group', 'grupo-vacio');
    fixture.detectChanges();
    expect(lineTitles()).toEqual(['Línea ficticia dos']);
  });

  it('shows a message when the filter matches nothing', () => {
    fixture.componentRef.setInput('group', 'otro');
    fixture.detectChanges();
    expect(lineTitles()).toEqual([]);
    expect(element.textContent).toContain('empty-results');
  });

  it('offers a select with every group', () => {
    const options = Array.from(element.querySelectorAll('#filter-group option')).map(o => o.getAttribute('value'));
    expect(options).toEqual(['', 'grupo-completo', 'grupo-vacio']);
    expect(element.querySelector('#filter-year')).toBeNull();
  });
});
