import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../shared/pipes/localized.pipe';
import { NotFoundComponent } from '../../../shared/components/not-found/not-found.component';
import { PersonLinksComponent } from '../../../shared/components/person-links/person-links.component';
import { PeopleService } from '../../../shared/services/people.service';
import { ResearchService } from '../../../shared/services/research.service';
import { PublicationService } from '../../../shared/services/publication.service';
import { Person, TeamMember } from '../../../shared/models/person.model';
import { Publication } from '../../../shared/models/publication.model';
import { ResearchGroup } from '../../../shared/models/research-group.model';
import { Lab } from '../../../shared/models/lab.model';
import { groupsOfPerson, personPhotoUrl, personProfilePath } from '../../../shared/utils/person.util';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { SeoService } from '../../../core/services/seo.service';

export interface TeamEntry {
  member: TeamMember;
  /** Ruta a la ficha, solo si la persona existe y es docente. */
  path: string | null;
}

export interface PersonDetail {
  person: Person;
  groups: ResearchGroup[];
  labs: Lab[];
  publications: Publication[];
  currentTeam: TeamEntry[];
  alumni: TeamEntry[];
}

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LocalizedPipe, NotFoundComponent, PersonLinksComponent],
  templateUrl: './person-detail.component.html',
  styleUrl: './person-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonDetailComponent {
  private people = inject(PeopleService);
  private research = inject(ResearchService);
  private publicationService = inject(PublicationService);

  /** Viene del parámetro de ruta `:id`. */
  id = input.required<string>();

  /** `undefined` mientras carga, `null` si la persona no existe. */
  detail = toSignal(toObservable(this.id).pipe(switchMap(id => this.load(id))));
  notFound = computed(() => this.detail() === null);

  constructor() {
    const breadcrumbs = inject(BreadcrumbService);
    const seo = inject(SeoService);
    effect(() => {
      const person = this.detail()?.person;
      breadcrumbs.setLeaf(person ? { es: person.fullName, en: person.fullName } : undefined);
      if (person) {
        // Biografía, si no cargo y, mientras ninguno exista, una frase genérica del programa.
        seo.set({
          title: { es: person.fullName, en: person.fullName },
          description: [person.summary, person.research, person.role, { key: 'seo-person-description' }]
        });
      }
    });
    inject(DestroyRef).onDestroy(() => breadcrumbs.setLeaf(undefined));
  }

  photoUrl(person: Person): string | null {
    return personPhotoUrl(person);
  }

  /** DOI sin el prefijo de URL, por si se guardó completo. */
  /** Separa un texto largo en párrafos: HTML ignora los saltos de línea, así que cada bloque va en su <p>. */
  paragraphs(text: string): string[] {
    return text.split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(Boolean);
  }

  /** Solo dígitos y "+", para el enlace tel:. */
  phoneDigits(phone: string): string {
    return phone.replace(/[^\d+]/g, '');
  }

  doiUrl(doi: string): string {
    return doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
  }

  private load(id: string): Observable<PersonDetail | null> {
    return this.people.getPeople().pipe(
      switchMap(people => {
        const person = people.find(candidate => candidate.id === id);
        if (!person || person.category !== 'faculty') {
          return of(null);
        }
        return forkJoin({
          groups: this.research.getResearchGroups(),
          labs: this.research.getResearchLabs(),
          publications: this.publicationService.getPublications()
        }).pipe(map(({ groups, labs, publications }): PersonDetail => {
          const toEntry = (member: TeamMember): TeamEntry => {
            const linked = member.personId ? people.find(candidate => candidate.id === member.personId) : undefined;
            return { member, path: linked ? personProfilePath(linked) : null };
          };
          const team = person.teamMembers ?? [];
          const featured = person.featuredPublications ?? [];
          // Destacadas de la ficha + las que listan a la persona como autora.
          const linkedPublications = publications.filter(publication =>
            publication.personIds?.includes(person.id) && !featured.some(item => item.id === publication.id));
          return {
            person,
            groups: groupsOfPerson(person, groups),
            labs: labs.filter(lab => lab.piId === person.id),
            publications: [...featured, ...linkedPublications],
            currentTeam: team.filter(member => member.status === 'current').map(toEntry),
            alumni: team.filter(member => member.status === 'alumni').map(toEntry)
          };
        }));
      })
    );
  }
}
