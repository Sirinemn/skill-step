import { Routes } from '@angular/router';
import { CallbackComponent } from './pages/callback/callback.component';
import { LoginComponent } from './pages/login/login.component';
import { unauthGuard } from '../../core/guards/unauth.guard';
import { PublicLayoutComponent } from '../../layouts/public-layout/public-layout.component';

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
  {
  path: '',
  component: PublicLayoutComponent, // ← layout partagé
  children: [
    { path: 'fonctionnalites', loadComponent: () => import('./pages/features-page/features-page.component').then(m => m.FeaturesPageComponent) },
    { path: 'a-propos',        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent) },
    { path: 'confidentialite', loadComponent: () => import('./pages/privacy/privacy.component').then(m => m.PrivacyComponent) },
    { path: 'conditions',      loadComponent: () => import('./pages/terms/terms.component').then(m => m.TermsComponent) },
  ]
}
];