import { TestBed } from '@angular/core/testing';
import { BROWSER_LANGUAGES, LanguageService } from './language.service';

const DICTIONARIES: Record<string, Record<string, string>> = {
  es: { hola: 'Hola', min: 'Mínimo {n} caracteres', two: '{a} y {b}' },
  en: { hola: 'Hello', min: 'At least {n} characters', two: '{a} and {b}' }
};

describe('LanguageService', () => {
  let fetchSpy: jasmine.Spy;

  beforeEach(() => {
    localStorage.removeItem('language');
    document.documentElement.lang = '';
    fetchSpy = spyOn(window, 'fetch').and.callFake((async (url: string) => {
      const lang = /\/(\w+)\.json$/.exec(String(url))![1];
      return { json: async () => DICTIONARIES[lang] };
    }) as unknown as typeof fetch);
  });

  afterEach(() => {
    localStorage.removeItem('language');
    document.documentElement.lang = 'es';
  });

  const create = (browser: string[] = ['es-CO']) => {
    TestBed.configureTestingModule({ providers: [{ provide: BROWSER_LANGUAGES, useValue: browser }] });
    return TestBed.inject(LanguageService);
  };

  describe('first visit', () => {
    it('uses the browser language when it is English', async () => {
      const service = create(['en-US']);
      await service.ready;
      expect(service.getCurrentLanguage()).toBe('en');
      expect(document.documentElement.lang).toBe('en');
      expect(service.translate('hola')).toBe('Hello');
    });

    it('uses Spanish when the browser language is neither Spanish nor English', async () => {
      const service = create(['fr-FR']);
      await service.ready;
      expect(service.getCurrentLanguage()).toBe('es');
      expect(document.documentElement.lang).toBe('es');
    });

    it('does not store anything until the person chooses a language', async () => {
      await create(['en-US']).ready;
      expect(localStorage.getItem('language')).toBeNull();
    });

    it('loads translations from a relative URL, so it works under any <base href>', async () => {
      await create().ready;
      expect(fetchSpy.calls.first().args[0]).toBe('assets/i18n/es.json');
    });
  });

  describe('returning visit', () => {
    it('the saved choice wins over the browser language', async () => {
      localStorage.setItem('language', 'es');
      const service = create(['en-US']);
      await service.ready;
      expect(service.getCurrentLanguage()).toBe('es');
    });

    it('ignores a saved language that is not supported', async () => {
      localStorage.setItem('language', 'fr');
      const service = create(['en-GB']);
      await service.ready;
      expect(service.getCurrentLanguage()).toBe('en');
    });
  });

  describe('changing language', () => {
    it('updates <html lang>, persists the choice and emits the new language', async () => {
      const service = create();
      await service.ready;
      const emitted: string[] = [];
      service.currentLanguage$.subscribe(lang => emitted.push(lang));

      await service.setLanguage('en');

      expect(document.documentElement.lang).toBe('en');
      expect(localStorage.getItem('language')).toBe('en');
      expect(emitted[emitted.length - 1]).toBe('en');
      expect(service.translate('hola')).toBe('Hello');

      await service.setLanguage('es');
      expect(document.documentElement.lang).toBe('es');
      expect(localStorage.getItem('language')).toBe('es');
    });

    it('ignores unsupported languages', async () => {
      const service = create();
      await service.ready;
      await service.setLanguage('fr');
      expect(service.getCurrentLanguage()).toBe('es');
      expect(document.documentElement.lang).toBe('es');
      expect(localStorage.getItem('language')).toBeNull();
    });

    it('downloads each dictionary only once', async () => {
      const service = create();
      await service.ready;
      await service.setLanguage('en');
      await service.setLanguage('es');
      await service.setLanguage('en');
      expect(fetchSpy.calls.count()).toBe(2);
    });
  });

  describe('translate', () => {
    it('returns the key when there is no translation', async () => {
      const service = create();
      await service.ready;
      expect(service.translate('no-existe')).toBe('no-existe');
    });

    it('replaces {name} parameters and leaves unknown ones untouched', async () => {
      const service = create();
      await service.ready;
      expect(service.translate('min', { n: 10 })).toBe('Mínimo 10 caracteres');
      expect(service.translate('two', { a: 'uno' })).toBe('uno y {b}');
      await service.setLanguage('en');
      expect(service.translate('min', { n: 3 })).toBe('At least 3 characters');
    });
  });

  it('survives blocked storage (private mode)', async () => {
    spyOn(Storage.prototype, 'getItem').and.throwError('blocked');
    spyOn(Storage.prototype, 'setItem').and.throwError('blocked');
    const service = create(['en-US']);
    await service.ready;
    await service.setLanguage('es');
    expect(service.getCurrentLanguage()).toBe('es');
  });
});
