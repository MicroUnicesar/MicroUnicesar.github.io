import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LanguageService } from './language.service';
import { LocalizedText } from '../../shared/models/localized-text.model';
import { localize } from '../../shared/utils/localized.util';

/** Un texto de metadatos: una clave i18n o un texto bilingüe de los datos. */
export type MetaText = { key: string } | LocalizedText;

export interface PageMeta {
  title: MetaText;
  description?: MetaText;
}

const SITE_NAME_KEY = 'seo-site-name';

/**
 * Título y meta descripción por página, en el idioma activo. Cada página llama a `set`;
 * al navegar se restablece el título por defecto, así nunca queda el de la página anterior.
 * La Fase 8 lo amplía (Open Graph, canonical).
 */
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private titleService = inject(Title);
  private meta = inject(Meta);
  private language = inject(LanguageService);
  private router = inject(Router);

  private current?: PageMeta;
  private readonly defaultTitle = this.titleService.getTitle();

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => this.clear());
    // Al cambiar de idioma (o al terminar de cargar sus textos) se vuelve a escribir.
    this.language.currentLanguage$.subscribe(() => this.apply());
  }

  set(page: PageMeta): void {
    this.current = page;
    this.apply();
  }

  private clear(): void {
    this.current = undefined;
    this.apply();
  }

  private resolve(text: MetaText): string {
    return 'key' in text ? this.language.translate(text.key) : localize(text, this.language.getCurrentLanguage());
  }

  private apply(): void {
    const page = this.current;
    const site = this.language.translate(SITE_NAME_KEY);
    const siteName = site === SITE_NAME_KEY ? this.defaultTitle : site;
    const title = page ? this.resolve(page.title) : '';
    this.titleService.setTitle(title ? `${title} | ${siteName}` : siteName);

    const description = page?.description ? this.resolve(page.description) : '';
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
    } else {
      this.meta.removeTag("name='description'");
    }
  }
}
