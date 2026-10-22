import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { ComingSoonComponent } from '../../../shared/components/coming-soon/coming-soon.component';
import { ListFiltersComponent } from '../../../shared/components/list-filters/list-filters.component';
import { PersonCardComponent } from '../../../shared/components/person-card/person-card.component';
import { PeopleService } from '../../../shared/services/people.service';
import { ResearchService } from '../../../shared/services/research.service';
import { Person } from '../../../shared/models/person.model';
import { groupsOfPerson, queryPeople } from '../../../shared/utils/person.util';

/**
 * Listado de personas de una categoría (docentes, estudiantes, personal).
 * La categoría y los títulos llegan desde `data` de la ruta; el filtro, desde la URL.
 */
@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [TranslatePipe, ComingSoonComponent, ListFiltersComponent, PersonCardComponent],
  templateUrl: './people-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleListComponent {
  private peopleService = inject(PeopleService);
  private research = inject(ResearchService);

  category = input.required<Person['category']>();
  titleKey = input.required<string>();
  descriptionKey = input.required<string>();
  /** Vienen de los parámetros de URL `?group=` y `?q=`. */
  group = input<string>();
  q = input<string>();

  private data = toSignal(forkJoin({
    people: this.peopleService.getPeople(),
    groups: this.research.getResearchGroups()
  }));

  loaded = computed(() => !!this.data());
  groups = computed(() => this.data()?.groups ?? []);
  /** Todas las personas de la categoría, sin filtros. */
  inCategory = computed(() => (this.data()?.people ?? []).filter(person => person.category === this.category()));

  people = computed(() =>
    queryPeople(this.data()?.people ?? [], { category: this.category(), groups: this.groups(), group: this.group(), q: this.q() }));

  groupsOf(person: Person) {
    return groupsOfPerson(person, this.groups());
  }
}
