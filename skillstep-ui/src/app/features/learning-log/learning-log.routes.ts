// src/app/features/learning-log/learning-log.routes.ts
import { Routes }    from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const LEARNING_LOG_ROUTES: Routes = [
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
          import('./pages/journal/journal.component')
            .then(m => m.JournalComponent),
      },
      {
        path: 'new',
        loadComponent: () =>
          import('./pages/log-form/log-form.component')
            .then(m => m.LogFormComponent),
      },
      {
        path: ':id/edit',
        loadComponent: () =>
          import('./pages/log-form/log-form.component')
            .then(m => m.LogFormComponent),
      },
    ]
  }
];