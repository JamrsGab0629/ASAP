import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { getSetting, setSetting } from './settings';

/** A yes/no choice that is saved on the phone. `ready` turns true once the saved value has been read. */
export function useBooleanSetting(key: string, fallback: boolean) {
  const db = useSQLiteContext();
  const [value, setValue] = useState(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stale = false;
    getSetting(db, key).then((saved) => {
      if (stale) return;
      if (saved !== null) setValue(saved === '1');
      setReady(true);
    });
    return () => {
      stale = true;
    };
  }, [db, key]);

  const set = (next: boolean) => {
    setValue(next);
    setSetting(db, key, next ? '1' : '0');
  };

  return { value, ready, set };
}