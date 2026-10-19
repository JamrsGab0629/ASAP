import { minutesOfDay, parseTime } from '@/lib/dates';
import type { ScheduledClass } from './classesForDate';

export type NextClass = {
  item: ScheduledClass;
  status: 'ongoing' | 'upcoming';
  minutesUntil: number;
};

/** Expects classes sorted by start time. */
export function pickNextClass(classes: ScheduledClass[], now: Date): NextClass | null {
  const nowMinutes = minutesOfDay(now);
  for (const item of classes) {
    if (parseTime(item.end) <= nowMinutes) continue;
    const startMinutes = parseTime(item.start);
    if (startMinutes <= nowMinutes) return { item, status: 'ongoing', minutesUntil: 0 };
    return { item, status: 'upcoming', minutesUntil: startMinutes - nowMinutes };
  }
  return null;
}