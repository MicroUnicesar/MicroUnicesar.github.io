import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../core/services/language.service';
import { LocalizedPipe } from '../../../shared/pipes/localized.pipe';
import { LocalizedDatePipe } from '../../../shared/pipes/localized-date.pipe';
import { NewsService } from '../../../shared/services/news.service';
import { News } from '../../../shared/models/news.model';
import { EventService } from '../../../shared/services/event.service';
import { Event } from '../../../shared/models/event.model';
import { APP_CONSTANTS } from '../../../shared/constants/app.constants';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslatePipe, LocalizedPipe, LocalizedDatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, AfterViewInit {
  private languageService = inject(LanguageService);
  private newsService = inject(NewsService);
  private readonly LATEST_NEWS_COUNT = APP_CONSTANTS.PAGINATION.LATEST_NEWS_COUNT;
  private eventService = inject(EventService);
  private readonly LATEST_EVENTS_COUNT = APP_CONSTANTS.PAGINATION.LATEST_EVENTS_COUNT;

  /** Bloques de la portada hacia las secciones principales. */
  readonly blocks = [
    { path: '/research', labelKey: 'nav-research', descriptionKey: 'desc-research', image: 'assets/images/home/research.jpg' },
    { path: '/people', labelKey: 'nav-people', descriptionKey: 'desc-people', image: 'assets/images/home/people.jpg' },
    { path: '/students', labelKey: 'nav-students', descriptionKey: 'desc-students', image: 'assets/images/home/students.jpg' },
    { path: '/program/impact', labelKey: 'nav-program-impact', descriptionKey: 'desc-program-impact', image: 'assets/images/home/impact.jpg' }
  ];

  latestNews: News[] = [];
  highlights: News[] = [];
  upcomingEvents: Event[] = [];

  ngOnInit(): void {
    this.newsService.getHighlights(3).subscribe(highlights => {
      this.highlights = highlights;
    });

    this.newsService.getLatestNews(this.LATEST_NEWS_COUNT).subscribe(news => {
      this.latestNews = news;
    });

    this.eventService.getUpcomingEvents(10).subscribe(events => {
      this.upcomingEvents = events;
    });
  }

  ngAfterViewInit(): void {
    this.initializeCarousel();
  }

  private initializeCarousel(): void {
    // NewsComponent carousel functionality
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (track && prevBtn && nextBtn) {
      let currentIndex = 0;
      const visibleCardsPerView = window.innerWidth >= 1180 ? 2 : 1; // Adjust based on how many cards you want to show
      const totalCards = this.LATEST_NEWS_COUNT;
      const maxIndex = Math.max(0, totalCards - visibleCardsPerView);

      const updateCarousel = () => {
        let visibleCardsPerView;

        if (window.innerWidth > 1180) {
          visibleCardsPerView = 2; // Tablet: 2 cards
        } else {
          visibleCardsPerView = 1; // Mobile: 1 card
        }
        const translateX = -(currentIndex * (100 / visibleCardsPerView));
        track.style.transform = `translateX(${translateX}%)`;
      };

      nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
          currentIndex++;
          updateCarousel();
        }
      });

      prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });
    }
  }

  getEventTypeClass(type: string): string {
    const typeClasses: { [key: string]: string } = {
      'deadline': 'border-danger text-danger',
      'seminar': 'border-primary text-primary',
      'evaluation': 'border-warning text-warning',
      'defense': 'border-success text-success'
    };
    return typeClasses[type] || 'border-secondary text-secondary';
  }

  getEventIcon(type: string): string {
    const typeIcons: { [key: string]: string } = {
      'deadline': 'bi-clock-fill',
      'seminar': 'bi-laptop',
      'evaluation': 'bi-clipboard-check',
      'defense': 'bi-mortarboard'
    };
    return typeIcons[type] || 'bi-calendar-event';
  }

}
