import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useRef, useState } from 'react';
import { countNewToday, listDeckSummaries } from './cardQueries';
import { NEW_CARDS_PER_DAY } from './config';
import { dayKey } from './dueAt';
import type { DeckSummary } from './types';

export type DecksState = { decks: DeckSummary[]; newLeft: number };

export function useDecks() {
  const db = useSQLiteContext();
  const [state, setState] = useState<DecksState | null>(null);
  const latest = useRef(0);

  const reload = useCallback(async () => {
    const request = ++latest.current;
    const now = new Date();
    const [decks, used] = await Promise.all([listDeckSummaries(db, now), countNewToday(db, dayKey(now))]);
    if (request === latest.current) setState({ decks, newLeft: Math.max(0, NEW_CARDS_PER_DAY - used) });
  }, [db]);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  return { state, reload };
}