import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { FaqComponent } from './faq.component';
import { LanguageService } from '../../../../core/services/language.service';
import { LanguageServiceStub } from '../../../../shared/testing/language.service.stub';
import { Faq } from '../../../../shared/models/faq.model';

// Datos ficticios, solo para pruebas.
const faq = (id: string, answer: string): Faq => ({
  id,
  question: { es: `Pregunta ${id}`, en: `Question ${id}` },
  answer: { es: answer, en: answer }
});

describe('FaqComponent', () => {
  let fixture: ComponentFixture<FaqComponent>;
  let http: HttpTestingController;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqComponent],
      providers: [
        provideRouter([]), provideHttpClient(), provideHttpClientTesting(),
        { provide: LanguageService, useValue: new LanguageServiceStub() }
      ]
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(FaqComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  const respond = (faqs: Faq[]) => {
    http.expectOne('assets/data/faqs.json').flush(faqs);
    fixture.detectChanges();
  };

  it('shows "coming soon" while no question has a real answer', () => {
    respond([faq('a', 'TODO_CONTENIDO'), faq('b', 'TODO_CONTENIDO')]);
    expect(element.querySelector('app-coming-soon')).not.toBeNull();
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(element.textContent).not.toContain('Pregunta a');
  });

  it('shows only the answered questions', () => {
    respond([faq('a', 'TODO_CONTENIDO'), faq('b', 'Respuesta b')]);
    expect(element.querySelector('app-coming-soon')).toBeNull();
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(element.textContent).toContain('Pregunta b');
    expect(element.textContent).not.toContain('Pregunta a');
  });
});
