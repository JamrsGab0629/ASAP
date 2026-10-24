import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { DEFAULT_LESSON } from './lesson';
import { listRecentLessons } from './galleryQueries';

/** The subject and lesson the photos will be filed under. Picking a subject suggests its latest lesson. */
export function usePhotoDestination(initialSubjectId: number | null) {
  const db = useSQLiteContext();
  const [subjectId, setSubjectId] = useState(initialSubjectId);
  const [lesson, setLesson] = useState('');
  const [lessons, setLessons] = useState<string[]>([]);

  useEffect(() => {
    if (subjectId === null) return;
    let cancelled = false;
    listRecentLessons(db, subjectId).then((found) => {
      if (cancelled) return;
      setLessons(found);
      setLesson(found[0] ?? DEFAULT_LESSON);
    });
    return () => { cancelled = true; };
  }, [db, subjectId]);

  return { subjectId, setSubjectId, lesson, setLesson, lessons };
}