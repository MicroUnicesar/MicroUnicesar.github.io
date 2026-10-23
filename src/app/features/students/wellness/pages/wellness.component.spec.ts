import { TestBed } from '@angular/core/testing';
import { WellnessComponent } from './wellness.component';
import { LanguageService } from '../../../../core/services/language.service';
import { LanguageServiceStub } from '../../../../shared/testing/language.service.stub';
import { flushData, pageTestProviders } from '../../../../shared/testing/page-spec.helpers';
import { WELLNESS } from '../../../../shared/testing/i18n.fixtures';

describe('WellnessComponent', () => {
  it('lists the topics from the data, in the active language, and follows language changes', async () => {
    TestBed.configureTestingModule({ imports: [WellnessComponent], providers: pageTestProviders() });
    const fixture = TestBed.createComponent(WellnessComponent);
    const element: HTMLElement = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ wellness: WELLNESS });
    fixture.detectChanges();

    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim())).toEqual(['Consejería', 'Saber Pro']);
    expect(element.textContent).toContain('Acompañamiento personalizado.');

    await (TestBed.inject(LanguageService) as unknown as LanguageServiceStub).setLanguage('en');
    fixture.detectChanges();
    expect(Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim())).toEqual(['Counseling', 'Saber Pro']);
    expect(element.textContent).toContain('Personalized support.');
  });
});
