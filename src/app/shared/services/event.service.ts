import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private dataLoader = inject(DataLoaderService);

  private events(): Observable<Event[]> {
    return this.dataLoader.load<Event[]>('events');
  }

  getAllEvents(): Observable<Event[]> {
    return this.events().pipe(map(events => [...events].sort((a, b) => b.date.localeCompare(a.date))));
  }

  /** Eventos de hoy en adelante, del más cercano al más lejano. */
  getUpcomingEvents(count: number = 10, today: Date = new Date()): Observable<Event[]> {
    const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return this.events().pipe(map(events =>
      events
        .filter(event => event.date >= iso)
        .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
        .slice(0, count)
    ));
  }
}
