import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useBooleanSetting } from '@/lib/useBooleanSetting';
import { addCard } from './cardMutations';
import { runSequentially } from './improve/batch';
import { ensureModelReady } from './improve/ensureModel';
import { llamaImprover } from './improve/llamaImprover';
import { MODEL } from './improve/modelConfig';
import { isModelDownloaded } from './improve/modelFiles';
import { canRewrite, MAX_REWRITES, rewriteSuggestion } from './improve/rewrite';
import { scanNote, type ScanResult } from './suggest/scanNote';
import type { Suggestion } from './suggest/types';
import { checkCard } from './validateCard';

type Edit = { front: string; back: string; rewritten?: boolean };

export type RewriteStatus =
  | { kind: 'idle' }
  | { kind: 'downloading'; percent: number }
  | { kind: 'working'; done: number; total: number }
  | { kind: 'finished'; rewritten: number; total: number; seconds: number }
  | { kind: 'failed'; message: string };

export function useNoteScan(noteId: number) {
  const db = useSQLiteContext();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [edits, setEdits] = useState<Record<string, Edit>>({});
  const [adding, setAdding] = useState(false);
  const [rewrite, setRewrite] = useState<RewriteStatus>({ kind: 'idle' });
  const cancelled = useRef(false);
  const autoStarted = useRef(false);
  const useAi = useBooleanSetting('scan_use_ai', false);

  useEffect(() => {
    let stale = false;
    scanNote(db, noteId).then((scan) => {
      if (stale) return;
      setResult(scan);
      // The reliable kinds start ticked. Fill-in-the-blank cards are left for the student to choose.
      setPicked(new Set((scan?.suggestions ?? []).filter((s) => s.kind !== 'blank').map((s) => s.id)));
      setLoading(false);
    });
    return () => {
      stale = true;
    };
  }, [db, noteId]);

  const suggestions = result?.suggestions ?? [];
  const cards = useMemo(() => suggestions.map((s): Suggestion => ({ ...s, ...edits[s.id] })), [suggestions, edits]);
  const canRewriteAny = cards.some(canRewrite);

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const setAll = (on: boolean) => setPicked(new Set(on ? suggestions.map((s) => s.id) : []));
  const edit = (id: string, change: { front: string; back: string }) => setEdits((prev) => ({ ...prev, [id]: change }));

  /** Adds the ticked cards. Returns how many were added. */
  const addPicked = async (): Promise<number> => {
    if (!result || adding) return 0;
    setAdding(true);
    let added = 0;
    for (const card of cards) {
      if (!picked.has(card.id)) continue;
      const check = checkCard(result.note.subjectId, card.front, card.back);
      if (!check.ok) continue;
      await addCard(db, { ...check.draft, noteId });
      added += 1;
    }
    setAdding(false);
    return added;
  };

  const runRewrite = async () => {
    if (!result) return;
    const targets = cards.filter(canRewrite).slice(0, MAX_REWRITES);
    cancelled.current = false;
    try {
      await ensureModelReady((percent) => setRewrite({ kind: 'downloading', percent }));
      const started = Date.now();
      setRewrite({ kind: 'working', done: 0, total: targets.length });

      const results = await runSequentially(
        targets,
        (suggestion) => rewriteSuggestion(llamaImprover, suggestion, result.note.body),
        (progress) => setRewrite({ kind: 'working', ...progress }),
        () => cancelled.current,
      );

      const changes: Record<string, Edit> = {};
      results.forEach((rewritten, i) => {
        if (rewritten) changes[targets[i].id] = { ...rewritten, rewritten: true };
      });
      const ids = Object.keys(changes);
      setEdits((prev) => ({ ...prev, ...changes }));
      setPicked((prev) => new Set([...prev, ...ids]));
      setRewrite({ kind: 'finished', rewritten: ids.length, total: targets.length, seconds: Math.round((Date.now() - started) / 100) / 10 });
    } catch (error) {
      setRewrite({ kind: 'failed', message: error instanceof Error ? error.message : 'Something went wrong.' });
    }
  };

  /** Asks before the one-time download, then rewrites. */
  const startRewrite = async () => {
    if (await isModelDownloaded()) return runRewrite();
    Alert.alert('Download the model?', `This needs a one-time download of about ${MODEL.sizeLabel}. Use Wi-Fi. After that it works offline.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Download', onPress: runRewrite },
    ]);
  };

  const cancelRewrite = () => {
    cancelled.current = true;
  };

  /** With the switch on, the rewrite starts by itself, but only when the model is already on the phone. A download is never started without asking. */
  useEffect(() => {
    if (loading || !useAi.ready || !useAi.value || autoStarted.current || !canRewriteAny) return;
    autoStarted.current = true;
    isModelDownloaded().then((downloaded) => {
      if (downloaded) runRewrite();
    });
  }, [loading, useAi.ready, useAi.value, canRewriteAny]);

  const setUseAi = (on: boolean) => {
    useAi.set(on);
    if (!on || !canRewriteAny) return;
    isModelDownloaded().then((downloaded) => {
      if (!downloaded) startRewrite();
    });
  };

  return {
    note: result?.note ?? null, cards, loading, picked, adding, toggle, setAll, edit, addPicked,
    rewrite, canRewriteAny, startRewrite, cancelRewrite,
    useAi: useAi.value, setUseAi,
  };
}