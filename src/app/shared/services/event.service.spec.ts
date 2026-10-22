import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EventService } from './event.service';
import { EVENTS } from '../testing/i18n.fixtures';

describe('EventService', () => {
  let service: EventService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(EventService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  /** Pide varias consultas a la vez: el cargador comparte una sola petición al JSON. */
  const upcoming = (queries: [Date, number?][]): number[][] => {
    const results: number[][] = queries.map(() => []);
    queries.forEach(([today, count], index) =>
      service.getUpcomingEvents(count ?? 10, today).subscribe(events => (results[index] = events.map(event => event.id!))));
    http.expectOne('assets/data/events.json').flush(EVENTS);
    return results;
  };

  it('returns only today-or-later events, nearest first', () => {
    expect(upcoming([[new Date(2026, 5, 1)]])).toEqual([[3, 2]]);
  });

  it('includes the events of today itself and drops them the day after', () => {
    expect(upcoming([[new Date(2999, 1, 17, 23, 59)], [new Date(2999, 1, 18)]])).toEqual([[3, 2], [2]]);
  });

  it('limits the amount', () => {
    expect(upcoming([[new Date(2026, 5, 1), 1]])).toEqual([[3]]);
  });

  it('returns all events, newest first', () => {
    let all: number[] = [];
    service.getAllEvents().subscribe(events => (all = events.map(event => event.id!)));
    http.expectOne('assets/data/events.json').flush(EVENTS);
    expect(all).toEqual([2, 3, 1]);
  });
});
