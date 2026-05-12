import { Routes } from '@angular/router';
import { CallbackComponent } from './pages/callback/callback.component';

export const AUTH_ROUTES: Routes = [
  {
    // '' = correspond à la racine du préfixe déclaré dans app.routes.ts
    // soit exactement '/' pour la landing/login
    path: '',
    title: 'Login'
  },
  {
    // /auth/callback?token=xxx — reçoit le token Google après redirect
    path: 'callback',
    title: 'Callback',
    component: CallbackComponent
  },
];