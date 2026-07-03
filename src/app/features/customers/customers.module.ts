import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';

import { CustomerFormPageComponent } from './pages/customer-form-page/customer-form-page.component';
import { CustomersPageComponent } from './pages/customers-page/customers-page.component';
import { CustomerBirthDatePipe } from './pipes/customer-birth-date.pipe';
import { createCustomerPaginatorIntl } from './utils/customer-paginator-intl';

const routes: Routes = [
  {
    path: 'new',
    component: CustomerFormPageComponent
  },
  {
    path: '',
    component: CustomersPageComponent
  }
];

@NgModule({
  declarations: [
    CustomersPageComponent,
    CustomerFormPageComponent,
    CustomerBirthDatePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
    {
      provide: MatPaginatorIntl,
      useFactory: createCustomerPaginatorIntl
    }
  ]
})
export class CustomersModule {}