import { ChangeDetectorRef, Pipe, PipeTransform, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LanguageService } from '../../core/services/language.service';

@Pipe({
  name: 'translate',
  pure: false,
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  private languageService = inject(LanguageService);
  private cdr = inject(ChangeDetectorRef, { optional: true });

  constructor() {
    // Permite que los componentes OnPush se actualicen al cambiar de idioma.
    this.languageService.currentLanguage$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr?.markForCheck());
  }

  transform(key: string): string {
    return this.languageService.translate(key);
  }
}
