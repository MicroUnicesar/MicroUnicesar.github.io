import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { LocalizedPipe } from '../../pipes/localized.pipe';
import { ResearchGroup } from '../../models/research-group.model';

/**
 * Filtros por grupo y año de los listados. El estado vive en la URL
 * (?group=pam&year=2024), así que un filtro se puede compartir.
 */
@Component({
  selector: 'app-list-filters',
  standalone: true,
  imports: [TranslatePipe, LocalizedPipe],
  templateUrl: './list-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListFiltersComponent {
  private router = inject(Router);

  groups = input.required<ResearchGroup[]>();
  /** Si está vacío, no se muestra el filtro de año. */
  years = input<number[]>([]);
  selectedGroup = input<string>();
  selectedYear = input<string>();
  /** Muestra el buscador por nombre (parámetro `?q=`). */
  search = input(false);
  query = input<string>();

  onChange(param: 'group' | 'year' | 'q', event: Event): void {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value.trim();
    // El texto de búsqueda reemplaza la entrada del historial para no llenarlo de pasos intermedios.
    this.router.navigate([], {
      queryParams: { [param]: value || null },
      queryParamsHandling: 'merge',
      replaceUrl: param === 'q'
    });
  }
}
