import { ChangeDetectorRef, Pipe, PipeTransform, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../core/services/language.service';
import { formatLongDate } from '../utils/date.util';

/** Fecha ISO (AAAA-MM-DD) en formato largo según el idioma activo. */
@Pipe({
  name: 'localizedDate',
  pure: false,
  standalone: true
})
export class LocalizedDatePipe implements PipeTransform {
  private languageService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef, { optional: true });

  constructor() {
    this.languageService.currentLanguage$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr?.markForCheck());
  }

  transform(iso: string | null | undefined): string {
    return iso ? formatLongDate(iso, this.languageService.getCurrentLanguage()) : '';
  }
}
