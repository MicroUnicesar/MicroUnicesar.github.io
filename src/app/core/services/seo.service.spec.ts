import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SeoService } from './seo.service';
import { LanguageService } from './language.service';

describe('SeoService', () => {
  let seo: SeoService;
  let title: Title;
  let lang: BehaviorSubject<string>;

  const description = () => document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? null;
  const dictionary: Record<string, Record<string, string>> = {
    es: { 'seo-site-name': 'Sitio', k: 'Clave es' },
    en: { 'seo-site-name': 'Site', k: 'Key en' }
  };

  beforeEach(() => {
    document.head.querySelectorAll('meta[name="description"]').forEach(tag => tag.remove());
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
    seo = TestBed.inject(SeoService);
  });

  afterEach(() => document.head.querySelectorAll('meta[name="description"]').forEach(tag => tag.remove()));

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
    seo.set({ title: { key: 'k' } });
    expect(description()).toBeNull();
  });

  it('resets title and description when a navigation starts, so the old page never lingers', async () => {
    seo.set({ title: { key: 'k' }, description: { key: 'k' } });
    await TestBed.inject(Router).navigateByUrl('/otra');
    expect(title.getTitle()).toBe('Sitio');
    expect(description()).toBeNull();
  });
});
