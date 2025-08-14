import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/sections/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'wellness',
    loadComponent: () => import('./components/sections/wellness/wellness.component').then(m => m.WellnessComponent)
  },
  {
    path: 'research',
    loadComponent: () => import('./components/sections/research/research.component').then(m => m.ResearchComponent)
  },
  {
    path: 'graduation-option',
    loadComponent: () => import('./components/sections/graduation-option/graduation-option.component').then(m => m.GraduationOptionComponent)
  },
  {
    path: 'more-info',
    loadComponent: () => import('./components/sections/more-info/more-info.component').then(m => m.MoreInfoComponent)
  },
  { path: '**', redirectTo: '/home' }
];
