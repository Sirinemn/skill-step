import { Routes } from '@angular/router';
import { TermsComponent } from './features/auth/pages/terms/terms.component';
import { PrivacyComponent } from './features/auth/pages/privacy/privacy.component';

export const routes: Routes = [

  // ── Auth (landing + callback) ──────────────────────────
  // Préfixe '' = routes à la racine : '/' et '/auth/callback'
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then(m => m.AUTH_ROUTES),
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
  // ── Catégories ─────────────────────────────────────────
  {
    path: 'categories',
    loadChildren: () =>
      import('./features/learning-log/categories.routes')
        .then(m => m.CATEGORIES_ROUTES),
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