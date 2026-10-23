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
    fixture.componentRef.setInput('sectionId', 'research');
    fixture.detectChanges();

    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(element.querySelector('a.landing-card')?.getAttribute('href')).toBe('/research/groups');
    expect(element.querySelector('a[href="/research/projects"]')).toBeNull();
    expect(element.querySelectorAll('.landing-card-disabled .badge').length).toBe(2);
  });

  it('turns /students into a hub with graduation, wellness, resources and seedbeds', () => {
    fixture.componentRef.setInput('sectionId', 'students');
    fixture.detectChanges();

    const hrefs = Array.from(element.querySelectorAll('a.landing-card')).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/students/graduation-options', '/students/wellness', '/students/resources', '/research/labs']);
    // Movilidad no tiene contenido real: no hay tarjeta. Las preguntas frecuentes aún no tienen respuestas.
    expect(element.querySelectorAll('.landing-card-disabled').length).toBe(1);
    expect(element.querySelector('a[href="/students/exchange"]')).toBeNull();
  });

  it('shows every card as "coming soon" when nothing is ready', () => {
    fixture.componentRef.setInput('sectionId', 'people');
    fixture.detectChanges();

    expect(element.querySelectorAll('a.landing-card').length).toBe(1);
    expect(element.querySelectorAll('.landing-card-disabled').length).toBe(2);
  });

  it('shows only the cards, without its own heading, when used under other content', () => {
    fixture.componentRef.setInput('sectionId', 'research');
    fixture.componentRef.setInput('showHeader', false);
    fixture.componentRef.setInput('exclude', ['/research/groups']);
    fixture.detectChanges();

    expect(element.querySelector('h1')).toBeNull();
    const hrefs = Array.from(element.querySelectorAll('a.landing-card')).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/research/labs', '/research/lines']);
    expect(element.querySelector('a[href="/research/groups"]')).toBeNull();
    expect(element.querySelectorAll('.landing-card-disabled').length).toBe(2);
  });

  it('keeps its heading and every card when the router leaves the optional inputs undefined', () => {
    fixture.componentRef.setInput('sectionId', 'research');
    fixture.componentRef.setInput('showHeader', undefined);
    fixture.componentRef.setInput('exclude', undefined);
    fixture.detectChanges();

    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(element.querySelector('a[href="/research/groups"]')).not.toBeNull();
  });
});
