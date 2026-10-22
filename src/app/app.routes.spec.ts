import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { LanguageService } from './core/services/language.service';
import { LanguageServiceStub } from './shared/testing/language.service.stub';
import { SITE_SECTIONS } from './shared/constants/site-map';

describe('app routes', () => {
  let harness: RouterTestingHarness;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(), provideHttpClientTesting(),
        { provide: LanguageService, useValue: new LanguageServiceStub() }
      ]
    });
    harness = await RouterTestingHarness.create();
    router = TestBed.inject(Router);
  });

  const urlAfter = async (url: string) => {
    await harness.navigateByUrl(url);
    return router.url;
  };

  const everyPath = [
    '/home', '/news', '/events', '/contact',
    '/program', '/program/about', '/program/labs',
    '/research', '/research/groups', '/research/lines', '/research/projects', '/research/publications',
    '/people', '/people/faculty', '/people/students', '/people/staff',
    '/students', '/students/graduation-options', '/students/wellness', '/students/faq', '/students/resources'
  ];

  for (const path of everyPath) {
    it(`loads ${path} without redirecting`, async () => {
      expect(await urlAfter(path)).toBe(path);
    });
  }

  it('redirects the old URLs', async () => {
    expect(await urlAfter('/graduation-option')).toBe('/students/graduation-options');
    expect(await urlAfter('/wellness')).toBe('/students/wellness');
    expect(await urlAfter('/more-info')).toBe('/contact');
    expect(await urlAfter('/research-labs')).toBe('/program/labs');
  });

  it('loads a group page by id and keeps the URL for unknown ids', async () => {
    expect(await urlAfter('/research/groups/pam')).toBe('/research/groups/pam');
    expect(await urlAfter('/research/groups/no-such-group')).toBe('/research/groups/no-such-group');
  });

  it('sends the root and unknown URLs to home', async () => {
    expect(await urlAfter('/')).toBe('/home');
    expect(await urlAfter('/does-not-exist')).toBe('/home');
  });

  it('has a route for every page in the site map', async () => {
    const paths = SITE_SECTIONS.flatMap(section => [
      ...(section.overview ? [section.overview.path] : []),
      ...section.children.map(child => child.path)
    ]);
    for (const path of paths) {
      expect(await urlAfter(path)).withContext(path).toBe(path);
    }
  });

  it('renders a single h1 on the landing and coming-soon pages', async () => {
    for (const path of ['/program', '/people', '/students', '/program/about', '/people/faculty']) {
      await harness.navigateByUrl(path);
      harness.detectChanges();
      expect((harness.routeNativeElement as HTMLElement).querySelectorAll('h1').length)
        .withContext(path).toBe(1);
    }
  });
});
