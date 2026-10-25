import { sameAnswer } from '../answerMatch';
import { blankAnswer, hideAnswer, isBlank, isList, termSide, wordCount } from '../cardShape';
import type { IdentifyQuestion, QuestionKind, QuizCard } from '../types';

const MAX_ANSWER_WORDS = 5;
const MAX_PROMPT_CHARS = 240;
const MAX_FIRST_SENTENCE_CHARS = 300;

/** The first sentence or two of a long description, or null when even the first sentence is too long to read. */
export function clipPrompt(text: string): string | null {
  const sentences = text.match(/[^.!?]+(?:[.!?]+|$)\s*/g) ?? [text];
  if (sentences[0].trim().length > MAX_FIRST_SENTENCE_CHARS) return null;
  let clipped = '';
  for (const sentence of sentences) {
    if (clipped && (clipped + sentence).trim().length > MAX_PROMPT_CHARS) break;
    clipped += sentence;
  }
  return clipped.trim();
}

/** What to show and what the student should type, or null when the card has no short answer. */
function describe(card: QuizCard): { prompt: string; answer: string } | null {
  if (isList(card)) return null;
  if (isBlank(card)) return { prompt: card.front, answer: blankAnswer(card) };

  const side = termSide(card);
  if (side) {
    const prompt = clipPrompt(side.description);
    return prompt ? { prompt: hideAnswer(prompt, side.term), answer: side.term } : null;
  }

  const back = card.back.trim();
  return wordCount(back) <= MAX_ANSWER_WORDS ? { prompt: hideAnswer(card.front, back), answer: back } : null;
}

export const identifyKind: QuestionKind<IdentifyQuestion> = {
  type: 'identify',
  label: 'Identification',

  canMake(card) {
    const found = describe(card);
    return found !== null && wordCount(found.answer) >= 1 && wordCount(found.answer) <= MAX_ANSWER_WORDS;
  },

  make(card) {
    const found = describe(card)!;
    return { type: 'identify', cardId: card.id, subjectId: card.subjectId, ...found };
  },

  grade(question, answer) {
    const correct = typeof answer === 'string' && sameAnswer(question.answer, answer);
    return { points: correct ? 1 : 0, correct, expected: question.answer };
  },
};