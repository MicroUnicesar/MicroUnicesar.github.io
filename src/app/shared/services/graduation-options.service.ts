import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
import { ResourcesService } from './resources.service';
import { toGraduationResource } from '../utils/resource.util';
import { GraduationData } from '../models/graduation-data.model';
import { GraduationOption } from '../models/graduation-option.model';
import { GraduationResource } from '../models/graduation-resource.model';
import { GraduationCicle } from '../models/graduation-cicle.model';
import { GraduationFaq } from '../models/graduation-faq.model';

@Injectable({
  providedIn: 'root'
})
export class GraduationOptionsService {
  private dataLoader = inject(DataLoaderService);
  private resourcesService = inject(ResourcesService);

  private getData(): Observable<GraduationData> {
    return this.dataLoader.load<GraduationData>('graduation-options');
  }

  getGraduationOptions(): Observable<GraduationOption[]> {
    return this.getData().pipe(map(data => data.options));
  }

  getGraduationOptionById(id: string): Observable<GraduationOption | undefined> {
    return this.getGraduationOptions().pipe(map(options => options.find(option => option.id === id)));
  }

  getGraduationResources(): Observable<GraduationResource[]> {
    // Los recursos viven en resources.json; aquí solo se elige cuáles se muestran y en qué orden.
    return this.getData().pipe(
      switchMap(data => this.resourcesService.getResourcesByIds(data.resourceIds)),
      map(resources => resources.map(toGraduationResource))
    );
  }

  getGraduationCicles(): Observable<GraduationCicle[]> {
    return this.getData().pipe(map(data => data.cicles));
  }

  getGraduationFaqs(): Observable<GraduationFaq[]> {
    return this.getData().pipe(map(data => data.faqs));
  }
}
