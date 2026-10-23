import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { SectionId, findSection } from '../../constants/site-map';
import { SeoService } from '../../../core/services/seo.service';

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
  backPath = computed(() => this.section()?.overview?.path ?? '/');
  backLabelKey = computed(() => this.section()?.labelKey ?? 'nav-home');

  constructor() {
    // Sin contenido propio todavía: que los buscadores no la indexen hasta que lo tenga.
    inject(SeoService).noIndex();
  }
}
