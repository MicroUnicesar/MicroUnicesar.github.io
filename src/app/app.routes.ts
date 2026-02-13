import { Routes } from '@angular/router';
import {ResearchLabsComponent} from './features/labs/pages/labs.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/pages/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'wellness',
    loadComponent: () => import('./features/wellness/pages/wellness.component').then(m => m.WellnessComponent)
  },
  {
    path: 'research',
    loadComponent: () => import('./features/research/pages/research.component').then(m => m.ResearchComponent)
  },
  {
    path: 'graduation-option',
    loadComponent: () => import('./features/graduation-option/pages/graduation-option.component').then(m => m.GraduationOptionComponent)
  },
  {
    path: 'more-info',
    loadComponent: () => import('./features/more-info/pages/more-info.component').then(m => m.MoreInfoComponent)
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
    path: 'research-labs',
    loadComponent: () => import('./features/labs/pages/labs.component').then(m => m.ResearchLabsComponent)
  },
  { path: '**', redirectTo: '/home' }
];
