import type { SQLiteDatabase } from 'expo-sqlite';

export async function ensureGalleryTables(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS lecture_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      lesson TEXT NOT NULL,
      file_path TEXT NOT NULL,
      thumb_path TEXT NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    CREATE INDEX IF NOT EXISTS idx_lecture_photos_album ON lecture_photos(subject_id, lesson);
  `);
}