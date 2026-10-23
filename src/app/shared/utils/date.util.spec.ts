import { formatDate, formatLongDate, formatNumber } from './date.util';

describe('formatDate', () => {
  it('formats the long date in Spanish and in English', () => {
    expect(formatLongDate('2026-10-21', 'es')).toBe('21 de octubre de 2026');
    expect(formatLongDate('2026-10-21', 'en')).toBe('October 21, 2026');
  });

  it('does not shift the day because of the time zone', () => {
    expect(formatDate('2026-01-01', 'es')).toBe('1 de enero de 2026');
    expect(formatDate('2026-12-31', 'en')).toBe('December 31, 2026');
  });

  it('formats the day and the short month for calendar badges', () => {
    expect(formatDate('2026-04-16', 'es', 'day')).toBe('16');
    expect(formatDate('2026-04-16', 'es', 'month').replace('.', '')).toBe('abr');
    expect(formatDate('2026-04-16', 'en', 'month')).toBe('Apr');
  });

  it('formats the short date with the language month name', () => {
    expect(formatDate('2026-02-17', 'en', 'short')).toContain('Feb');
    expect(formatDate('2026-02-17', 'es', 'short')).toContain('feb');
  });

  it('formats a 24-hour time for each language (am/pm in English)', () => {
    expect(formatDate('17:00', 'en', 'time')).toMatch(/^5:00\s?PM$/i);
    expect(formatDate('08:30', 'en', 'time')).toMatch(/^8:30\s?AM$/i);
    expect(formatDate('17:00', 'es', 'time')).toMatch(/^5:00\s?p\.\s?m\.$/i);
  });

  it('returns the text unchanged when it is not a date or time', () => {
    expect(formatDate('pronto', 'es')).toBe('pronto');
    expect(formatDate('25 de agosto', 'en')).toBe('25 de agosto');
    expect(formatDate('tarde', 'es', 'time')).toBe('tarde');
    expect(formatDate('17', 'es', 'time')).toBe('17');
  });
});

describe('formatNumber', () => {
  it('uses the separators of each language', () => {
    expect(formatNumber(1234567.5, 'en')).toBe('1,234,567.5');
    expect(formatNumber(1234567.5, 'es')).toBe('1.234.567,5');
  });

  it('groups four-digit numbers in Spanish (Colombian convention), so years must never use it', () => {
    expect(formatNumber(2026, 'es')).toBe('2.026');
    expect(formatNumber(2026, 'en')).toBe('2,026');
  });
});
