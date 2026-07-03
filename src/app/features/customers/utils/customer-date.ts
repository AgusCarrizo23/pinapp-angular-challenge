interface FirestoreTimestampLike {
  toDate(): Date;
}

export function toCustomerDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return isValidDate(value) ? value : null;
  }

  if (isFirestoreTimestamp(value)) {
    const date = value.toDate();
    return isValidDate(date) ? date : null;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isValidDate(date) ? date : null;
  }

  return null;
}

function isFirestoreTimestamp(value: unknown): value is FirestoreTimestampLike {
  return typeof value === 'object'
    && value !== null
    && 'toDate' in value
    && typeof (value as FirestoreTimestampLike).toDate === 'function';
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}