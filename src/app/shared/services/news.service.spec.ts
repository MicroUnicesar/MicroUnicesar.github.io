import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NewsService } from './news.service';
import { NEWS } from '../testing/i18n.fixtures';

describe('NewsService', () => {
  let service: NewsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(NewsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('returns the news newest first, the latest N, the highlights, one by id and a page', () => {
    const ids = (items: { id?: number }[]) => items.map(item => item.id);
    let all: number[] = [], latest: number[] = [], highlights: number[] = [], page: number[] = [];
    let total = 0;
    let one: number | undefined;
    service.getAllNews().subscribe(v => (all = ids(v) as number[]));
    service.getLatestNews(2).subscribe(v => (latest = ids(v) as number[]));
    service.getHighlights().subscribe(v => (highlights = ids(v) as number[]));
    service.getNewsById(1).subscribe(v => (one = v?.id));
    service.getNewsPaginated(0).subscribe(v => { page = ids(v.news) as number[]; total = v.total; });
    http.expectOne('assets/data/news.json').flush(NEWS);

    expect(all).toEqual([3, 2, 1]);
    expect(latest).toEqual([3, 2]);
    expect(highlights).toEqual([2]);
    expect(one).toBe(1);
    expect(page).toEqual([3, 2, 1]);
    expect(total).toBe(3);
  });
});
