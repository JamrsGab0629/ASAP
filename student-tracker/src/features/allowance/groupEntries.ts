import { addDays, formatShortDate, toISODate } from '@/lib/dates';
import { parseISODate } from './period';
import type { Entry } from './types';

export type DayGroup = { key: string; label: string; entries: Entry[] };

/** Expects entries sorted newest first. */
export function groupEntriesByDay(entries: Entry[], today: Date): DayGroup[] {
  const todayKey = toISODate(today);
  const yesterdayKey = toISODate(addDays(today, -1));

  const byDay = new Map<string, Entry[]>();
  for (const entry of entries) {
    const key = entry.date.slice(0, 10);
    byDay.set(key, [...(byDay.get(key) ?? []), entry]);
  }
  return [...byDay].map(([key, list]) => ({
    key,
    label: key === todayKey ? 'Today' : key === yesterdayKey ? 'Yesterday' : formatShortDate(parseISODate(key)),
    entries: list,
  }));
}