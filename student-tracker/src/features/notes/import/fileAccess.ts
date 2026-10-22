import * as FileSystem from 'expo-file-system/legacy';

/** Reads a picked file. These work on the picker's temporary files and on content:// links. */
export const readBase64 = (uri: string) => FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
export const readText = (uri: string) => FileSystem.readAsStringAsync(uri);