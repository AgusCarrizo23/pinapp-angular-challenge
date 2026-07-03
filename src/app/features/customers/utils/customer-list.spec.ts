import { Customer } from '../interfaces/customer';
import { filterAndSortCustomers, paginateCustomers } from './customer-list';

describe('customer list utilities', () => {
  const customers: Customer[] = [
    createCustomer('Agustina', 'Carrizo', 32, '1992-04-10', '2024-01-02'),
    createCustomer('Martín', 'Álvarez', 45, '1979-08-20', '2024-03-15'),
    createCustomer('Bruno', 'Díaz', 24, '2000-02-01', '2023-11-05')
  ];

  it('filters by name, last name and full name without case or accent sensitivity', () => {
    expect(filterAndSortCustomers(customers, 'AGUS', 'name-asc').map(({ name }) => name))
      .toEqual(['Agustina']);
    expect(filterAndSortCustomers(customers, 'alvarez', 'name-asc').map(({ name }) => name))
      .toEqual(['Martín']);
    expect(filterAndSortCustomers(customers, 'agustina carrizo', 'name-asc').length)
      .toBe(1);
  });

  it('sorts by age in both directions', () => {
    expect(filterAndSortCustomers(customers, '', 'age-asc').map(({ age }) => age))
      .toEqual([24, 32, 45]);
    expect(filterAndSortCustomers(customers, '', 'age-desc').map(({ age }) => age))
      .toEqual([45, 32, 24]);
  });

  it('sorts by name and birth date in both directions', () => {
    expect(filterAndSortCustomers(customers, '', 'name-desc').map(({ name }) => name))
      .toEqual(['Martín', 'Bruno', 'Agustina']);
    expect(filterAndSortCustomers(customers, '', 'birth-date-asc').map(({ name }) => name))
      .toEqual(['Martín', 'Agustina', 'Bruno']);
    expect(filterAndSortCustomers(customers, '', 'birth-date-desc').map(({ name }) => name))
      .toEqual(['Bruno', 'Agustina', 'Martín']);
  });

  it('sorts customers by creation date with the newest first', () => {
    expect(filterAndSortCustomers(customers, '', 'created-desc').map(({ name }) => name))
      .toEqual(['Martín', 'Agustina', 'Bruno']);
  });

  it('returns only the customers belonging to the requested page', () => {
    expect(paginateCustomers(customers, 1, 2).map(({ name }) => name))
      .toEqual(['Bruno']);
  });

  function createCustomer(
    name: string,
    lastName: string,
    age: number,
    birthDate: string,
    createdAt: string
  ): Customer {
    return { name, lastName, age, birthDate, createdAt };
  }
});