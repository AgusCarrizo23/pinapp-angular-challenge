import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Customer } from '../../interfaces/customer';

@Component({
  selector: 'app-customer-detail-dialog',
  templateUrl: './customer-detail-dialog.component.html',
  styleUrls: ['./customer-detail-dialog.component.scss']
})
export class CustomerDetailDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CustomerDetailDialogComponent>);

  readonly customer = inject(MAT_DIALOG_DATA) as Customer;

  get fullName(): string {
    return `${this.customer.name} ${this.customer.lastName}`.trim();
  }

  get initials(): string {
    const nameInitial = this.customer.name.trim().charAt(0);
    const lastNameInitial = this.customer.lastName.trim().charAt(0);
    return `${nameInitial}${lastNameInitial}`.toUpperCase() || '?';
  }

  close(): void {
    this.dialogRef.close();
  }
}