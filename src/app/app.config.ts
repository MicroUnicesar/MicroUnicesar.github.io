import { ViewportScroller } from '@angular/common';
import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { LanguageService } from './core/services/language.service';

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
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
};
