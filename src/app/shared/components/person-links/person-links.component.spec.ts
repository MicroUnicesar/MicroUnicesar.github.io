import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonLinksComponent } from './person-links.component';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../testing/language.service.stub';
import { PersonLinks } from '../../models/person.model';
import { FULL_FACULTY } from '../../testing/people.fixtures';

describe('PersonLinksComponent', () => {
  let fixture: ComponentFixture<PersonLinksComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PersonLinksComponent],
      providers: [{ provide: LanguageService, useValue: new LanguageServiceStub() }]
    });
    fixture = TestBed.createComponent(PersonLinksComponent);
    element = fixture.nativeElement;
  });

  const render = (links: PersonLinks | undefined) => {
    fixture.componentRef.setInput('links', links);
    fixture.detectChanges();
  };
  const anchors = () => Array.from(element.querySelectorAll('a'));

  it('shows the six profiles when they exist, all opening safely in a new tab', () => {
    render(FULL_FACULTY.links);
    expect(anchors().map(a => a.textContent?.trim())).toEqual([
      'link-orcid', 'link-scholar', 'link-cvlac', 'link-scopus', 'link-researchgate', 'link-website'
    ]);
    for (const anchor of anchors()) {
      expect(anchor.getAttribute('target')).toBe('_blank');
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  it('expands a bare ORCID id into its URL', () => {
    render({ orcid: '0000-0000-0000-0001' });
    expect(anchors()[0].getAttribute('href')).toBe('https://orcid.org/0000-0000-0000-0001');
  });

  it('shows only the links that exist', () => {
    render({ cvlac: 'https://cvlac.example.test/9', scopus: '  ' });
    expect(anchors().length).toBe(1);
    expect(anchors()[0].getAttribute('href')).toBe('https://cvlac.example.test/9');
  });

  it('ignores values that are not http(s) URLs', () => {
    render({ googleScholar: 'javascript:alert(1)', website: 'no-es-una-url' });
    expect(anchors().length).toBe(0);
  });

  it('renders nothing without links', () => {
    render({});
    expect(element.querySelector('ul')).toBeNull();
    render(undefined);
    expect(element.querySelector('ul')).toBeNull();
  });
});
