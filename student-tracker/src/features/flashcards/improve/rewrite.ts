import type { Suggestion } from '../suggest/types';
import { improveFront } from './improveCard';
import type { CardImprover } from './types';

/** Only the weakest kind is rewritten. Terms, definitions, lists and highlights already have a clear front. */
const REWRITABLE_KINDS: Suggestion['kind'][] = ['blank'];

/** Each rewrite takes seconds on a phone, so one batch is kept small. */
export const MAX_REWRITES = 8;

export const canRewrite = (suggestion: Suggestion) => REWRITABLE_KINDS.includes(suggestion.kind) && !suggestion.rewritten;

/** A fill-in-the-blank card becomes a question. The back is the whole sentence from the note, so the answer is never made up. */
export async function rewriteSuggestion(
  improver: CardImprover,
  suggestion: Suggestion,
  noteBody: string | null,
): Promise<{ front: string; back: string } | null> {
  const front = await improveFront(improver, { front: suggestion.front, back: suggestion.source }, noteBody);
  return front ? { front, back: suggestion.source } : null;
}