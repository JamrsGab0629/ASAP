import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';
import { removePhotos, renameLesson } from './galleryMutations';
import { cleanLesson } from './lesson';
import { deleteStored } from './photoFiles';
import type { Photo } from './types';

export function useAlbumActions(subjectId: number, lesson: string, photos: Photo[], reload: () => void) {
  const db = useSQLiteContext();
  const router = useRouter();

  const deletePhoto = async (photo: Photo) => {
    await deleteStored(await removePhotos(db, [photo.id]));
    reload();
  };

  const deleteAlbum = () =>
    Alert.alert(`Delete "${lesson}"?`, `${photos.length} photo${photos.length === 1 ? '' : 's'} will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteStored(await removePhotos(db, photos.map((p) => p.id)));
          router.back();
        },
      },
    ]);

  const rename = async (name: string) => {
    const next = cleanLesson(name);
    if (!next || next === lesson) return;
    await renameLesson(db, subjectId, lesson, next);
    router.setParams({ lesson: next });
  };

  return { deletePhoto, deleteAlbum, rename };
}