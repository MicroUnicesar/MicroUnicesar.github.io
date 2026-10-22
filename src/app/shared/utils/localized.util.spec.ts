import { localize } from './localized.util';

describe('localize', () => {
  it('returns the text in the requested language', () => {
    expect(localize({ es: 'Hola', en: 'Hello' }, 'en')).toBe('Hello');
    expect(localize({ es: 'Hola', en: 'Hello' }, 'es')).toBe('Hola');
  });

  it('falls back to Spanish when the translation is pending', () => {
    expect(localize({ es: 'Hola', en: 'TODO_TRADUCCION' }, 'en')).toBe('Hola');
  });

  it('falls back to Spanish when the language is unknown or empty', () => {
    expect(localize({ es: 'Hola', en: 'Hello' }, 'fr')).toBe('Hola');
    expect(localize({ es: 'Hola', en: '' }, 'en')).toBe('Hola');
  });

  it('returns an empty string for pending content so views can hide it', () => {
    expect(localize({ es: 'TODO_CONTENIDO', en: 'TODO_CONTENIDO' }, 'es')).toBe('');
    expect(localize({ es: 'TODO_CONTENIDO', en: 'TODO_CONTENIDO' }, 'en')).toBe('');
  });

  it('returns an empty string for missing text', () => {
    expect(localize(undefined, 'es')).toBe('');
    expect(localize(null, 'en')).toBe('');
  });
});
