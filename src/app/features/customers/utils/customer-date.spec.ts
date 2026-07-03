import { toCustomerDate } from './customer-date';

describe('customer date utilities', () => {
  it('keeps valid Date values', () => {
    const date = new Date(1990, 4, 12);

    expect(toCustomerDate(date)).toBe(date);
  });

  it('converts Firestore Timestamp-like values', () => {
    const date = new Date(2001, 8, 3);

    expect(toCustomerDate({ toDate: () => date })).toBe(date);
  });

  it('returns null for invalid values', () => {
    expect(toCustomerDate(null)).toBeNull();
    expect(toCustomerDate('invalid-date')).toBeNull();
  });
});