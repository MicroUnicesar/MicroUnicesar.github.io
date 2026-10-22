import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { NavEntry, buildNavEntries } from '../../utils/nav-entries.util';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  /** Mismas secciones que el menú, sin "Inicio". */
  readonly entries: NavEntry[] = buildNavEntries().filter(entry => entry.id !== 'home');
  readonly year = new Date().getFullYear();
}
