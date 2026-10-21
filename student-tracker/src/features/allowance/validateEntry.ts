import { toISODate } from '@/lib/dates';
import type { EntryDraft, EntryType } from './types';

export const parseAmount = (text: string) => Number(text.trim().replace(/,/g, ''));

export type EntryFields = { type: EntryType; amount: string; category: string | null; note: string; date: Date };

export function parseEntry(fields: EntryFields): { draft: EntryDraft } | { error: string } {
  const amount = parseAmount(fields.amount);
  if (!(amount > 0) || !Number.isFinite(amount)) return { error: 'Enter an amount more than 0.' };
  return {
    draft: {
      amount,
      type: fields.type,
      category: fields.type === 'expense' ? fields.category : null,
      date: toISODate(fields.date),
      note: fields.note.trim() || null,
    },
  };
}