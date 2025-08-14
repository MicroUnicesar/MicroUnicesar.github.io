import {Component, OnInit, AfterViewInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '../../../shared/pipes/translate-pipe';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslatePipe, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  private currentIndex = 0;
  private totalCards = 3; // Number of news items
  private visibleCards = window.innerWidth > 1180 ? 3 : 1;
  private maxIndex = this.totalCards - this.visibleCards;

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

  newsItems = [
    {
      title: 'Nuevo Laboratorio de Investigación',
      summary: 'Inauguración del moderno laboratorio de microbiología molecular.',
      date: '2024-01-15',
      image: 'assets/images/news/lab-news.jpg'
    },
    {
      title: 'Conferencia Internacional',
      summary: 'Participación en el congreso mundial de microbiología.',
      date: '2024-01-10',
      image: 'assets/images/news/conference-news.jpg'
    },
    {
      title: 'Graduación 2024',
      summary: 'Ceremonia de graduación de la promoción 2024.',
      date: '2024-01-05',
      image: 'assets/images/news/graduation-news.jpg'
    }
  ];

  ngOnInit(): void {
    this.totalCards = this.newsItems.length;
  }

  ngAfterViewInit(): void {
    this.initializeCarousel();
  }

  private initializeCarousel(): void {
    const track = document.getElementById('newsCarouselTrack');
    const prevBtn = document.getElementById('newsPrevBtn');
    const nextBtn = document.getElementById('newsNextBtn');

    if (!track || !prevBtn || !nextBtn) {
      console.error('News carousel elements not found');
      return;
    }

    this.updateVisibleCards();
    prevBtn.addEventListener('click', (e) => this.handlePrevClick(e));
    nextBtn.addEventListener('click', (e) => this.handleNextClick(e));
    this.updateCarousel();

    window.addEventListener('resize', () => {
      this.updateVisibleCards();
      this.updateCarousel();
    });
  }

  private updateVisibleCards(): void {
    if (window.innerWidth > 1180) {
      this.visibleCards = 3;
    } else if (window.innerWidth >= 992) {
      this.visibleCards = 2;
    } else {
      this.visibleCards = 1;
    }
    this.maxIndex = this.totalCards - this.visibleCards;

    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
  }

  private updateCarousel(): void {
    const track = document.getElementById('newsCarouselTrack');
    const prevBtn = document.getElementById('newsPrevBtn');
    const nextBtn = document.getElementById('newsNextBtn');

    if (!track || !prevBtn || !nextBtn) return;

    const cardWidth = 100 / this.visibleCards;
    const translateX = -(this.currentIndex * cardWidth);
    track.style.transform = `translateX(${translateX}%)`;

    prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
    nextBtn.style.opacity = this.currentIndex >= this.maxIndex ? '0.5' : '1';
    (prevBtn as HTMLButtonElement).disabled = this.currentIndex === 0;
    (nextBtn as HTMLButtonElement).disabled = this.currentIndex >= this.maxIndex;
  }

  private handlePrevClick(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  private handleNextClick(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }
}
