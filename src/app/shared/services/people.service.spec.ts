import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PeopleService } from './people.service';
import { Person } from '../models/person.model';

// Datos ficticios, solo para pruebas.
const people: Person[] = [
  { id: 'persona-ficticia', fullName: 'Persona Ficticia', role: { es: 'Docente de prueba', en: 'Test lecturer' },
    category: 'faculty', groupIds: [], researchLines: [], bio: { es: 'x', en: 'x' }, links: {} }
];

describe('PeopleService', () => {
  let service: PeopleService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(PeopleService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('returns people and finds one by id', () => {
    let all: Person[] = [];
    let one: Person | undefined;
    let none: Person | undefined = people[0];
    service.getPeople().subscribe(value => (all = value));
    service.getPersonById('persona-ficticia').subscribe(value => (one = value));
    service.getPersonById('nadie').subscribe(value => (none = value));
    http.expectOne('assets/data/people.json').flush(people);
    expect(all.length).toBe(1);
    expect(one?.fullName).toBe('Persona Ficticia');
    expect(none).toBeUndefined();
  });
});
