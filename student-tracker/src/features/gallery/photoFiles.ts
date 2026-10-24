import * as FileSystem from 'expo-file-system/legacy';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import type { PickedPhoto } from './types';

const FOLDER = 'gallery/';
const FULL_WIDTH = 1600;
const THUMB_WIDTH = 400;

export const photoUri = (relativePath: string) => `${FileSystem.documentDirectory}${relativePath}`;

/** Re-encodes as JPEG, shrinking only when the source is wider than maxWidth. Also fixes phone rotation. */
async function render(uri: string, maxWidth: number, sourceWidth: number | null, compress: number): Promise<string> {
  const context = ImageManipulator.manipulate(uri);
  if (sourceWidth && sourceWidth > maxWidth) context.resize({ width: maxWidth });
  const image = await context.renderAsync();
  const saved = await image.saveAsync({ format: SaveFormat.JPEG, compress });
  return saved.uri;
}

/** Makes a full-size copy and a thumbnail inside the app's storage. Returns their relative paths. */
export async function storePhoto(photo: PickedPhoto): Promise<{ filePath: string; thumbPath: string }> {
  const fullTemp = await render(photo.uri, FULL_WIDTH, photo.width, 0.8);
  const thumbTemp = await render(fullTemp, THUMB_WIDTH, photo.width ? Math.min(photo.width, FULL_WIDTH) : FULL_WIDTH, 0.7);

  await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}${FOLDER}`, { intermediates: true });
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const filePath = `${FOLDER}${stamp}.jpg`;
  const thumbPath = `${FOLDER}${stamp}-thumb.jpg`;
  await FileSystem.moveAsync({ from: fullTemp, to: photoUri(filePath) });
  await FileSystem.moveAsync({ from: thumbTemp, to: photoUri(thumbPath) });
  return { filePath, thumbPath };
}

export async function deleteStored(relativePaths: string[]): Promise<void> {
  await Promise.all(relativePaths.map((p) => FileSystem.deleteAsync(photoUri(p), { idempotent: true }).catch(() => {})));
}