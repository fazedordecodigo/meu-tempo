import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    data: { prerender: false }
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    data: { prerender: false }
  },
  {
    path: 'agendar/:customUrl',
    loadComponent: () => import('./features/public/booking/booking.component').then(m => m.BookingComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
