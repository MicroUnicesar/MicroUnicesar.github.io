import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { DataLoaderService } from '../../core/services/data-loader.service';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private dataLoader = inject(DataLoaderService);

  getProjects(): Observable<Project[]> {
    return this.dataLoader.load<Project[]>('projects');
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return this.getProjects().pipe(map(projects => projects.find(project => project.id === id)));
  }

  getProjectsByGroup(groupId: string): Observable<Project[]> {
    return this.getProjects().pipe(map(projects => projects.filter(project => project.groupIds.includes(groupId))));
  }
}
