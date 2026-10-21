import { addDays, formatLongDate, formatShortDate, toISODate } from '@/lib/dates';

export type PeriodType = 'day' | 'week' | 'month';
export type Period = { start: string; end: string }; // 'YYYY-MM-DD', both inclusive

export const PERIOD_OPTIONS: { value: PeriodType; label: string }[] = [
  { value: 'day', label: 'Daily' },
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
];

export const THIS_PERIOD: Record<PeriodType, string> = { day: 'today', week: 'this week', month: 'this month' };
export const EVERY_PERIOD: Record<PeriodType, string> = { day: 'day', week: 'week', month: 'month' };

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(fromISO: string, toISO: string): number {
  return Math.round((parseISODate(toISO).getTime() - parseISODate(fromISO).getTime()) / 86_400_000);
}

/** Tolerates other spellings that may already be in the database. */
export function toPeriodType(value: string): PeriodType {
  const map: Record<string, PeriodType> = { day: 'day', daily: 'day', week: 'week', weekly: 'week', month: 'month', monthly: 'month' };
  return map[value.toLowerCase()] ?? 'month';
}

type Strategy = {
  bounds(date: Date): { start: Date; end: Date };
  shift(start: Date, direction: 1 | -1): Date;
};

/** To support a new kind of period (say, every two weeks), add one entry here. */
const STRATEGIES: Record<PeriodType, Strategy> = {
  day: {
    bounds: (d) => ({ start: d, end: d }),
    shift: (s, dir) => addDays(s, dir),
  },
  week: {
    bounds: (d) => {
      const start = addDays(d, -((d.getDay() + 6) % 7)); // weeks run Monday to Sunday
      return { start, end: addDays(start, 6) };
    },
    shift: (s, dir) => addDays(s, 7 * dir),
  },
  month: {
    bounds: (d) => ({ start: new Date(d.getFullYear(), d.getMonth(), 1), end: new Date(d.getFullYear(), d.getMonth() + 1, 0) }),
    shift: (s, dir) => new Date(s.getFullYear(), s.getMonth() + dir, 1),
  },
};

/** The period containing `today`, moved `offset` periods (0 = now, -1 = previous). */
export function periodAt(type: PeriodType, today: Date, offset: number): Period {
  const strategy = STRATEGIES[type];
  let { start } = strategy.bounds(today);
  const step = offset < 0 ? -1 : 1;
  for (let i = 0; i < Math.abs(offset); i++) start = strategy.shift(start, step);
  return { start: toISODate(start), end: toISODate(strategy.bounds(start).end) };
}

export function periodLabel(type: PeriodType, period: Period): string {
  const start = parseISODate(period.start);
  if (type === 'day') return formatLongDate(start);
  return `${formatShortDate(start)} – ${formatShortDate(parseISODate(period.end))}`;
}