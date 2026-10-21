import type { SQLiteDatabase } from 'expo-sqlite';

/** Safe to run on every launch. */
export async function ensureNoteColumns(db: SQLiteDatabase): Promise<void> {
  const columns = await db.getAllAsync<{ name: string }>(`PRAGMA table_info(notes)`);
  if (!columns.some((c) => c.name === 'updated_at')) {
    await db.execAsync(`
      ALTER TABLE notes ADD COLUMN updated_at TEXT;
      UPDATE notes SET updated_at = created_at WHERE updated_at IS NULL;
    `);
  }
}