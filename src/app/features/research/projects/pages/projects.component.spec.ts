import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearchProjectsComponent, projectYears } from './projects.component';
import { flushData, pageTestProviders } from '../../../../shared/testing/page-spec.helpers';
import { GROUPS, PROJECTS } from '../../../../shared/testing/research.fixtures';
import { Project } from '../../../../shared/models/project.model';

describe('projectYears', () => {
  const base: Project = { id: 'x', title: { es: 'x', en: 'x' }, description: { es: '', en: '' }, groupIds: [], status: 'finished' };

  it('covers the whole range of a finished project', () => {
    expect(projectYears({ ...base, startYear: 2020, endYear: 2022 })).toEqual([2020, 2021, 2022]);
  });

  it('runs until the current year for an active project without end', () => {
    expect(projectYears({ ...base, status: 'active', startYear: 2023 }, 2025)).toEqual([2023, 2024, 2025]);
  });

  it('is a single year when a finished project has no end', () => {
    expect(projectYears({ ...base, startYear: 2021 })).toEqual([2021]);
  });

  it('is empty when there is no start year', () => {
    expect(projectYears(base)).toEqual([]);
  });
});

describe('ResearchProjectsComponent', () => {
  let fixture: ComponentFixture<ResearchProjectsComponent>;
  let element: HTMLElement;

  const create = (projects: object) => {
    TestBed.configureTestingModule({ imports: [ResearchProjectsComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(ResearchProjectsComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ projects, 'research-groups': GROUPS });
    fixture.detectChanges();
  };

  const titles = () => Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim());

  it('shows "coming soon" while there are no projects at all', () => {
    create([]);
    expect(element.querySelector('app-coming-soon')).not.toBeNull();
    expect(element.querySelector('#filter-group')).toBeNull();
    expect(element.querySelectorAll('h1').length).toBe(1);
  });

  describe('with projects', () => {
    beforeEach(() => create(PROJECTS));

    it('lists the projects, newest first, with status and period', () => {
      expect(element.querySelectorAll('h1').length).toBe(1);
      expect(titles()).toEqual(['Proyecto ficticio uno', 'Proyecto ficticio dos']);
      expect(element.textContent).toContain('project-status-active');
      expect(element.textContent).toContain('2020–2021');
      expect(element.textContent).toContain('2024–project-present');
    });

    it('filters by group', () => {
      fixture.componentRef.setInput('group', 'grupo-vacio');
      fixture.detectChanges();
      expect(titles()).toEqual(['Proyecto ficticio dos']);
    });

    it('filters by year, counting every year of the project', () => {
      fixture.componentRef.setInput('year', '2021');
      fixture.detectChanges();
      expect(titles()).toEqual(['Proyecto ficticio dos']);
    });

    it('combines both filters and reports when nothing matches', () => {
      fixture.componentRef.setInput('group', 'grupo-completo');
      fixture.componentRef.setInput('year', '2021');
      fixture.detectChanges();
      expect(titles()).toEqual([]);
      expect(element.textContent).toContain('empty-results');
    });

    it('offers the years that exist in the data', () => {
      const years = Array.from(element.querySelectorAll('#filter-year option')).map(o => o.getAttribute('value'));
      expect(years[0]).toBe('');
      expect(years).toContain('2021');
      expect(years).toContain('2024');
      expect(years).not.toContain('2019');
    });
  });
});
