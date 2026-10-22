import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '../../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { ComingSoonComponent } from '../../../../shared/components/coming-soon/coming-soon.component';
import { FaqService } from '../../../../shared/services/faq.service';
import { PENDING_CONTENT } from '../../../../shared/models/localized-text.model';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [NgbAccordionModule, TranslatePipe, LocalizedPipe, ComingSoonComponent],
  templateUrl: './faq.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FaqComponent {
  private faqService = inject(FaqService);

  /** Solo se muestran las preguntas que ya tienen respuesta real. */
  answeredFaqs = computed(() =>
    (this.faqs() ?? []).filter(faq => faq.answer.es !== PENDING_CONTENT));
  loaded = computed(() => this.faqs() !== undefined);

  private faqs = toSignal(this.faqService.getFaqs());
}
