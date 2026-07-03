/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Customer } from '../../interfaces/customer';
import { CustomerDetailDialogComponent } from './customer-detail-dialog.component';

describe('CustomerDetailDialogComponent', () => {
  const customer: Customer = {
    id: 'customer-1',
    name: 'Agustina',
    lastName: 'Carrizo',
    age: 29,
    birthDate: new Date(1997, 3, 15)
  };

  let dialogRef: jasmine.SpyObj<MatDialogRef<CustomerDetailDialogComponent>>;
  let component: CustomerDetailDialogComponent;

  beforeEach(() => {
    dialogRef = jasmine.createSpyObj<MatDialogRef<CustomerDetailDialogComponent>>(
      'MatDialogRef',
      ['close']
    );

    TestBed.configureTestingModule({
      providers: [
        CustomerDetailDialogComponent,
        { provide: MAT_DIALOG_DATA, useValue: customer },
        { provide: MatDialogRef, useValue: dialogRef }
      ]
    });

    component = TestBed.inject(CustomerDetailDialogComponent);
  });

  it('builds the full name and initials from the received customer', () => {
    expect(component.fullName).toBe('Agustina Carrizo');
    expect(component.initials).toBe('AC');
  });

  it('closes the dialog', () => {
    component.close();

    expect(dialogRef.close).toHaveBeenCalled();
  });
});