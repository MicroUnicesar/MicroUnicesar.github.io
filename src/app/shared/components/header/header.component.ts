import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../pipes/translate-pipe';
import { LanguageService } from '../../../core/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private languageService = inject(LanguageService);
  currentLanguage = 'es';
  private langSubscription: Subscription | undefined;

  ngOnInit() {
    this.langSubscription = this.languageService.currentLanguage$.subscribe(
      lang => this.currentLanguage = lang
    );
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }

  toggleLanguage() {
    const newLang = this.currentLanguage === 'es' ? 'en' : 'es';
    this.languageService.setLanguage(newLang);
  }
}
