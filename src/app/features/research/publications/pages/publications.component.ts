import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { ComingSoonComponent } from '../../../../shared/components/coming-soon/coming-soon.component';
import { ListFiltersComponent } from '../../../../shared/components/list-filters/list-filters.component';
import { ResearchService } from '../../../../shared/services/research.service';
import { PublicationService } from '../../../../shared/services/publication.service';

@Component({
  selector: 'app-research-publications',
  standalone: true,
  imports: [RouterLink, TranslatePipe, ComingSoonComponent, ListFiltersComponent],
  templateUrl: './publications.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchPublicationsComponent {
  private research = inject(ResearchService);
  private publicationService = inject(PublicationService);

  /** Vienen de los parámetros de URL `?group=` y `?year=`. */
  group = input<string>();
  year = input<string>();

  private data = toSignal(forkJoin({
    publications: this.publicationService.getPublications(),
    groups: this.research.getResearchGroups()
  }));

  loaded = computed(() => !!this.data());
  all = computed(() => this.data()?.publications ?? []);
  groups = computed(() => this.data()?.groups ?? []);
  groupById = computed(() => new Map(this.groups().map(group => [group.id, group])));

  years = computed(() =>
    [...new Set(this.all().map(publication => publication.year).filter((year): year is number => !!year))]
      .sort((a, b) => b - a));

  publications = computed(() => {
    const group = this.group();
    const year = Number(this.year());
    return this.all()
      .filter(publication => !group || publication.groupIds?.includes(group))
      .filter(publication => !year || publication.year === year)
      .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  });

  /** DOI sin el prefijo de URL, por si se guardó completo. */
  doiUrl(doi: string): string {
    return doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
  }
}
