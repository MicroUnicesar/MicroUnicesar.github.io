import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { NotFoundComponent } from '../../../../shared/components/not-found/not-found.component';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { SeoService } from '../../../../core/services/seo.service';
import { ResearchService } from '../../../../shared/services/research.service';
import { ProjectService } from '../../../../shared/services/project.service';
import { PublicationService } from '../../../../shared/services/publication.service';
import { ResearchLine } from '../../../../shared/models/research-line.model';
import { ResearchGroup } from '../../../../shared/models/research-group.model';
import { Lab } from '../../../../shared/models/lab.model';
import { Project } from '../../../../shared/models/project.model';
import { Publication } from '../../../../shared/models/publication.model';
import { truncateLocalized } from '../../../../shared/utils/text.util';

export interface LineDetail {
  line: ResearchLine;
  groups: ResearchGroup[];
  labs: Lab[];
  projects: Project[];
  publications: Publication[];
  others: ResearchLine[];
}

/** Longitud máxima de la meta descripción. */
const META_DESCRIPTION_MAX = 155;

/** Página de una línea de investigación. Cada sección se muestra solo si tiene datos. */
@Component({
  selector: 'app-line-detail',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LocalizedPipe, NotFoundComponent],
  templateUrl: './line-detail.component.html',
  styleUrl: './line-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineDetailComponent {
  private research = inject(ResearchService);
  private projects = inject(ProjectService);
  private publications = inject(PublicationService);
  private seo = inject(SeoService);

  /** Viene del parámetro de ruta `:id`. */
  id = input.required<string>();

  /** `undefined` mientras carga, `null` si la línea no existe. */
  detail = toSignal(toObservable(this.id).pipe(switchMap(id => this.load(id))));
  notFound = computed(() => this.detail() === null);

  constructor() {
    const breadcrumbs = inject(BreadcrumbService);
    effect(() => {
      const detail = this.detail();
      breadcrumbs.setLeaf(detail?.line.name);
      if (detail) {
        this.seo.set({ title: detail.line.name, description: truncateLocalized(detail.line.description, META_DESCRIPTION_MAX) });
      } else if (detail === null) {
        this.seo.set({ title: { key: 'not-found-line-title' } });
      }
    });
    inject(DestroyRef).onDestroy(() => breadcrumbs.setLeaf(undefined));
  }

  /** DOI sin el prefijo de URL, por si se guardó completo. */
  doiUrl(doi: string): string {
    return doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
  }

  private load(id: string) {
    return forkJoin({
      lines: this.research.getResearchLines(),
      groups: this.research.getResearchGroups(),
      labs: this.research.getResearchLabs(),
      projects: this.projects.getProjects(),
      publications: this.publications.getPublications()
    }).pipe(
      map(({ lines, groups, labs, projects, publications }): LineDetail | null => {
        const line = lines.find(candidate => candidate.id === id);
        if (!line) {
          return null;
        }
        return {
          line,
          groups: groups.filter(group => line.groupIds.includes(group.id)),
          labs: labs.filter(lab => lab.researchLineIds.includes(line.id)),
          projects: projects.filter(project => line.projectIds?.includes(project.id)),
          publications: publications.filter(publication => line.publicationIds?.includes(publication.id)),
          others: lines.filter(candidate => candidate.id !== line.id)
        };
      })
    );
  }
}
