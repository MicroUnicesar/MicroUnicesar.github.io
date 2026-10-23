import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImpactComponent } from './impact.component';
import { flushData, pageTestProviders } from '../../../../shared/testing/page-spec.helpers';

// Datos ficticios, solo para pruebas.
const text = (es: string) => ({ es, en: `${es} (en)` });

describe('ImpactComponent', () => {
  let fixture: ComponentFixture<ImpactComponent>;
  let element: HTMLElement;

  const open = (initiatives: object) => {
    TestBed.configureTestingModule({ imports: [ImpactComponent], providers: pageTestProviders() });
    fixture = TestBed.createComponent(ImpactComponent);
    element = fixture.nativeElement;
    fixture.detectChanges();
    flushData({ impact: initiatives });
    fixture.detectChanges();
  };

  it('shows the bilingual "coming soon" state while there are no initiatives', () => {
    open([]);
    expect(element.querySelector('app-coming-soon')).not.toBeNull();
    expect(element.querySelectorAll('h1').length).toBe(1);
  });

  it('lists the initiatives, with optional image and link', () => {
    open([
      { id: 'a', title: text('Iniciativa ficticia A'), description: text('Descripción A'), image: 'a.jpg', url: 'https://example.test/a' },
      { id: 'b', title: text('Iniciativa ficticia B'), description: text('Descripción B') }
    ]);
    expect(element.querySelector('app-coming-soon')).toBeNull();
    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(Array.from(element.querySelectorAll('h2')).map(h => h.textContent?.trim()))
      .toEqual(['Iniciativa ficticia A', 'Iniciativa ficticia B']);
    expect(element.querySelectorAll('img').length).toBe(1);
    expect(element.querySelector('img')?.getAttribute('src')).toBe('assets/images/impact/a.jpg');
    expect(element.querySelector('img')?.getAttribute('alt')).toBe('');
    const link = element.querySelector('a[href="https://example.test/a"]');
    expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(element.querySelectorAll('a[target="_blank"]').length).toBe(1);
  });
});
