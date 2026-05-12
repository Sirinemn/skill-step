// src/app/features/profile/profile.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    title: 'Profile',
    canActivate: [authGuard]
  },
];