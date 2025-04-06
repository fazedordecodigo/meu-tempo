import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'appointments',
        loadComponent: () => import('../appointments/appointments-list/appointments-list.component').then(m => m.AppointmentsListComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('../services/services-list/services-list.component').then(m => m.ServicesListComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('../profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  }
]; 