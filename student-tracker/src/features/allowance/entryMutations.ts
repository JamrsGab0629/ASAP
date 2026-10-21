import type { SQLiteDatabase } from 'expo-sqlite';
import type { EntryDraft } from './types';

export async function addEntry(db: SQLiteDatabase, d: EntryDraft): Promise<void> {
  await db.runAsync(
    `INSERT INTO allowance_entries (amount, type, category, date, note) VALUES (?, ?, ?, ?, ?)`,
    d.amount, d.type, d.category, d.date, d.note,
  );
}

export async function updateEntry(db: SQLiteDatabase, id: number, d: EntryDraft): Promise<void> {
  await db.runAsync(
    `UPDATE allowance_entries SET amount = ?, type = ?, category = ?, date = ?, note = ? WHERE id = ?`,
    d.amount, d.type, d.category, d.date, d.note, id,
  );
}

export async function deleteEntry(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync(`DELETE FROM allowance_entries WHERE id = ?`, id);
}