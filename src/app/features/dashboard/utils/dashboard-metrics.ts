import { Customer } from '../../customers/interfaces/customer';

export function getAverageAge(customers: Customer[]): number {
  const ages = getValidAges(customers);

  if (ages.length === 0) {
    return 0;
  }

  return roundToOneDecimal(getMean(ages));
}

export function getAgeStandardDeviation(customers: Customer[]): number {
  const ages = getValidAges(customers);

  if (ages.length === 0) {
    return 0;
  }

  const average = getMean(ages);
  const variance = ages.reduce(
    (sum, age) => sum + Math.pow(age - average, 2),
    0
  ) / ages.length;

  return roundToOneDecimal(Math.sqrt(variance));
}

function getValidAges(customers: Customer[]): number[] {
  return customers
    .map(({ age }) => age)
    .filter((age): age is number => typeof age === 'number' && Number.isFinite(age) && age >= 0);
}

function getMean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function roundToOneDecimal(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}