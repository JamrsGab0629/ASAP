import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { listSubjectOptions, type SubjectOption } from '@/lib/subjectOptions';

export function useSubjectOptions(): SubjectOption[] {
  const db = useSQLiteContext();
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);

  useFocusEffect(
    useCallback(() => {
      listSubjectOptions(db).then(setSubjects);
    }, [db]),
  );

  return subjects;
}