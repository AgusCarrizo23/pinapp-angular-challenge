import { Pipe, PipeTransform } from '@angular/core';

import { toCustomerDate } from '../utils/customer-date';

@Pipe({
  name: 'customerBirthDate'
})
export class CustomerBirthDatePipe implements PipeTransform {
  private readonly formatter = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  transform(value: unknown): string {
    const date = toCustomerDate(value);
    return date ? this.formatter.format(date) : '—';
  }
}