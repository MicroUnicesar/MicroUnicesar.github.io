import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../shared/pipes/localized.pipe';
import { SectionLandingComponent } from '../../../shared/components/section-landing/section-landing.component';
import { ResearchService } from '../../../shared/services/research.service';

/** Resumen de Investigación: banner de grupos y, debajo, tarjetas hacia semilleros, líneas, proyectos y publicaciones. */
@Component({
  selector: 'app-research',
  standalone: true,
  imports: [RouterLink, NgbCarouselModule, TranslatePipe, LocalizedPipe, SectionLandingComponent],
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchComponent {
  groups = toSignal(inject(ResearchService).getResearchGroups(), { initialValue: [] });
}
