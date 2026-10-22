import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/pipes/translate-pipe';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslatePipe, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private languageService = inject(LanguageService);
  private fb = inject(FormBuilder);

  readonly programEmail = 'microbiologia@unicesar.edu.co';
  /** Claves i18n de los asuntos; el correo se redacta con el texto en el idioma activo. */
  readonly subjectOptions = [
    'contact-subject-grade',
    'contact-subject-groups',
    'contact-subject-advice',
    'contact-subject-meeting',
    'contact-subject-other'
  ];

  contactForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

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

    const t = (key: string) => this.languageService.translate(key);
    const mailtoLink = `mailto:${this.programEmail}?subject=${encodeURIComponent(t(formData.asunto))}&body=${encodeURIComponent(
      `${t('contact-mail-name')}: ${formData.nombre} ${formData.apellido}\n` +
      `${t('contact-mail-email')}: ${formData.email}\n\n` +
      `${t('contact-message')}:\n${formData.mensaje}`
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
      return this.languageService.translate('form-required');
    }
    if (field?.hasError('email')) {
      return this.languageService.translate('form-email-invalid');
    }
    if (field?.hasError('minlength')) {
      return this.languageService.translate('form-min-length', { n: field.errors?.['minlength'].requiredLength });
    }
    return '';
  }
}
