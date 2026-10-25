import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { addCard } from './cardMutations';
import { scanNote, type ScanResult } from './suggest/scanNote';
import type { Suggestion } from './suggest/types';
import { checkCard } from './validateCard';

type Edit = { front: string; back: string };

export function useNoteScan(noteId: number) {
  const db = useSQLiteContext();
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [edits, setEdits] = useState<Record<string, Edit>>({});
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    scanNote(db, noteId).then((scan) => {
      if (cancelled) return;
      setResult(scan);
      // The reliable kinds start ticked. Fill-in-the-blank cards are left for the student to choose.
      setPicked(new Set((scan?.suggestions ?? []).filter((s) => s.kind !== 'blank').map((s) => s.id)));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [db, noteId]);

  const suggestions = result?.suggestions ?? [];
  const show = (s: Suggestion): Suggestion => ({ ...s, ...edits[s.id] });

  const cards = useMemo(() => suggestions.map(show), [suggestions, edits]);

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const setAll = (on: boolean) => setPicked(new Set(on ? suggestions.map((s) => s.id) : []));
  const edit = (id: string, change: Edit) => setEdits((prev) => ({ ...prev, [id]: change }));

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

  return { note: result?.note ?? null, cards, loading, picked, adding, toggle, setAll, edit, addPicked };
}