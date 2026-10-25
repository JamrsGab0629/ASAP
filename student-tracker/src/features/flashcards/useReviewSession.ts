import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { applyReview } from './cardMutations';
import { countNewToday, listStudyCards } from './cardQueries';
import { NEW_CARDS_PER_DAY } from './config';
import { dayKey } from './dueAt';
import { intervalLabel } from './intervalLabel';
import { previewOutcomes, sm2Scheduler } from './scheduler';
import { advanceQueue } from './studyQueue';
import type { Card, Rating } from './types';

export type SessionStatus = 'loading' | 'empty' | 'studying' | 'finished';

const EMPTY_TALLY: Record<Rating, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };

/** One study session: the cards due now (and today's new cards), answered one at a time. */
export function useReviewSession(subjectId: number | null) {
  const db = useSQLiteContext();
  const [queue, setQueue] = useState<Card[] | null>(null);
  const [total, setTotal] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tally, setTally] = useState(EMPTY_TALLY);
  const [reviewed, setReviewed] = useState(0);
  const busy = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const now = new Date();
      const used = await countNewToday(db, dayKey(now));
      const cards = await listStudyCards(db, subjectId, now, Math.max(0, NEW_CARDS_PER_DAY - used));
      if (cancelled) return;
      setQueue(cards);
      setTotal(cards.length);
    })();
    return () => { cancelled = true; };
  }, [db, subjectId]);

  const card = queue?.[0] ?? null;

  /** "10 min / 1 d / 4 d" under each button */
  const labels = useMemo<Record<Rating, string> | null>(() => {
    if (!card) return null;
    const now = new Date();
    const p = previewOutcomes(card, now);
    return { 1: intervalLabel(now, p[1].dueAt), 2: intervalLabel(now, p[2].dueAt), 3: intervalLabel(now, p[3].dueAt), 4: intervalLabel(now, p[4].dueAt) };
  }, [card]);

  const rate = async (rating: Rating) => {
    if (!card || busy.current) return;
    busy.current = true;
    try {
      const now = new Date();
      const outcome = sm2Scheduler.next(card, rating, now);
      await applyReview(db, card, rating, outcome, now);
      setQueue((current) => (current ? advanceQueue(current, outcome, now) : current));
      setTally((t) => ({ ...t, [rating]: t[rating] + 1 }));
      setReviewed((n) => n + 1);
      setRevealed(false);
    } finally {
      busy.current = false;
    }
  };

  const status: SessionStatus = queue === null ? 'loading' : total === 0 ? 'empty' : queue.length === 0 ? 'finished' : 'studying';

  return { status, card, labels, revealed, reveal: () => setRevealed(true), rate, remaining: queue?.length ?? 0, reviewed, tally };
}