import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavigationComponent } from './navigation.component';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../testing/language.service.stub';

describe('NavigationComponent', () => {
  let fixture: ComponentFixture<NavigationComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [provideRouter([]), { provide: LanguageService, useValue: new LanguageServiceStub() }]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  const topLevelLabels = () =>
    Array.from(element.querySelectorAll('.navbar-nav > .nav-item > .nav-link'))
      .map(item => item.textContent?.trim());

  it('lists the main sections in order', () => {
    expect(topLevelLabels()).toEqual([
      'nav-home', 'nav-program', 'nav-research', 'nav-people', 'nav-students', 'nav-news-events', 'nav-contact'
    ]);
  });

  it('renders dropdown toggles as buttons and the rest as links', () => {
    expect(element.querySelectorAll('button.dropdown-toggle').length).toBe(4);
    expect(element.querySelector('a.nav-link[href="/people"]')).not.toBeNull();
    expect(element.querySelector('a.nav-link[href="/contact"]')).not.toBeNull();
  });

  it('opens a dropdown with its pages and closes it with Escape', () => {
    const toggle = element.querySelector('button.dropdown-toggle') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');

    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const hrefs = Array.from(element.querySelectorAll('.dropdown-menu.show a')).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/program', '/program/labs']);

    toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('does not link pages that are not ready yet', () => {
    expect(element.querySelector('a[href="/program/about"]')).toBeNull();
    expect(element.querySelector('a[href="/students/faq"]')).toBeNull();
  });

  it('toggles the mobile menu and exposes its state', () => {
    const toggler = element.querySelector('.navbar-toggler') as HTMLButtonElement;
    expect(toggler.getAttribute('aria-expanded')).toBe('false');
    toggler.click();
    fixture.detectChanges();
    expect(toggler.getAttribute('aria-expanded')).toBe('true');
  });
});
