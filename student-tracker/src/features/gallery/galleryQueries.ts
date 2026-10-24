import type { SQLiteDatabase } from 'expo-sqlite';
import type { Photo } from './types';

const SELECT = `SELECT p.id, p.subject_id AS subjectId, s.name AS subjectName, s.color AS subjectColor,
  p.lesson, p.file_path AS filePath, p.thumb_path AS thumbPath, p.position
  FROM lecture_photos p JOIN subjects s ON s.id = p.subject_id`;

export function listPhotos(db: SQLiteDatabase, subjectId: number | null): Promise<Photo[]> {
  return db.getAllAsync<Photo>(`${SELECT} WHERE (? IS NULL OR p.subject_id = ?) ORDER BY p.position, p.id`, subjectId, subjectId);
}

export function listAlbumPhotos(db: SQLiteDatabase, subjectId: number, lesson: string): Promise<Photo[]> {
  return db.getAllAsync<Photo>(`${SELECT} WHERE p.subject_id = ? AND p.lesson = ? ORDER BY p.position, p.id`, subjectId, lesson);
}

/** Lessons of a subject, most recently used first. */
export async function listRecentLessons(db: SQLiteDatabase, subjectId: number): Promise<string[]> {
  const rows = await db.getAllAsync<{ lesson: string }>(
    `SELECT lesson FROM lecture_photos WHERE subject_id = ? GROUP BY lesson ORDER BY MAX(id) DESC LIMIT 12`,
    subjectId,
  );
  return rows.map((r) => r.lesson);
}