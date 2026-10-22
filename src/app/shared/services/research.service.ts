import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
import { ResearchGroup } from '../models/research-group.model';
import { ResearchLine } from '../models/research-line.model';
import { Lab } from '../models/lab.model';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {
  private dataLoader = inject(DataLoaderService);

  getResearchGroups(): Observable<ResearchGroup[]> {
    return this.dataLoader.load<ResearchGroup[]>('research-groups');
  }

  getResearchGroupById(id: string): Observable<ResearchGroup | undefined> {
    return this.getResearchGroups().pipe(map(groups => groups.find(group => group.id === id)));
  }

  getResearchLines(): Observable<ResearchLine[]> {
    return this.dataLoader.load<ResearchLine[]>('research-lines');
  }

  getResearchLabs(): Observable<Lab[]> {
    return this.dataLoader.load<Lab[]>('labs');
  }

  /** Labs marcados como semillero (sección de semilleros). */
  getSemilleros(): Observable<Lab[]> {
    return this.getResearchLabs().pipe(map(labs => labs.filter(lab => lab.isSemillero)));
  }

  getResearchLabById(id: string): Observable<Lab | undefined> {
    return this.getResearchLabs().pipe(map(labs => labs.find(lab => lab.id === id)));
  }
}
