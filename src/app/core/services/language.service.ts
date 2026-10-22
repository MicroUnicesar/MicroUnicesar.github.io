import { DOCUMENT } from '@angular/common';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';
import { resolveInitialLanguage } from '../../shared/utils/language.util';

/** Idiomas preferidos del navegador (se sustituye en las pruebas). */
export const BROWSER_LANGUAGES = new InjectionToken<readonly string[]>('BROWSER_LANGUAGES', {
  providedIn: 'root',
  factory: () => {
    const nav = inject(DOCUMENT).defaultView?.navigator;
    return nav?.languages?.length ? nav.languages : nav?.language ? [nav.language] : [];
  }
});

export type TranslateParams = Record<string, string | number>;

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private document = inject(DOCUMENT);
  private browserLanguages = inject(BROWSER_LANGUAGES);

  private currentLanguage: BehaviorSubject<string>;
  public currentLanguage$;

  private translations: Record<string, Record<string, string>> = {};

  /** Se cumple cuando ya están cargados los textos del idioma inicial (evita mostrar claves al arrancar). */
  readonly ready: Promise<void>;

  constructor() {
    const initial = resolveInitialLanguage(
      this.readSaved(),
      this.browserLanguages,
      APP_CONSTANTS.LANGUAGES.AVAILABLE,
      APP_CONSTANTS.LANGUAGES.DEFAULT
    );
    this.currentLanguage = new BehaviorSubject<string>(initial);
    this.currentLanguage$ = this.currentLanguage.asObservable();
    this.applyHtmlLang(initial);
    // Aún no se guarda: si la persona nunca eligió, la próxima visita vuelve a seguir al navegador.
    this.ready = this.loadTranslations(initial).then(() => this.currentLanguage.next(initial));
  }

  async loadTranslations(lang: string): Promise<void> {
    if (this.translations[lang]) {
      return;
    }
    try {
      // Ruta relativa: respeta <base href>, también cuando el sitio no está en la raíz del dominio.
      const response = await fetch(`assets/i18n/${lang}.json`);
      this.translations[lang] = await response.json();
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  }

  /** Cambia el idioma, lo recuerda y actualiza `<html lang>`. Un idioma no soportado se ignora. */
  async setLanguage(lang: string): Promise<void> {
    if (!APP_CONSTANTS.LANGUAGES.AVAILABLE.includes(lang)) {
      return;
    }
    await this.loadTranslations(lang);
    this.applyHtmlLang(lang);
    this.currentLanguage.next(lang);
    this.save(lang);
  }

  /** Texto traducido; `{nombre}` se sustituye con `params`. Sin traducción devuelve la clave. */
  translate(key: string, params?: TranslateParams): string {
    const text = this.translations[this.currentLanguage.value]?.[key] || key;
    return params ? text.replace(/\{(\w+)\}/g, (match, name) => String(params[name] ?? match)) : text;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }

  private applyHtmlLang(lang: string): void {
    this.document.documentElement.lang = lang;
  }

  private readSaved(): string | null {
    try {
      return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.LANGUAGE);
    } catch {
      return null; // almacenamiento bloqueado (navegación privada, políticas del navegador)
    }
  }

  private save(lang: string): void {
    try {
      localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.LANGUAGE, lang);
    } catch {
      /* sin almacenamiento: el idioma vale solo para esta visita */
    }
  }
}
