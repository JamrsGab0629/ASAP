import type { SQLiteDatabase } from 'expo-sqlite';

/** Remembers each reworded sentence, so a note is only processed once. When the model changed nothing, simple equals original. */
export async function ensureSimplifyTables(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS simplified_sentences (
      original TEXT PRIMARY KEY,
      simple TEXT NOT NULL
    );
  `);
}

const CHUNK = 400;

export async function loadSimplified(db: SQLiteDatabase, originals: string[]): Promise<Map<string, string>> {
  const found = new Map<string, string>();
  for (let i = 0; i < originals.length; i += CHUNK) {
    const chunk = originals.slice(i, i + CHUNK);
    const rows = await db.getAllAsync<{ original: string; simple: string }>(
      `SELECT original, simple FROM simplified_sentences WHERE original IN (${chunk.map(() => '?').join(',')})`,
      chunk,
    );
    for (const row of rows) found.set(row.original, row.simple);
  }
  return found;
}

export async function saveSimplified(db: SQLiteDatabase, original: string, simple: string): Promise<void> {
  await db.runAsync(`INSERT OR REPLACE INTO simplified_sentences (original, simple) VALUES (?, ?)`, original, simple);
}