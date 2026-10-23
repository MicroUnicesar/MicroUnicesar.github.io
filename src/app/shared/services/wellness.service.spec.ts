import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { WellnessService } from './wellness.service';
import { WELLNESS } from '../testing/i18n.fixtures';

describe('WellnessService', () => {
  it('loads the wellness topics from wellness.json', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    let items: unknown[] = [];
    TestBed.inject(WellnessService).getItems().subscribe(value => (items = value));
    TestBed.inject(HttpTestingController).expectOne('assets/data/wellness.json').flush(WELLNESS);
    expect(items.length).toBe(2);
  });
});
