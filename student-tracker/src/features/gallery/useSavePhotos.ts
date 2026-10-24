import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert } from 'react-native';
import { importPhotos } from './importPhotos';
import type { Destination, PickedPhoto, SaveProgress } from './types';

export function useSavePhotos(onSaved: () => void) {
  const db = useSQLiteContext();
  const [progress, setProgress] = useState<SaveProgress | null>(null);

  const save = async (photos: PickedPhoto[], destination: Destination) => {
    setProgress({ done: 0, total: photos.length });
    const { failed } = await importPhotos(db, photos, destination, (done, total) => setProgress({ done, total }));
    setProgress(null);
    onSaved();
    if (failed > 0) Alert.alert('Some photos were not saved', `${failed} could not be processed.`);
  };

  return { progress, save };
}