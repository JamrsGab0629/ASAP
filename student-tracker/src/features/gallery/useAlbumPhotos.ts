import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useRef, useState } from 'react';
import { listAlbumPhotos } from './galleryQueries';
import type { Photo } from './types';

export function useAlbumPhotos(subjectId: number, lesson: string) {
  const db = useSQLiteContext();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const latest = useRef(0);

  const reload = useCallback(async () => {
    const request = ++latest.current;
    const found = await listAlbumPhotos(db, subjectId, lesson);
    if (request === latest.current) {
      setPhotos(found);
      setLoaded(true);
    }
  }, [db, subjectId, lesson]);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  return { photos, loaded, reload };
}