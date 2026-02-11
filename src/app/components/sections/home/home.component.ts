import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../services/language.service';
import { DateUtil } from '../../../shared/utils/date.util';
import { NewsService } from '../../../services/news.service';
import { News } from '../../../shared/models/news.model';
import { EventService } from '../../../services/event.service';
import { Event } from '../../../shared/models/event.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslatePipe, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, AfterViewInit {
  private languageService = inject(LanguageService);
  private router = inject(Router);
  private newsService = inject(NewsService);
  private readonly LATEST_NEWS_COUNT = 6;
  private eventService = inject(EventService);
  private readonly LATEST_EVENTS_COUNT = 10;

  areas = [
    {
      title: 'Microbiología Agricola e Industrial',
      description: 'Control biológico, bioprocesos y control de calidad en la industria alimentaria'
    },
    {
      title: 'Bioinformática y Biología de Sistemas',
      description: 'Análisis de datos ómicos, y modelación de sistemas biológicos'
    },
    {
      title: 'Microbiología Médica y Clínica',
      description: 'Control, estudio y prevención de enfermedades infecciosas'
    }
    ,
    {
      title: 'Biotecnología Microbiana',
      description: 'Aplicaciones industriales y desarrollo de bioprocesos'
    },
    {
      title: 'Microbiología Ambiental',
      description: 'Estudio de microorganismos en ecosistemas naturales y como bioindicadores'
    }
  ];

  features = [
    {
      icon: 'bi-award',
      title: 'Acreditación de Calidad',
      description: 'Programa acreditado con los más altos estándares de calidad educativa.'
    }
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

  formatDate(dateString: string): string {
    return DateUtil.formatDate(dateString);
  }

  showAllNews(): void {
    this.router.navigate(['/news']);
  }

  showAllEvents(): void {
    this.router.navigate(['/events']);
  }
}
