import { Component, OnDestroy, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, finalize, takeUntil } from 'rxjs';

import { Customer } from '../../interfaces/customer';
import { CustomersService } from '../../services/customers.service';
import { toCustomerDate } from '../../utils/customer-date';
import {
  calculateAge,
  lettersOnlyValidator,
  noWhitespaceValidator,
  notFutureDateValidator
} from '../../utils/customer-form-validators';

@Component({
  selector: 'app-customer-edit-dialog',
  templateUrl: './customer-edit-dialog.component.html',
  styleUrls: ['./customer-edit-dialog.component.scss']
})
export class CustomerEditDialogComponent implements OnDestroy {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly dialogRef = inject(MatDialogRef<CustomerEditDialogComponent, boolean>);
  private readonly customersService = inject(CustomersService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyed$ = new Subject<void>();

  readonly customer = inject(MAT_DIALOG_DATA) as Customer;
  private readonly initialBirthDate = toCustomerDate(this.customer.birthDate);
  readonly maxBirthDate = new Date();
  readonly customerForm = this.formBuilder.group(
    {
      name: [this.customer.name, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        noWhitespaceValidator,
        lettersOnlyValidator
      ]],
      lastName: [this.customer.lastName, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        noWhitespaceValidator,
        lettersOnlyValidator
      ]],
      age: this.formBuilder.control<number | null>(calculateAge(this.initialBirthDate), [
        Validators.required,
        Validators.min(1),
        Validators.max(120)
      ]),
      birthDate: this.formBuilder.control<Date | null>(
        this.initialBirthDate,
        [Validators.required, notFutureDateValidator(this.maxBirthDate)]
      )
    }
  );

  isSaving = false;

  constructor() {
    this.customerForm.controls.birthDate.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((birthDate) => {
        this.customerForm.controls.age.setValue(calculateAge(birthDate), {
          emitEvent: false
        });
        this.customerForm.controls.age.markAsTouched();
      });
  }

  submit(): void {
    if (this.customerForm.invalid || this.isSaving) {
      this.customerForm.markAllAsTouched();
      return;
    }

    if (!this.customer.id) {
      this.showError();
      return;
    }

    const value = this.customerForm.getRawValue();
    this.isSaving = true;
    this.customersService.updateCustomer(this.customer.id, {
      name: value.name.trim(),
      lastName: value.lastName.trim(),
      age: value.age as number,
      birthDate: value.birthDate as Date
    }).pipe(
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Cliente actualizado correctamente.', 'Cerrar', {
          duration: 3500
        });
        this.dialogRef.close(true);
      },
      error: () => this.showError()
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  getNameErrorMessage(): string {
    return this.getTextErrorMessage('name', 'nombre');
  }

  getLastNameErrorMessage(): string {
    return this.getTextErrorMessage('lastName', 'apellido');
  }

  getAgeErrorMessage(): string {
    const control = this.customerForm.controls.age;

    if (control.hasError('required')) {
      return 'La edad es obligatoria.';
    }

    if (control.hasError('min')) {
      return 'La edad debe ser mayor a 0.';
    }

    if (control.hasError('max')) {
      return 'La edad no puede ser mayor a 120.';
    }

    return '';
  }

  getBirthDateErrorMessage(): string {
    const control = this.customerForm.controls.birthDate;

    if (control.hasError('required')) {
      return 'La fecha de nacimiento es obligatoria.';
    }

    if (control.hasError('matDatepickerParse')) {
      return 'Ingresá una fecha válida.';
    }

    return control.hasError('futureDate') || control.hasError('matDatepickerMax')
      ? 'La fecha de nacimiento no puede ser futura.'
      : '';
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private getTextErrorMessage(
    field: 'name' | 'lastName',
    label: string
  ): string {
    const control = this.customerForm.controls[field];

    if (control.hasError('required') || control.hasError('whitespace')) {
      return `El ${label} es obligatorio.`;
    }

    if (control.hasError('lettersOnly')) {
      return `El ${label} solo puede contener letras.`;
    }

    if (control.hasError('minlength')) {
      return `El ${label} debe tener al menos 2 caracteres.`;
    }

    return control.hasError('maxlength')
      ? `El ${label} no puede superar los 50 caracteres.`
      : '';
  }

  private showError(): void {
    this.snackBar.open(
      'No pudimos actualizar el cliente. Intentá nuevamente.',
      'Cerrar',
      { duration: 5000 }
    );
  }
}