import { Customer } from '../../customers/interfaces/customer';
import { getAgeStandardDeviation, getAverageAge } from './dashboard-metrics';

describe('dashboard metrics', () => {
  it('returns zero metrics when there are no customers', () => {
    expect(getAverageAge([])).toBe(0);
    expect(getAgeStandardDeviation([])).toBe(0);
  });

  it('calculates the average age rounded to one decimal', () => {
    const customers = createCustomers(21, 34, 54);

    expect(getAverageAge(customers)).toBe(36.3);
  });

  it('calculates the population standard deviation rounded to one decimal', () => {
    const customers = createCustomers(20, 30, 40);

    expect(getAgeStandardDeviation(customers)).toBe(8.2);
  });

  function createCustomers(...ages: number[]): Customer[] {
    return ages.map((age) => ({
      name: 'Test',
      lastName: 'User',
      age,
    }));
  }
});