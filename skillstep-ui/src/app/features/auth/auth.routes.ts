import { Routes } from '@angular/router';
import { CallbackComponent } from './pages/callback/callback.component';
import { LoginComponent } from './pages/login/login.component';

export const AUTH_ROUTES: Routes = [
  {
    // '' = correspond à la racine du préfixe déclaré dans app.routes.ts
    // soit exactement '/' pour la landing/login
    path: '',
    title: 'Login',
    component: LoginComponent
  },
  {
    // /auth/callback?token=xxx — reçoit le token Google après redirect
    path: 'callback',
    title: 'Callback',
    component: CallbackComponent
  },
];