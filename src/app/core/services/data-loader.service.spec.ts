import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DataLoaderService } from './data-loader.service';

describe('DataLoaderService', () => {
  let service: DataLoaderService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(DataLoaderService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads a JSON file from assets/data', () => {
    let result: unknown;
    service.load<{ a: number }>('example').subscribe(value => (result = value));
    http.expectOne('assets/data/example.json').flush({ a: 1 });
    expect(result).toEqual({ a: 1 });
  });

  it('requests each file only once', () => {
    const results: unknown[] = [];
    service.load('example').subscribe(value => results.push(value));
    service.load('example').subscribe(value => results.push(value));
    http.expectOne('assets/data/example.json').flush([1]);
    expect(results).toEqual([[1], [1]]);
  });
});
