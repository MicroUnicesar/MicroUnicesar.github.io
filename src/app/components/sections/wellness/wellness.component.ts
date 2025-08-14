import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../services/language';

@Component({
  selector: 'app-wellness',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './wellness.component.html',
  styleUrl: './wellness.component.scss'
})
export class WellnessComponent implements OnInit, AfterViewInit {
  private languageService = inject(LanguageService);

  information = [
    {
      icon: 'fa-comments',
      name: 'Consejeria',
      description: 'La consejería de Bienestar Universitario ofrece acompañamiento personalizado para apoyar ' +
        'el desarrollo académico, emocional y social de los estudiantes, promoviendo su bienestar integral y ' +
        'una vida universitaria equilibrada.',
    },
    {
      icon: 'fa-circle-exclamation',
      name: 'Protocolo en caso de maltrato, acoso, y discriminación',
      description: 'La institución cuenta con un protocolo de actuación para prevenir, atender y sancionar ' +
        'situaciones de maltrato, acoso y discriminación. Ante cualquier caso, el afectado o testigo debe reportarlo ' +
        'de forma confidencial a Bienestar Universitario o a la Oficina de Atención a la Comunidad. Se garantizará ' +
        'la recepción inmediata de la denuncia, la activación de medidas de protección, la investigación imparcial ' +
        'y la orientación psicológica y jurídica correspondiente, respetando la dignidad, la privacidad y los ' +
        'derechos de todas las partes involucradas.',
    },
    {
      icon: 'fa-person-chalkboard',
      name: 'Representante de estudiantes',
      description: 'El representante de estudiantes es el vocero oficial del cuerpo estudiantil ante los órganos ' +
        'de gobierno y decisión académica de la institución. Su función principal es canalizar las inquietudes, ' +
        'propuestas y necesidades de sus compañeros, fomentando la participación activa, el diálogo constructivo ' +
        'y la búsqueda de soluciones que contribuyan al fortalecimiento de la vida universitaria.',
    },
    {
      icon: 'fa-clipboard-question',
      name: 'Saber Pro',
      description: 'El examen Saber Pro es una prueba de carácter nacional aplicada por el ICFES que evalúa las ' +
        'competencias genéricas y específicas de los estudiantes de educación superior en etapa avanzada de su ' +
        'formación. Su propósito es medir la calidad de la educación y servir como referencia para el mejoramiento ' +
        'académico, la proyección profesional y la toma de decisiones en políticas educativas.',
    },
    {
      icon: 'fa-file-arrow-down',
      name: 'Procesos y formatos diferentes a investigación',
      description: 'Incluyen todos aquellos trámites, procedimientos y documentos institucionales que no están ' +
        'directamente relacionados con proyectos de investigación, tales como solicitudes administrativas, ' +
        'prácticas académicas, actividades de extensión, bienestar universitario, movilidad estudiantil y ' +
        'participación en eventos. Estos procesos cuentan con formatos específicos que facilitan su gestión, ' +
        'seguimiento y archivo, garantizando transparencia y eficiencia en la administración universitaria.',
    }
  ];

  ngOnInit(): void {
    // Initialize component logic here
  }

  ngAfterViewInit(): void {
    // View initialization logic here
  }
}
