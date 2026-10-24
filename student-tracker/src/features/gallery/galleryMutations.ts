import type { SQLiteDatabase } from 'expo-sqlite';

type NewPhoto = { subjectId: number; lesson: string; filePath: string; thumbPath: string; position: number };

export async function nextPosition(db: SQLiteDatabase, subjectId: number, lesson: string): Promise<number> {
  const row = await db.getFirstAsync<{ next: number }>(
    `SELECT COALESCE(MAX(position), -1) + 1 AS next FROM lecture_photos WHERE subject_id = ? AND lesson = ?`,
    subjectId, lesson,
  );
  return row?.next ?? 0;
}

export async function insertPhoto(db: SQLiteDatabase, p: NewPhoto): Promise<void> {
  await db.runAsync(
    `INSERT INTO lecture_photos (subject_id, lesson, file_path, thumb_path, position) VALUES (?, ?, ?, ?, ?)`,
    p.subjectId, p.lesson, p.filePath, p.thumbPath, p.position,
  );
}

export async function renameLesson(db: SQLiteDatabase, subjectId: number, from: string, to: string): Promise<void> {
  await db.runAsync(`UPDATE lecture_photos SET lesson = ? WHERE subject_id = ? AND lesson = ?`, to, subjectId, from);
}

/** Deletes rows and returns the file paths that now need deleting from storage. */
export async function removePhotos(db: SQLiteDatabase, ids: number[]): Promise<string[]> {
  if (ids.length === 0) return [];
  const marks = ids.map(() => '?').join(',');
  const rows = await db.getAllAsync<{ file_path: string; thumb_path: string }>(
    `SELECT file_path, thumb_path FROM lecture_photos WHERE id IN (${marks})`, ids,
  );
  await db.runAsync(`DELETE FROM lecture_photos WHERE id IN (${marks})`, ids);
  return rows.flatMap((r) => [r.file_path, r.thumb_path]);
}