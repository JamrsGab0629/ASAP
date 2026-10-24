import type { SQLiteDatabase } from 'expo-sqlite';
import type { Highlight } from './types';

export function listHighlights(db: SQLiteDatabase, noteId: number): Promise<Highlight[]> {
  return db.getAllAsync<Highlight>(`SELECT id, note_id AS noteId, text FROM note_highlights WHERE note_id = ? ORDER BY id`, noteId);
}