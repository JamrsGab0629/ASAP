import { normalizeAnswer, sameAnswer } from '../answerMatch';
import { MAX_ANSWER_CHARS } from '../cardShape';
import { contentWords, related } from '@/features/shorten/words';

const WRONG_ANSWERS = 3;
const MIN_LENGTH_SHARE = 0.4; // a wrong answer much shorter or longer than the right one gives it away
const MAX_LENGTH_SHARE = 2.5;
const MAX_SHARED_WORDS = 0.6; // of its key words, counting the question too, since repeating the question is how a paraphrase of the answer looks

const LABEL = /^(?:wrong\s+answers?|incorrect|options?|choices?|answer|[a-d])\s*[:.)]\s*/i;

/**
 * Checks what the model wrote. Returns up to 3 wrong answers that are safe to show next to the right one.
 * They must look like the right answer (similar length), must not be the right answer reworded, and must not repeat each other.
 */
export function cleanWrongAnswers(correct: string, output: string, existing: string[] = [], question = ''): string[] {
  const right = correct.trim();
  const rightKey = normalizeAnswer(right);
  const known = [...new Set(contentWords(`${right} ${question}`))];
  const taken = new Set([rightKey, ...existing.map(normalizeAnswer)]);
  const lengthMin = Math.max(2, right.length * MIN_LENGTH_SHARE);
  const lengthMax = right.length * MAX_LENGTH_SHARE + 10;
  const kept: string[] = [];

  for (const raw of output.split('\n')) {
    const text = raw
      .trim()
      .replace(/^[-•*]\s+/, '')
      .replace(/^\d+[.)]\s+/, '')
      .replace(LABEL, '')
      .replace(/^["“‘']+|["”’']+$/g, '')
      .trim();
    const key = normalizeAnswer(text);
    if (!key || taken.has(key)) continue;
    if (text.length < lengthMin || text.length > Math.min(lengthMax, MAX_ANSWER_CHARS)) continue;
    if (text.endsWith('?')) continue;
    if (sameAnswer(right, text)) continue;
    if (rightKey.length >= 4 && (key.includes(rightKey) || rightKey.includes(key))) continue; // "Stack" vs "Stack overflow"

    const words = contentWords(text);
    if (words.length > 0 && words.filter((w) => known.some((k) => related(k, w))).length / words.length > MAX_SHARED_WORDS) continue;

    taken.add(key);
    kept.push(text);
    if (kept.length === WRONG_ANSWERS) break;
  }
  return kept;
}