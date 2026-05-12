// src/app/features/learning-log/learning-log.routes.ts
import { Routes }    from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const LEARNING_LOG_ROUTES: Routes = [
  {
    // /journal — liste de tous les logs
    path: '',
    title: 'Journal',
    canActivate: [authGuard],
    
  },
  {
    // /journal/new — formulaire création
    path: 'new',
    title: 'New Log',
    canActivate: [authGuard],
    
  },
  {
    // /journal/:id/edit — formulaire édition
    path: ':id/edit',
    title: 'Edit Log',
    canActivate: [authGuard],
    
  },
];