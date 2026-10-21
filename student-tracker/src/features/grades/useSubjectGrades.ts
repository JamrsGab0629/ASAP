import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ensureDefaultScale } from './defaultScale';
import { listComponents, loadScale } from './gradeQueries';
import type { GradeComponent, GradeScale } from './types';

type Loaded = { subjectId: number; components: GradeComponent[]; scale: GradeScale };

export function useSubjectGrades(subjectId: number | null) {
  const db = useSQLiteContext();
  const [state, setState] = useState<Loaded | null>(null);

  const reload = useCallback(async () => {
    if (subjectId === null) return;
    const scale = await loadScale(db, await ensureDefaultScale(db));
    setState({ subjectId, scale, components: await listComponents(db, subjectId) });
  }, [db, subjectId]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  // Never show another subject's data while this one is loading.
  const ready = state && state.subjectId === subjectId ? state : null;
  return { components: ready?.components ?? [], scale: ready?.scale ?? null, reload };
}