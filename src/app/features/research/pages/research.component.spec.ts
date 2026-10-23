import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { ResearchComponent } from './research.component';
import { flushData, pageTestProviders } from '../../../shared/testing/page-spec.helpers';
import { GROUPS } from '../../../shared/testing/research.fixtures';

describe('ResearchComponent', () => {
  let fixture: ComponentFixture<ResearchComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ResearchComponent], providers: pageTestProviders() });
    // Sin animación, la diapositiva cambia al instante (en el navegador la transición dura ~1 s).
    TestBed.inject(NgbCarouselConfig).animation = false;
    fixture = TestBed.createComponent(ResearchComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ 'research-groups': GROUPS });
    fixture.detectChanges();
  });

  const activeIndex = () => Array.from(element.querySelectorAll('.groups-carousel .carousel-item')).findIndex(i => i.classList.contains('active'));
  const click = (selector: string) => {
    (element.querySelector(selector) as HTMLElement).click();
    fixture.detectChanges();
  };

  it('has a single h1 and a banner with the intro slide plus one slide per group', () => {
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(element.querySelectorAll('.groups-carousel .carousel-item').length).toBe(1 + GROUPS.length);
    expect(element.querySelector('.groups-banner')?.getAttribute('aria-label')).toBe('nav-research-groups');
  });

  it('each group slide links to the page of that group', () => {
    const hrefs = Array.from(element.querySelectorAll('.groups-carousel a.btn')).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/research/groups/grupo-completo', '/research/groups/grupo-vacio']);
  });

  it('moves between slides with the arrows, which have translated hidden labels', () => {
    expect(activeIndex()).toBe(0);
    expect(element.querySelector('.carousel-control-next .visually-hidden')?.textContent).toBe('carousel-next');
    click('.carousel-control-next');
    expect(activeIndex()).toBe(1);
    click('.carousel-control-prev');
    expect(activeIndex()).toBe(0);
  });

  it('shows the cards to semilleros and lines under the banner, without repeating groups', () => {
    const hrefs = Array.from(element.querySelectorAll('a.landing-card')).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['/research/labs', '/research/lines']);
    const banner = element.querySelector('.groups-banner')!;
    const firstCard = element.querySelector('.landing-card')!;
    expect(banner.compareDocumentPosition(firstCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('no longer holds the seedbed text or the full list of lines', () => {
    expect(element.textContent).not.toContain('research-seedbeds');
    expect(element.querySelector('#semilleros')).toBeNull();
    expect(element.querySelector('.research-card')).toBeNull();
  });
});
