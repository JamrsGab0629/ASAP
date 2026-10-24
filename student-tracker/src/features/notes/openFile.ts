import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';

const MIME_TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.txt': 'text/plain',
  '.md': 'text/plain',
  '.markdown': 'text/plain',
};

const mimeTypeOf = (path: string) => MIME_TYPES[(/\.[^.]+$/.exec(path)?.[0] ?? '').toLowerCase()] ?? '*/*';

const FLAG_GRANT_READ_URI_PERMISSION = 1;

/** Opens a stored lecture file in whatever app on the phone can show it (PDF reader, PowerPoint, and so on). */
export async function openStoredFile(relativePath: string): Promise<void> {
  const contentUri = await FileSystem.getContentUriAsync(`${FileSystem.documentDirectory}${relativePath}`);
  await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
    data: contentUri,
    flags: FLAG_GRANT_READ_URI_PERMISSION,
    type: mimeTypeOf(relativePath),
  });
}