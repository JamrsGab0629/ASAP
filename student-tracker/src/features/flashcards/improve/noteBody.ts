import type { SQLiteDatabase } from 'expo-sqlite';

export async function loadNoteBody(db: SQLiteDatabase, noteId: number): Promise<string | null> {
  const row = await db.getFirstAsync<{ body: string | null }>(`SELECT body FROM notes WHERE id = ?`, noteId);
  return row?.body ?? null;
}