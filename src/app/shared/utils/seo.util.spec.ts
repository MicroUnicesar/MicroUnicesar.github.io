import { absoluteUrl, canonicalPath, defaultPageMeta, ogLocale } from './seo.util';
import { SITE_SECTIONS } from '../constants/site-map';

describe('canonicalPath', () => {
  it('drops the query string, the fragment and the trailing slash', () => {
    expect(canonicalPath('/research/lines?group=pam')).toBe('/research/lines');
    expect(canonicalPath('/students/graduation-options#procedure')).toBe('/students/graduation-options');
    expect(canonicalPath('/program/')).toBe('/program');
  });

  it('treats the root and /home as the same page', () => {
    expect(canonicalPath('/')).toBe('/');
    expect(canonicalPath('')).toBe('/');
    expect(canonicalPath('/home')).toBe('/');
    expect(canonicalPath('/home?x=1')).toBe('/');
  });
});

describe('absoluteUrl', () => {
  it('builds absolute URLs without double slashes', () => {
    expect(absoluteUrl('https://example.test', '/')).toBe('https://example.test/');
    expect(absoluteUrl('https://example.test/', '/research')).toBe('https://example.test/research');
    expect(absoluteUrl('https://example.test', 'assets/a.jpg')).toBe('https://example.test/assets/a.jpg');
  });
});

describe('ogLocale', () => {
  it('maps the site language to an Open Graph locale', () => {
    expect(ogLocale('es')).toBe('es_CO');
    expect(ogLocale('en')).toBe('en_US');
  });
});

describe('defaultPageMeta', () => {
  it('describes the home page without a title (only the site name is shown)', () => {
    expect(defaultPageMeta('/')).toEqual({ description: { key: 'seo-home-description' } });
  });

  it('uses the menu label and description for sections and their pages', () => {
    expect(defaultPageMeta('/research')).toEqual({ title: { key: 'nav-research' }, description: { key: 'desc-research' } });
    expect(defaultPageMeta('/research/lines')).toEqual({ title: { key: 'nav-research-lines' }, description: { key: 'desc-research-lines' } });
    expect(defaultPageMeta('/students/wellness')?.title).toEqual({ key: 'nav-wellness' });
    expect(defaultPageMeta('/contact')?.description).toEqual({ key: 'seo-contact-description' });
  });

  it('knows every page of the site map, so no page falls back to the generic title', () => {
    for (const section of SITE_SECTIONS) {
      for (const page of [...(section.overview ? [section.overview] : []), ...section.children]) {
        expect(defaultPageMeta(page.path)).withContext(page.path).toBeDefined();
      }
    }
  });

  it('returns undefined for unknown routes', () => {
    expect(defaultPageMeta('/no-existe')).toBeUndefined();
    expect(defaultPageMeta('/research/groups/pam')).toBeUndefined();
  });
});
