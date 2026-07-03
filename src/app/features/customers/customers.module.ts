import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';

import { CustomersPageComponent } from './pages/customers-page/customers-page.component';
import { CustomerBirthDatePipe } from './pipes/customer-birth-date.pipe';
import { createCustomerPaginatorIntl } from './utils/customer-paginator-intl';

const routes: Routes = [
  {
    path: '',
    component: CustomersPageComponent
  }
];

@NgModule({
  declarations: [CustomersPageComponent, CustomerBirthDatePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useFactory: createCustomerPaginatorIntl
    }
  ]
})
export class CustomersModule {}