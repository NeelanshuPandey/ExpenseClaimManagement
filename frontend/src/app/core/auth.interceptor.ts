import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

let refreshing: ReturnType<AuthService['refresh']> | null = null;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const session = auth.session();

  const send = (token: string | null) => {
    if (!token) return next(request);

    const authenticatedRequest = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(authenticatedRequest);
  };

  const isAuthRequest = /\/auth\/(login|register|refresh)$/.test(request.url);
  if (!session || isAuthRequest) {
    return send(session?.accessToken ?? null);
  }

  return send(session.accessToken).pipe(
    catchError((error) => {
      if (error.status !== 401) return throwError(() => error);

      if (!refreshing) {
        const refreshRequest = auth.refresh();
        if (!refreshRequest) {
          auth.logout();
          return throwError(() => error);
        }
        refreshing = refreshRequest.pipe(shareReplay(1));
      }

      return refreshing.pipe(
        switchMap((freshSession) => {
          refreshing = null;
          return send(freshSession.accessToken);
        }),
        catchError((refreshError) => {
          refreshing = null;
          auth.logout();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
