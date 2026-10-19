import { BookOpen } from 'lucide-react-native';
import { plural } from '@/lib/format';
import type { TileProvider } from '../types';

export const subjectsTile: TileProvider = {
  id: 'subjects',
  label: 'Subjects',
  icon: BookOpen,
  href: '/subjects',
  async load(db) {
    const row = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM subjects');
    const count = row?.n ?? 0;
    return { text: count === 0 ? 'Add your first' : plural(count, 'subject', 'subjects') };
  },
};