import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GraduationOptionsService } from './graduation-options.service';
import { GraduationData } from '../models/graduation-data.model';

// Datos ficticios, solo para pruebas.
const text = (es: string) => ({ es, en: `${es} (en)` });
const data: GraduationData = {
  options: [{ icon: 'bi-book', name: text('Opción'), description: text('d'), modal: 'modalTest' }],
  resources: [{ icon: 'bi-filetype-pdf', link: 'https://example.test/f.pdf', name: text('Recurso'), file: 'f.pdf' }],
  cicles: [{ number: '1', reception_from: text('a'), reception_to: text('b'), session: text('c'),
    eval_from: text('d'), eval_to: text('e'), answer: text('f') }],
  faqs: [
    { id: 'One', question: text('¿Pregunta?'), answer: text('Respuesta') },
    { id: 'Two', question: text('¿Pasos?'), steps: [text('Paso 1'), text('Paso 2')] }
  ]
};

describe('GraduationOptionsService', () => {
  let service: GraduationOptionsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(GraduationOptionsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('serves every section from a single request', () => {
    const results: Record<string, number> = {};
    service.getGraduationOptions().subscribe(v => (results['options'] = v.length));
    service.getGraduationResources().subscribe(v => (results['resources'] = v.length));
    service.getGraduationCicles().subscribe(v => (results['cicles'] = v.length));
    service.getGraduationFaqs().subscribe(v => (results['faqs'] = v.length));
    http.expectOne('assets/data/graduation-options.json').flush(data);
    expect(results).toEqual({ options: 1, resources: 1, cicles: 1, faqs: 2 });
  });
});
