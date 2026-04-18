import {
  differenceInCalendarDays,
  formatDistanceToNow,
  format,
  parseISO,
  isValid,
} from 'date-fns';

export function toDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }
  if (typeof value.toDate === 'function') return value.toDate();
  if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
  return null;
}

export function relativeTime(value) {
  const date = toDate(value);
  if (!date) return '';
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatDate(value, pattern = 'MMM d, yyyy') {
  const date = toDate(value);
  if (!date) return '';
  return format(date, pattern);
}

export function daysBetween(a, b) {
  const dateA = toDate(a);
  const dateB = toDate(b);
  if (!dateA || !dateB) return 0;
  return differenceInCalendarDays(dateB, dateA);
}

export function daysUntil(value) {
  const date = toDate(value);
  if (!date) return null;
  return differenceInCalendarDays(date, new Date());
}

export function dateKey(value) {
  const date = toDate(value);
  if (!date) return '';
  return format(date, 'yyyy-MM-dd');
}
