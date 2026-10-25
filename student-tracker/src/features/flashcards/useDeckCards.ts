import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useRef, useState } from 'react';
import { listCards } from './cardQueries';
import type { Card } from './types';

export function useDeckCards(subjectId: number) {
  const db = useSQLiteContext();
  const [cards, setCards] = useState<Card[]>([]);
  const latest = useRef(0);

  const reload = useCallback(async () => {
    const request = ++latest.current;
    const found = await listCards(db, subjectId);
    if (request === latest.current) setCards(found);
  }, [db, subjectId]);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  return { cards, reload };
}