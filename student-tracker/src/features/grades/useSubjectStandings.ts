import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { listAllComponents } from './gradeQueries';
import { standingsBySubject } from './standing';

export function useSubjectStandings(): Map<number, number> {
  const db = useSQLiteContext();
  const [standings, setStandings] = useState<Map<number, number>>(new Map());

  useFocusEffect(
    useCallback(() => {
    listAllComponents(db).then((all) => setStandings(standingsBySubject(all)));
    }, [db]),
  );

  return standings;
}