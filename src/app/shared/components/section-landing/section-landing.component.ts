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
  // Estas dos entradas llevan transform porque el router (withComponentInputBinding) asigna `undefined`
  // a toda entrada que la ruta no define, y eso pisaría el valor por defecto.
  /** `false` = solo las tarjetas, para colocarlas bajo otro contenido (la página ya tiene su h1). */
  showHeader = input<boolean, boolean | undefined>(true, { transform: value => value ?? true });
  /** Rutas que no deben aparecer como tarjeta (p. ej. la que ya muestra la página). */
  exclude = input<string[], string[] | undefined>([], { transform: value => value ?? [] });

  section = computed(() => findSection(this.sectionId()));
  cards = computed(() => (this.section()?.children ?? []).filter(child => !this.exclude().includes(child.path)));
}
