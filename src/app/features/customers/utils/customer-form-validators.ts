import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import { toCustomerDate } from './customer-date';

export function noWhitespaceValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  return typeof value === 'string' && value.trim().length === 0
    ? { whitespace: true }
    : null;
}

export function positiveIntegerValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  return value === null || value === '' || Number.isInteger(value)
    ? null
    : { integer: true };
}

export function notFutureDateValidator(today = new Date()): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = toCustomerDate(control.value);

    if (!value) {
      return null;
    }

    return startOfDay(value).getTime() > startOfDay(today).getTime()
      ? { futureDate: true }
      : null;
  };
}

export const ageBirthDateConsistencyValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const age = control.get('age')?.value;
  const birthDate = toCustomerDate(control.get('birthDate')?.value);

  if (typeof age !== 'number' || !birthDate) {
    return null;
  }

  const calculatedAge = calculateAge(birthDate);
  return calculatedAge !== null && Math.abs(calculatedAge - age) > 1
    ? { ageBirthDateMismatch: true }
    : null;
};

export function calculateAge(
  birthDateValue: unknown,
  today = new Date()
): number | null {
  const birthDate = toCustomerDate(birthDateValue);
  const currentDate = startOfDay(today);

  if (!birthDate || startOfDay(birthDate).getTime() > currentDate.getTime()) {
    return null;
  }

  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const birthdayHasPassed = currentDate.getMonth() > birthDate.getMonth()
    || (currentDate.getMonth() === birthDate.getMonth()
      && currentDate.getDate() >= birthDate.getDate());

  if (!birthdayHasPassed) {
    age -= 1;
  }

  return age;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}