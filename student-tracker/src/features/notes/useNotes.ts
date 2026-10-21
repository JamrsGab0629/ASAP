import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useRef, useState } from 'react';
import { listNotes } from './noteQueries';
import type { NoteFilters, NoteListItem } from './types';

export function useNotes({ query, subjectId, reviewOnly }: NoteFilters) {
  const db = useSQLiteContext();
  const [notes, setNotes] = useState<NoteListItem[]>([]);
  const latestRequest = useRef(0);

  const reload = useCallback(async () => {
    const request = ++latestRequest.current;
    const result = await listNotes(db, { query, subjectId, reviewOnly });
    if (request === latestRequest.current) setNotes(result); // ignore slower, older searches
  }, [db, query, subjectId, reviewOnly]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { notes, reload };
}