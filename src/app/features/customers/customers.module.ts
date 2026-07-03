import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';

import { CustomerDetailDialogComponent } from './dialogs/customer-detail-dialog/customer-detail-dialog.component';
import { CustomerDeleteDialogComponent } from './dialogs/customer-delete-dialog/customer-delete-dialog.component';
import { CustomerEditDialogComponent } from './dialogs/customer-edit-dialog/customer-edit-dialog.component';
import { LettersOnlyInputDirective } from './directives/letters-only-input.directive';
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
    CustomerDetailDialogComponent,
    CustomerDeleteDialogComponent,
    CustomerEditDialogComponent,
    LettersOnlyInputDirective,
    CustomerBirthDatePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
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