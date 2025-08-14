import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../services/language';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-research-group-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './research-group-modal.html',
  styleUrls: ['./research-group-modal.scss']
})
export class ResearchGroupModal implements OnInit, OnDestroy {
  private languageService = inject(LanguageService);
  private langSubscription: Subscription | undefined;

  ngOnInit() {
    this.langSubscription = this.languageService.currentLanguage$.subscribe(
      () => {
        // Trigger change detection when language changes
      }
    );
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }
}
