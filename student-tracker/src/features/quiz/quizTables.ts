import type { SQLiteDatabase } from 'expo-sqlite';

export async function ensureQuizTables(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER,
      taken_at TEXT NOT NULL,
      question_count INTEGER NOT NULL,
      points REAL NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_quiz_results_taken ON quiz_results(taken_at);
  `);
}