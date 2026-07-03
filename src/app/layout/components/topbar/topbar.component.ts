import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Input() userName = 'Agustina';
  @Input() isLoggingOut = false;
  @Output() menuToggle = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();

  get userInitial(): string {
    return this.userName.trim().charAt(0).toUpperCase() || 'A';
  }
}