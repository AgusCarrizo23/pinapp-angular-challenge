import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { AppShellComponent } from './layout/components/app-shell/app-shell.component';
import { TopbarComponent } from './layout/components/topbar/topbar.component';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';
import { CustomersPlaceholderComponent } from './pages/customers-placeholder/customers-placeholder.component';
import { CustomerFormPlaceholderComponent } from './pages/customer-form-placeholder/customer-form-placeholder.component';
import { DashboardPageComponent } from './features/dashboard/page/dashboard-page/dashboard-page.component';
import { MetricCardComponent } from './shared/components/metric-card/metric-card.component';
import { QuickActionCardComponent } from './shared/components/quick-action-card/quick-action-card.component';


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LoginComponent,
    AppShellComponent,
    TopbarComponent,
    SidebarComponent,
    CustomersPlaceholderComponent,
    CustomerFormPlaceholderComponent,
    DashboardPageComponent,
    MetricCardComponent,
    QuickActionCardComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatDividerModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }