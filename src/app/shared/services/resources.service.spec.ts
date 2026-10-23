import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ResourcesService } from './resources.service';
import { Resource } from '../models/resource.model';

// Datos ficticios, solo para pruebas.
const text = (es: string) => ({ es, en: `${es} (en)` });
const resources: Resource[] = [
  { id: 'r1', category: 'regulations', type: 'pdf', title: text('Reglamento ficticio'), url: 'https://example.test/1' },
  { id: 'r2', category: 'grade-formats', type: 'doc', title: text('Formato ficticio'), url: 'https://example.test/2' },
  { id: 'r3', category: 'regulations', type: 'link', title: text('Otro reglamento'), url: 'https://example.test/3' }
];

describe('ResourcesService', () => {
  let service: ResourcesService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ResourcesService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('returns all resources, by category and by ids in the requested order', () => {
    let all: Resource[] = [];
    let regulations: Resource[] = [];
    let some: Resource[] = [];
    service.getResources().subscribe(value => (all = value));
    service.getResourcesByCategory('regulations').subscribe(value => (regulations = value));
    service.getResourcesByIds(['r3', 'nope', 'r1']).subscribe(value => (some = value));
    http.expectOne('assets/data/resources.json').flush(resources);
    expect(all.length).toBe(3);
    expect(regulations.map(resource => resource.id)).toEqual(['r1', 'r3']);
    expect(some.map(resource => resource.id)).toEqual(['r3', 'r1']);
  });
});
