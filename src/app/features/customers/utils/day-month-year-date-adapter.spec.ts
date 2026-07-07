/// <reference types="jasmine" />

import { DayMonthYearDateAdapter } from './day-month-year-date-adapter';

describe('DayMonthYearDateAdapter', () => {
  const adapter = new DayMonthYearDateAdapter('es-AR');

  it('parses manually entered dates as day/month/year', () => {
    const date = adapter.parse('2/8/2000');

    expect(date?.getFullYear()).toBe(2000);
    expect(date?.getMonth()).toBe(7);
    expect(date?.getDate()).toBe(2);
  });

  it('accepts leading zeroes and surrounding whitespace', () => {
    const date = adapter.parse(' 02/08/2000 ');

    expect(date?.getFullYear()).toBe(2000);
    expect(date?.getMonth()).toBe(7);
    expect(date?.getDate()).toBe(2);
  });

  it('accepts leap days in leap years', () => {
    expect(adapter.isValid(adapter.parse('29/2/2000') as Date)).toBeTrue();
  });

  it('rejects impossible dates and unsupported formats', () => {
    expect(adapter.isValid(adapter.parse('31/4/2000') as Date)).toBeFalse();
    expect(adapter.isValid(adapter.parse('29/2/2001') as Date)).toBeFalse();
    expect(adapter.isValid(adapter.parse('2000-08-02') as Date)).toBeFalse();
  });
});