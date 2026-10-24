import type { SQLiteDatabase } from 'expo-sqlite';
import { deleteStoredFile } from './noteFiles';
import { extractTags } from './tags';
import type { NoteDraft } from './types';
import { removeNoteHighlights } from '@/features/highlights/highlightMutations';
const NOW = `datetime('now', 'localtime')`;

export async function createNote(db: SQLiteDatabase, subjectId: number): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO notes (subject_id, title, body, type, tags, updated_at) VALUES (?, '', '', 'text', '', ${NOW})`,
    subjectId,
  );
  return result.lastInsertRowId;
}

type FileNote = { subjectId: number; title: string; body: string; filePath: string };

/** A note made from an imported file: editable text plus the stored original. */
export async function createFileNote(db: SQLiteDatabase, note: FileNote): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO notes (subject_id, title, body, type, tags, file_path, updated_at)
     VALUES (?, ?, ?, 'file', ?, ?, ${NOW})`,
    note.subjectId, note.title, note.body, extractTags(note.body).join(','), note.filePath,
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
  const row = await db.getFirstAsync<{ file_path: string | null }>(`SELECT file_path FROM notes WHERE id = ?`, id);
  await removeNoteHighlights(db, id);
  await db.runAsync(`DELETE FROM notes WHERE id = ?`, id);
  if (row?.file_path) deleteStoredFile(row.file_path);
}