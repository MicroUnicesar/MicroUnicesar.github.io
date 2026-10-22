import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LocalizedDatePipe } from './localized-date.pipe';
import { LanguageService } from '../../core/services/language.service';

describe('LocalizedDatePipe', () => {
  let lang: string;
  let pipe: LocalizedDatePipe;

  beforeEach(() => {
    lang = 'es';
    TestBed.configureTestingModule({
      providers: [
        LocalizedDatePipe,
        { provide: LanguageService, useValue: { getCurrentLanguage: () => lang, currentLanguage$: of('es') } }
      ]
    });
    pipe = TestBed.inject(LocalizedDatePipe);
  });

  it('formats the date with the active language', () => {
    expect(pipe.transform('2026-10-21')).toBe('21 de octubre de 2026');
    lang = 'en';
    expect(pipe.transform('2026-10-21')).toBe('October 21, 2026');
  });

  it('returns an empty string without a date', () => {
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
  });
});
