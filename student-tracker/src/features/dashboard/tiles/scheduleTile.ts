import { CalendarDays } from 'lucide-react-native';
import { getClassesForDate } from '@/features/schedule/classesForDate';
import { plural } from '@/lib/format';
import type { TileProvider } from '../types';

export const scheduleTile: TileProvider = {
  id: 'schedule',
  label: 'Schedule',
  icon: CalendarDays,
  href: null,
  async load(db, today) {
    const classes = await getClassesForDate(db, today);
    return { text: classes.length === 0 ? 'No classes today' : `${plural(classes.length, 'class', 'classes')} today` };
  },
};