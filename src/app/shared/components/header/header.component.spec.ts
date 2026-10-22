import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../testing/language.service.stub';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let language: LanguageServiceStub;

  const buttons = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.language-selector button')) as HTMLButtonElement[];

  beforeEach(async () => {
    language = new LanguageServiceStub();
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: LanguageService, useValue: language }]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
  });

  it('shows both languages at all times', () => {
    expect(buttons().map(button => button.textContent?.trim())).toEqual(['ES', 'EN']);
  });

  it('marks the active language as pressed', () => {
    expect(buttons().map(button => button.getAttribute('aria-pressed'))).toEqual(['true', 'false']);
  });

  it('switches language when a button is clicked', async () => {
    buttons()[1].click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(language.setLanguageCalls).toEqual(['en']);
    expect(buttons().map(button => button.getAttribute('aria-pressed'))).toEqual(['false', 'true']);
  });
});
