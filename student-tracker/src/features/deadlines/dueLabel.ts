import { formatShortDate } from '@/lib/dates';
import { to12h } from '@/lib/clock';
import { dayDiff } from './dayDiff';
import type { DueDeadline } from './upcomingDeadlines';

export function formatDueLabel(item: DueDeadline, now: Date): string {
  const days = dayDiff(item.dueAt, now);
  const time = to12h(item.dueAt);
  const day = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : formatShortDate(item.dueAt);
  return `${item.isOverdue ? 'Overdue · ' : ''}${day}, ${time}`;
}