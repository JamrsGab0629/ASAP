import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { loadPeriodSummary } from './loadSummary';
import type { PeriodSummary } from './summary';

export function useAllowance(offset: number) {
  const db = useSQLiteContext();
  const [summary, setSummary] = useState<PeriodSummary | null>(null);
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    setSummary(await loadPeriodSummary(db, new Date(), offset));
    setLoaded(true);
  }, [db, offset]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { summary, loaded, reload };
}