import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { ComingSoonComponent } from '../../../../shared/components/coming-soon/coming-soon.component';
import { ProgramService } from '../../../../shared/services/program.service';

/** Impacto en la sociedad / extensión. Alimentada por impact.json; sin iniciativas muestra "Próximamente". */
@Component({
  selector: 'app-impact',
  standalone: true,
  imports: [TranslatePipe, LocalizedPipe, ComingSoonComponent],
  templateUrl: './impact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpactComponent {
  private initiatives = toSignal(inject(ProgramService).getImpactInitiatives());

  loaded = computed(() => this.initiatives() !== undefined);
  items = computed(() => this.initiatives() ?? []);

  imageUrl(image: string): string {
    return image.startsWith('http') ? image : `assets/images/impact/${image}`;
  }
}
