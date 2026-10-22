import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { WellnessService } from '../../../../shared/services/wellness.service';

@Component({
  selector: 'app-wellness',
  standalone: true,
  imports: [TranslatePipe, LocalizedPipe],
  templateUrl: './wellness.component.html',
  styleUrl: './wellness.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WellnessComponent {
  information = toSignal(inject(WellnessService).getItems(), { initialValue: [] });
}
