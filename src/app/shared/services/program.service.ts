import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
import { ProgramData } from '../models/program.model';
import { ImpactInitiative } from '../models/impact.model';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {
  private dataLoader = inject(DataLoaderService);

  getProgram(): Observable<ProgramData> {
    return this.dataLoader.load<ProgramData>('program');
  }

  getImpactInitiatives(): Observable<ImpactInitiative[]> {
    return this.dataLoader.load<ImpactInitiative[]>('impact');
  }
}
