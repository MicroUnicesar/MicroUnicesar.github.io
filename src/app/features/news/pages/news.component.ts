import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../core/services/language.service';
import { DateUtil } from '../../../shared/utils/date.util';
import { NewsService } from '../../../shared/services/news.service';
import { News } from '../../../shared/models/news.model';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})

export class NewsComponent implements OnInit, AfterViewInit {
  private languageService = inject(LanguageService);
  private newsService = inject(NewsService);

  allNews: News[] = [];

  ngOnInit(): void {
    this.newsService.getAllNews().subscribe(allNews => {
      this.allNews = allNews;
    });
  }

  ngAfterViewInit(): void {
  }

  formatDate(dateString: string): string {
    return DateUtil.formatDate(dateString);
  }
}
