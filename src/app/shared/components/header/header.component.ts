import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { LanguageService } from '../../../core/services/language.service';
import { Subscription } from 'rxjs';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private languageService = inject(LanguageService);
  readonly languages = APP_CONSTANTS.LANGUAGES.AVAILABLE;
  currentLanguage: string = APP_CONSTANTS.LANGUAGES.DEFAULT;
  private langSubscription: Subscription | undefined;

  ngOnInit() {
    this.langSubscription = this.languageService.currentLanguage$.subscribe(
      lang => this.currentLanguage = lang
    );
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }

  setLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }
}
