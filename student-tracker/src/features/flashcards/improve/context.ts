import { contentWords } from '@/features/shorten/words';
import { splitSentences } from '@/lib/splitSentences';

const MAX_CONTEXT_CHARS = 500;

/** The sentence in the note that best matches the card's back, so the model reads the real text. Falls back to the back itself. */
export function contextFor(back: string, noteBody: string | null): string {
  const target = new Set(contentWords(back));
  if (!noteBody || target.size === 0) return back;

  let best = { text: '', score: 0 };
  for (const piece of splitSentences(noteBody)) {
    const text = piece.replace(/^\s*[-•*]\s+/, '').trim();
    if (!text) continue;
    const score = contentWords(text).filter((w) => target.has(w)).length / target.size;
    if (score > best.score) best = { text, score };
  }
  const found = best.score >= 0.5 ? best.text : back;
  return found.length > MAX_CONTEXT_CHARS ? found.slice(0, MAX_CONTEXT_CHARS) : found;
}