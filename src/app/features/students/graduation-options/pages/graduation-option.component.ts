import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { LocalizedDatePipe } from '../../../../shared/pipes/localized-date.pipe';
import { LocalizedNumberPipe } from '../../../../shared/pipes/localized-number.pipe';
import { SeoService } from '../../../../core/services/seo.service';
import { GraduationOptionsService } from '../../../../shared/services/graduation-options.service';
import { GRADUATION_CONTACT_EMAIL, GRADUATION_PROCEDURE_STEPS } from '../graduation-options.constants';

/** Listado de opciones de grado (tarjetas), procedimiento general, cronograma y preguntas frecuentes. */
@Component({
  selector: 'app-graduation-option',
  standalone: true,
  imports: [RouterLink, NgbAccordionModule, TranslatePipe, LocalizedPipe, LocalizedDatePipe, LocalizedNumberPipe],
  templateUrl: './graduation-option.component.html',
  styleUrls: ['./graduation-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraduationOptionComponent {
  private graduationService = inject(GraduationOptionsService);

  readonly steps = GRADUATION_PROCEDURE_STEPS;
  readonly contactEmail = GRADUATION_CONTACT_EMAIL;

  options = toSignal(this.graduationService.getGraduationOptions(), { initialValue: [] });
  resources = toSignal(this.graduationService.getGraduationResources(), { initialValue: [] });
  cicles = toSignal(this.graduationService.getGraduationCicles(), { initialValue: [] });
  faqs = toSignal(this.graduationService.getGraduationFaqs(), { initialValue: [] });

  /** Cantidad de pasos de la ruta de cada opción, para mostrarla en la tarjeta. */
  routeLength = computed(() => new Map(this.options().map(option => [option.id, option.steps.length])));

  constructor() {
    inject(SeoService).set({ title: { key: 'nav-options' }, description: { key: 'seo-grade-list-description' } });
  }
}
