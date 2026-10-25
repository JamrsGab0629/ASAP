import type { DeckSummary } from './types';

/** Cards to study in one deck: everything due, plus new cards up to what's left of today's allowance. */
export const deckStudyCount = (deck: DeckSummary, newLeft: number) => deck.due + Math.min(deck.fresh, newLeft);

export function allDecksStudyCount(decks: DeckSummary[], newLeft: number): number {
  const due = decks.reduce((sum, d) => sum + d.due, 0);
  const fresh = decks.reduce((sum, d) => sum + d.fresh, 0);
  return due + Math.min(fresh, newLeft);
}