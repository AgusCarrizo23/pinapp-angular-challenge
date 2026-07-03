/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

import { Customer } from '../../interfaces/customer';
import { CustomersService } from '../../services/customers.service';
import { CustomerDeleteDialogComponent } from './customer-delete-dialog.component';

describe('CustomerDeleteDialogComponent', () => {
  let component: CustomerDeleteDialogComponent;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CustomerDeleteDialogComponent, boolean>>;
  let customersService: jasmine.SpyObj<CustomersService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const customer: Customer = {
    id: 'customer-1',
    name: 'Agustina',
    lastName: 'Carrizo',
    age: 30,
    birthDate: new Date(1996, 0, 15)
  };

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<CustomerDeleteDialogComponent, boolean>>(
      'MatDialogRef',
      ['close']
    );
    customersService = jasmine.createSpyObj<CustomersService>(
      'CustomersService',
      ['deleteCustomer']
    );
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      providers: [
        CustomerDeleteDialogComponent,
        { provide: MAT_DIALOG_DATA, useValue: customer },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: CustomersService, useValue: customersService },
        { provide: MatSnackBar, useValue: snackBar }
      ]
    });

    component = TestBed.inject(CustomerDeleteDialogComponent);
  });

  it('closes without deleting when cancelled', () => {
    component.cancel();

    expect(customersService.deleteCustomer).not.toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('deletes the customer and closes with a successful result', () => {
    customersService.deleteCustomer.and.returnValue(of(void 0));

    component.confirmDelete();

    expect(customersService.deleteCustomer).toHaveBeenCalledOnceWith('customer-1');
    expect(snackBar.open).toHaveBeenCalledWith(
      'Cliente eliminado correctamente.',
      'Cerrar',
      { duration: 3500 }
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('keeps the dialog open and restores its state when deletion fails', () => {
    customersService.deleteCustomer.and.returnValue(
      throwError(() => new Error('Firestore error'))
    );

    component.confirmDelete();

    expect(dialogRef.close).not.toHaveBeenCalled();
    expect(component.isDeleting).toBeFalse();
    expect(snackBar.open).toHaveBeenCalledWith(
      'No pudimos eliminar el cliente. Intentá nuevamente.',
      'Cerrar',
      { duration: 5000 }
    );
  });
});