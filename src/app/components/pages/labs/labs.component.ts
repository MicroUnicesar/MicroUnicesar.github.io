import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../services/language.service';
import { DateUtil } from '../../../shared/utils/date.util';
import { ResearchService } from '../../../services/research.service';
import { ResearchLabs } from '../../../shared/models/research-labs.model';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})

export class ResearchLabsComponent implements OnInit, AfterViewInit {
  private languageService = inject(LanguageService);
  private researchLabsService = inject(ResearchService);

  labs: ResearchLabs[] = [];
  displayedLabs: ResearchLabs[] = [];
  labsPerPage = 5;
  currentPage = 1;
  hasMoreLabs = true;

  ngOnInit(): void {
    this.researchLabsService.getResearchLabs().subscribe(labs => {
      this.labs = labs;
      this.loadMore();
    });
  }

  ngAfterViewInit(): void {
  }

  formatDate(dateString: string): string {
    return DateUtil.formatDate(dateString);
  }

  loadMore(): void {
    const startIndex = (this.currentPage - 1) * this.labsPerPage;
    const endIndex = startIndex + this.labsPerPage;
    const newLabs = this.labs.slice(startIndex, endIndex);

    this.displayedLabs = [...this.displayedLabs, ...newLabs];
    this.currentPage++;
    this.hasMoreLabs = this.displayedLabs.length < this.labs.length;
  }
}
