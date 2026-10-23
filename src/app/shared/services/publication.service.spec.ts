import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PublicationService } from './publication.service';
import { Publication } from '../models/publication.model';

// Datos ficticios, solo para pruebas.
const publications: Publication[] = [
  { id: 'a1', title: 'Artículo ficticio 1', authors: ['Autora Ficticia'], year: 2024, groupIds: ['g1'] },
  { id: 'a2', title: 'Artículo ficticio 2', authors: ['Autor Ficticio'], year: 2023 }
];

describe('PublicationService', () => {
  let service: PublicationService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(PublicationService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('returns all publications, by id and by group (groupIds is optional)', () => {
    let all: Publication[] = [];
    let one: Publication | undefined;
    let ofG1: Publication[] = [];
    service.getPublications().subscribe(value => (all = value));
    service.getPublicationById('a2').subscribe(value => (one = value));
    service.getPublicationsByGroup('g1').subscribe(value => (ofG1 = value));
    http.expectOne('assets/data/publications.json').flush(publications);
    expect(all.length).toBe(2);
    expect(one?.id).toBe('a2');
    expect(ofG1.map(item => item.id)).toEqual(['a1']);
  });
});
