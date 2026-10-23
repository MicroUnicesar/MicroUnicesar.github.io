import { TestBed } from '@angular/core/testing';
import { ResearchGroupsComponent } from './groups.component';
import { flushData, pageTestProviders } from '../../../../shared/testing/page-spec.helpers';
import { GROUPS } from '../../../../shared/testing/research.fixtures';

describe('ResearchGroupsComponent', () => {
  it('lists every group with a link to its own page', () => {
    TestBed.configureTestingModule({ imports: [ResearchGroupsComponent], providers: pageTestProviders() });
    const fixture = TestBed.createComponent(ResearchGroupsComponent);
    fixture.detectChanges();
    flushData({ 'research-groups': GROUPS });
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('h1').length).toBe(1);
    const hrefs = Array.from(element.querySelectorAll('a.group-card')).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/research/groups/grupo-completo', '/research/groups/grupo-vacio']);
    expect(element.textContent).toContain('Grupo Completo Ficticio');
    expect(element.textContent).toContain('Categoría ficticia');
  });
});
