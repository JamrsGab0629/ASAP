import { MAX_SIDE_LENGTH } from './config';
import type { CardDraft } from './types';

export type CardCheck = { ok: true; draft: CardDraft } | { ok: false; message: string };

export function checkCard(subjectId: number | null, front: string, back: string): CardCheck {
  const f = front.trim();
  const b = back.trim();
  if (subjectId === null) return { ok: false, message: 'Pick a subject for this card.' };
  if (!f) return { ok: false, message: 'Write the front of the card (the question or term).' };
  if (!b) return { ok: false, message: 'Write the back of the card (the answer).' };
  if (f.length > MAX_SIDE_LENGTH || b.length > MAX_SIDE_LENGTH) {
    return { ok: false, message: `Keep each side under ${MAX_SIDE_LENGTH} characters.` };
  }
  return { ok: true, draft: { subjectId, front: f, back: b } };
}