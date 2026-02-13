import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { APP_CONSTANTS } from '../../shared/constants/app.constants';

@Injectable({
  providedIn: 'root'
})

export class LanguageService {
  private currentLanguage = new BehaviorSubject<string>(APP_CONSTANTS.LANGUAGES.DEFAULT);
  public currentLanguage$ = this.currentLanguage.asObservable();

  private translations: { [key: string]: any } = {};

  constructor() {
    const savedLang = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.LANGUAGE) || APP_CONSTANTS.LANGUAGES.DEFAULT;
    this.setLanguage(savedLang);
  }

  async loadTranslations(lang: string) {
    try {
      const response = await fetch(`/assets/i18n/${lang}.json`);
      this.translations[lang] = await response.json();
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  }

  async setLanguage(lang: string) {
    await this.loadTranslations(lang);
    this.currentLanguage.next(lang);
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.LANGUAGE, lang);
  }

  translate(key: string): string {
    const currentLang = this.currentLanguage.value;
    return this.translations[currentLang]?.[key] || key;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }
}
