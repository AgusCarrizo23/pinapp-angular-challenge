import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { AppShellComponent } from './layout/components/app-shell/app-shell.component';
import { CustomerFormPlaceholderComponent } from './pages/customer-form-placeholder/customer-form-placeholder.component';
import { CustomersPlaceholderComponent } from './pages/customers-placeholder/customers-placeholder.component';
import { DashboardPageComponent } from './features/dashboard/page/dashboard-page/dashboard-page.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardPageComponent
      },
      {
        path: 'customers/new',
        component: CustomerFormPlaceholderComponent
      },
      {
        path: 'customers',
        component: CustomersPlaceholderComponent
      },
      {
        path: 'home',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }