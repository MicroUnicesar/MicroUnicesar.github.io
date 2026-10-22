import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProjectService } from './project.service';
import { Project } from '../models/project.model';

// Datos ficticios, solo para pruebas.
const text = (es: string) => ({ es, en: `${es} (en)` });
const projects: Project[] = [
  { id: 'p1', title: text('Proyecto ficticio 1'), description: text('d'), groupIds: ['g1'], status: 'active', startYear: 2024 },
  { id: 'p2', title: text('Proyecto ficticio 2'), description: text('d'), groupIds: ['g1', 'g2'], status: 'finished', startYear: 2020, endYear: 2022 }
];

describe('ProjectService', () => {
  let service: ProjectService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProjectService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('returns all projects, by id and by group', () => {
    let all: Project[] = [];
    let one: Project | undefined;
    let ofG2: Project[] = [];
    service.getProjects().subscribe(value => (all = value));
    service.getProjectById('p1').subscribe(value => (one = value));
    service.getProjectsByGroup('g2').subscribe(value => (ofG2 = value));
    http.expectOne('assets/data/projects.json').flush(projects);
    expect(all.length).toBe(2);
    expect(one?.id).toBe('p1');
    expect(ofG2.map(project => project.id)).toEqual(['p2']);
  });
});
