import { Component, OnDestroy, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { Subject, finalize, takeUntil } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { Customer } from '../../interfaces/customer';
import { CustomersService } from '../../services/customers.service';
import {
  ageBirthDateConsistencyValidator,
  calculateAge,
  noWhitespaceValidator,
  notFutureDateValidator,
  positiveIntegerValidator
} from '../../utils/customer-form-validators';

@Component({
  selector: 'app-customer-form-page',
  templateUrl: './customer-form-page.component.html',
  styleUrls: ['./customer-form-page.component.scss']
})
export class CustomerFormPageComponent implements OnDestroy {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly customersService = inject(CustomersService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly destroyed$ = new Subject<void>();

  readonly maxBirthDate = new Date();
  readonly customerForm = this.formBuilder.group(
    {
      name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        noWhitespaceValidator
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        noWhitespaceValidator
      ]],
      age: this.formBuilder.control<number | null>(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(120),
        positiveIntegerValidator
      ]),
      birthDate: this.formBuilder.control<Date | null>(null, [
        Validators.required,
        notFutureDateValidator(this.maxBirthDate)
      ])
    },
    { validators: ageBirthDateConsistencyValidator }
  );

  isSaving = false;

  constructor() {
    this.customerForm.controls.birthDate.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((birthDate) => {
        this.customerForm.controls.age.setValue(calculateAge(birthDate), {
          emitEvent: false
        });
        this.customerForm.updateValueAndValidity({ emitEvent: false });
        this.customerForm.controls.age.markAsTouched();
      });
  }

  submit(): void {
    if (this.customerForm.invalid || this.isSaving) {
      this.customerForm.markAllAsTouched();
      return;
    }

    const formValue = this.customerForm.getRawValue();
    const customer: Customer = {
      name: formValue.name.trim(),
      lastName: formValue.lastName.trim(),
      age: formValue.age as number,
      birthDate: formValue.birthDate as Date
    };

    this.isSaving = true;
    this.customersService.createCustomer(customer).pipe(
      finalize(() => {
        this.isSaving = false;
      })
    ).subscribe({
      next: () => {
        this.snackBar.open('Cliente registrado correctamente.', 'Cerrar', {
          duration: 3500
        });
        this.router.navigate(['/customers']);
      },
      error: (error: unknown) => {
        if (!environment.production) {
          console.error('Error al registrar el cliente en Firestore:', error);
        }

        this.snackBar.open(
          this.getSaveErrorMessage(error),
          'Cerrar',
          { duration: 5000 }
        );
      }
    });
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

    return control.hasError('integer') ? 'La edad debe ser un número entero.' : '';
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

    if (control.hasError('minlength')) {
      return `El ${label} debe tener al menos 2 caracteres.`;
    }

    return control.hasError('maxlength')
      ? `El ${label} no puede superar los 50 caracteres.`
      : '';
  }

  private getSaveErrorMessage(error: unknown): string {
    if (!(error instanceof FirebaseError)) {
      return 'No pudimos registrar el cliente. Intentá nuevamente.';
    }

    switch (error.code) {
      case 'permission-denied':
      case 'firestore/permission-denied':
        return 'No tenés permisos para registrar clientes. Revisá las reglas de Firestore.';
      case 'failed-precondition':
      case 'firestore/failed-precondition':
        return 'Firestore no está listo para guardar datos en este proyecto.';
      case 'unavailable':
      case 'firestore/unavailable':
        return 'Firestore no está disponible. Verificá tu conexión e intentá nuevamente.';
      default:
        return 'No pudimos registrar el cliente. Intentá nuevamente.';
    }
  }
}