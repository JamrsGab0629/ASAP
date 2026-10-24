import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert } from 'react-native';
import { resolveDefaultSubject } from '@/features/notes/resolveSubject';
import type { SubjectOption } from '@/lib/subjectOptions';
import type { PhotoSource } from './photoSources';
import type { Destination, PickedPhoto } from './types';
import { useSavePhotos } from './useSavePhotos';

export function useAddPhotos(subjects: SubjectOption[], filterSubjectId: number | null, onSaved: () => void) {
  const db = useSQLiteContext();
  const [pending, setPending] = useState<PickedPhoto[] | null>(null);
  const [initialSubjectId, setInitialSubjectId] = useState<number | null>(null);
  const { progress, save } = useSavePhotos(onSaved);

  const pick = async (source: PhotoSource) => {
    if (subjects.length === 0) return Alert.alert('Add a subject first', 'Photos are filed under a subject.');
    const photos = await source.pick();
    if (photos.length === 0) return;
    setInitialSubjectId(await resolveDefaultSubject(db, subjects.map((s) => s.id), filterSubjectId));
    setPending(photos);
  };

  const confirm = async (destination: Destination) => {
    if (!pending) return;
    await save(pending, destination);
    setPending(null);
  };

  return { pending, initialSubjectId, progress, pick, confirm, cancel: () => setPending(null) };
}