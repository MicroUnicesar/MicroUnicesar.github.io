import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../services/language';
import { DateUtil } from '../../../shared/utils/date.util';
import { NewsService, NewsItem } from '../../../services/news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})

export class NewsComponent implements OnInit, AfterViewInit {
  private languageService = inject(LanguageService);
  private newsService = inject(NewsService);

  allNews: NewsItem[] = [];

  ngOnInit(): void {
    this.allNews = this.newsService.getAllNews();
  }

  ngAfterViewInit(): void {
  }

  formatDate(dateString: string): string {
    return DateUtil.formatDate(dateString);
  }
}
