import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, firstValueFrom, of } from 'rxjs';

import { AuthService } from '../../features/auth/services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: Router;
  let authService: { isAuthenticated$: Observable<boolean> };

  beforeEach(() => {
    authService = {
      isAuthenticated$: of(false)
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    });

    router = TestBed.inject(Router);
  });

  it('allows access when the user is authenticated', async () => {
    authService.isAuthenticated$ = of(true);

    const result = await executeGuard('/dashboard');

    expect(result).toBeTrue();
  });

  it('redirects unauthenticated users to login with the return URL', async () => {
    const result = await executeGuard('/dashboard');

    expect(result instanceof UrlTree).toBeTrue();
    expect(router.serializeUrl(result as UrlTree)).toBe('/login?returnUrl=%2Fdashboard');
  });

  function executeGuard(url: string): Promise<boolean | UrlTree> {
    const guardResult = TestBed.runInInjectionContext(() =>
      authGuard(
        {} as ActivatedRouteSnapshot,
        { url } as RouterStateSnapshot
      )
    ) as Observable<boolean | UrlTree>;

    return firstValueFrom(guardResult);
  }
});