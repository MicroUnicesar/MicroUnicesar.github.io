import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizedPipe } from '../../pipes/localized.pipe';
import { Person } from '../../models/person.model';
import { ResearchGroup } from '../../models/research-group.model';
import { personPhotoUrl, personProfilePath } from '../../utils/person.util';

/** Tarjeta de una persona. Solo los docentes enlazan a su ficha. */
@Component({
  selector: 'app-person-card',
  standalone: true,
  imports: [RouterLink, LocalizedPipe],
  templateUrl: './person-card.component.html',
  styleUrl: './person-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonCardComponent {
  person = input.required<Person>();
  /** Grupos de la persona (ya resueltos por quien usa la tarjeta). */
  groups = input<ResearchGroup[]>([]);

  profilePath = computed(() => personProfilePath(this.person()));
  photoUrl = computed(() => personPhotoUrl(this.person()));
}
