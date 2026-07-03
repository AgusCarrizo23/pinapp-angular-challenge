/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, firstValueFrom, of } from 'rxjs';

import { AuthService } from '../../features/auth/services/auth.service';
import { authMatchGuard } from './auth-match.guard';

describe('authMatchGuard', () => {
  let router: Router;
  let authService: { isAuthenticated$: Observable<boolean> };

  beforeEach(() => {
    authService = { isAuthenticated$: of(false) };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authService }]
    });

    router = TestBed.inject(Router);
  });

  it('allows authenticated users to match the app shell', async () => {
    authService.isAuthenticated$ = of(true);

    expect(await executeGuard('testing123')).toBeTrue();
  });

  it('redirects known private routes to login preserving returnUrl', async () => {
    const result = await executeGuard('customers', 'new');

    expect(result instanceof UrlTree).toBeTrue();
    expect(router.serializeUrl(result as UrlTree))
      .toBe('/login?returnUrl=%2Fcustomers%2Fnew');
  });

  it('does not match the app shell for unknown public routes', async () => {
    expect(await executeGuard('login', 'testing123')).toBeFalse();
  });

  function executeGuard(...paths: string[]): Promise<boolean | UrlTree> {
    const result = TestBed.runInInjectionContext(() =>
      authMatchGuard(
        {} as Route,
        paths.map((path) => new UrlSegment(path, {}))
      )
    ) as Observable<boolean | UrlTree>;

    return firstValueFrom(result);
  }
});