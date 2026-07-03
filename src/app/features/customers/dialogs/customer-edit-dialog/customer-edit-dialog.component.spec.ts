/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { Customer } from '../../interfaces/customer';
import { CustomersService } from '../../services/customers.service';
import { CustomerEditDialogComponent } from './customer-edit-dialog.component';

describe('CustomerEditDialogComponent', () => {
  let component: CustomerEditDialogComponent;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CustomerEditDialogComponent, boolean>>;
  let customersService: jasmine.SpyObj<CustomersService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const today = new Date();
  const birthDate = new Date(
    today.getFullYear() - 30,
    today.getMonth(),
    today.getDate()
  );
  const customer: Customer = {
    id: 'customer-1',
    name: 'Agustina',
    lastName: 'Carrizo',
    age: 30,
    birthDate: { toDate: () => birthDate }
  };

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<CustomerEditDialogComponent, boolean>>(
      'MatDialogRef',
      ['close']
    );
    customersService = jasmine.createSpyObj<CustomersService>(
      'CustomersService',
      ['updateCustomer']
    );
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        CustomerEditDialogComponent,
        { provide: MAT_DIALOG_DATA, useValue: customer },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: CustomersService, useValue: customersService },
        { provide: MatSnackBar, useValue: snackBar }
      ]
    });

    component = TestBed.inject(CustomerEditDialogComponent);
  });

  it('preloads the customer and converts its Firestore date', () => {
    expect(component.customerForm.getRawValue()).toEqual({
      name: 'Agustina',
      lastName: 'Carrizo',
      age: 30,
      birthDate
    });
  });

  it('recalculates age when birth date changes', () => {
    const newBirthDate = new Date(
      today.getFullYear() - 22,
      today.getMonth(),
      today.getDate()
    );

    component.customerForm.controls.birthDate.setValue(newBirthDate);

    expect(component.customerForm.controls.age.value).toBe(22);
  });

  it('updates the customer and closes with a successful result', () => {
    customersService.updateCustomer.and.returnValue(of(void 0));

    component.submit();

    expect(customersService.updateCustomer).toHaveBeenCalledWith(
      'customer-1',
      jasmine.objectContaining({
        name: 'Agustina',
        lastName: 'Carrizo',
        age: 30,
        birthDate
      })
    );
    expect(snackBar.open).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('closes without saving when cancelled', () => {
    component.cancel();

    expect(customersService.updateCustomer).not.toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});