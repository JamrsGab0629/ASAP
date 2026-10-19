import { toISODate } from '@/lib/dates';

const pad = (n: number) => String(n).padStart(2, '0');

/** Local time as 'YYYY-MM-DDTHH:mm', the format stored in deadlines.due_date. */
export function toDueDateString(d: Date): string {
  return `${toISODate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function combineDateAndTime(date: Date, time: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
}