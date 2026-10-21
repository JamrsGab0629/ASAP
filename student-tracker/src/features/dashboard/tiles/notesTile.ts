import { FileText } from 'lucide-react-native';
import { plural } from '@/lib/format';
import type { TileProvider } from '../types';

export const notesTile: TileProvider = {
  id: 'notes',
  label: 'Notes',
  icon: FileText,
  href: '/notes',
  async load(db) {
    const row = await db.getFirstAsync<{ total: number; flagged: number }>(
      'SELECT COUNT(*) AS total, COALESCE(SUM(review_flag), 0) AS flagged FROM notes'
    );
    const total = row?.total ?? 0;
    const flagged = row?.flagged ?? 0;
    if (total === 0) return { text: 'No notes yet' };
    return { text: flagged > 0 ? `${flagged} to review` : plural(total, 'note', 'notes') };
  },
};