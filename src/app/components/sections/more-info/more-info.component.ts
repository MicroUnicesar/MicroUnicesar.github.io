import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../services/language';

@Component({
  selector: 'app-more-info',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './more-info.component.html',
  styleUrl: './more-info.component.scss'
})
export class MoreInfoComponent {
  private languageService = inject(LanguageService);

  faqs = [
    {
      id: 'One',
      question: '¿Puedo renunciar a mi opción de grado?',
      answer: 'Dado que es un requisito de grado tomar una opción de grado no es posible renunciar tu opción de ' +
        'grado. Sin embargo, el acuerdo 005 de 12 de febrero de 2025 establece que es posible realizar el cambio ' +
        'de opción de grado por una unica vez. Es importante que te mantengas informado sobre las fechas para cada ' +
        'ciclo y requisitos específicos si deseas realizar el cambio de opción de grado.'
    },
    {
      id: 'Two',
      question: 'Ya envié la solicitud usando el formulario ¿cuando recibo respuesta?',
      answer: 'El comité de investigación del programa y de la facultad revisará las solicitudes en la sesión ' +
        'programada según ciclo. Revisa el cronograma de recepción y evaluación de solicitudes para conocer las ' +
        'fechas específicas según el ciclo en el que enviaste tu solicitud. Una vez evaluada tu solicitud, ' +
        'recibirás una respuesta formal por correo electrónico indicando si tu opción de grado ha sido aprobada o ' +
        'si se requiere información adicional.'
    },
    {
      id: 'Three',
      question: '¿Puedo cambiar el título u objetivos de mi trabajo de grado?',
      answer: 'Si, puedes hacerlo. Sin embargo, es importante que tengas en cuenta que esto debe ser informado al ' +
        'comité de investigación del programa y de la facultad. Cualquier cambio en el título u objetivos debe ser ' +
        'justificado y aprobado por el comité para asegurar que se mantenga la coherencia con los requisitos ' +
        'académicos y de investigación del programa. Te recomendamos que te comuniques con el comité a través del ' +
        'correo electrónico oficial para discutir cualquier modificación que desees realizar.'
    },
    {
      id: 'Four',
      question: 'Ya finalicé mi trabajo de grado ¿Qué debo hacer?',
      answer: `Una vez hayas finalizado tu trabajo de grado, debes seguir estos pasos: <ol>
            <li>Revisa que tu trabajo cumpla con todos los requisitos establecidos en el acuerdo 005 de 12 de febrero de 2025.</li>
            <li>Prepara tu trabajo de grado según las normas de presentación y formato requeridas por el programa.</li>
            <li>Envia el formulario web de solicitud de opción de grado, adjuntando tu trabajo de grado y cualquier documento adicional requerido. Revisa la sección opciones de grado para mas detalles.</li>
            <li>Espera la respuesta por parte del comité de investigación del programa y de la facultad. Recibirás una notificación por correo electrónico indicando si tu trabajo ha sido aprobado y los pasos a seguir para la sustentación.</li>
          </ol>`
    }
  ]
}
