import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { map, take } from 'rxjs';

import { AuthService } from '../../features/auth/services/auth.service';

export const authMatchGuard: CanMatchFn = (_route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }

      if (!isKnownPrivateRoute(segments)) {
        return false;
      }

      if (segments.length === 0) {
        return router.createUrlTree(['/login']);
      }

      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: getReturnUrl(segments) }
      });
    })
  );
};

function isKnownPrivateRoute(segments: UrlSegment[]): boolean {
  const paths = segments.map(({ path }) => path);

  if (paths.length === 0) {
    return true;
  }

  if (paths.length === 1) {
    return ['dashboard', 'home', 'customers'].includes(paths[0]);
  }

  if (paths.length === 2) {
    return paths[0] === 'customers' && paths[1] === 'new';
  }

  return paths.length === 3
    && paths[0] === 'customers'
    && paths[1].length > 0
    && paths[2] === 'edit';
}

function getReturnUrl(segments: UrlSegment[]): string {
  return `/${segments.map(({ path }) => path).join('/')}`;
}