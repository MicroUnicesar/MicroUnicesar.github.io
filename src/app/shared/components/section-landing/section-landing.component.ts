import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { SectionId, findSection } from '../../constants/site-map';

/** Landing de una sección: tarjetas hacia sus subsecciones. Las que aún no tienen contenido no se enlazan. */
@Component({
  selector: 'app-section-landing',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './section-landing.component.html',
  styleUrl: './section-landing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionLandingComponent {
  sectionId = input.required<SectionId>();

  section = computed(() => findSection(this.sectionId()));
}
