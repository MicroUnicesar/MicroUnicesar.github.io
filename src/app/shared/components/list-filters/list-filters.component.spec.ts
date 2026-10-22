import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ListFiltersComponent } from './list-filters.component';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../testing/language.service.stub';
import { GROUPS } from '../../testing/research.fixtures';

describe('ListFiltersComponent', () => {
  let fixture: ComponentFixture<ListFiltersComponent>;
  let element: HTMLElement;
  let navigate: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListFiltersComponent],
      providers: [provideRouter([]), { provide: LanguageService, useValue: new LanguageServiceStub() }]
    });
    navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    fixture = TestBed.createComponent(ListFiltersComponent);
    element = fixture.nativeElement;
    fixture.componentRef.setInput('groups', GROUPS);
  });

  const type = (selector: string, value: string, eventName: 'input' | 'change') => {
    const control = element.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
    control.value = value;
    control.dispatchEvent(new Event(eventName));
  };

  it('shows only the group filter by default', () => {
    fixture.detectChanges();
    expect(element.querySelector('#filter-group')).not.toBeNull();
    expect(element.querySelector('#filter-search')).toBeNull();
    expect(element.querySelector('#filter-year')).toBeNull();
  });

  it('shows the search box and the year filter when asked', () => {
    fixture.componentRef.setInput('search', true);
    fixture.componentRef.setInput('years', [2024, 2023]);
    fixture.detectChanges();
    expect(element.querySelector('#filter-search')).not.toBeNull();
    expect(element.querySelectorAll('#filter-year option').length).toBe(3);
  });

  it('puts the chosen group in the URL, and removes it when cleared', () => {
    fixture.detectChanges();
    type('#filter-group', 'grupo-completo', 'change');
    expect(navigate).toHaveBeenCalledWith([], jasmine.objectContaining({ queryParams: { group: 'grupo-completo' }, queryParamsHandling: 'merge', replaceUrl: false }));
    type('#filter-group', '', 'change');
    expect(navigate.calls.mostRecent().args[1]).toEqual(jasmine.objectContaining({ queryParams: { group: null } }));
  });

  it('puts the search text in the URL replacing the history entry', () => {
    fixture.componentRef.setInput('search', true);
    fixture.detectChanges();
    type('#filter-search', '  Docente ', 'input');
    expect(navigate).toHaveBeenCalledWith([], jasmine.objectContaining({ queryParams: { q: 'Docente' }, replaceUrl: true }));
  });

  it('reflects the current filter in the controls', () => {
    fixture.componentRef.setInput('search', true);
    fixture.componentRef.setInput('selectedGroup', 'grupo-vacio');
    fixture.componentRef.setInput('query', 'ana');
    fixture.detectChanges();
    expect((element.querySelector('#filter-group') as HTMLSelectElement).value).toBe('grupo-vacio');
    expect((element.querySelector('#filter-search') as HTMLInputElement).value).toBe('ana');
  });
});
