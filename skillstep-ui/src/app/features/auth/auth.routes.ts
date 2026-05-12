import { Routes } from '@angular/router';
import { CallbackComponent } from './pages/callback/callback.component';
import { LoginComponent } from './pages/login/login.component';
import { unauthGuard } from '../../core/guards/unauth.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',             // /auth → landing page
    canActivate: [unauthGuard],
    loadComponent: () =>
      import('./pages/home/home.component')
        .then(m => m.HomeComponent),
  },
  {
    path: 'login',        // /auth/login → page connexion dédiée
    canActivate: [unauthGuard],
    loadComponent: () =>
      import('./pages/login/login.component')
        .then(m => m.LoginComponent),
  },
  {
    // /auth/callback?token=xxx — reçoit le token Google après redirect
    path: 'callback',
    title: 'Callback',
    component: CallbackComponent
  },
];