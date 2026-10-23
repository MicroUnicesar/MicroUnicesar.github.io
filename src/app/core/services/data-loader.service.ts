import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';

/** Carga y cachea los JSON de contenido ubicados en src/assets/data. */
@Injectable({
  providedIn: 'root'
})
export class DataLoaderService {
  private http = inject(HttpClient);
  private cache = new Map<string, Observable<unknown>>();

  load<T>(file: string): Observable<T> {
    let request = this.cache.get(file);
    if (!request) {
      request = this.http.get<T>(`assets/data/${file}.json`).pipe(shareReplay(1));
      this.cache.set(file, request);
    }
    return request as Observable<T>;
  }
}
