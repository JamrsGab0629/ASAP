import { contentWords } from '@/features/shorten/words';
import { isVagueFront } from '../cardQuality';

const MIN_CHARS = 10;
const MAX_CHARS = 160;
/** A question about the topic reuses topic words. Copying almost the whole answer is what we block. */
const MAX_ANSWER_OVERLAP = 0.8;
const QUESTION_WORDS =
  /^(?:(?:in|on|at|by|for|from|to|with|during|under|of|about)\s+)?(?:what|which|who|whom|whose|when|where|why|how|name|identify|define|describe|explain|state|list|give|is|are|does|do|can)\b/i;

/** Cleans what the model wrote, or returns null when it can't be trusted. */
export function cleanQuestion(raw: string, source: { front: string; back: string; context: string }): string | null {
  let text = raw.trim().split('\n')[0].trim();
  text = text.replace(/^(?:question|q)\s*[:\-]\s*/i, '').replace(/^["'“”‘’`]+|["'“”‘’`]+$/g, '').trim();
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) return null;
  if (!QUESTION_WORDS.test(text)) return null;
  if (isVagueFront(text)) return null;

  const normalize = (t: string) => t.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  if (normalize(text) === normalize(source.front)) return null;

  // It must be about the note: share at least one real word with the text it was given.
  const known = new Set(contentWords(`${source.context} ${source.back}`));
  const shared = contentWords(text).filter((w) => known.has(w));
  if (shared.length === 0) return null;

  // It must not give the answer away by repeating most of it.
  const answerWords = contentWords(source.back);
  if (answerWords.length >= 3) {
    const inQuestion = answerWords.filter((w) => contentWords(text).includes(w)).length;
    if (inQuestion / answerWords.length > MAX_ANSWER_OVERLAP) return null;
  }

  return /[?.]$/.test(text) ? text.replace(/\.$/, '?') : `${text}?`;
}