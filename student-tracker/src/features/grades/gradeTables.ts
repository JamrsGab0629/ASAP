import type { SQLiteDatabase } from 'expo-sqlite';

/** Safe to run on every launch, and creates the tables on phones that already have a database. */
export async function ensureGradeTables(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS grade_components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      name TEXT NOT NULL, weight REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS grade_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      component_id INTEGER NOT NULL REFERENCES grade_components(id) ON DELETE CASCADE,
      title TEXT NOT NULL, score REAL, max_score REAL NOT NULL DEFAULT 100
    );
  `);
}