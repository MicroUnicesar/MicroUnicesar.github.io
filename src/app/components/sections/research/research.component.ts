import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../services/language';
import { ResearchGroupModal } from '../../modals/research-group-modal/research-group-modal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-investigacion',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ResearchGroupModal],
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.scss']
})

export class ResearchComponent implements OnInit, OnDestroy {
  private languageService = inject(LanguageService);
  private langSubscription: Subscription | undefined;

  groups = [
    {
      abr: 'PAM',
      name: 'Parasitología - Agroecología Milenio',
      description: 'Nuestro enfoque es el control biológico de insectos y microorganismos de ' +
        'enfermedades, asi comó el uso de la bioprospección para identificar microorganismos ' +
        'con potencial en bio economía',
      image: 'group_slide_pam.png',
      modal: 'modalPam'
    },
    {
      abr: 'MAGYA',
      name: 'Microbiología Agrícola y Ambiental',
      description: 'Nuestro enfoque es el conocimiento aplicable a la actividad agrícola, conservación, ' +
        'educación, recuperación y aprovechamiento ambiental sostenible de los recursos ' +
        'naturales y la biodiversidad.',
      image: 'group_slide_magya.png',
      modal: 'modalMagya'
    },
    {
      abr: 'CINBIOS',
      name: 'Ciencia e Investigación Biológica en Salud',
      description: 'Nuestro enfoque es la investigación en bioindicadores, epidemiología, enfermedades ' +
        'infecciosas, resistencia microbiana, y el uso de la bioinformática para el análisis ' +
        'de datos ómicos.',
      image: 'group_slide_cinbios.png',
      modal: 'modalCinbios'
    },
    {
      abr: 'BIOTECGEN',
      name: 'Biotecnología y Genotoxicidad Ambiental',
      description: 'Nuestro enfoque es investigación en el campo de las ciencias biológicas y ' +
        'aprovechamiento de la biodiversidad en Colombia, desarrollador de productos y ' +
        'servicios biotecnológicos',
      image: 'group_slide_biotecgen.png',
      modal: 'modalBiotecgen'
    },
    {
      abr: 'ZOOBIOS',
      name: '-',
      description: 'Nuestro enfoque es la investigación en nutrición animal, epidemiología, enfermedades ' +
        'infecciosas, reproducción y mejoramiento animal que aporten soluciones a los ' +
        'problemas de la región y del país',
      image: 'group_slide_zoobios.png',
      modal: 'modalZoobios'
    }
  ];

  ngOnInit() {
    this.langSubscription = this.languageService.currentLanguage$.subscribe(
      () => {
        // Trigger change detection when language changes
      }
    );
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }
}
