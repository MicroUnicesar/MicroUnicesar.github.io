import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { ListFiltersComponent } from '../../../../shared/components/list-filters/list-filters.component';
import { ResearchService } from '../../../../shared/services/research.service';

@Component({
  selector: 'app-research-lines',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LocalizedPipe, ListFiltersComponent],
  templateUrl: './lines.component.html',
  styleUrl: './lines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchLinesComponent {
  private research = inject(ResearchService);

  /** Viene del parámetro de URL `?group=`. */
  group = input<string>();

  private data = toSignal(forkJoin({
    lines: this.research.getResearchLines(),
    groups: this.research.getResearchGroups()
  }));

  groups = computed(() => this.data()?.groups ?? []);
  lines = computed(() => {
    const group = this.group();
    const lines = this.data()?.lines ?? [];
    return group ? lines.filter(line => line.groupIds.includes(group)) : lines;
  });

  groupById = computed(() => new Map(this.groups().map(group => [group.id, group])));
}
