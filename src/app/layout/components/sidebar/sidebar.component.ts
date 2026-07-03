import { Component, EventEmitter, Input, Output } from '@angular/core';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isLoggingOut = false;
  @Output() navigated = new EventEmitter<void>();
  @Output() logoutRequested = new EventEmitter<void>();

  readonly navigationItems: NavigationItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Clientes', icon: 'groups', route: '/customers' },
    { label: 'Nuevo cliente', icon: 'person_add', route: '/customers/new' }
  ];
}