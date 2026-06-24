import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
                                  

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn ) => {

    const token = localStorage.getItem('skillstep_jwt');

    if (!token) {
        return next(req);
    }

    const authReq = req.clone({
        setHeaders: {
        Authorization: `Bearer ${token}`
        }
    });

    return next(authReq);
}