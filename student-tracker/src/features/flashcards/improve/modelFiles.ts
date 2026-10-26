import * as FileSystem from 'expo-file-system/legacy';
import { MODEL } from './modelConfig';

const folder = () => `${FileSystem.documentDirectory}models/`;

export const modelPath = () => `${folder()}${MODEL.fileName}`;

export async function isModelDownloaded(): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(modelPath());
  return info.exists && info.size >= MODEL.minBytes;
}

/** Downloads the model once. It is saved under a temporary name first, so a stopped download is never mistaken for a finished one. */
export async function downloadModel(onPercent: (percent: number) => void): Promise<void> {
  await FileSystem.makeDirectoryAsync(folder(), { intermediates: true });
  const partial = `${modelPath()}.part`;

  const task = FileSystem.createDownloadResumable(MODEL.url, partial, {}, ({ totalBytesWritten, totalBytesExpectedToWrite }) =>
    onPercent(totalBytesExpectedToWrite > 0 ? Math.round((totalBytesWritten / totalBytesExpectedToWrite) * 100) : 0),
  );
  const result = await task.downloadAsync();

  if (!result || result.status !== 200) {
    await FileSystem.deleteAsync(partial, { idempotent: true });
    throw new Error(`The download failed (${result ? `status ${result.status}` : 'no response'}). Check your internet connection.`);
  }
  const info = await FileSystem.getInfoAsync(partial);
  if (!info.exists || info.size < MODEL.minBytes) {
    await FileSystem.deleteAsync(partial, { idempotent: true });
    throw new Error('The downloaded file looks incomplete. Try again on a stronger connection.');
  }
  await FileSystem.moveAsync({ from: partial, to: modelPath() });
}

export const deleteModel = () => FileSystem.deleteAsync(modelPath(), { idempotent: true });