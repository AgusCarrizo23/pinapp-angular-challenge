import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { Customer } from '../../interfaces/customer';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'app-customer-delete-dialog',
  templateUrl: './customer-delete-dialog.component.html',
  styleUrls: ['./customer-delete-dialog.component.scss']
})
export class CustomerDeleteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<CustomerDeleteDialogComponent, boolean>);
  private readonly customersService = inject(CustomersService);
  private readonly snackBar = inject(MatSnackBar);

  readonly customer = inject(MAT_DIALOG_DATA) as Customer;
  isDeleting = false;

  get fullName(): string {
    return `${this.customer.name} ${this.customer.lastName}`.trim();
  }

  confirmDelete(): void {
    if (this.isDeleting) {
      return;
    }

    if (!this.customer.id) {
      this.showError();
      return;
    }

    this.isDeleting = true;
    this.customersService.deleteCustomer(this.customer.id).pipe(
      finalize(() => {
        this.isDeleting = false;
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Cliente eliminado correctamente.', 'Cerrar', {
          duration: 3500
        });
        this.dialogRef.close(true);
      },
      error: () => this.showError()
    });
  }

  cancel(): void {
    if (!this.isDeleting) {
      this.dialogRef.close(false);
    }
  }

  private showError(): void {
    this.snackBar.open(
      'No pudimos eliminar el cliente. Intentá nuevamente.',
      'Cerrar',
      { duration: 5000 }
    );
  }
}

function trim() {
    throw new Error('Function not implemented.');
}
