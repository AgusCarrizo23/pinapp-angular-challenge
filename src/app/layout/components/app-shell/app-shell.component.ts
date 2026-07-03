import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subject, finalize, takeUntil } from 'rxjs';

import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss']
})
export class AppShellComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly destroyed$ = new Subject<void>();

  @ViewChild('sidenav') private sidenav?: MatSidenav;

  readonly currentUser$ = this.authService.currentUser$;
  isMobile = this.breakpointObserver.isMatched('(max-width: 47.9375rem)');
  isLoggingOut = false;

  constructor() {
    this.breakpointObserver.observe('(max-width: 47.9375rem)')
      .pipe(takeUntil(this.destroyed$))
      .subscribe(({ matches }) => {
        this.isMobile = matches;
      });
  }

  toggleSidebar(): void {
    this.sidenav?.toggle();
  }

  closeSidebarOnMobile(): void {
    if (this.isMobile) {
      this.sidenav?.close();
    }
  }

  logout(): void {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;
    this.authService.logout().pipe(
      finalize(() => {
        this.isLoggingOut = false;
      })
    ).subscribe({
      next: () => this.router.navigate(['/login'])
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}