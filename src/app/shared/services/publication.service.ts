import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
import { Publication } from '../models/publication.model';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private dataLoader = inject(DataLoaderService);

  getPublications(): Observable<Publication[]> {
    return this.dataLoader.load<Publication[]>('publications');
  }

  getPublicationById(id: string): Observable<Publication | undefined> {
    return this.getPublications().pipe(map(items => items.find(item => item.id === id)));
  }

  getPublicationsByGroup(groupId: string): Observable<Publication[]> {
    return this.getPublications().pipe(map(items => items.filter(item => item.groupIds?.includes(groupId))));
  }
}
