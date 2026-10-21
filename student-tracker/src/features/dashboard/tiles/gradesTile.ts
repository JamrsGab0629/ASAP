import { GraduationCap } from 'lucide-react-native';
import { listAllComponents } from '@/features/grades/gradeQueries';
import { averageStanding } from '@/features/grades/standing';
import type { TileProvider } from '../types';

export const gradesTile: TileProvider = {
  id: 'grades',
  label: 'Grades',
  icon: GraduationCap,
  href: '/grades',
  async load(db) {
  const average = averageStanding(await listAllComponents(db));
    return { text: average === null ? 'No grades yet' : `Avg ${average.toFixed(1)}%` };
  },
};