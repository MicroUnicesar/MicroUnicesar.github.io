import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'app-more-info',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: './more-info.component.html',
  styleUrl: './more-info.component.scss'
})
export class MoreInfoComponent {
  private languageService = inject(LanguageService);
  private fb = inject(FormBuilder);

  contactForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  faqs = [
    {
      id: 'One',
      question: '¿En qué puede trabajar un microbiólogo?',
      answer: 'Dado que es un requisito de grado tomar una opción de grado no es posible renunciar tu opción de ' +
        'grado. Sin embargo, el acuerdo 005 de 12 de febrero de 2025 establece que es posible realizar el cambio ' +
        'de opción de grado por una unica vez. Es importante que te mantengas informado sobre las fechas para cada ' +
        'ciclo y requisitos específicos si deseas realizar el cambio de opción de grado.'
    },
    {
      id: 'Two',
      question: '¿Qué requisitos necesito para graduarme?',
      answer: 'El comité de investigación del programa y de la facultad revisará las solicitudes en la sesión ' +
        'programada según ciclo. Revisa el cronograma de recepción y evaluación de solicitudes para conocer las ' +
        'fechas específicas según el ciclo en el que enviaste tu solicitud. Una vez evaluada tu solicitud, ' +
        'recibirás una respuesta formal por correo electrónico indicando si tu opción de grado ha sido aprobada o ' +
        'si se requiere información adicional.'
    },
    {
      id: 'Three',
      question: '¿Necesito acreditar inglés?',
      answer: 'Si, puedes hacerlo. Sin embargo, es importante que tengas en cuenta que esto debe ser informado al ' +
        'comité de investigación del programa y de la facultad. Cualquier cambio en el título u objetivos debe ser ' +
        'justificado y aprobado por el comité para asegurar que se mantenga la coherencia con los requisitos ' +
        'académicos y de investigación del programa. Te recomendamos que te comuniques con el comité a través del ' +
        'correo electrónico oficial para discutir cualquier modificación que desees realizar.'
    },
    {
      id: 'Four',
      question: '¿Hay un puntaje mínimo en las pruebas Saber Pro?',
      answer: `Una vez hayas finalizado tu trabajo de grado, debes seguir estos pasos: <ol>
            <li>Revisa que tu trabajo cumpla con todos los requisitos establecidos en el acuerdo 005 de 12 de febrero de 2025.</li>
            <li>Prepara tu trabajo de grado según las normas de presentación y formato requeridas por el programa.</li>
            <li>Envia el formulario web de solicitud de opción de grado, adjuntando tu trabajo de grado y cualquier documento adicional requerido. Revisa la sección opciones de grado para mas detalles.</li>
            <li>Espera la respuesta por parte del comité de investigación del programa y de la facultad. Recibirás una notificación por correo electrónico indicando si tu trabajo ha sido aprobado y los pasos a seguir para la sustentación.</li>
          </ol>`
    },
    {
      id: 'Five',
      question: '¿Donde puedo realizar mis practicas?',
      answer: `Una vez hayas finalizado tu trabajo de grado, debes seguir estos pasos: <ol>
            <li>Revisa que tu trabajo cumpla con todos los requisitos establecidos en el acuerdo 005 de 12 de febrero de 2025.</li>
            <li>Prepara tu trabajo de grado según las normas de presentación y formato requeridas por el programa.</li>
            <li>Envia el formulario web de solicitud de opción de grado, adjuntando tu trabajo de grado y cualquier documento adicional requerido. Revisa la sección opciones de grado para mas detalles.</li>
            <li>Espera la respuesta por parte del comité de investigación del programa y de la facultad. Recibirás una notificación por correo electrónico indicando si tu trabajo ha sido aprobado y los pasos a seguir para la sustentación.</li>
          </ol>`
    }
  ]

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', Validators.required],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    const formData = this.contactForm.value;

    const mailtoLink = `mailto:microbiologia@unicesar.edu.co?subject=${encodeURIComponent(formData.asunto)}&body=${encodeURIComponent(
      `Nombre: ${formData.nombre} ${formData.apellido}\n` +
      `Email: ${formData.email}\n\n` +
      `Mensaje:\n${formData.mensaje}`
    )}`;
    window.location.href = mailtoLink;

    setTimeout(() => {
      this.isSubmitting = false;
      this.submitSuccess = true;
      this.contactForm.reset();
    }, 1000);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('email')) {
      return 'Email inválido';
    }
    if (field?.hasError('minlength')) {
      return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    }
    return '';
  }
}
