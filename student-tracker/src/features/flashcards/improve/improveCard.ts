import { contextFor } from './context';
import type { CardImprover } from './types';
import { cleanQuestion } from './validate';

export type CardToImprove = { front: string; back: string };

/** Asks the improver for a better front and checks it. Returns null when nothing trustworthy came back, so the card stays as it is. */
export async function improveFront(improver: CardImprover, card: CardToImprove, noteBody: string | null): Promise<string | null> {
  const context = contextFor(card.back, noteBody);
  try {
    const raw = await improver.write({ front: card.front, back: card.back, context });
    return cleanQuestion(raw, { ...card, context });
  } catch {
    return null;
  }
}