import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
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

  private getData(): Observable<GraduationData> {
    return this.dataLoader.load<GraduationData>('graduation-options');
  }

  getGraduationOptions(): Observable<GraduationOption[]> {
    return this.getData().pipe(map(data => data.options));
  }

  getGraduationResources(): Observable<GraduationResource[]> {
    return this.getData().pipe(map(data => data.resources));
  }

  getGraduationCicles(): Observable<GraduationCicle[]> {
    return this.getData().pipe(map(data => data.cicles));
  }

  getGraduationFaqs(): Observable<GraduationFaq[]> {
    return this.getData().pipe(map(data => data.faqs));
  }
}
