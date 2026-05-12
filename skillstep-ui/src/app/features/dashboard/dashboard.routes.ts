// src/app/features/dashboard/dashboard.routes.ts
import { Routes }    from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    title: 'Dashboard',
    canActivate: [authGuard],
    component: DashboardComponent
  },
];