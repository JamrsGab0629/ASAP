import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { listDeadlines } from './listDeadlines';
import type { DeadlineStatus } from './types';
import type { DueDeadline } from './upcomingDeadlines';

export function useDeadlines(status: DeadlineStatus) {
  const db = useSQLiteContext();
  const [state, setState] = useState<{ items: DueDeadline[]; now: Date }>({ items: [], now: new Date() });

  const reload = useCallback(async () => {
    const now = new Date();
    setState({ items: await listDeadlines(db, status, now), now });
  }, [db, status]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { ...state, reload };
}