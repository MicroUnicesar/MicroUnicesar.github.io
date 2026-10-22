import { ChangeDetectorRef, Pipe, PipeTransform, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../core/services/language.service';
import { DateStyle, formatDate } from '../utils/date.util';

/** Fecha ISO (AAAA-MM-DD), o hora (HH:mm) con el estilo 'time', en el idioma activo. */
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

  transform(value: string | null | undefined, style: DateStyle = 'long'): string {
    return value ? formatDate(value, this.languageService.getCurrentLanguage(), style) : '';
  }
}
