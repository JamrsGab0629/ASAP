import { addDays, toISODate } from '@/lib/dates';

export const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** The Sunday-to-Saturday week containing `anchor`. */
export function getWeekDates(anchor: Date): Date[] {
  const sunday = addDays(anchor, -anchor.getDay());
  return Array.from({ length: 7 }, (_, i) => addDays(sunday, i));
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}