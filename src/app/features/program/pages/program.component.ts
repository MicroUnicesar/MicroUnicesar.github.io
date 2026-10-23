import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../shared/pipes/localized.pipe';
import { LocalizedDatePipe } from '../../../shared/pipes/localized-date.pipe';
import { ProgramService } from '../../../shared/services/program.service';
import { PENDING_CONTENT } from '../../../shared/models/localized-text.model';

@Component({
  selector: 'app-program',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LocalizedPipe, LocalizedDatePipe],
  templateUrl: './program.component.html',
  styleUrl: './program.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramComponent {
  program = toSignal(inject(ProgramService).getProgram());

  /** El plan de estudios puede tener un enlace aunque aún no haya resumen. */
  curriculumUrl = computed(() => this.program()?.curriculum.url);

  hasCurriculum = computed(() => {
    const curriculum = this.program()?.curriculum;
    return !!curriculum && (curriculum.summary.es !== PENDING_CONTENT || !!curriculum.url);
  });
}
