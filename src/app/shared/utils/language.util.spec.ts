import { intlLocale, resolveInitialLanguage } from './language.util';

const AVAILABLE = ['es', 'en'];
const resolve = (saved: string | null, browser: string[]) => resolveInitialLanguage(saved, browser, AVAILABLE, 'es');

describe('resolveInitialLanguage', () => {
  it('uses the saved choice first, even if the browser prefers another language', () => {
    expect(resolve('en', ['es-CO'])).toBe('en');
    expect(resolve('es', ['en-US'])).toBe('es');
  });

  it('ignores a saved value that is not supported', () => {
    expect(resolve('fr', ['en-GB'])).toBe('en');
    expect(resolve('', [])).toBe('es');
  });

  it('on a first visit follows the browser language, matching regional variants', () => {
    expect(resolve(null, ['en-US'])).toBe('en');
    expect(resolve(null, ['EN'])).toBe('en');
    expect(resolve(null, ['es-419'])).toBe('es');
  });

  it('takes the first supported language in the browser preference order', () => {
    expect(resolve(null, ['fr-FR', 'en-GB', 'es-ES'])).toBe('en');
    expect(resolve(null, ['de', 'es'])).toBe('es');
  });

  it('falls back to Spanish when the browser language is not Spanish or English', () => {
    expect(resolve(null, ['fr-FR', 'pt-BR'])).toBe('es');
    expect(resolve(null, [])).toBe('es');
  });
});

describe('intlLocale', () => {
  it('maps the site language to an Intl locale', () => {
    expect(intlLocale('en')).toBe('en-US');
    expect(intlLocale('es')).toBe('es-CO');
    expect(intlLocale('xx')).toBe('es-CO');
  });
});
