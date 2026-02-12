import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GraduationOption } from '../models/graduation-option.model';
import { GraduationResource } from '../models/graduation-resource.model';
import { GraduationCicle } from '../models/graduation-cicle.model';
import { GraduationFaq } from '../models/graduation-faq.model';

@Injectable({
  providedIn: 'root'
})
export class GraduationOptionsService {

  private graduationOptions: GraduationOption[] = [
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

  private graduationResources: GraduationResource[] = [
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

  private graduationCicles: GraduationCicle[] = [
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
  ]

  private graduationFaqs: GraduationFaq[] = [
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
      answer: [
        'Revisa que tu trabajo cumpla con todos los requisitos establecidos en el acuerdo 005 de 12 de febrero de 2025.',
        'Prepara tu trabajo de grado según las normas de presentación y formato requeridas por el programa.',
        'Envía el formulario web de solicitud de opción de grado, adjuntando tu trabajo de grado y cualquier documento adicional requerido.',
        'Espera la respuesta por parte del comité de investigación del programa y de la facultad.'
      ]
    }
  ]

  getGraduationOptions(): Observable<GraduationOption[]> {
    return of(this.graduationOptions);
  }

  getGraduationResources(): Observable<GraduationResource[]> {
    return of(this.graduationResources);
  }

  getGraduationCicles(): Observable<GraduationCicle[]> {
    return of(this.graduationCicles);
  }

  getGraduationFaqs(): Observable<GraduationFaq[]> {
    return of(this.graduationFaqs);
  }

}
