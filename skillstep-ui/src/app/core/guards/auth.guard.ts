import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { filter, map, take } from "rxjs/operators";
import { toObservable } from "@angular/core/rxjs-interop";

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  return toObservable(authService.isInitialized$).pipe(

    // On attend que la restauration soit terminée
    filter(initialized => initialized),

    // Une seule décision suffit
    take(1),

    map(() => {

      if (authService.isAuthenticated$()) {
        return true;
      }
      return router.createUrlTree(['/auth']);
    })
  );
};