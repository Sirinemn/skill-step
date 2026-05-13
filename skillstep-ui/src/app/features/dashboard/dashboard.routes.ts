// src/app/features/dashboard/dashboard.routes.ts
import { Routes }    from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    // Le layout enveloppe le dashboard
    loadComponent: () =>
      import('../../layouts/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
      }
    ]
  },
];