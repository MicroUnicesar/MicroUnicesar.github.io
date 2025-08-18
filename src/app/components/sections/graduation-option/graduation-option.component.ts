import {Component, OnInit, AfterViewInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '../../../shared/pipes/translate-pipe';
import {LanguageService} from '../../../services/language';
import {GraduationOptionModal} from '../../modals/graduation-option-modal/graduation-option-modal';

@Component({
  selector: 'app-graduation-option',
  standalone: true,
  imports: [CommonModule, GraduationOptionModal, TranslatePipe],
  templateUrl: './graduation-option.component.html',
  styleUrls: ['./graduation-option.component.scss']
})

export class GraduationOptionComponent implements OnInit, AfterViewInit {

  graduation_options = [
    {
      icon: 'bi-mortarboard',
      name: 'Primer Semestre de Posgrado',
      description: 'Cursa y aprueba el primer semestre académico de posgrado propio de la institución',
      modal: 'modalPosgrado'
    },
    {
      icon: 'bi-award',
      name: 'Diplomado de Actualización',
      description: 'Cursa y aprueba un diplomado de actualización y/o profundización en microbiología',
      modal: 'modalDiplomado'
    },
    {
      icon: 'bi-star',
      name: 'Excelencia Académica',
      description: 'Demostrar excelencia académica con promedio igual o superior a 4.5 o resultado Saber Pro',
      modal: 'modalExcelencia'
    },
    {
      icon: 'bi-building',
      name: 'Pasantía de Investigación',
      description: 'Realizar pasantía de investigación en un centro o grupo de investigación especializado',
      modal: 'modalPasantia'
    },
    {
      icon: 'bi-journal-text',
      name: 'Artículo Científico',
      description: 'Publicar artículo científico en revista indexada como resultado de una investigación',
      modal: 'modalArticulo'
    },
    {
      icon: 'bi-book',
      name: 'Trabajo de Grado',
      description: 'Desarrolla y sustenta un trabajo de grado de investigación en microbiología',
      modal: 'modalTrabajo'
    },
    {
      icon: 'bi-lightbulb',
      name: 'Productos de Nuevo Conocimiento',
      description: 'Genera productos de investigación reconocidos por MinCiencias que generan nuevo conocimiento',
      modal: 'modalProductos'
    },
    {
      icon: 'bi-search',
      name: 'Trabajos Investigativos',
      description: 'Desarrolla trabajos investigativos especializados en diferentes áreas de la microbiología',
      modal: 'modalTrabajos'
    }
  ];

  resources = [
    {
      icon: 'bi-filetype-pdf',
      link: 'https://ant.unicesar.edu.co/index.php/en/normatividad/doc_download/10830-acuerdo-no-005-del-12-de-febrero-de-2025-opciones-de-grado-facultad-ciencias-basicas',
      name: 'Acuerdo 005 de 12 de febrero de 2025',
      file: 'acuerdo_005_2025.pdf'
    },
    {
      icon: 'bi-filetype-pdf',
      link: 'https://unicesareduco-my.sharepoint.com/personal/comiteinvestigacionmicro_unicesar_edu_co/_layouts/15/download.aspx?SourceUrl=%2Fpersonal%2Fcomiteinvestigacionmicro%5Funicesar%5Fedu%5Fco%2FDocuments%2F01%2E%20Comité%20de%20Investigación%2F07%2E%20Ruta%20de%20entrega%20de%20trabajos%20de%20grado%2Fproceso%5Fopciones%5Fde%5Fgrado%2Epdf',
      name: 'Ruta global para la selección de grado',
      file: 'proceso_opciones_de_grado.pdf'
    },
    {
      icon: 'bi-filetype-pdf',
      link: 'https://unicesareduco-my.sharepoint.com/personal/comiteinvestigacionmicro_unicesar_edu_co/_layouts/15/download.aspx?SourceUrl=%2Fpersonal%2Fcomiteinvestigacionmicro%5Funicesar%5Fedu%5Fco%2FDocuments%2F01%2E%20Comité%20de%20Investigación%2F13%2E%20Formatos%2FFormatos%20publicos%2F01%5Fsolicitud%5Fopcion%5Fde%5Fgrado%2Epdf',
      name: 'Formato solicitud opción de grado',
      file: '01_solicitud_opcion_de_grado.pdf'
    },
    {
      icon: 'bi-file-earmark-word',
      link: 'https://unicesareduco-my.sharepoint.com/personal/comiteinvestigacionmicro_unicesar_edu_co/_layouts/15/download.aspx?UniqueId=%7Bc8c9ef47%2D9304%2D4ef7%2Da4e7%2D5086995db2f2%7D',
      name: 'Formato anteproyecto de trabajo de grado',
      file: '04_guia_anteproyecto.dotx'
    },
    {
      icon: 'bi-file-earmark-word',
      link: 'https://unicesareduco-my.sharepoint.com/personal/comiteinvestigacionmicro_unicesar_edu_co/_layouts/15/download.aspx?UniqueId=%7Bd91d7709%2Df351%2D4703%2Dac88%2D80839dac097d%7D',
      name: 'Formato trabajo de grado final',
      file: '05_guia_proyecto_finalizado.dotx'
    },
    {
      icon: 'bi-send-arrow-down',
      link: 'https://forms.office.com/r/s3CWsmRAji',
      name: 'Formulario web de selección de opción de grado',
      file: ''
    }
  ];

  cicles = [
    {
      number: '1',
      reception_from: '15 de agosto de 2025',
      reception_to: '19 de agosto de 2025',
      session: '21 de agosto de 2025',
      eval_from: '22 de agosto de 2025',
      eval_to: '02 de septiembre de 2025',
      answer: '06 de septiembre de 2025'
    },
    {
      number: '2',
      reception_from: '20 de agosto de 2025',
      reception_to: '02 de septiembre de 2025',
      session: '04 de septiembre de 2025',
      eval_from: '05 de septiembre de 2025',
      eval_to: '16 de septiembre de 2025',
      answer: '20 de septiembre de 2025'
    },
    {
      number: '3',
      reception_from: '03 de septiembre de 2025',
      reception_to: '16 de septiembre de 2025',
      session: '18 de septiembre de 2025',
      eval_from: '19 de septiembre de 2025',
      eval_to: '30 de septiembre de 2025',
      answer: '04 de octubre de 2025'
    },
    {
      number: '4',
      reception_from: '17 de septiembre de 2025',
      reception_to: '30 de septiembre de 2025',
      session: '02 de octubre de 2025',
      eval_from: '03 de octubre de 2025',
      eval_to: '14 de octubre de 2025',
      answer: '18 de octubre de 2025'
    },
    {
      number: '5',
      reception_from: '01 de octubre de 2025',
      reception_to: '14 de octubre de 2025',
      session: '16 de octubre de 2025',
      eval_from: '17 de octubre de 2025',
      eval_to: '28 de octubre de 2025',
      answer: '02 de noviembre de 2025'
    },
    {
      number: '6',
      reception_from: '15 de octubre de 2025',
      reception_to: '28 de octubre de 2025',
      session: '30 de octubre de 2025',
      eval_from: '31 de octubre de 2025',
      eval_to: '11 de noviembre de 2025',
      answer: '15 de noviembre de 2025'
    }
  ];

  private languageService = inject(LanguageService);
  private currentIndex = 0;
  private totalCards = this.graduation_options.length;
  private visibleCards = window.innerWidth > 1180 ? 3 : 1;
  private maxIndex = this.totalCards - this.visibleCards;

  ngOnInit(): void {
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
      const totalCards = this.graduation_options.length;
      const maxIndex = Math.max(0, totalCards - visibleCardsPerView);

      const updateCarousel = () => {
        let visibleCardsPerView = 3;

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
