import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ProgramService } from './program.service';
import { ProgramData } from '../models/program.model';
import { ImpactInitiative } from '../models/impact.model';

describe('ProgramService', () => {
  let service: ProgramService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(ProgramService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads the program data and the impact initiatives from their JSON files', () => {
    let program: ProgramData | undefined;
    let impact: ImpactInitiative[] | undefined;
    service.getProgram().subscribe(value => (program = value));
    service.getImpactInitiatives().subscribe(value => (impact = value));
    http.expectOne('assets/data/program.json').flush({ lastUpdated: '2026-01-01' });
    http.expectOne('assets/data/impact.json').flush([]);
    expect(program?.lastUpdated).toBe('2026-01-01');
    expect(impact).toEqual([]);
  });
});
