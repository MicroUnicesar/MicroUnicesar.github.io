import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FooterComponent } from './footer.component';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../testing/language.service.stub';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([]), { provide: LanguageService, useValue: new LanguageServiceStub() }]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('links the new sections', () => {
    const hrefs = Array.from(element.querySelectorAll('nav a')).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(jasmine.arrayContaining([
      '/program', '/program/labs', '/research', '/people', '/students',
      '/students/graduation-options', '/students/wellness', '/news', '/events', '/contact'
    ]));
    expect(hrefs).not.toContain('/home');
  });

  it('shows the current year', () => {
    expect(element.textContent).toContain(`© ${new Date().getFullYear()}`);
  });
});
