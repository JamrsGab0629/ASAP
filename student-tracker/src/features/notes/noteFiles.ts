import { File, Paths } from 'expo-file-system';
import * as FileSystem from 'expo-file-system/legacy';

const FOLDER = 'notes';

/** Copies a picked file into the app's own storage. Returns its path relative to the documents folder. */
export async function storeFile(sourceUri: string, originalName: string): Promise<string> {
  const folder = `${FileSystem.documentDirectory}${FOLDER}/`;
  await FileSystem.makeDirectoryAsync(folder, { intermediates: true });

  const safeName = originalName.replace(/[^\w.\-]+/g, '_');
  const storedName = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${safeName}`;
  await FileSystem.copyAsync({ from: sourceUri, to: `${folder}${storedName}` });
  return `${FOLDER}/${storedName}`;
}

export const resolveStoredFile = (relativePath: string) => new File(Paths.document, relativePath);

export function deleteStoredFile(relativePath: string): void {
  try {
    const file = resolveStoredFile(relativePath);
    if (file.exists) file.delete();
  } catch {
    // Nothing useful to do if the file is already gone.
  }
}

/** "notes/1729-ab12-Week_3.pptx" -> "Week_3.pptx" */
export const storedDisplayName = (relativePath: string) =>
  (relativePath.split('/').pop() ?? relativePath).replace(/^\d+-[a-z0-9]{4}-/, '');