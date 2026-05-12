import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (authService.isAuthenticated$()) {
    return true; // L'utilisateur est authentifié, on autorise l'accès
  } else {
    router.navigate(['/']); // Redirige vers la page d'accueil ou de connexion
    return false; // Bloque l'accès à la route protégée
  }
};