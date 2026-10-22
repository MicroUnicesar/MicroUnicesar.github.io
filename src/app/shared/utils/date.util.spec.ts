import { formatLongDate } from './date.util';

describe('formatLongDate', () => {
  it('formats an ISO date in Spanish and in English', () => {
    expect(formatLongDate('2026-10-21', 'es')).toBe('21 de octubre de 2026');
    expect(formatLongDate('2026-10-21', 'en')).toBe('October 21, 2026');
  });

  it('does not shift the day because of the time zone', () => {
    expect(formatLongDate('2026-01-01', 'es')).toBe('1 de enero de 2026');
    expect(formatLongDate('2026-12-31', 'en')).toBe('December 31, 2026');
  });

  it('returns the text unchanged when it is not a date', () => {
    expect(formatLongDate('pronto', 'es')).toBe('pronto');
  });
});
