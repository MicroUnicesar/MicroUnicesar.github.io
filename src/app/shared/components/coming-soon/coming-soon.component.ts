import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { SectionId, findSection } from '../../constants/site-map';

/** Estado "Próximamente" para subsecciones sin contenido. Recibe sus datos desde `data` de la ruta. */
@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComingSoonComponent {
  titleKey = input.required<string>();
  sectionId = input<SectionId>();

  section = computed(() => {
    const id = this.sectionId();
    return id ? findSection(id) : undefined;
  });
  backPath = computed(() => this.section()?.overview?.path ?? '/home');
  backLabelKey = computed(() => this.section()?.labelKey ?? 'nav-home');
}
