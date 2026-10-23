import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
import { Resource, ResourceCategory } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  private dataLoader = inject(DataLoaderService);

  getResources(): Observable<Resource[]> {
    return this.dataLoader.load<Resource[]>('resources');
  }

  getResourcesByCategory(category: ResourceCategory): Observable<Resource[]> {
    return this.getResources().pipe(map(resources => resources.filter(resource => resource.category === category)));
  }

  /** Recursos por id, en el orden pedido. Los ids desconocidos se omiten. */
  getResourcesByIds(ids: string[]): Observable<Resource[]> {
    return this.getResources().pipe(map(resources =>
      ids.map(id => resources.find(resource => resource.id === id)).filter((resource): resource is Resource => !!resource)));
  }
}
