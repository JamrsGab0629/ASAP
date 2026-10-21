import type { SQLiteDatabase } from 'expo-sqlite';
import { initDb } from './schema';
import { seedDemoData } from './seedDemo';
import { ensureGradeTables } from '@/features/grades/gradeTables';
import { ensureNoteColumns } from '@/features/notes/noteTable';

export async function initializeDatabase(db: SQLiteDatabase) {
  await initDb(db);
  await ensureGradeTables(db);
  await seedDemoData(db); // TEMPORARY: remove when real screens exist
  await ensureNoteColumns(db);
}