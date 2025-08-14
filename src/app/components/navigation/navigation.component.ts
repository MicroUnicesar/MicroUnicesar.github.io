import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate-pipe';
import { LanguageService } from '../../services/language';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  private languageService = inject(LanguageService);
  private langSubscription: Subscription | undefined;

  ngOnInit() {
    // Subscribe to language changes to trigger re-render
    this.langSubscription = this.languageService.currentLanguage$.subscribe(
      () => {
        // This will trigger change detection when language changes
      }
    );
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }
}
