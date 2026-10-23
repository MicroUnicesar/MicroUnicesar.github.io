import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
import { WellnessItem } from '../models/wellness.model';

@Injectable({
  providedIn: 'root'
})
export class WellnessService {
  private dataLoader = inject(DataLoaderService);

  getItems(): Observable<WellnessItem[]> {
    return this.dataLoader.load<WellnessItem[]>('wellness');
  }
}
