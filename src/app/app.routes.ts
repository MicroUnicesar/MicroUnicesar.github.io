import { Routes } from '@angular/router';

const comingSoon = () =>
  import('./shared/components/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent);
const landing = () =>
  import('./shared/components/section-landing/section-landing.component').then(m => m.SectionLandingComponent);

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/pages/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'program',
    children: [
      { path: '', loadComponent: landing, data: { sectionId: 'program' } },
      { path: 'about', loadComponent: comingSoon, data: { titleKey: 'nav-program-about', sectionId: 'program' } },
      {
        path: 'labs',
        loadComponent: () => import('./features/program/labs/pages/labs.component').then(m => m.ResearchLabsComponent)
      }
    ]
  },
  {
    path: 'research',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/research/pages/research.component').then(m => m.ResearchComponent)
      },
      { path: 'groups', loadComponent: comingSoon, data: { titleKey: 'nav-research-groups', sectionId: 'research' } },
      { path: 'lines', loadComponent: comingSoon, data: { titleKey: 'nav-research-lines', sectionId: 'research' } },
      { path: 'projects', loadComponent: comingSoon, data: { titleKey: 'nav-research-projects', sectionId: 'research' } },
      { path: 'publications', loadComponent: comingSoon, data: { titleKey: 'nav-research-publications', sectionId: 'research' } }
    ]
  },
  {
    path: 'people',
    children: [
      { path: '', loadComponent: landing, data: { sectionId: 'people' } },
      { path: 'faculty', loadComponent: comingSoon, data: { titleKey: 'nav-people-faculty', sectionId: 'people' } },
      { path: 'students', loadComponent: comingSoon, data: { titleKey: 'nav-people-students', sectionId: 'people' } },
      { path: 'staff', loadComponent: comingSoon, data: { titleKey: 'nav-people-staff', sectionId: 'people' } }
    ]
  },
  {
    path: 'students',
    children: [
      { path: '', loadComponent: landing, data: { sectionId: 'students' } },
      {
        path: 'graduation-options',
        loadComponent: () =>
          import('./features/students/graduation-options/pages/graduation-option.component')
            .then(m => m.GraduationOptionComponent)
      },
      {
        path: 'wellness',
        loadComponent: () =>
          import('./features/students/wellness/pages/wellness.component').then(m => m.WellnessComponent)
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/students/faq/pages/faq.component').then(m => m.FaqComponent)
      },
      { path: 'resources', loadComponent: comingSoon, data: { titleKey: 'nav-students-resources', sectionId: 'students' } }
    ]
  },
  {
    path: 'news',
    loadComponent: () => import('./features/news/pages/news.component').then(m => m.NewsComponent)
  },
  {
    path: 'events',
    loadComponent: () => import('./features/events/pages/events.component').then(m => m.EventsComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/pages/contact.component').then(m => m.ContactComponent)
  },

  // Redirecciones de las URLs anteriores
  { path: 'graduation-option', redirectTo: 'students/graduation-options', pathMatch: 'full' },
  { path: 'wellness', redirectTo: 'students/wellness', pathMatch: 'full' },
  { path: 'more-info', redirectTo: 'contact', pathMatch: 'full' },
  { path: 'research-labs', redirectTo: 'program/labs', pathMatch: 'full' },

  { path: '**', redirectTo: 'home' }
];
