import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsComponent } from './news.component';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../../shared/testing/language.service.stub';
import { flushData, pageTestProviders } from '../../../shared/testing/page-spec.helpers';
import { NEWS } from '../../../shared/testing/i18n.fixtures';

describe('NewsComponent', () => {
  let fixture: ComponentFixture<NewsComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [NewsComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(NewsComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ news: NEWS });
    fixture.detectChanges();
  });

  const titles = () => Array.from(element.querySelectorAll('h2.card-title')).map(h => h.textContent?.trim());

  it('shows one h1 and the news from the most recent to the oldest', () => {
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(titles()).toEqual(['Noticia reciente', 'Noticia destacada', 'Noticia vieja']);
  });

  it('shows each date in a time element, written in the active language', () => {
    const first = element.querySelector('time');
    expect(first?.getAttribute('datetime')).toBe('2025-10-01');
    expect(first?.textContent?.trim()).toBe('1 de octubre de 2025');
  });

  it('switches to English when the language changes (OnPush)', async () => {
    await (TestBed.inject(LanguageService) as unknown as LanguageServiceStub).setLanguage('en');
    fixture.detectChanges();
    expect(titles()).toEqual(['Recent news', 'Highlighted news', 'Old news']);
    expect(element.querySelector('time')?.textContent?.trim()).toBe('October 1, 2025');
  });

  it('uses decorative images (the title is already next to them)', () => {
    for (const image of Array.from(element.querySelectorAll('img'))) {
      expect(image.getAttribute('alt')).toBe('');
    }
  });
});
