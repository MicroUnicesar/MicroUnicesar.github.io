import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate-pipe';

/** Vista "no encontrado" para ids inexistentes (p. ej. un grupo que no existe). */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './not-found.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {
  titleKey = input.required<string>();
  backPath = input('/home');
  backLabelKey = input('nav-home');
}
