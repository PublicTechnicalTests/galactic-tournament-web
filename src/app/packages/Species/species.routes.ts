import { Routes } from '@angular/router';

/** Lazy-loaded routes for the Species feature. */
export const SPECIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature-list-species/feature-list-species.component').then(
        (m) => m.FeatureListSpeciesComponent
      ),
  },
];
