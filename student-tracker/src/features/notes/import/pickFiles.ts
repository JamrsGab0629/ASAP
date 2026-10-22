import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import type { PickedFile } from './types';

const FOLDER = `${FileSystem.cacheDirectory}imports/`;

/** Copies a picked file into the app's own cache so it can be read like any normal file. */
async function copyIntoCache(sourceUri: string, name: string): Promise<string> {
  await FileSystem.makeDirectoryAsync(FOLDER, { intermediates: true });
  const safeName = name.replace(/[^\w.\-]+/g, '_');
  const target = `${FOLDER}${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${safeName}`;
  await FileSystem.copyAsync({ from: sourceUri, to: target });
  return target;
}

/** Opens the phone's file picker. Several files at once; unsupported types are reported later. */
export async function pickFiles(): Promise<PickedFile[]> {
  const result = await DocumentPicker.getDocumentAsync({ type: '*/*', multiple: true, copyToCacheDirectory: false });
  if (result.canceled) return [];

  const files: PickedFile[] = [];
  for (const asset of result.assets) {
    try {
      files.push({ uri: await copyIntoCache(asset.uri, asset.name), name: asset.name, size: asset.size });
    } catch {
      // The file is skipped here. Ideally it would show in the list as unreadable.
    }
  }
  return files;
}