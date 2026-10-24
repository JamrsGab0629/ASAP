import type { SQLiteDatabase } from 'expo-sqlite';
import { insertPhoto, nextPosition } from './galleryMutations';
import { deleteStored, storePhoto } from './photoFiles';
import type { Destination, PickedPhoto } from './types';

/** Saves photos one at a time (keeps memory low). One bad photo doesn't stop the rest. */
export async function importPhotos(
  db: SQLiteDatabase,
  photos: PickedPhoto[],
  destination: Destination,
  onProgress: (done: number, total: number) => void,
): Promise<{ saved: number; failed: number }> {
  let position = await nextPosition(db, destination.subjectId, destination.lesson);
  let saved = 0;
  let failed = 0;

  for (let i = 0; i < photos.length; i++) {
    let stored: { filePath: string; thumbPath: string } | null = null;
    try {
      stored = await storePhoto(photos[i]);
      await insertPhoto(db, { ...destination, ...stored, position: position++ });
      saved++;
    } catch {
      if (stored) await deleteStored([stored.filePath, stored.thumbPath]);
      failed++;
    }
    onProgress(i + 1, photos.length);
  }
  return { saved, failed };
}