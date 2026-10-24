import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { listHighlights } from './highlightQueries';
import { addHighlight, removeHighlight } from './highlightMutations';
import type { Highlight } from './types';

export function useHighlights(noteId: number) {
  const db = useSQLiteContext();
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  const reload = useCallback(async () => setHighlights(await listHighlights(db, noteId)), [db, noteId]);
  useEffect(() => { reload(); }, [reload]);

  const add = async (text: string) => {
    await addHighlight(db, noteId, text);
    await reload();
  };
  const remove = async (id: number) => {
    await removeHighlight(db, id);
    await reload();
  };

  return { highlights, add, remove };
}