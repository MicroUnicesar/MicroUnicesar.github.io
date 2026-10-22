import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { NotFoundComponent } from '../../../../shared/components/not-found/not-found.component';
import { ResearchService } from '../../../../shared/services/research.service';
import { PeopleService } from '../../../../shared/services/people.service';
import { ProjectService } from '../../../../shared/services/project.service';
import { PublicationService } from '../../../../shared/services/publication.service';
import { ResearchGroup } from '../../../../shared/models/research-group.model';
import { Person } from '../../../../shared/models/person.model';
import { Project } from '../../../../shared/models/project.model';
import { Publication } from '../../../../shared/models/publication.model';

export interface GroupDetail {
  group: ResearchGroup;
  leader?: Person;
  members: Person[];
  projects: Project[];
  publications: Publication[];
}

@Component({
  selector: 'app-group-detail',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LocalizedPipe, NotFoundComponent],
  templateUrl: './group-detail.component.html',
  styleUrl: './group-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailComponent {
  private research = inject(ResearchService);
  private people = inject(PeopleService);
  private projects = inject(ProjectService);
  private publications = inject(PublicationService);

  /** Viene del parámetro de ruta `:id`. */
  id = input.required<string>();

  /** `undefined` mientras carga, `null` si el grupo no existe. */
  detail = toSignal(toObservable(this.id).pipe(switchMap(id => this.load(id))));
  notFound = computed(() => this.detail() === null);

  /** Persona con ficha de docente: solo ellas tienen página propia. */
  profilePath(person: Person): string | null {
    return person.category === 'faculty' ? `/people/faculty/${person.id}` : null;
  }

  /** DOI sin el prefijo de URL, por si se guardó completo. */
  doiUrl(doi: string): string {
    return doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
  }

  private load(id: string): Observable<GroupDetail | null> {
    return this.research.getResearchGroupById(id).pipe(
      switchMap(group => {
        if (!group) {
          return of(null);
        }
        return forkJoin({
          people: this.people.getPeople(),
          projects: this.projects.getProjects(),
          publications: this.publications.getPublications()
        }).pipe(map(({ people, projects, publications }): GroupDetail => ({
          group,
          leader: people.find(person => person.id === group.leaderId),
          // Los ids sin persona registrada se omiten: no hay nombre que mostrar.
          members: group.memberIds
            .filter(memberId => memberId !== group.leaderId)
            .map(memberId => people.find(person => person.id === memberId))
            .filter((person): person is Person => !!person),
          projects: projects.filter(project => group.projectIds.includes(project.id)),
          publications: publications.filter(publication => group.publicationIds.includes(publication.id))
        })));
      })
    );
  }
}
