import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./packages/Dashboard/dashboard.routes').then(
            (m) => m.DASHBOARD_ROUTES
          ),
      },
      {
        path: 'species',
        loadChildren: () =>
          import('./packages/Species/species.routes').then(
            (m) => m.SPECIES_ROUTES
          ),
      },
      {
        path: 'ranking',
        loadChildren: () =>
          import('./packages/Ranking/ranking.routes').then(
            (m) => m.RANKING_ROUTES
          ),
      },
      // Additional feature routes are registered iteratively in subsequent features
    ],
  },
  { path: '**', redirectTo: '' },
];

