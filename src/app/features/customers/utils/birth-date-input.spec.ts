/// <reference types="jasmine" />

import {
  formatBirthDateInput,
  isValidPartialBirthDate
} from './birth-date-input';

describe('birth date input helpers', () => {
  it('formats at most eight digits as DD/MM/YYYY', () => {
    expect(formatBirthDateInput('02082000')).toBe('02/08/2000');
    expect(formatBirthDateInput('020820001234')).toBe('02/08/2000');
    expect(formatBirthDateInput('02-08-2000')).toBe('02/08/2000');
  });

  it('supports partial input while adding the separators', () => {
    expect(formatBirthDateInput('0')).toBe('0');
    expect(formatBirthDateInput('02')).toBe('02/');
    expect(formatBirthDateInput('0208')).toBe('02/08/');
  });

  it('rejects days over 31 and months over 12', () => {
    expect(isValidPartialBirthDate('4', 2025)).toBeFalse();
    expect(isValidPartialBirthDate('32', 2025)).toBeFalse();
    expect(isValidPartialBirthDate('3113', 2025)).toBeFalse();
    expect(isValidPartialBirthDate('3112', 2025)).toBeTrue();
  });

  it('rejects years above the configured maximum', () => {
    expect(isValidPartialBirthDate('31122025', 2025)).toBeTrue();
    expect(isValidPartialBirthDate('31122026', 2025)).toBeFalse();
    expect(isValidPartialBirthDate('31123', 2025)).toBeFalse();
  });
});