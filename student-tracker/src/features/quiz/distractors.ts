import { answerText, isBlank, isList, MAX_ANSWER_CHARS } from './cardShape';
import { normalizeAnswer } from './answerMatch';
import type { QuizCard } from './types';

/** Other cards in the subject whose answers make believable wrong answers, most believable first. */
export function distractorsFor(card: QuizCard, pool: QuizCard[]): QuizCard[] {
  const correct = normalizeAnswer(answerText(card));
  const length = answerText(card).length;
  const seen = new Set<string>([correct]);

  return pool
    .filter((other) => other.id !== card.id && !isList(other) && answerText(other).length <= MAX_ANSWER_CHARS)
    .filter((other) => isBlank(other) === isBlank(card)) // a hidden word is only mixed with other hidden words
    .filter((other) => {
      const key = normalizeAnswer(answerText(other));
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => Math.abs(answerText(a).length - length) - Math.abs(answerText(b).length - length));
}