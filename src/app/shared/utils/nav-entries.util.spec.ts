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
    expect(program.items.map(item => item.path)).toEqual(['/program', '/program/labs']);

    const students = byId('students') as NavDropdownEntry;
    expect(students.items.map(item => item.path))
      .toEqual(['/students', '/students/graduation-options', '/students/wellness']);

    const news = byId('news-events') as NavDropdownEntry;
    expect(news.items.map(item => item.path)).toEqual(['/news', '/events']);
  });

  it('keeps a plain link when a section has nothing else ready', () => {
    expect(byId('research')).toEqual(jasmine.objectContaining({ kind: 'link', path: '/research' }));
    expect(byId('people')).toEqual(jasmine.objectContaining({ kind: 'link', path: '/people' }));
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
