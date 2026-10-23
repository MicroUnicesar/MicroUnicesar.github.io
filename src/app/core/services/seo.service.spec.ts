import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SeoService } from './seo.service';
import { LanguageService } from './language.service';

describe('SeoService', () => {
  let seo: SeoService;
  let title: Title;
  let router: Router;
  let lang: BehaviorSubject<string>;

  const SITE = 'https://microunicesar.github.io';
  const name = (selector: string) => document.head.querySelector(`meta[name="${selector}"]`)?.getAttribute('content') ?? null;
  const prop = (selector: string) => document.head.querySelector(`meta[property="${selector}"]`)?.getAttribute('content') ?? null;
  const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;
  const description = () => name('description');

  const dictionary: Record<string, Record<string, string>> = {
    es: { 'seo-site-name': 'Sitio', k: 'Clave es', 'nav-research': 'Investigación', 'desc-research': 'Descripción de investigación', 'seo-home-description': 'Inicio es', empty: '' },
    en: { 'seo-site-name': 'Site', k: 'Key en', 'nav-research': 'Research', 'desc-research': 'Research description', 'seo-home-description': 'Home en', empty: '' }
  };

  const clean = () => {
    document.head.querySelectorAll('meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]')
      .forEach(tag => tag.remove());
  };

  beforeEach(() => {
    clean();
    lang = new BehaviorSubject('es');
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        {
          provide: LanguageService,
          useValue: {
            currentLanguage$: lang.asObservable(),
            getCurrentLanguage: () => lang.value,
            translate: (key: string) => dictionary[lang.value][key] ?? key
          }
        }
      ]
    });
    title = TestBed.inject(Title);
    router = TestBed.inject(Router);
    seo = TestBed.inject(SeoService);
  });

  afterEach(clean);

  it('sets "page | site" and the meta description from i18n keys', () => {
    seo.set({ title: { key: 'k' }, description: { key: 'k' } });
    expect(title.getTitle()).toBe('Clave es | Sitio');
    expect(description()).toBe('Clave es');
  });

  it('uses bilingual data texts and follows the active language', () => {
    seo.set({ title: { es: 'Título', en: 'Title' }, description: { es: 'Descripción', en: 'Description' } });
    expect(title.getTitle()).toBe('Título | Sitio');
    lang.next('en');
    expect(title.getTitle()).toBe('Title | Site');
    expect(description()).toBe('Description');
  });

  it('falls back to Spanish while the translation is pending', () => {
    seo.set({ title: { es: 'Título', en: 'TODO_TRADUCCION' } });
    lang.next('en');
    expect(title.getTitle()).toBe('Título | Site');
  });

  it('shows only the site name and drops the description without a page title', () => {
    seo.set({ title: { key: 'k' }, description: { key: 'k' } });
    seo.set({});
    expect(title.getTitle()).toBe('Sitio');
    expect(description()).toBeNull();
  });

  describe('description', () => {
    it('uses the first alternative that has content', () => {
      seo.set({ title: { key: 'k' }, description: [{ es: 'TODO_CONTENIDO', en: 'TODO_CONTENIDO' }, { key: 'empty' }, { key: 'k' }] });
      expect(description()).toBe('Clave es');
    });

    it('is cut to 155 characters at a word boundary', () => {
      seo.set({ title: { key: 'k' }, description: { es: 'palabra '.repeat(60), en: 'word '.repeat(60) } });
      expect(description()!.length).toBeLessThanOrEqual(155);
      expect(description()!.endsWith('…')).toBeTrue();
    });
  });

  describe('Open Graph, Twitter and canonical', () => {
    beforeEach(async () => {
      await router.navigateByUrl('/research/groups/pam?x=1#top');
      seo.set({ title: { es: 'Grupo PAM', en: 'PAM group' }, description: { es: 'Texto', en: 'Text' } });
    });

    it('writes the Open Graph tags with an absolute URL and image', () => {
      expect(prop('og:type')).toBe('website');
      expect(prop('og:site_name')).toBe('Sitio');
      expect(prop('og:title')).toBe('Grupo PAM');
      expect(prop('og:description')).toBe('Texto');
      expect(prop('og:url')).toBe(`${SITE}/research/groups/pam`);
      expect(prop('og:image')).toMatch(new RegExp(`^${SITE}/assets/images/.+\\.jpg$`));
      expect(prop('og:locale')).toBe('es_CO');
      expect(prop('og:locale:alternate')).toBe('en_US');
    });

    it('writes the Twitter card tags', () => {
      expect(name('twitter:card')).toBe('summary_large_image');
      expect(name('twitter:title')).toBe('Grupo PAM');
      expect(name('twitter:description')).toBe('Texto');
      expect(name('twitter:image')).toBe(prop('og:image'));
    });

    it('sets the canonical link without query or fragment, and reuses the same element', () => {
      expect(canonical()).toBe(`${SITE}/research/groups/pam`);
      expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
    });

    it('translates the tags when the language changes', () => {
      lang.next('en');
      expect(prop('og:title')).toBe('PAM group');
      expect(prop('og:description')).toBe('Text');
      expect(prop('og:locale')).toBe('en_US');
      expect(prop('og:locale:alternate')).toBe('es_CO');
      expect(document.head.querySelectorAll('meta[property="og:locale:alternate"]').length).toBe(1);
    });
  });

  describe('pages that do not set their own metadata', () => {
    it('take title and description from the site map', async () => {
      await router.navigateByUrl('/research');
      expect(title.getTitle()).toBe('Investigación | Sitio');
      expect(description()).toBe('Descripción de investigación');
      expect(canonical()).toBe(`${SITE}/research`);
    });

    it('treat the root and /home as the same canonical page, with a description and no title', async () => {
      await router.navigateByUrl('/');
      expect(title.getTitle()).toBe('Sitio');
      expect(description()).toBe('Inicio es');
      expect(canonical()).toBe(`${SITE}/`);
      expect(prop('og:url')).toBe(`${SITE}/`);
    });

    it('translate to the active language', async () => {
      await router.navigateByUrl('/research');
      lang.next('en');
      expect(title.getTitle()).toBe('Research | Site');
    });

    it('keep only the site name for unknown routes', async () => {
      await router.navigateByUrl('/otra');
      expect(title.getTitle()).toBe('Sitio');
      expect(description()).toBeNull();
    });
  });

  describe('indexing', () => {
    it('pages are indexable by default (no robots tag)', async () => {
      await router.navigateByUrl('/research');
      expect(name('robots')).toBeNull();
    });

    it('noIndex adds "noindex, follow"', async () => {
      await router.navigateByUrl('/research');
      seo.noIndex();
      expect(name('robots')).toBe('noindex, follow');
    });

    it('noIndex does not leak into the next page', async () => {
      await router.navigateByUrl('/research');
      seo.noIndex();
      await router.navigateByUrl('/contact');
      expect(name('robots')).toBeNull();
    });
  });

  it('page-specific metadata does not leak into the next page', async () => {
    await router.navigateByUrl('/research/groups/pam');
    seo.set({ title: { key: 'k' }, description: { key: 'k' } });
    await router.navigateByUrl('/research');
    expect(title.getTitle()).toBe('Investigación | Sitio');
  });
});
