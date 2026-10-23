import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { LanguageServiceStub } from './language.service.stub';

/** Providers comunes de las pruebas de páginas que leen JSON de assets/data. */
export const pageTestProviders = () => [
  provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
  { provide: LanguageService, useValue: new LanguageServiceStub() }
];

/** Responde las peticiones pendientes a assets/data/<archivo>.json con los datos dados. */
export function flushData(files: Record<string, object>): void {
  const http = TestBed.inject(HttpTestingController);
  for (const [file, data] of Object.entries(files)) {
    for (const request of http.match(`assets/data/${file}.json`)) {
      request.flush(data);
    }
  }
}
