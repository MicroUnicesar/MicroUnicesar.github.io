import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../core/services/language.service';
import { GraduationOptionsService } from '../../../shared/services/graduation-options.service';
import { GraduationOption } from '../../../shared/models/graduation-option.model';
import { GraduationResource } from '../../../shared/models/graduation-resource.model';
import { GraduationCicle } from '../../../shared/models/graduation-cicle.model';
import { GraduationFaq } from '../../../shared/models/graduation-faq.model';
import { GraduationOptionModal } from '../modals/graduation-option-modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-graduation-option',
  standalone: true,
  imports: [CommonModule, GraduationOptionModal, TranslatePipe],
  templateUrl: './graduation-option.component.html',
  styleUrls: ['./graduation-option.component.scss']
})

export class GraduationOptionComponent implements OnInit, AfterViewInit {
  private languageService = inject(LanguageService);
  private langSubscription: Subscription | undefined;
  private graduationService = inject(GraduationOptionsService);

  options: GraduationOption[] = [];
  resources: GraduationResource[] = [];
  cicles: GraduationCicle[] = [];
  faqs: GraduationFaq[] = [];

  ngOnInit(): void {
    this.langSubscription = this.languageService.currentLanguage$.subscribe(
      () => {
        // Trigger change detection when language changes
      }
    );

    this.graduationService.getGraduationOptions().subscribe(options => {
      this.options = options;
    });

    this.graduationService.getGraduationResources().subscribe(resources => {
      this.resources = resources;
    });

    this.graduationService.getGraduationCicles().subscribe(cicles => {
      this.cicles = cicles;
    });

    this.graduationService.getGraduationFaqs().subscribe(faqs => {
      this.faqs = faqs;
    });
  }

  ngAfterViewInit(): void {
    this.initializeCarousel();
  }

  private initializeCarousel(): void {
    // carousel functionality
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (track && prevBtn && nextBtn) {
      let currentIndex = 0;
      const visibleCardsPerView = window.innerWidth > 1180 ? 3 : 1; // Adjust based on how many cards you want to show
      const totalCards = this.options.length;
      const maxIndex = Math.max(0, totalCards - visibleCardsPerView);

      const updateCarousel = () => {
        let visibleCardsPerView: number;

        if (window.innerWidth > 1180) {
          visibleCardsPerView= 3; // Desktop: 3 cards
        } else if (window.innerWidth > 992) {
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
}
