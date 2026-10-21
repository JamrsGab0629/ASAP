export type EntryType = 'expense' | 'income';

export type Entry = {
  id: number;
  amount: number;
  type: EntryType;
  category: string | null;
  date: string; // 'YYYY-MM-DD'
  note: string | null;
};

export type EntryDraft = Omit<Entry, 'id'>;
