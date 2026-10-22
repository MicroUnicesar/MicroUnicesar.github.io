import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsComponent } from './events.component';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../../shared/testing/language.service.stub';
import { flushData, pageTestProviders } from '../../../shared/testing/page-spec.helpers';
import { EVENTS } from '../../../shared/testing/i18n.fixtures';

describe('EventsComponent', () => {
  let fixture: ComponentFixture<EventsComponent>;
  let element: HTMLElement;
  let language: LanguageServiceStub;

  const create = (events: object = EVENTS) => {
    TestBed.configureTestingModule({ imports: [EventsComponent], providers: pageTestProviders() });
    language = TestBed.inject(LanguageService) as unknown as LanguageServiceStub;
    fixture = TestBed.createComponent(EventsComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ events });
    fixture.detectChanges();
  };

  const titles = () => Array.from(element.querySelectorAll('h2.card-title')).map(h => h.textContent?.trim());

  it('shows one h1 and only the upcoming events, nearest first', () => {
    create();
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(titles()).toEqual(['Fecha límite ficticia', 'Seminario ficticio']);
  });

  it('formats the date badge and the time with the active language', () => {
    create();
    const badges = Array.from(element.querySelectorAll('.date-badge')).map(b => b.textContent?.replace(/\s+/g, ' ').trim());
    expect(badges[0]).toMatch(/^17 feb/i);
    expect(element.textContent).toMatch(/8:30\s?a\.\s?m\./i);
    expect(element.textContent).toMatch(/5:00\s?p\.\s?m\./i);
  });

  it('switches text, date and time to English when the language changes (OnPush)', async () => {
    create();
    await language.setLanguage('en');
    fixture.detectChanges();
    expect(titles()).toEqual(['Fictitious deadline', 'Fictitious seminar']);
    expect(element.textContent).toContain('Online');
    expect(element.textContent).toContain('Auditorium');
    expect(element.querySelector('.date-badge')?.textContent?.replace(/\s+/g, ' ').trim()).toMatch(/^17 feb/i);
    expect(element.textContent).toMatch(/8:30\s?AM/i);
    expect(element.textContent).toMatch(/5:00\s?PM/i);
  });

  it('opens the registration link safely and shows the extra info', () => {
    create();
    const link = element.querySelector('a[href="https://example.test/registro"]');
    expect(link?.getAttribute('target')).toBe('_blank');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(element.textContent).toContain('info@example.test');
  });

  it('shows the bilingual empty state when nothing is coming up', () => {
    create([EVENTS[0]]);
    expect(titles()).toEqual([]);
    expect(element.textContent).toContain('events-empty-title');
  });

  it('loads more events in pages', () => {
    const many = Array.from({ length: 8 }, (_, i) => ({ ...EVENTS[1], id: 100 + i, date: `2999-05-${String(10 + i).padStart(2, '0')}` }));
    create(many);
    expect(titles().length).toBe(6);
    (element.querySelector('button.btn-outline-primary') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(titles().length).toBe(8);
    expect(element.querySelector('button.btn-outline-primary')).toBeNull();
  });
});
