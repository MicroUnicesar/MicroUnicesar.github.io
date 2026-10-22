import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { GraduationOptionComponent } from './graduation-option.component';
import { flushData, pageTestProviders } from '../../../../shared/testing/page-spec.helpers';
import { OPTIONS, RESOURCES } from '../../../../shared/testing/graduation.fixtures';
import { GraduationData } from '../../../../shared/models/graduation-data.model';

const t = (es: string) => ({ es, en: `${es} (en)` });
const DATA: GraduationData = {
  options: OPTIONS,
  resourceIds: ['formato-ficticio'],
  cicles: [{ number: '1', reception_from: t('a'), reception_to: t('b'), session: t('c'), eval_from: t('d'), eval_to: t('e'), answer: t('f') }],
  faqs: [
    { id: 'uno', question: t('¿Pregunta uno?'), answer: t('Respuesta uno') },
    { id: 'dos', question: t('¿Pregunta dos?'), steps: [t('Paso A'), t('Paso B')] }
  ]
};

describe('GraduationOptionComponent', () => {
  let fixture: ComponentFixture<GraduationOptionComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [GraduationOptionComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(GraduationOptionComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ 'graduation-options': DATA, resources: RESOURCES });
    fixture.detectChanges();
  });

  it('shows one h1 and sets the page title and description', () => {
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(TestBed.inject(Title).getTitle()).toContain('nav-options');
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('seo-grade-list-description');
  });

  it('shows a card per option linking to its own page, with the number of steps', () => {
    const cards = Array.from(element.querySelectorAll('a.option-card'));
    expect(cards.map(card => card.getAttribute('href'))).toEqual([
      '/students/graduation-options/opcion-completa', '/students/graduation-options/opcion-minima'
    ]);
    expect(cards[0].textContent).toContain('Opción completa');
    expect(cards[0].textContent).toContain('Resumen de la opción completa');
    expect(cards[0].textContent).toContain('3');
    expect(cards[1].textContent).toContain('0');
  });

  it('has no modal or Bootstrap JS hooks left', () => {
    expect(element.querySelector('[data-bs-toggle]')).toBeNull();
    expect(element.querySelector('.modal')).toBeNull();
  });

  it('keeps the general procedure with its 7 steps, the resources and the schedule', () => {
    expect(element.querySelectorAll('#procedure ol > li').length).toBe(7);
    const resource = element.querySelector('#procedure a[href="https://example.test/formato.pdf"]');
    expect(resource?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(element.querySelectorAll('#schedule .card').length).toBe(1);
  });

  it('shows the FAQ as an accordion that opens, with the committee contact', () => {
    const buttons = element.querySelectorAll('#faq button.accordion-button');
    expect(buttons.length).toBe(2);
    expect(element.querySelector('#faq')?.textContent).not.toContain('Respuesta uno');
    (buttons[0] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect((buttons[0] as HTMLButtonElement).getAttribute('aria-expanded')).toBe('true');
    expect(element.querySelector('#faq')?.textContent).toContain('Respuesta uno');
    expect(element.querySelector('#faq a[href="mailto:comiteinvestigacionmicro@unicesar.edu.co"]')).not.toBeNull();
  });

  it('has no fixed Spanish text left in the template', () => {
    for (const phrase of ['Procedimiento General', 'Pasos a seguir', 'Recursos disponibles', 'Cronograma de recepción', 'Más información']) {
      expect(element.textContent).withContext(phrase).not.toContain(phrase);
    }
  });
});
