export function formatBirthDateInput(digits: string): string {
  const value = digits.replace(/\D/g, '').slice(0, 8);

  if (value.length < 2) {
    return value;
  }

  if (value.length < 4) {
    return `${value.slice(0, 2)}/${value.slice(2)}`;
  }

  return `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
}

export function isValidPartialBirthDate(
  digits: string,
  maxYear = new Date().getFullYear()
): boolean {
  if (!/^\d{0,8}$/.test(digits)) {
    return false;
  }

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  if (day.length === 1 && Number(day) > 3) {
    return false;
  }

  if (day.length === 2 && (Number(day) < 1 || Number(day) > 31)) {
    return false;
  }

  if (month.length === 1 && Number(month) > 1) {
    return false;
  }

  if (month.length === 2 && (Number(month) < 1 || Number(month) > 12)) {
    return false;
  }

  if (year.length > 0) {
    const lowestPossibleYear = Number(year) * (10 ** (4 - year.length));

    if (lowestPossibleYear > maxYear) {
      return false;
    }
  }

  return year.length < 4 || Number(year) > 0;
}