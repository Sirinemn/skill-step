import { Routes }    from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../../layouts/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/categories/categories.component')
            .then(m => m.CategoriesComponent),
      }
    ]
  },
];