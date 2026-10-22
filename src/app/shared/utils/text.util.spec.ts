import { truncateLocalized, truncateText } from './text.util';

describe('truncateText', () => {
  it('returns short text unchanged, with the spaces tidied', () => {
    expect(truncateText('  Hola   mundo ', 50)).toBe('Hola mundo');
  });

  it('cuts at a word boundary and adds an ellipsis, never exceeding the limit', () => {
    const result = truncateText('uno dos tres cuatro cinco seis siete ocho nueve diez', 30);
    expect(result.endsWith('…')).toBeTrue();
    expect(result.length).toBeLessThanOrEqual(30);
    expect(result).toBe('uno dos tres cuatro cinco…');
  });

  it('does not leave dangling punctuation before the ellipsis', () => {
    expect(truncateText('uno dos tres, cuatro cinco seis siete ocho', 20)).toBe('uno dos tres…');
  });

  it('cuts mid-word when there is no usable space', () => {
    expect(truncateText('a'.repeat(100), 10)).toBe(`${'a'.repeat(9)}…`);
  });
});

describe('truncateLocalized', () => {
  it('shortens both languages', () => {
    const long = 'palabra '.repeat(40);
    const result = truncateLocalized({ es: long, en: long }, 50);
    expect(result.es.length).toBeLessThanOrEqual(50);
    expect(result.en.length).toBeLessThanOrEqual(50);
  });

  it('keeps pending-translation markers intact', () => {
    expect(truncateLocalized({ es: 'x '.repeat(100), en: 'TODO_TRADUCCION' }, 20).en).toBe('TODO_TRADUCCION');
  });
});
