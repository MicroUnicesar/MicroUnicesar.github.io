import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../testing/language.service.stub';

describe('NotFoundComponent', () => {
  it('shows the title, the explanation and a link back', () => {
    TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideRouter([]), { provide: LanguageService, useValue: new LanguageServiceStub() }]
    });
    const fixture = TestBed.createComponent(NotFoundComponent);
    fixture.componentRef.setInput('titleKey', 'not-found-group-title');
    fixture.componentRef.setInput('backPath', '/research/groups');
    fixture.componentRef.setInput('backLabelKey', 'nav-research-groups');
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(element.textContent).toContain('not-found-group-title');
    expect(element.textContent).toContain('not-found-text');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/research/groups');
  });
});
