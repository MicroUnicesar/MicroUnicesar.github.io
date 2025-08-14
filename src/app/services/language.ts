import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LanguageService {
  private currentLanguage = new BehaviorSubject<string>('es');
  public currentLanguage$ = this.currentLanguage.asObservable();

  private translations: { [key: string]: any } = {};

  constructor() {
    const savedLang = localStorage.getItem('language') || 'es';
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
    localStorage.setItem('language', lang);
  }

  translate(key: string): string {
    const currentLang = this.currentLanguage.value;
    return this.translations[currentLang]?.[key] || key;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }
}
