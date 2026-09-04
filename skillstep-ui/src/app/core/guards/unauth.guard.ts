import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { map } from "rxjs/internal/operators/map";
import { take } from "rxjs/internal/operators/take";
import { filter } from "rxjs/internal/operators/filter";
import { toObservable } from "@angular/core/rxjs-interop";

export const unauthGuard : CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.isInitialized$).pipe(

    filter(initialized => initialized),

    take(1),

    map(() => {

      if (authService.isAuthenticated$()) {
        return router.createUrlTree(['/dashboard']);
      }
      return true;
    })
  );
};