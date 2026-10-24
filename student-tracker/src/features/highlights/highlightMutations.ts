import type { SQLiteDatabase } from 'expo-sqlite';

export async function addHighlight(db: SQLiteDatabase, noteId: number, text: string): Promise<void> {
  const clean = text.trim();
  if (clean.length < 2) return;
  await db.runAsync(`INSERT OR IGNORE INTO note_highlights (note_id, text) VALUES (?, ?)`, noteId, clean);
}

export async function removeHighlight(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync(`DELETE FROM note_highlights WHERE id = ?`, id);
}

export async function removeNoteHighlights(db: SQLiteDatabase, noteId: number): Promise<void> {
  await db.runAsync(`DELETE FROM note_highlights WHERE note_id = ?`, noteId);
}