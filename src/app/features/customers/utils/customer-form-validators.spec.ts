/// <reference types="jasmine" />

import { FormControl, FormGroup } from '@angular/forms';

import {
  ageBirthDateConsistencyValidator,
  calculateAge,
  lettersOnlyValidator,
  noWhitespaceValidator,
  notFutureDateValidator,
  positiveIntegerValidator,
  sanitizeLettersInput
} from './customer-form-validators';

describe('customer form validators', () => {
  it('rejects text containing only whitespace', () => {
    expect(noWhitespaceValidator(new FormControl('   '))).toEqual({ whitespace: true });
    expect(noWhitespaceValidator(new FormControl('Agustina'))).toBeNull();
  });

  it('accepts Unicode letters and spaces', () => {
    expect(lettersOnlyValidator(new FormControl('María José'))).toBeNull();
    expect(lettersOnlyValidator(new FormControl('Muñoz'))).toBeNull();
  });

  it('rejects numbers and special characters in names', () => {
    expect(lettersOnlyValidator(new FormControl('Agustina123')))
      .toEqual({ lettersOnly: true });
    expect(lettersOnlyValidator(new FormControl('Carrizo!')))
      .toEqual({ lettersOnly: true });
  });

  it('removes invalid characters from typed or pasted text', () => {
    expect(sanitizeLettersInput('María123 José!')).toBe('María José');
  });

  it('rejects decimal values for age', () => {
    expect(positiveIntegerValidator(new FormControl(25.5))).toEqual({ integer: true });
    expect(positiveIntegerValidator(new FormControl(25))).toBeNull();
  });

  it('rejects future birth dates', () => {
    const validator = notFutureDateValidator(new Date(2026, 6, 3));

    expect(validator(new FormControl(new Date(2026, 6, 4))))
      .toEqual({ futureDate: true });
    expect(validator(new FormControl(new Date(2026, 6, 3)))).toBeNull();
  });

  it('calculates age according to whether the birthday has passed', () => {
    expect(calculateAge(new Date(1990, 8, 10), new Date(2026, 6, 3))).toBe(35);
    expect(calculateAge(new Date(1990, 4, 10), new Date(2026, 6, 3))).toBe(36);
  });

  it('allows one year of difference and rejects larger mismatches', () => {
    const today = new Date();
    const form = new FormGroup({
      age: new FormControl(34),
      birthDate: new FormControl(new Date(
        today.getFullYear() - 35,
        today.getMonth(),
        today.getDate()
      ))
    });

    expect(ageBirthDateConsistencyValidator(form)).toBeNull();

    form.controls.age.setValue(20);
    expect(ageBirthDateConsistencyValidator(form))
      .toEqual({ ageBirthDateMismatch: true });
  });
});