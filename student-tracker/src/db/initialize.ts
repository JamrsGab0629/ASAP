import type { SQLiteDatabase } from 'expo-sqlite';
import { initDb } from './schema';
import { seedDemoData } from './seedDemo';

export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await initDb(db);
  await seedDemoData(db); // TEMPORARY: remove this line when real screens exist
}