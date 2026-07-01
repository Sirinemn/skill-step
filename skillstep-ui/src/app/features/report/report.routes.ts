import { Routes }    from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const REPORT_ROUTES: Routes = [
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
          import('./pages/report/report.component')
            .then(m => m.ReportComponent),
      }
    ]
  }
];