import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';

/**
 * Saves `value` shortly after it stops changing, and when the app goes to the background.
 * `value` must keep the same identity until it really changes (use useMemo).
 * Returns flush(), which saves right now if there is anything unsaved.
 */
export function useAutosave<T>(value: T, save: (value: T) => Promise<void> | void, delay = 600) {
  const latest = useRef(value);
  const saved = useRef(value);
  const saveRef = useRef(save);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  latest.current = value;
  saveRef.current = save;

  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (latest.current === saved.current) return;
    saved.current = latest.current;
    await saveRef.current(latest.current);
  }, []);

  useEffect(() => {
    if (value === saved.current) return;
    timer.current = setTimeout(flush, delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, delay, flush]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') flush();
    });
    return () => subscription.remove();
  }, [flush]);

  return flush;
}