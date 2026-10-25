import { REQUEUE_WITHIN_MINUTES } from './config';
import { toDueAt } from './dueAt';
import type { Outcome } from './scheduler';
import type { Card } from './types';

/** After an answer: the queue without that card, plus the card again at the end if it will be due very soon. */
export function advanceQueue(queue: Card[], outcome: Outcome, now: Date): Card[] {
  const [current, ...rest] = queue;
  if (!current) return rest;
  const soon = outcome.dueAt.getTime() - now.getTime() <= REQUEUE_WITHIN_MINUTES * 60_000;
  if (!soon) return rest;
  return [...rest, { ...current, stage: outcome.stage, intervalDays: outcome.intervalDays, ease: outcome.ease, reps: outcome.reps, lapses: outcome.lapses, dueAt: toDueAt(outcome.dueAt) }];
}