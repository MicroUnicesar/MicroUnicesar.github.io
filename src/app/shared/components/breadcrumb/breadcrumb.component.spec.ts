import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { LanguageService } from '../../../core/services/language.service';
import { LanguageServiceStub } from '../../testing/language.service.stub';

describe('BreadcrumbComponent', () => {
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let element: HTMLElement;
  let router: Router;
  let service: BreadcrumbService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: LanguageService, useValue: new LanguageServiceStub() }
      ]
    });
    router = TestBed.inject(Router);
    service = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(BreadcrumbComponent);
    element = fixture.nativeElement;
  });

  const go = async (url: string) => {
    await router.navigateByUrl(url);
    fixture.detectChanges();
  };
  const crumbs = () => Array.from(element.querySelectorAll('li')).map(li => li.textContent?.trim());

  it('renders nothing on first-level pages', async () => {
    await go('/students');
    expect(element.querySelector('nav')).toBeNull();
  });

  it('follows the URL and updates when it changes', async () => {
    await go('/students/wellness');
    expect(crumbs()).toEqual(['nav-home', 'nav-students', 'nav-wellness']);
    await go('/program/labs');
    expect(crumbs()).toEqual(['nav-home', 'nav-program', 'nav-program-labs']);
  });

  it('is an accessible navigation landmark with the current page marked and not linked', async () => {
    await go('/students/wellness');
    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe('breadcrumb-label');
    const items = element.querySelectorAll('li');
    expect(items[2].getAttribute('aria-current')).toBe('page');
    expect(items[2].querySelector('a')).toBeNull();
    expect(items[0].querySelector('a')?.getAttribute('href')).toBe('/home');
    expect(items[1].querySelector('a')?.getAttribute('href')).toBe('/students');
  });

  it('shows the name of the open detail as the last crumb, and drops it when cleared', async () => {
    service.setLeaf({ es: 'Grupo ficticio', en: 'Fictitious group' });
    await go('/research/groups/pam');
    expect(crumbs()).toEqual(['nav-home', 'nav-research', 'nav-research-groups', 'Grupo ficticio']);
    expect(element.querySelectorAll('li')[2].querySelector('a')?.getAttribute('href')).toBe('/research/groups');

    service.setLeaf(undefined);
    fixture.detectChanges();
    expect(crumbs()).toEqual(['nav-home', 'nav-research', 'nav-research-groups']);
  });
});
