import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ComingSoonComponent } from './coming-soon.component';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../testing/language.service.stub';

describe('ComingSoonComponent', () => {
  let fixture: ComponentFixture<ComingSoonComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComingSoonComponent],
      providers: [provideRouter([]), { provide: LanguageService, useValue: new LanguageServiceStub() }]
    }).compileComponents();
    fixture = TestBed.createComponent(ComingSoonComponent);
    element = fixture.nativeElement;
  });

  it('shows one heading with the section title and a link back to the section', () => {
    fixture.componentRef.setInput('titleKey', 'nav-program-about');
    fixture.componentRef.setInput('sectionId', 'program');
    fixture.detectChanges();

    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(element.querySelector('h1')?.textContent).toContain('nav-program-about');
    expect(element.textContent).toContain('coming-soon-title');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/program');
  });

  it('goes back to home when no section is given', () => {
    fixture.componentRef.setInput('titleKey', 'nav-faq');
    fixture.detectChanges();
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/home');
  });
});
