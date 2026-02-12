import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../core/services/language.service';
import { Subscription } from 'rxjs';
import { ResearchService } from '../../../shared/services/research.service';
import { ResearchGroup } from '../../../shared/models/research-group.model';

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
  private researchService = inject(ResearchService);

  groups: ResearchGroup[] = [];

  ngOnInit() {
    this.langSubscription = this.languageService.currentLanguage$.subscribe(() => {});
    this.researchService.getResearchGroups().subscribe(groups => {
      this.groups = groups;
    });
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }
}
