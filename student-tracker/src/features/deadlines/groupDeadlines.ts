import { dayDiff } from './dayDiff';
import type { DueDeadline } from './upcomingDeadlines';

export type DeadlineSection = { title: string; data: DueDeadline[] };

type Bucket = { title: string; accepts: (d: DueDeadline, days: number) => boolean };

/** First matching bucket wins, so order matters. */
const BUCKETS: Bucket[] = [
  { title: 'Overdue', accepts: (d) => d.isOverdue },
  { title: 'Today', accepts: (_, days) => days === 0 },
  { title: 'Tomorrow', accepts: (_, days) => days === 1 },
  { title: 'Next 7 days', accepts: (_, days) => days <= 7 },
  { title: 'Later', accepts: () => true },
];

/** Expects open deadlines sorted by due date. */
export function groupDeadlines(items: DueDeadline[], now: Date): DeadlineSection[] {
  const sections: DeadlineSection[] = BUCKETS.map((b) => ({ title: b.title, data: [] }));
  for (const item of items) {
    const days = dayDiff(item.dueAt, now);
    const index = BUCKETS.findIndex((b) => b.accepts(item, days));
    sections[index].data.push(item);
  }
  return sections.filter((s) => s.data.length > 0);
}