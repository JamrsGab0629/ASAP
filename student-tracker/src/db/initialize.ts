import type { SQLiteDatabase } from 'expo-sqlite';
import { initDb } from './schema';
import { seedDemoData } from './seedDemo';
import { ensureGradeTables } from '@/features/grades/gradeTables';

export async function initializeDatabase(db: SQLiteDatabase) {
  await initDb(db);
  await ensureGradeTables(db);
  await seedDemoData(db); // TEMPORARY: remove when real screens exist
}