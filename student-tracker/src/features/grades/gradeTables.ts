import type { SQLiteDatabase } from 'expo-sqlite';

/** The previous version stored parts directly under the subject. Those test rows are dropped. */
async function dropLegacyComponents(db: SQLiteDatabase): Promise<void> {
  const columns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(grade_components)`);
  if (columns.length > 0 && !columns.some((c) => c.name === 'period_id')) {
    await db.execAsync(`DROP TABLE IF EXISTS grade_items; DROP TABLE IF EXISTS grade_components;`);
  }
}

/** Safe to run on every launch. */
export async function ensureGradeTables(db: SQLiteDatabase): Promise<void> {
  await dropLegacyComponents(db);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS grade_periods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      name TEXT NOT NULL, weight REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS grade_components (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      period_id INTEGER NOT NULL REFERENCES grade_periods(id) ON DELETE CASCADE,
      name TEXT NOT NULL, weight REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS grade_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      component_id INTEGER NOT NULL REFERENCES grade_components(id) ON DELETE CASCADE,
      title TEXT NOT NULL, score REAL, max_score REAL NOT NULL DEFAULT 100
    );
  `);
}