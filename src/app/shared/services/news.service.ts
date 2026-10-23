import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
import { News } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly PAGE_SIZE = 10;
  private dataLoader = inject(DataLoaderService);

  /** Noticias de la más reciente a la más antigua. Las fechas ISO se ordenan como texto. */
  private sorted(): Observable<News[]> {
    return this.dataLoader.load<News[]>('news').pipe(
      map(news => [...news].sort((a, b) => b.date.localeCompare(a.date)))
    );
  }

  getAllNews(): Observable<News[]> {
    return this.sorted();
  }

  getLatestNews(count: number = 3): Observable<News[]> {
    return this.sorted().pipe(map(news => news.slice(0, count)));
  }

  getHighlights(count: number = 3): Observable<News[]> {
    return this.sorted().pipe(map(news => news.filter(item => item.isHighlight).slice(0, count)));
  }

  getNewsById(id: number): Observable<News | undefined> {
    return this.dataLoader.load<News[]>('news').pipe(map(news => news.find(item => item.id === id)));
  }

  getNewsPaginated(page: number = 0): Observable<{ news: News[], total: number }> {
    return this.sorted().pipe(map(news => ({
      news: news.slice(page * this.PAGE_SIZE, (page + 1) * this.PAGE_SIZE),
      total: news.length
    })));
  }
}
