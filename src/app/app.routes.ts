import { Routes } from '@angular/router';

const comingSoon = () =>
  import('./shared/components/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent);
const landing = () =>
  import('./shared/components/section-landing/section-landing.component').then(m => m.SectionLandingComponent);

const peopleList = () =>
  import('./features/people/pages/people-list.component').then(m => m.PeopleListComponent);

export const routes: Routes = [
  // La portada vive en la raíz (así WhatsApp, Facebook y Google leen su contenido y no una página de redirección).
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home/pages/home.component').then(m => m.HomeComponent)
  },
  { path: 'home', redirectTo: '/', pathMatch: 'full' },
  {
    path: 'program',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/program/pages/program.component').then(m => m.ProgramComponent)
      },
      {
        path: 'impact',
        loadComponent: () =>
          import('./features/program/impact/pages/impact.component').then(m => m.ImpactComponent)
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
      {
        path: 'labs',
        loadComponent: () => import('./features/research/labs/pages/labs.component').then(m => m.ResearchLabsComponent)
      },
      {
        path: 'groups',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/research/groups/pages/groups.component').then(m => m.ResearchGroupsComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/research/groups/pages/group-detail.component').then(m => m.GroupDetailComponent)
          }
        ]
      },
      {
        path: 'lines',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/research/lines/pages/lines.component').then(m => m.ResearchLinesComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/research/lines/pages/line-detail.component').then(m => m.LineDetailComponent)
          }
        ]
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/research/projects/pages/projects.component').then(m => m.ResearchProjectsComponent)
      },
      {
        path: 'publications',
        loadComponent: () =>
          import('./features/research/publications/pages/publications.component')
            .then(m => m.ResearchPublicationsComponent)
      }
    ]
  },
  {
    path: 'people',
    children: [
      { path: '', loadComponent: landing, data: { sectionId: 'people' } },
      {
        path: 'faculty',
        children: [
          {
            path: '',
            loadComponent: peopleList,
            data: { category: 'faculty', titleKey: 'nav-people-faculty', descriptionKey: 'desc-people-faculty' }
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/people/pages/person-detail.component').then(m => m.PersonDetailComponent)
          }
        ]
      },
      {
        path: 'students',
        loadComponent: peopleList,
        data: { category: 'student', titleKey: 'nav-people-students', descriptionKey: 'desc-people-students' }
      },
      {
        path: 'staff',
        loadComponent: peopleList,
        data: { category: 'staff', titleKey: 'nav-people-staff', descriptionKey: 'desc-people-staff' }
      }
    ]
  },
  {
    path: 'students',
    children: [
      { path: '', loadComponent: landing, data: { sectionId: 'students' } },
      {
        path: 'graduation-options',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/students/graduation-options/pages/graduation-option.component')
                .then(m => m.GraduationOptionComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/students/graduation-options/pages/graduation-option-detail.component')
                .then(m => m.GraduationOptionDetailComponent)
          }
        ]
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
      {
        path: 'resources',
        loadComponent: () =>
          import('./features/students/resources/pages/resources.component').then(m => m.ResourcesComponent)
      }
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

  // Redirecciones de las URLs anteriores. Los destinos son absolutos (con "/"): con uno relativo, el prerender
  // lo resuelve contra la ruta padre que comparte prefijo (/program/about salía como /program/program).
  { path: 'graduation-option', redirectTo: '/students/graduation-options', pathMatch: 'full' },
  { path: 'wellness', redirectTo: '/students/wellness', pathMatch: 'full' },
  { path: 'more-info', redirectTo: '/contact', pathMatch: 'full' },
  { path: 'research-labs', redirectTo: '/research/labs', pathMatch: 'full' },
  { path: 'program/labs', redirectTo: '/research/labs', pathMatch: 'full' },
  { path: 'program/about', redirectTo: '/program', pathMatch: 'full' },

  { path: '**', redirectTo: '/' }
];
