import { Pipe, PipeTransform, inject } from '@angular/core';
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

  transform(text: LocalizedText | null | undefined): string {
    return localize(text, this.languageService.getCurrentLanguage());
  }
}
