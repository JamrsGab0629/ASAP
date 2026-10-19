import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { getClassesForDate, type ScheduledClass } from './classesForDate';

export function useDayClasses(date: Date) {
  const db = useSQLiteContext();
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const time = date.getTime();

  const reload = useCallback(async () => {
    setClasses(await getClassesForDate(db, new Date(time)));
  }, [db, time]);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  return { classes, reload };
}