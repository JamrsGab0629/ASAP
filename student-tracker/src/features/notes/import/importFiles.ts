import type { SQLiteDatabase } from 'expo-sqlite';
import { createFileNote } from '../noteMutations';
import { deleteStoredFile, storeFile } from '../noteFiles';
import type { FileAnalysis } from './analyzeFile';

/** Saves every ready file as a note, one at a time. A bad file doesn't stop the others. */
export async function importFiles(
  db: SQLiteDatabase,
  subjectId: number,
  items: FileAnalysis[],
): Promise<{ saved: number; failed: number }> {
  let saved = 0;
  let failed = 0;

  for (const item of items) {
    if (item.status !== 'ready') continue;
    let storedPath: string | null = null;
    try {
      storedPath = await storeFile(item.file.uri, item.file.name);
      await createFileNote(db, { subjectId, title: item.title, body: item.body, filePath: storedPath });
      saved++;
    } catch {
      if (storedPath) deleteStoredFile(storedPath);
      failed++;
    }
  }
  return { saved, failed };
}