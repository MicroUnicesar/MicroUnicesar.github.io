import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LocalizedDatePipe } from './localized-date.pipe';
import { LocalizedNumberPipe } from './localized-number.pipe';
import { LanguageService } from '../../core/services/language.service';

describe('LocalizedDatePipe and LocalizedNumberPipe', () => {
  let lang: string;
  let date: LocalizedDatePipe;
  let number: LocalizedNumberPipe;

  beforeEach(() => {
    lang = 'es';
    TestBed.configureTestingModule({
      providers: [
        LocalizedDatePipe,
        LocalizedNumberPipe,
        { provide: LanguageService, useValue: { getCurrentLanguage: () => lang, currentLanguage$: of('es') } }
      ]
    });
    date = TestBed.inject(LocalizedDatePipe);
    number = TestBed.inject(LocalizedNumberPipe);
  });

  it('formats the date with the active language and the requested style', () => {
    expect(date.transform('2026-10-21')).toBe('21 de octubre de 2026');
    expect(date.transform('2026-10-21', 'day')).toBe('21');
    lang = 'en';
    expect(date.transform('2026-10-21')).toBe('October 21, 2026');
    expect(date.transform('17:00', 'time')).toMatch(/^5:00\s?PM$/i);
  });

  it('formats numbers with the active language', () => {
    expect(number.transform(1234.5)).toBe('1.234,5');
    lang = 'en';
    expect(number.transform(1234.5)).toBe('1,234.5');
  });

  it('returns an empty string without a value', () => {
    expect(date.transform(undefined)).toBe('');
    expect(date.transform('')).toBe('');
    expect(number.transform(null)).toBe('');
    expect(number.transform(0)).toBe('0');
  });
});
