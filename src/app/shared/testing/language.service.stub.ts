import { BehaviorSubject } from 'rxjs';

/** Sustituto de LanguageService para pruebas: `translate` devuelve la clave y no hace peticiones. */
export class LanguageServiceStub {
  private language = new BehaviorSubject<string>('es');
  readonly currentLanguage$ = this.language.asObservable();
  readonly setLanguageCalls: string[] = [];

  translate(key: string): string {
    return key;
  }

  getCurrentLanguage(): string {
    return this.language.value;
  }

  async setLanguage(lang: string): Promise<void> {
    this.setLanguageCalls.push(lang);
    this.language.next(lang);
  }
}
