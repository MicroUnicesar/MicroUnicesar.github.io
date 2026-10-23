import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { ComingSoonComponent } from '../../../../shared/components/coming-soon/coming-soon.component';
import { ListFiltersComponent } from '../../../../shared/components/list-filters/list-filters.component';
import { ResearchService } from '../../../../shared/services/research.service';
import { ProjectService } from '../../../../shared/services/project.service';
import { Project } from '../../../../shared/models/project.model';

/** Años en los que el proyecto estuvo activo. */
export function projectYears(project: Project, currentYear = new Date().getFullYear()): number[] {
  if (!project.startYear) {
    return [];
  }
  const end = project.endYear ?? (project.status === 'active' ? currentYear : project.startYear);
  return Array.from({ length: Math.max(end - project.startYear + 1, 1) }, (_, i) => project.startYear! + i);
}

@Component({
  selector: 'app-research-projects',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LocalizedPipe, ComingSoonComponent, ListFiltersComponent],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchProjectsComponent {
  private research = inject(ResearchService);
  private projectService = inject(ProjectService);

  /** Vienen de los parámetros de URL `?group=` y `?year=`. */
  group = input<string>();
  year = input<string>();

  private data = toSignal(forkJoin({
    projects: this.projectService.getProjects(),
    groups: this.research.getResearchGroups()
  }));

  loaded = computed(() => !!this.data());
  all = computed(() => this.data()?.projects ?? []);
  groups = computed(() => this.data()?.groups ?? []);
  groupById = computed(() => new Map(this.groups().map(group => [group.id, group])));

  years = computed(() =>
    [...new Set(this.all().flatMap(project => projectYears(project)))].sort((a, b) => b - a));

  projects = computed(() => {
    const group = this.group();
    const year = Number(this.year());
    return this.all()
      .filter(project => !group || project.groupIds.includes(group))
      .filter(project => !year || projectYears(project).includes(year))
      .sort((a, b) => (b.startYear ?? 0) - (a.startYear ?? 0));
  });
}
