import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResearchLabsComponent } from './labs.component';
import { flushData, pageTestProviders } from '../../../../shared/testing/page-spec.helpers';
import { LINES } from '../../../../shared/testing/research.fixtures';
import { Lab } from '../../../../shared/models/lab.model';

// Datos ficticios, solo para pruebas.
const t = (es: string) => ({ es, en: `${es} (en)` });
const lab = (id: string, isSemillero: boolean, piId?: string): Lab => ({
  id, abr: id.toUpperCase(), name: t(`Lab ${id}`), description: { es: 'TODO_CONTENIDO', en: 'TODO_CONTENIDO' },
  researchLineIds: ['linea-1'], isSemillero, pi: `Responsable ${id}`, piId, contact: `${id}@example.test`, projectIds: []
});
const LABS: Lab[] = [lab('a', true, 'persona-a'), lab('b', false), lab('c', true)];

describe('ResearchLabsComponent', () => {
  let fixture: ComponentFixture<ResearchLabsComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ResearchLabsComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(ResearchLabsComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ labs: LABS, 'research-lines': LINES });
    fixture.detectChanges();
  });

  const titles = () => Array.from(element.querySelectorAll('.card h2')).map(h => h.textContent?.trim());

  it('shows one h1 and only the labs flagged as semillero', () => {
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(titles()).toEqual(['Lab a', 'Lab c']);
  });

  it('explains what a seedbed is, with the supporting image before the cards', () => {
    expect(element.textContent).toContain('research-seedbeds-1');
    expect(element.textContent).toContain('research-seedbeds-2');
    const image = element.querySelector('.seedbeds-image')!;
    const firstCard = element.querySelector('.card')!;
    expect(image.compareDocumentPosition(firstCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('keeps the supporting image small so the seedbed cards stay in view', () => {
    const image = element.querySelector('.seedbeds-image') as HTMLImageElement;
    const style = getComputedStyle(image);
    // Sin esto la imagen se pinta a su tamaño natural (1792 px) y empuja las tarjetas fuera de la pantalla.
    // 14rem (224 px) en pantallas anchas y 12rem (192 px) en móvil: nunca "none".
    expect(parseFloat(style.maxHeight)).toBeGreaterThan(0);
    expect(parseFloat(style.maxHeight)).toBeLessThanOrEqual(224);
    expect(style.objectFit).toBe('cover');
    expect(image.getAttribute('width')).toBe('640');
    expect(image.getAttribute('height')).toBe('480');
    expect(image.getAttribute('src')).toBe('assets/images/research/semilleros_640.jpg');
    expect(image.getAttribute('alt')).toBe('');
    expect(image.getAttribute('loading')).toBe('lazy');
  });

  it('makes img-fluid effective across the site (Bootstrap images partial)', () => {
    const probe = document.createElement('img');
    probe.className = 'img-fluid';
    document.body.appendChild(probe);
    expect(getComputedStyle(probe).maxWidth).toBe('100%');
    probe.remove();
  });

  it('links the lead of each lab to their profile when they have one, and hides pending descriptions', () => {
    expect(element.querySelector('a[href="/people/faculty/persona-a"]')).not.toBeNull();
    expect(element.textContent).not.toContain('TODO_');
  });
});
