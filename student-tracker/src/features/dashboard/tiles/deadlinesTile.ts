import { Flag } from 'lucide-react-native';
import { countOpenDueOnOrBefore } from '@/features/deadlines/upcomingDeadlines';
import { addDays, toISODate } from '@/lib/dates';
import type { TileProvider } from '../types';

export const deadlinesTile: TileProvider = {
  id: 'deadlines',
  label: 'Deadlines',
  icon: Flag,
  href: null,
  async load(db, today) {
    const count = await countOpenDueOnOrBefore(db, toISODate(addDays(today, 7)));
    return { text: count === 0 ? 'All clear' : `${count} due soon` };
  },
};