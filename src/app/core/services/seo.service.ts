import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { LanguageService } from './language.service';
import { MetaText, PageMeta } from '../../shared/models/seo.model';
import { localize } from '../../shared/utils/localized.util';
import { truncateText } from '../../shared/utils/text.util';
import { absoluteUrl, canonicalPath, defaultPageMeta, ogLocale } from '../../shared/utils/seo.util';
import site from '../../../site.config.json';

export type { MetaText, PageMeta } from '../../shared/models/seo.model';

const SITE_NAME_KEY = 'seo-site-name';
/** Longitud máxima de la descripción: los buscadores y las redes cortan a ~155-160 caracteres. */
const DESCRIPTION_MAX = 155;

/**
 * Metadatos de cada página, en el idioma activo: título, descripción, Open Graph, Twitter, canonical y robots.
 *
 * - Cada página puede llamar a `set` con sus textos (los detalles de grupo, persona, línea u opción de grado).
 * - Las que no lo hacen toman título y descripción del mapa del sitio (`defaultPageMeta`).
 * - `noIndex` marca la página actual como no indexable (secciones "Próximamente" y "no encontrado").
 * - Al navegar se descarta todo lo anterior, así nunca queda el de la página previa.
 * Funciona igual al prerenderizar (Node) y en el navegador.
 */
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private document = inject(DOCUMENT);
  private titleService = inject(Title);
  private meta = inject(Meta);
  private language = inject(LanguageService);
  private router = inject(Router);

  private current?: PageMeta;
  private indexable = true;
  private url = '/';
  private readonly defaultTitle = this.titleService.getTitle();

  constructor() {
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(() => {
      this.current = undefined;
      this.indexable = true;
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.url = (event as NavigationEnd).urlAfterRedirects;
      this.apply();
    });
    // Al cambiar de idioma (o al terminar de cargar sus textos) se vuelve a escribir.
    this.language.currentLanguage$.subscribe(() => this.apply());
  }

  set(page: PageMeta): void {
    this.current = page;
    this.apply();
  }

  /** La página actual no debe indexarse (no tiene contenido propio todavía o no existe). */
  noIndex(): void {
    this.indexable = false;
    this.apply();
  }

  /** Texto en el idioma activo; con varias alternativas, la primera que tenga contenido. */
  private resolve(text: MetaText | MetaText[] | undefined): string {
    for (const option of Array.isArray(text) ? text : [text]) {
      const value = !option
        ? ''
        : 'key' in option ? this.language.translate(option.key) : localize(option, this.language.getCurrentLanguage());
      if (value) {
        return value;
      }
    }
    return '';
  }

  private apply(): void {
    const lang = this.language.getCurrentLanguage();
    const path = canonicalPath(this.url);
    const page = this.current ?? defaultPageMeta(path);

    const siteNameText = this.language.translate(SITE_NAME_KEY);
    const siteName = siteNameText === SITE_NAME_KEY ? this.defaultTitle : siteNameText;
    const pageTitle = this.resolve(page?.title);
    const title = pageTitle ? `${pageTitle} | ${siteName}` : siteName;
    const description = truncateText(this.resolve(page?.description), DESCRIPTION_MAX);
    const url = absoluteUrl(site.url, path);
    const image = absoluteUrl(site.url, site.ogImage);

    this.titleService.setTitle(title);
    this.setName('description', description);
    this.setName('robots', this.indexable ? '' : 'noindex, follow');
    this.setCanonical(url);

    this.setProperty('og:type', 'website');
    this.setProperty('og:site_name', siteName);
    this.setProperty('og:title', pageTitle || siteName);
    this.setProperty('og:description', description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', image);
    this.setProperty('og:locale', ogLocale(lang));
    this.setAlternateLocale(lang === 'en' ? 'es' : 'en');

    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', pageTitle || siteName);
    this.setName('twitter:description', description);
    this.setName('twitter:image', image);
  }

  /** Etiqueta <meta name=...>; con contenido vacío se elimina. */
  private setName(name: string, content: string): void {
    content ? this.meta.updateTag({ name, content }) : this.meta.removeTag(`name='${name}'`);
  }

  /** Etiqueta <meta property=...> (Open Graph); con contenido vacío se elimina. */
  private setProperty(property: string, content: string): void {
    content ? this.meta.updateTag({ property, content }) : this.meta.removeTag(`property='${property}'`);
  }

  private setAlternateLocale(lang: string): void {
    this.meta.updateTag({ property: 'og:locale:alternate', content: ogLocale(lang) }, "property='og:locale:alternate'");
  }

  private setCanonical(href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
