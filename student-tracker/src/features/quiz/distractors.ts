import { contentWords } from '@/features/shorten/words';
import { answerText, isBlank, isList, MAX_ANSWER_CHARS } from './cardShape';
import { normalizeAnswer } from './answerMatch';
import type { QuizCard } from './types';

const SAME_NOTE_BONUS = 1000; // cards from the same note are always preferred
const NEAR_DUPLICATE = 0.85;

/** How much two cards are about the same thing: the same note counts most, then shared key words in the front and answer. */
function topicScore(card: QuizCard, other: QuizCard): number {
  const mine = new Set([...contentWords(card.front), ...contentWords(answerText(card))]);
  const theirs = new Set([...contentWords(other.front), ...contentWords(answerText(other))]);
  let shared = 0;
  for (const word of theirs) if (mine.has(word)) shared++;
  const sameNote = card.noteId != null && card.noteId === other.noteId;
  return shared + (sameNote ? SAME_NOTE_BONUS : 0);
}

/** True when two answers say nearly the same thing in different words, like a term card and a fill-in-the-blank card of one sentence. */
function nearDuplicate(a: Set<string>, b: Set<string>): boolean {
  const smaller = Math.min(a.size, b.size);
  if (smaller < 4) return false;
  let shared = 0;
  for (const word of a) if (b.has(word)) shared++;
  return shared / smaller >= NEAR_DUPLICATE;
}

/** Other cards whose answers make believable wrong answers, most believable first: same note, then same topic, then similar length. */
export function distractorsFor(card: QuizCard, pool: QuizCard[]): QuizCard[] {
  const correct = normalizeAnswer(answerText(card));
  const length = answerText(card).length;
  const seen = new Set<string>([correct]);

  const ranked = pool
    .filter((other) => other.id !== card.id && !isList(other) && answerText(other).length <= MAX_ANSWER_CHARS)
    .filter((other) => isBlank(other) === isBlank(card)) // a hidden word is only mixed with other hidden words
    .filter((other) => {
      const key = normalizeAnswer(answerText(other));
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((other) => ({ other, topic: topicScore(card, other), gap: Math.abs(answerText(other).length - length) }))
    .sort((a, b) => b.topic - a.topic || a.gap - b.gap);

  // Walk the best first and drop anything that says the same as the right answer or as an option already taken.
  const taken = [new Set(contentWords(answerText(card)))];
  const result: QuizCard[] = [];
  for (const { other } of ranked) {
    const words = new Set(contentWords(answerText(other)));
    if (taken.some((t) => nearDuplicate(t, words))) continue;
    taken.push(words);
    result.push(other);
  }
  return result;
}