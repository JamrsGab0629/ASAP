import type { SQLiteDatabase } from 'expo-sqlite';

/** Small yes/no or text choices the app remembers, such as "use AI when scanning". */
export async function ensureSettingsTable(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}