import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GraduationOptionsService } from './graduation-options.service';
import { GraduationResource } from '../models/graduation-resource.model';
import { GraduationData } from '../models/graduation-data.model';
import { Resource } from '../models/resource.model';

// Datos ficticios, solo para pruebas.
const text = (es: string) => ({ es, en: `${es} (en)` });
const resources: Resource[] = [
  { id: 'recurso-a', category: 'regulations', type: 'pdf', title: text('Recurso A'), url: 'https://example.test/a.pdf', file: 'a.pdf' },
  { id: 'recurso-b', category: 'grade-formats', type: 'form', title: text('Recurso B'), url: 'https://example.test/form' },
  { id: 'recurso-c', category: 'institutional-links', type: 'link', title: text('Recurso C'), url: 'https://example.test/c' }
];
const data: GraduationData = {
  options: [{ icon: 'bi-book', name: text('Opción'), description: text('d'), modal: 'modalTest' }],
  resourceIds: ['recurso-b', 'recurso-a', 'no-existe'],
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
    service.getGraduationCicles().subscribe(v => (results['cicles'] = v.length));
    service.getGraduationFaqs().subscribe(v => (results['faqs'] = v.length));
    http.expectOne('assets/data/graduation-options.json').flush(data);
    expect(results).toEqual({ options: 1, cicles: 1, faqs: 2 });
  });

  it('resolves its resources from resources.json, in the listed order, skipping unknown ids', () => {
    let result: GraduationResource[] = [];
    service.getGraduationResources().subscribe(v => (result = v));
    http.expectOne('assets/data/graduation-options.json').flush(data);
    http.expectOne('assets/data/resources.json').flush(resources);
    expect(result.map(resource => resource.link)).toEqual(['https://example.test/form', 'https://example.test/a.pdf']);
    expect(result.map(resource => resource.icon)).toEqual(['bi-send-arrow-down', 'bi-filetype-pdf']);
    expect(result.map(resource => resource.file)).toEqual(['', 'a.pdf']);
    expect(result[1].name.es).toBe('Recurso A');
  });
});
