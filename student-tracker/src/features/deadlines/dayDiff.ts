import { toISODate } from '@/lib/dates';

/** Calendar days from `from` to `to` (negative if `to` is earlier). */
export function dayDiff(to: Date, from: Date): number {
  return Math.round((Date.parse(toISODate(to)) - Date.parse(toISODate(from))) / 86_400_000);
}