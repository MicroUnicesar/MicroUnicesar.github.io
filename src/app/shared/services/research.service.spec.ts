import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ResearchService } from './research.service';
import { ResearchGroup } from '../models/research-group.model';
import { ResearchLine } from '../models/research-line.model';
import { Lab } from '../models/lab.model';

// Datos ficticios, solo para pruebas.
const text = (es: string) => ({ es, en: `${es} (en)` });
const groups: ResearchGroup[] = [
  { id: 'test-a', abr: 'TA', name: text('Grupo A'), image: 'a.png', gruplac: 'https://example.test/a',
    category: text('Cat'), briefDescription: text('b'), description: text('d'), researchLines: [text('L')],
    memberIds: [], projectIds: [], publicationIds: [] },
  { id: 'test-b', abr: 'TB', name: text('Grupo B'), image: 'b.png', gruplac: 'https://example.test/b',
    category: text('Cat'), briefDescription: text('b'), description: text('d'), researchLines: [],
    memberIds: [], projectIds: [], publicationIds: [] }
];
const lines: ResearchLine[] = [
  { id: 'line-1', name: text('Línea 1'), description: text('d'), icon: 'bi-dna', groupIds: ['test-a'] }
];
const labs: Lab[] = [
  { id: 'lab-1', abr: 'L1', name: text('Lab 1'), description: text('d'), researchLineIds: ['line-1'],
    isSemillero: true, pi: 'Persona Ficticia', contact: 'ficticia@example.test', projectIds: [] },
  { id: 'lab-2', abr: 'L2', name: text('Lab 2'), description: text('d'), researchLineIds: [],
    isSemillero: false, pi: 'Otra Ficticia', contact: 'otra@example.test', projectIds: [] }
];

describe('ResearchService', () => {
  let service: ResearchService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ResearchService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('returns all research groups', () => {
    let result: ResearchGroup[] = [];
    service.getResearchGroups().subscribe(value => (result = value));
    http.expectOne('assets/data/research-groups.json').flush(groups);
    expect(result.map(group => group.id)).toEqual(['test-a', 'test-b']);
  });

  it('finds a group by id', () => {
    let result: ResearchGroup | undefined;
    service.getResearchGroupById('test-b').subscribe(value => (result = value));
    http.expectOne('assets/data/research-groups.json').flush(groups);
    expect(result?.abr).toBe('TB');
  });

  it('returns undefined for an unknown group id', () => {
    let result: ResearchGroup | undefined = groups[0];
    service.getResearchGroupById('nope').subscribe(value => (result = value));
    http.expectOne('assets/data/research-groups.json').flush(groups);
    expect(result).toBeUndefined();
  });

  it('returns the groups that match a list of ids', () => {
    let result: ResearchGroup[] = [];
    service.getResearchGroupsByIds(['test-b', 'nope']).subscribe(value => (result = value));
    http.expectOne('assets/data/research-groups.json').flush(groups);
    expect(result.map(group => group.id)).toEqual(['test-b']);
  });

  it('returns research lines', () => {
    let result: ResearchLine[] = [];
    service.getResearchLines().subscribe(value => (result = value));
    http.expectOne('assets/data/research-lines.json').flush(lines);
    expect(result.length).toBe(1);
  });

  it('returns labs and finds one by id', () => {
    let all: Lab[] = [];
    let one: Lab | undefined;
    service.getResearchLabs().subscribe(value => (all = value));
    service.getResearchLabById('lab-1').subscribe(value => (one = value));
    http.expectOne('assets/data/labs.json').flush(labs);
    expect(all.length).toBe(2);
    expect(one?.abr).toBe('L1');
  });

  it('returns only the labs flagged as semillero', () => {
    let result: Lab[] = [];
    service.getSemilleros().subscribe(value => (result = value));
    http.expectOne('assets/data/labs.json').flush(labs);
    expect(result.map(lab => lab.id)).toEqual(['lab-1']);
  });
});
