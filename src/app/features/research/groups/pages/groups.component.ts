import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { ResearchService } from '../../../../shared/services/research.service';

@Component({
  selector: 'app-research-groups',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LocalizedPipe],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchGroupsComponent {
  groups = toSignal(inject(ResearchService).getResearchGroups(), { initialValue: [] });
}
