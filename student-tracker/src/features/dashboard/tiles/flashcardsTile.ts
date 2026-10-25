import { Layers } from 'lucide-react-native';
import { toISODate } from '@/lib/dates';
import type { TileProvider } from '../types';

export const flashcardsTile: TileProvider = {
  id: 'flashcards',
  label: 'Flashcards',
  icon: Layers,
  href: '/flashcards',
  async load(db, today) {
    const row = await db.getFirstAsync<{ n: number }>(
      'SELECT COUNT(*) AS n FROM cards WHERE next_review IS NULL OR substr(next_review, 1, 10) <= ?',
      toISODate(today)
    );
    const due = row?.n ?? 0;
    return { text: due === 0 ? 'Nothing due' : `${due} to review` };
  },
};