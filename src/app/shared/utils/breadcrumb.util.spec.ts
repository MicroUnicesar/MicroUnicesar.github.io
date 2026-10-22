import { buildBreadcrumb } from './breadcrumb.util';

const keys = (url: string, leaf?: { es: string; en: string }) =>
  buildBreadcrumb(url, leaf).map(item => item.labelKey ?? item.text?.es);
const paths = (url: string, leaf?: { es: string; en: string }) =>
  buildBreadcrumb(url, leaf).map(item => item.path ?? null);

describe('buildBreadcrumb', () => {
  it('has no breadcrumb on first-level pages or home', () => {
    for (const url of ['/', '/home', '/program', '/research', '/people', '/students', '/news', '/events', '/contact']) {
      expect(buildBreadcrumb(url)).withContext(url).toEqual([]);
    }
  });

  it('builds Home > Section > Page for second-level pages, the last one without a link', () => {
    expect(keys('/students/wellness')).toEqual(['nav-home', 'nav-students', 'nav-wellness']);
    expect(paths('/students/wellness')).toEqual(['/home', '/students', null]);
    expect(keys('/program/labs')).toEqual(['nav-home', 'nav-program', 'nav-program-labs']);
    expect(keys('/students/graduation-options')).toEqual(['nav-home', 'nav-students', 'nav-options']);
    expect(keys('/people/faculty')).toEqual(['nav-home', 'nav-people', 'nav-people-faculty']);
  });

  it('covers every second-level page, including those still "coming soon"', () => {
    const urls = ['/program/about', '/research/groups', '/research/lines', '/research/projects', '/research/publications',
      '/people/students', '/people/staff', '/students/resources', '/students/faq'];
    for (const url of urls) {
      expect(buildBreadcrumb(url).length).withContext(url).toBe(3);
    }
  });

  it('adds the detail name as the current page and links the list page', () => {
    const leaf = { es: 'Grupo ficticio', en: 'Fictitious group' };
    expect(keys('/research/groups/pam', leaf)).toEqual(['nav-home', 'nav-research', 'nav-research-groups', 'Grupo ficticio']);
    expect(paths('/research/groups/pam', leaf)).toEqual(['/home', '/research', '/research/groups', null]);
  });

  it('stops at the list page when there is no detail name yet (loading or not found)', () => {
    expect(keys('/research/groups/no-existe')).toEqual(['nav-home', 'nav-research', 'nav-research-groups']);
    expect(paths('/research/groups/no-existe')).toEqual(['/home', '/research', '/research/groups']);
  });

  it('ignores query strings and fragments', () => {
    expect(keys('/research/projects?group=pam#x')).toEqual(['nav-home', 'nav-research', 'nav-research-projects']);
  });

  it('gives nothing for unknown URLs', () => {
    expect(buildBreadcrumb('/no/existe')).toEqual([]);
    expect(buildBreadcrumb('/students/nope')).toEqual([]);
  });
});
