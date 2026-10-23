import { ChangeDetectorRef, Pipe, PipeTransform, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../core/services/language.service';
import { LocalizedText } from '../models/localized-text.model';
import { localize } from '../utils/localized.util';

@Pipe({
  name: 'localized',
  pure: false,
  standalone: true
})
export class LocalizedPipe implements PipeTransform {
  private languageService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef, { optional: true });

  constructor() {
    this.languageService.currentLanguage$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr?.markForCheck());
  }

  transform(text: LocalizedText | null | undefined): string {
    return localize(text, this.languageService.getCurrentLanguage());
  }
}
