import { Routes } from '@angular/router';

export const RANKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature-list-ranking/feature-list-ranking.component').then(
        (m) => m.FeatureListRankingComponent
      ),
  },
];
