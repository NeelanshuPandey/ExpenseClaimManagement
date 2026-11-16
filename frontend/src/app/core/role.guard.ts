import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

type UserRole = 'EMPLOYEE' | 'MANAGER';

export const roleGuard = (...roles: UserRole[]): CanActivateFn => () => {
  const session = inject(AuthService).session();
  const router = inject(Router);

  if (!session) {
    router.navigateByUrl('/login', { replaceUrl: true });
    return false;
  }

  if (roles.length > 0 && !roles.includes(session.role)) {
    router.navigateByUrl('/denied', { replaceUrl: true });
    return false;
  }

  return true;
};

export const signedOutOnlyGuard: CanActivateFn = () => {
  const session = inject(AuthService).session();
  const router = inject(Router);

  if (!session) return true;

  const dashboard = session.role === 'MANAGER' ? '/manager' : '/employee';
  router.navigateByUrl(dashboard, { replaceUrl: true });
  return false;
};
