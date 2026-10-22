import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearchPublicationsComponent } from './publications.component';
import { flushData, pageTestProviders } from '../../../../shared/testing/page-spec.helpers';
import { GROUPS, PUBLICATIONS } from '../../../../shared/testing/research.fixtures';

describe('ResearchPublicationsComponent', () => {
  let fixture: ComponentFixture<ResearchPublicationsComponent>;
  let element: HTMLElement;

  const create = (publications: object) => {
    TestBed.configureTestingModule({ imports: [ResearchPublicationsComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(ResearchPublicationsComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ publications, 'research-groups': GROUPS });
    fixture.detectChanges();
  };

  const titles = () => Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim());

  it('shows "coming soon" while there are no publications at all', () => {
    create([]);
    expect(element.querySelector('app-coming-soon')).not.toBeNull();
    expect(element.querySelectorAll('h1').length).toBe(1);
  });

  describe('with publications', () => {
    beforeEach(() => create(PUBLICATIONS));

    it('lists them newest first with authors, journal, DOI and group', () => {
      expect(titles()).toEqual(['Artículo ficticio uno', 'Artículo ficticio dos']);
      expect(element.textContent).toContain('Autora A, Autor B');
      expect(element.textContent).toContain('Revista Ficticia');
      const doi = element.querySelector('a[href="https://doi.org/10.0000/ficticio"]');
      expect(doi?.getAttribute('rel')).toBe('noopener noreferrer');
      expect(element.querySelector('a[href="/research/groups/grupo-completo"]')).not.toBeNull();
    });

    it('filters by group and by year', () => {
      fixture.componentRef.setInput('group', 'grupo-vacio');
      fixture.detectChanges();
      expect(titles()).toEqual(['Artículo ficticio dos']);

      fixture.componentRef.setInput('group', undefined);
      fixture.componentRef.setInput('year', '2024');
      fixture.detectChanges();
      expect(titles()).toEqual(['Artículo ficticio uno']);
    });
  });
});
