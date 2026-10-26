import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { Alert } from 'react-native';
import { improveFront, type CardToImprove } from './improveCard';
import { llamaImprover } from './llamaImprover';
import { MODEL } from './modelConfig';
import { ensureModelReady } from './ensureModel';
import { isModelDownloaded } from './modelFiles';
import { loadNoteBody } from './noteBody';

export type ImproveStatus =
  | { kind: 'idle' }
  | { kind: 'downloading'; percent: number }
  | { kind: 'working' }
  | { kind: 'done'; suggestion: string; loadSeconds: number; writeSeconds: number }
  | { kind: 'failed'; message: string };

const seconds = (from: number) => Math.round((Date.now() - from) / 100) / 10;

export function useImproveFront() {
  const db = useSQLiteContext();
  const [status, setStatus] = useState<ImproveStatus>({ kind: 'idle' });

  const run = async (card: CardToImprove, noteId: number | null) => {
    try {
      setStatus({ kind: 'working' });
      const loadStart = Date.now();
      await ensureModelReady((percent) => setStatus({ kind: 'downloading', percent }));
      setStatus({ kind: 'working' });
      const loadSeconds = seconds(loadStart);

      const body = noteId ? await loadNoteBody(db, noteId) : null;
      const writeStart = Date.now();
      const suggestion = await improveFront(llamaImprover, card, body);
      const writeSeconds = seconds(writeStart);

      setStatus(
        suggestion
          ? { kind: 'done', suggestion, loadSeconds, writeSeconds }
          : { kind: 'failed', message: 'The model did not write a question that passed the checks. Your card is unchanged.' },
      );
    } catch (error) {
      setStatus({ kind: 'failed', message: error instanceof Error ? error.message : 'Something went wrong.' });
    }
  };

  /** Asks before the one-time download, then runs. */
  const start = async (card: CardToImprove, noteId: number | null) => {
    if (await isModelDownloaded()) return run(card, noteId);
    Alert.alert(
      'Download the model?',
      `This needs a one-time download of about ${MODEL.sizeLabel}. Use Wi-Fi. After that it works offline.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => run(card, noteId) },
      ],
    );
  };

  const reset = () => setStatus({ kind: 'idle' });

  return { status, start, reset };
}