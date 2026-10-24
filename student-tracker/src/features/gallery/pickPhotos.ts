import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import type { PickedPhoto } from './types';

const toPicked = (assets: ImagePicker.ImagePickerAsset[]): PickedPhoto[] =>
  assets.map((a) => ({ uri: a.uri, width: a.width ?? null }));

export async function pickFromLibrary(): Promise<PickedPhoto[]> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: 0, // 0 = no limit
    orderedSelection: true,
    quality: 1,
  });
  return result.canceled ? [] : toPicked(result.assets);
}

const askAnother = () =>
  new Promise<boolean>((resolve) =>
    Alert.alert('Photo added', 'Take another page?', [
      { text: 'Done', onPress: () => resolve(false) },
      { text: 'Another', onPress: () => resolve(true) },
    ], { cancelable: false }),
  );

/** Camera loop: one shot after another until the student says Done. */
export async function takePhotos(): Promise<PickedPhoto[]> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Camera access needed', 'Allow the camera in your phone settings to take photos.');
    return [];
  }
  const taken: PickedPhoto[] = [];
  for (;;) {
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1 });
    if (result.canceled) break;
    taken.push(...toPicked(result.assets));
    if (!(await askAnother())) break;
  }
  return taken;
}