import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { getNote } from './noteQueries';
import type { Note } from './types';

/** undefined = loading, null = not found. */
export function useNote(id: number): Note | null | undefined {
  const db = useSQLiteContext();
  const [note, setNote] = useState<Note | null | undefined>(undefined);
  useEffect(() => {
    getNote(db, id).then(setNote);
  }, [db, id]);
  return note;
}