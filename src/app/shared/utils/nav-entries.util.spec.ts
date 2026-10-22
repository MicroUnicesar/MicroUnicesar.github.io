import { NavDropdownEntry, NavLinkEntry, buildNavEntries, isDropdownActive } from './nav-entries.util';
import { SITE_SECTIONS } from '../constants/site-map';

describe('buildNavEntries', () => {
  const entries = buildNavEntries();
  const byId = (id: string) => entries.find(entry => entry.id === id);

  it('starts with home and ends with contact', () => {
    expect(entries[0].id).toBe('home');
    expect(entries[entries.length - 1].id).toBe('contact');
  });

  it('builds a dropdown for sections with several ready pages', () => {
    const program = byId('program') as NavDropdownEntry;
    expect(program.kind).toBe('dropdown');
    expect(program.items.map(item => item.path)).toEqual(['/program', '/program/impact']);

    const students = byId('students') as NavDropdownEntry;
    expect(students.items.map(item => item.path))
      .toEqual(['/students', '/students/graduation-options', '/students/wellness', '/students/resources']);

    const news = byId('news-events') as NavDropdownEntry;
    expect(news.items.map(item => item.path)).toEqual(['/news', '/events']);
  });

  it('lists the research pages that already have content', () => {
    const research = byId('research') as NavDropdownEntry;
    expect(research.kind).toBe('dropdown');
    expect(research.items.map(item => item.path))
      .toEqual(['/research', '/research/groups', '/research/labs', '/research/lines']);
  });

  it('lists the people pages that already have content', () => {
    const people = byId('people') as NavDropdownEntry;
    expect(people.kind).toBe('dropdown');
    expect(people.items.map(item => item.path)).toEqual(['/people', '/people/faculty']);
  });

  it('keeps hub-only cards (menu: false) out of the menu', () => {
    const students = byId('students') as NavDropdownEntry;
    expect(students.items.some(item => item.path === '/research/labs')).toBeFalse();
    const research = byId('research') as NavDropdownEntry;
    expect(research.items.some(item => item.path === '/research/labs')).toBeTrue();
  });

  it('never lists pages that are not ready', () => {
    const notReady = SITE_SECTIONS.flatMap(section => section.children).filter(child => !child.ready);
    const listed = entries.flatMap(entry =>
      entry.kind === 'dropdown' ? entry.items : [entry as NavLinkEntry]);
    for (const child of notReady) {
      expect(listed.some(item => item.path === child.path)).withContext(child.path).toBeFalse();
    }
  });
});

describe('isDropdownActive', () => {
  const program = buildNavEntries().find(entry => entry.id === 'program') as NavDropdownEntry;

  it('is active on the section and any page below it', () => {
    expect(isDropdownActive(program, '/program')).toBeTrue();
    expect(isDropdownActive(program, '/program/labs')).toBeTrue();
    expect(isDropdownActive(program, '/program/about?x=1')).toBeTrue();
  });

  it('is not active elsewhere', () => {
    expect(isDropdownActive(program, '/programming')).toBeFalse();
    expect(isDropdownActive(program, '/research')).toBeFalse();
  });
});
