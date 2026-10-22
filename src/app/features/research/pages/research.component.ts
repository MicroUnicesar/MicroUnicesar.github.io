import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LocalizedPipe } from '../../../shared/pipes/localized.pipe';
import { LanguageService } from '../../../core/services/language.service';
import { ResearchService } from '../../../shared/services/research.service';
import { ResearchGroup } from '../../../shared/models/research-group.model';
import { ResearchLine } from '../../../shared/models/research-line.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-research',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe, LocalizedPipe],
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})

export class ResearchComponent implements OnInit, OnDestroy {
  private languageService = inject(LanguageService);
  private langSubscription: Subscription | undefined;
  private router = inject(Router);
  private researchService = inject(ResearchService);

  groups: ResearchGroup[] = [];
  research_lines: ResearchLine[] = [];

  ngOnInit() {
    this.langSubscription = this.languageService.currentLanguage$.subscribe(
      () => {
        // Trigger change detection when language changes
      }
    );

    this.researchService.getResearchGroups().subscribe(groups => {
      this.groups = groups;
    });

    this.researchService.getResearchLines().subscribe(lines => {
      this.research_lines = lines;
    });
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }

  groupAbr(groupId: string): string {
    return this.groups.find(group => group.id === groupId)?.abr ?? groupId.toUpperCase();
  }

  showResearchLabs(): void {
    this.router.navigate(['/research/labs']);
  }
}
