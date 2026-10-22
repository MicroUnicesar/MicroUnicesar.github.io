import { TestBed } from '@angular/core/testing';
import { LocalizedPipe } from './localized.pipe';
import { LanguageService } from '../../core/services/language.service';

describe('LocalizedPipe', () => {
  let currentLang: string;
  let pipe: LocalizedPipe;

  beforeEach(() => {
    currentLang = 'es';
    TestBed.configureTestingModule({
      providers: [
        LocalizedPipe,
        { provide: LanguageService, useValue: { getCurrentLanguage: () => currentLang } }
      ]
    });
    pipe = TestBed.inject(LocalizedPipe);
  });

  it('uses the active language of LanguageService', () => {
    const text = { es: 'Hola', en: 'Hello' };
    expect(pipe.transform(text)).toBe('Hola');
    currentLang = 'en';
    expect(pipe.transform(text)).toBe('Hello');
  });

  it('handles undefined values', () => {
    expect(pipe.transform(undefined)).toBe('');
  });
});
