import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
import { Person } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private dataLoader = inject(DataLoaderService);

  getPeople(): Observable<Person[]> {
    return this.dataLoader.load<Person[]>('people');
  }

  getPersonById(id: string): Observable<Person | undefined> {
    return this.getPeople().pipe(map(people => people.find(person => person.id === id)));
  }
}
