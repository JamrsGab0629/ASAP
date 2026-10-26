import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { ensureModelReady } from '@/features/flashcards/improve/ensureModel';
import { runSequentially } from '@/features/flashcards/improve/batch';
import { MODEL } from '@/features/flashcards/improve/modelConfig';
import { isModelDownloaded } from '@/features/flashcards/improve/modelFiles';
import type { LengthLevel } from '../levels';
import { extractiveShortener } from '../extractive';
import { shorten } from '../shorten';
import { canSimplify } from './clean';
import { llamaSimplifier } from './llamaSimplifier';
import { simplifySentence } from './simplifySentence';
import { loadSimplified, saveSimplified } from './simplifyTable';

export type SimplifyStatus =
  | { kind: 'idle' }
  | { kind: 'downloading'; percent: number }
  | { kind: 'working'; done: number; total: number }
  | { kind: 'finished'; changed: number; total: number }
  | { kind: 'failed'; message: string };

/** The shortened note for the chosen level. On an AI level, the kept sentences can be reworded by the model, one at a time. */
export function useSimplifiedShorten(body: string, level: LengthLevel) {
  const db = useSQLiteContext();
  const [done, setDone] = useState<ReadonlyMap<string, string>>(new Map());
  const [status, setStatus] = useState<SimplifyStatus>({ kind: 'idle' });
  const cancelled = useRef(false);

  const plain = useMemo(() => shorten(body, level.ratio), [body, level.ratio]);
  const wanted = useMemo(() => (level.ai ? plain.keptSentences.filter(canSimplify) : []), [plain, level.ai]);
  const pending = useMemo(() => wanted.filter((sentence) => !done.has(sentence)), [wanted, done]);

  useEffect(() => setStatus({ kind: 'idle' }), [body, level.key]);

  // Sentences done in an earlier visit are picked up from the phone, so nothing is processed twice.
  useEffect(() => {
    if (wanted.length === 0) return;
    let live = true;
    loadSimplified(db, wanted).then((found) => {
      if (live && found.size > 0) setDone((current) => new Map([...current, ...found]));
    });
    return () => {
      live = false;
    };
  }, [db, wanted]);

  const result = useMemo(() => {
    if (!level.ai || done.size === 0) return plain;
    return shorten(body, level.ratio, extractiveShortener, (sentence) => {
      const simple = done.get(sentence);
      return simple && simple !== sentence ? simple : undefined;
    });
  }, [plain, done, body, level.ai, level.ratio]);

  const run = async () => {
    const todo = pending;
    cancelled.current = false;
    let changed = 0;
    try {
      setStatus({ kind: 'working', done: 0, total: todo.length });
      await ensureModelReady((percent) => setStatus({ kind: 'downloading', percent }));
      setStatus({ kind: 'working', done: 0, total: todo.length });
      await runSequentially(
        todo,
        async (sentence) => {
          const simple = await simplifySentence(llamaSimplifier, sentence);
          await saveSimplified(db, sentence, simple);
          if (simple !== sentence) changed++;
          setDone((current) => new Map(current).set(sentence, simple));
        },
        (progress) => setStatus({ kind: 'working', ...progress }),
        () => cancelled.current,
      );
      setStatus({ kind: 'finished', changed, total: todo.length });
    } catch (error) {
      setStatus({ kind: 'failed', message: error instanceof Error ? error.message : 'Something went wrong.' });
    }
  };

  /** Asks before the one-time download, then runs. */
  const start = async () => {
    if (pending.length === 0) return;
    if (await isModelDownloaded()) return run();
    Alert.alert(
      'Download the model?',
      `This needs a one-time download of about ${MODEL.sizeLabel}. Use Wi-Fi. After that it works offline.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => run() },
      ],
    );
  };

  const cancel = () => {
    cancelled.current = true;
  };

  return { result, status, pendingCount: pending.length, start, cancel, isAi: !!level.ai };
}