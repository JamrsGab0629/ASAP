import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo, useRef, useState } from 'react';
import { listPhotos } from './galleryQueries';
import { groupAlbums } from './groupAlbums';
import type { Photo } from './types';

export function useGallery(subjectId: number | null) {
  const db = useSQLiteContext();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const latest = useRef(0);

  const reload = useCallback(async () => {
    const request = ++latest.current;
    const found = await listPhotos(db, subjectId);
    if (request === latest.current) setPhotos(found);
  }, [db, subjectId]);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  return { albums: useMemo(() => groupAlbums(photos), [photos]), reload };
}