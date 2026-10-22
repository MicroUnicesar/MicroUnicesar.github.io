import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizedPipe } from '../../../../shared/pipes/localized.pipe';
import { LanguageService } from '../../../../core/services/language.service';
import { DateUtil } from '../../../../shared/utils/date.util';
import { ResearchService } from '../../../../shared/services/research.service';
import { Lab } from '../../../../shared/models/lab.model';
import { ResearchLine } from '../../../../shared/models/research-line.model';
import { APP_CONSTANTS } from '../../../../shared/constants/app.constants';

@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule, LocalizedPipe],
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.scss']
})

export class ResearchLabsComponent implements OnInit, AfterViewInit {
  private languageService = inject(LanguageService);
  private researchLabsService = inject(ResearchService);

  labs: Lab[] = [];
  displayedLabs: Lab[] = [];
  researchLines: ResearchLine[] = [];
  labsPerPage = APP_CONSTANTS.PAGINATION.LABS_PER_PAGE;
  currentPage = 1;
  hasMoreLabs = true;

  ngOnInit(): void {
    this.researchLabsService.getResearchLines().subscribe(lines => {
      this.researchLines = lines;
    });

    this.researchLabsService.getSemilleros().subscribe(labs => {
      this.labs = labs;
      this.loadMore();
    });
  }

  ngAfterViewInit(): void {
  }

  lineById(lineId: string): ResearchLine | undefined {
    return this.researchLines.find(line => line.id === lineId);
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
