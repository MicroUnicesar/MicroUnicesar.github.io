import {Component, OnInit, AfterViewInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '../../../shared/pipes/translate-pipe';
import {LanguageService} from '../../../services/language';
import {RouterLink, RouterLinkActive} from '@angular/router';
import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../services/language';
import { DateUtil } from '../../../shared/utils/date.util';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TranslatePipe, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, AfterViewInit {
  private languageService = inject(LanguageService);

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

  highlights = [
    {
      title: 'Nuevo Laboratorio de Investigación',
      summary: 'Inauguración del moderno laboratorio de microbiología molecular.',
      date: '2024-01-15',
      image: 'assets/images/news/molecular_biology_lab.jpg'
    },
    {
      title: 'Conferencia Internacional',
      summary: 'Participación en el congreso mundial de microbiología.',
      date: '2024-01-10',
      image: 'assets/images/news/international_conference.jpg'
    },
    {
      title: 'Graduación 2024',
      summary: 'Ceremonia de graduación de la promoción 2024.',
      date: '2024-01-05',
      image: 'assets/images/news/graduation.jpg'
    }
  ];

  newsItems = [
    {
      title: 'Nuevo Laboratorio de Investigación',
      summary: 'Inauguración del moderno laboratorio de microbiología molecular.',
      date: '2024-01-15',
      image: 'assets/images/news/molecular_biology_lab.jpg'
    },
    {
      title: 'Conferencia Internacional',
      summary: 'Participación en el congreso mundial de microbiología.',
      date: '2024-01-10',
      image: 'assets/images/news/international_conference.jpg'
    },
    {
      title: 'Graduación 2024',
      summary: 'Ceremonia de graduación de la promoción 2024.',
      date: '2024-01-05',
      image: 'assets/images/news/graduation.jpg'
    },
    {
      title: 'Graduación 2025',
      summary: 'Ceremonia de graduación de la promoción 2024.',
      date: '2024-01-05',
      image: 'assets/images/news/graduation.jpg'
    }
  ];

  events = [
    {
      id: 1,
      title: 'Solicitud de Opciones de Grado',
      date: '2024-02-15',
      time: '09:00 AM',
      type: 'deadline',
      description: 'Fecha límite para envío de solicitudes del primer ciclo 2024.',
      location: 'Virtual'
    },
    {
      id: 2,
      title: 'Seminario de Investigación',
      date: '2024-02-20',
      time: '02:00 PM',
      type: 'seminar',
      description: 'Presentación de avances en microbiología molecular.',
      location: 'Auditorio Principal'
    },
    {
      id: 3,
      title: 'Evaluación de Proyectos',
      date: '2024-02-28',
      time: '10:00 AM',
      type: 'evaluation',
      description: 'Sesión del comité de investigación para evaluación de propuestas.',
      location: 'Sala de Juntas'
    },
    {
      id: 4,
      title: 'Sustentaciones de Grado',
      date: '2024-03-05',
      time: '08:00 AM',
      type: 'defense',
      description: 'Presentaciones finales de trabajos de grado.',
      location: 'Aulas múltiples'
    }
  ];

  ngOnInit(): void {
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
      const totalCards = 3;
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
}
