import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject }                                         from '@angular/core';
import { AuthService }                                    from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn ) => {

    const authService = inject(AuthService);
    const token       = authService.getToken();

    // Si pas de token → on laisse passer la requête telle quelle
    if (!token) {
        return next(req);
    }

    // On "clone" la requête (elle est immuable) en ajoutant le header
    const authReq = req.clone({
        setHeaders: {
        Authorization: `Bearer ${token}`
        }
    });

    return next(authReq);
    };