import { ChangeDetectorRef, Pipe, PipeTransform, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../core/services/language.service';
import { formatNumber } from '../utils/date.util';

/** Número con los separadores del idioma activo. */
@Pipe({
  name: 'localizedNumber',
  pure: false,
  standalone: true
})
export class LocalizedNumberPipe implements PipeTransform {
  private languageService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef, { optional: true });

  constructor() {
    this.languageService.currentLanguage$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr?.markForCheck());
  }

  transform(value: number | null | undefined): string {
    return value === null || value === undefined ? '' : formatNumber(value, this.languageService.getCurrentLanguage());
  }
}
