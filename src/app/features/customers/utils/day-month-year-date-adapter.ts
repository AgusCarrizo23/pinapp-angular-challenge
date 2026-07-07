import { Inject, Injectable } from '@angular/core';
import { MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';

@Injectable()
export class DayMonthYearDateAdapter extends NativeDateAdapter {
  constructor(@Inject(MAT_DATE_LOCALE) locale: string) {
    super(locale);
  }

  override parse(value: unknown): Date | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (value instanceof Date) {
      return this.clone(value);
    }

    if (typeof value === 'number') {
      return new Date(value);
    }

    if (typeof value !== 'string') {
      return this.invalid();
    }

    const match = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (!match) {
      return this.invalid();
    }

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const date = new Date(0);

    date.setHours(0, 0, 0, 0);
    date.setFullYear(year, month - 1, day);

    return date.getFullYear() === year
      && date.getMonth() === month - 1
      && date.getDate() === day
      ? date
      : this.invalid();
  }

  override format(date: Date, displayFormat: Intl.DateTimeFormatOptions): string {
    if (
      displayFormat.day === 'numeric'
      && displayFormat.month === 'numeric'
      && displayFormat.year === 'numeric'
    ) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');

      return `${day}/${month}/${date.getFullYear()}`;
    }

    return super.format(date, displayFormat);
  }
}