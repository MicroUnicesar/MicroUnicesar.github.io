import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SectionLandingComponent } from './section-landing.component';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../testing/language.service.stub';

describe('SectionLandingComponent', () => {
  let fixture: ComponentFixture<SectionLandingComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionLandingComponent],
      providers: [provideRouter([]), { provide: LanguageService, useValue: new LanguageServiceStub() }]
    }).compileComponents();
    fixture = TestBed.createComponent(SectionLandingComponent);
    element = fixture.nativeElement;
  });

  it('links ready pages and shows the rest as "coming soon" without a link', () => {
    fixture.componentRef.setInput('sectionId', 'program');
    fixture.detectChanges();

    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(element.querySelector('a.landing-card')?.getAttribute('href')).toBe('/program/labs');
    expect(element.querySelector('a[href="/program/about"]')).toBeNull();
    expect(element.querySelectorAll('.landing-card-disabled .badge').length).toBe(1);
  });

  it('turns /students into a hub with graduation, wellness, resources and seedbeds', () => {
    fixture.componentRef.setInput('sectionId', 'students');
    fixture.detectChanges();

    const hrefs = Array.from(element.querySelectorAll('a.landing-card')).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/students/graduation-options', '/students/wellness', '/students/resources', '/program/labs']);
    // Movilidad no tiene contenido real: no hay tarjeta. Las preguntas frecuentes aún no tienen respuestas.
    expect(element.querySelectorAll('.landing-card-disabled').length).toBe(1);
    expect(element.querySelector('a[href="/students/exchange"]')).toBeNull();
  });

  it('shows every card as "coming soon" when nothing is ready', () => {
    fixture.componentRef.setInput('sectionId', 'research');
    fixture.detectChanges();

    expect(element.querySelectorAll('a.landing-card').length).toBe(2);
    expect(element.querySelectorAll('.landing-card-disabled').length).toBe(2);
  });
});
