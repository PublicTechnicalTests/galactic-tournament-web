import { Routes } from '@angular/router';

/** Lazy-loaded routes for the Dashboard feature. */
export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((m) => m.DashboardComponent),
  },
];
