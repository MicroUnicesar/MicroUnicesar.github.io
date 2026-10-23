import { ViewportScroller } from '@angular/common';
import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { LanguageService } from './core/services/language.service';
import { provideClientHydration } from '@angular/platform-browser';

export function HttpLoaderFactory(http: HttpClient) {
  // Remove the http parameter - newer versions handle this automatically
  return new TranslateHttpLoader();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
    ),
    // Al saltar a un anclaje (#procedure) se deja libre la barra superior fija (51 px).
    provideAppInitializer(() => inject(ViewportScroller).setOffset([0, 70])),
    // La app espera los textos del idioma inicial para no mostrar claves sueltas al cargar.
    provideAppInitializer(() => inject(LanguageService).ready),
    // withFetch: durante el prerender las URL relativas (assets/data/...) solo se resuelven con el backend fetch.
    provideHttpClient(withFetch()),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    // El HTML prerenderizado se reutiliza (hidrata) en vez de borrarse y volver a dibujarse: sin esto el contenido
    // desaparece unos instantes al cargar. Sin withEventReplay(): los enlaces del HTML son reales y ahorra ~20 kB.
    provideClientHydration()
  ]
};
