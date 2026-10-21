import type { SQLiteDatabase } from 'expo-sqlite';
import { extractTags } from './tags';
import type { NoteDraft } from './types';

const NOW = `datetime('now', 'localtime')`;

export async function createNote(db: SQLiteDatabase, subjectId: number): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO notes (subject_id, title, body, type, tags, updated_at) VALUES (?, '', '', 'text', '', ${NOW})`,
    subjectId,
  );
  return result.lastInsertRowId;
}

export async function updateNote(db: SQLiteDatabase, id: number, draft: NoteDraft): Promise<void> {
  const tags = extractTags(`${draft.title} ${draft.body}`).join(',');
  await db.runAsync(
    `UPDATE notes SET subject_id = ?, title = ?, body = ?, tags = ?, updated_at = ${NOW} WHERE id = ?`,
    draft.subjectId, draft.title, draft.body, tags, id,
  );
}

export async function saveReviewFlag(db: SQLiteDatabase, id: number, flag: boolean): Promise<void> {
  await db.runAsync(`UPDATE notes SET review_flag = ? WHERE id = ?`, flag ? 1 : 0, id);
}

export async function deleteNote(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync(`DELETE FROM notes WHERE id = ?`, id);
}