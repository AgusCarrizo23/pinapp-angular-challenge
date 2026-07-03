import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  private readonly router = inject(Router);

  get isLoginRoute(): boolean {
    return this.router.url.split('?')[0] === '/login';
  }
}