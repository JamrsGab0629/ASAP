import type { SQLiteDatabase } from 'expo-sqlite';
import { initDb } from './schema';
import { seedDemoData } from './seedDemo';
import { ensureGradeTables } from '@/features/grades/gradeTables';
import { ensureNoteColumns } from '@/features/notes/noteTable';
import { ensureGalleryTables } from '@/features/gallery/galleryTables';
import { ensureHighlightTable } from '@/features/highlights/highlightTable';
import {ensureFlashcardTables} from '@/features/flashcards/flashCardTables';

export async function initializeDatabase(db: SQLiteDatabase) {
  await initDb(db);
  await ensureGradeTables(db);
  await seedDemoData(db); // TEMPORARY: remove when real screens exist
  await ensureNoteColumns(db);
  await ensureGalleryTables(db);
  await ensureHighlightTable(db);
  await ensureFlashcardTables(db);
}