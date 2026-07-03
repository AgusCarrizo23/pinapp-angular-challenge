import { Customer } from '../interfaces/customer';
import { toCustomerDate } from './customer-date';

export type CustomerSortOption =
  | 'name-asc'
  | 'name-desc'
  | 'age-asc'
  | 'age-desc'
  | 'birth-date-asc'
  | 'birth-date-desc'
  | 'created-desc'
  | 'created-asc';

export function filterAndSortCustomers(
  customers: Customer[],
  searchTerm: string,
  sortOption: CustomerSortOption
): Customer[] {
  const normalizedTerm = normalizeText(searchTerm.trim());
  const filteredCustomers = normalizedTerm
    ? customers.filter((customer) =>
        normalizeText(`${customer.name} ${customer.lastName}`)
          .includes(normalizedTerm)
      )
    : [...customers];

  return filteredCustomers.sort(getCustomerComparator(sortOption));
}

export function paginateCustomers(
  customers: Customer[],
  pageIndex: number,
  pageSize: number
): Customer[] {
  const startIndex = pageIndex * pageSize;
  return customers.slice(startIndex, startIndex + pageSize);
}

function getCustomerComparator(
  sortOption: CustomerSortOption
): (first: Customer, second: Customer) => number {
  switch (sortOption) {
    case 'name-desc':
      return (first, second) => compareNames(second, first);
    case 'age-asc':
      return (first, second) => compareAges(first.age, second.age);
    case 'age-desc':
      return (first, second) => compareAges(second.age, first.age);
    case 'birth-date-asc':
      return (first, second) => compareDates(first.birthDate, second.birthDate, 1);
    case 'birth-date-desc':
      return (first, second) => compareDates(first.birthDate, second.birthDate, -1);
    case 'created-desc':
      return (first, second) => compareDates(first.createdAt, second.createdAt, -1);
    case 'created-asc':
      return (first, second) => compareDates(first.createdAt, second.createdAt, 1);
    case 'name-asc':
    default:
      return compareNames;
  }
}

function compareNames(first: Customer, second: Customer): number {
  return `${first.name} ${first.lastName}`.localeCompare(
    `${second.name} ${second.lastName}`,
    'es',
    { sensitivity: 'base' }
  );
}

function compareAges(firstAge: number | undefined, secondAge: number | undefined): number {
  if (firstAge == null && secondAge == null) {
    return 0;
  }

  if (firstAge == null) {
    return 1;
  }

  if (secondAge == null) {
    return -1;
  }

  return firstAge - secondAge;
}

function compareDates(first: unknown, second: unknown, direction: 1 | -1): number {
  const firstDate = toCustomerDate(first);
  const secondDate = toCustomerDate(second);

  if (!firstDate && !secondDate) {
    return 0;
  }

  if (!firstDate) {
    return 1;
  }

  if (!secondDate) {
    return -1;
  }

  return (firstDate.getTime() - secondDate.getTime()) * direction;
}

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}