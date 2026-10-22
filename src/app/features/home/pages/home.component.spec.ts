import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../../shared/testing/language.service.stub';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting(), { provide: LanguageService, useValue: new LanguageServiceStub() }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const element = () => fixture.nativeElement as HTMLElement;

  it('has a single h1 with the department name', () => {
    expect(element().querySelectorAll('h1').length).toBe(1);
    expect(element().querySelector('h1')?.textContent).toContain('department');
    expect(element().querySelector('h1')?.textContent).toContain('department-name');
  });

  it('links the hero buttons to the program and to the research groups', () => {
    const hrefs = Array.from(element().querySelectorAll('.hero-buttons a')).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/program', '/research/groups']);
  });

  it('shows four blocks with an image towards research, people, students and impact', () => {
    const blocks = Array.from(element().querySelectorAll('a.home-block'));
    expect(blocks.map(block => block.getAttribute('href'))).toEqual(['/research', '/people', '/students', '/program/impact']);
    for (const block of blocks) {
      const image = block.querySelector('img');
      expect(image?.getAttribute('src')).toMatch(/^assets\/images\/home\/.+\.jpg$/);
      expect(image?.getAttribute('alt')).toBe('');
      expect(block.querySelector('h2')?.textContent?.trim().length).toBeGreaterThan(0);
    }
  });

  it('highlights the four blocks with the shared highlighted-card style', () => {
    const blocks = Array.from(element().querySelectorAll('a.home-block'));
    expect(blocks.length).toBe(4);
    for (const block of blocks) {
      expect(block.classList.contains('card-highlight')).toBeTrue();
    }
  });

  it('keeps the highlights, news and events sections', () => {
    const text = element().textContent ?? '';
    expect(text).toContain('highlights');
    expect(text).toContain('latest-news');
    expect(text).toContain('events');
    expect(element().querySelector('a[href="/news"]')).not.toBeNull();
    expect(element().querySelector('a[href="/events"]')).not.toBeNull();
  });

  it('has no fixed Spanish text in the template', () => {
    const fixed = ['Ver todas', 'Todos los eventos', 'Fecha límite', 'Registro:', 'Nuestras áreas', 'Acreditación de Calidad'];
    for (const phrase of fixed) {
      expect(element().textContent).withContext(phrase).not.toContain(phrase);
    }
  });
});
