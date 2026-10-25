import { intervalLabel } from './intervalLabel';
import { parseDueAt } from './dueAt';
import type { Card } from './types';

/** "New", "Due now" or "Due in 3 d", for the card list. */
export function cardStatus(card: Pick<Card, 'stage' | 'dueAt'>, now: Date): string {
  if (card.stage === 'new') return 'New';
  const due = parseDueAt(card.dueAt);
  return due.getTime() <= now.getTime() ? 'Due now' : `Due in ${intervalLabel(now, due)}`;
}