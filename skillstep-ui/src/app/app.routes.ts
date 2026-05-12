import { Routes } from '@angular/router';
import { unauthGuard } from './core/guards/unauth.guard';
import { HomeComponent } from './features/auth/pages/home/home.component';
import { LoginComponent } from './features/auth/pages/login/login.component';

export const routes: Routes = [

 {
    path: '',             // /auth → landing page
    canActivate: [unauthGuard],
    component: HomeComponent
  },
  {
    path: 'login',        // /auth/login → page connexion dédiée
    canActivate: [unauthGuard],
    component: LoginComponent
  },

  // Redirect racine vers auth (landing page)
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },

  // ── Dashboard ──────────────────────────────────────────
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes')
        .then(m => m.DASHBOARD_ROUTES),
  },

  // ── Journal / Learning Logs ────────────────────────────
  {
    path: 'journal',
    loadChildren: () =>
      import('./features/learning-log/learning-log.routes')
        .then(m => m.LEARNING_LOG_ROUTES),
  },

  // ── Profil ─────────────────────────────────────────────
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile.routes')
        .then(m => m.PROFILE_ROUTES),
  },

  // ── Fallback ───────────────────────────────────────────
  {
    path: '**',
    redirectTo: 'auth',
  },
];