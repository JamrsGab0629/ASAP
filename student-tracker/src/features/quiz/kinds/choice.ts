import { answerText, hideAnswer, isList, MAX_ANSWER_CHARS, wordCount } from '../cardShape';
import { distractorsFor } from '../distractors';
import { shuffle } from '../rng';
import type { ChoiceQuestion, QuestionKind } from '../types';

const WRONG_OPTIONS = 3;
const CLOSEST_TO_CHOOSE_FROM = 6;
const MAX_HIDDEN_ANSWER_WORDS = 5;

export const choiceKind: QuestionKind<ChoiceQuestion> = {
  type: 'choice',
  label: 'Multiple choice',

  canMake(card, pool) {
    return !isList(card) && answerText(card).length <= MAX_ANSWER_CHARS && distractorsFor(card, pool).length >= WRONG_OPTIONS;
  },

  make(card, pool, rng) {
    const correct = answerText(card);
    const wrong = shuffle(distractorsFor(card, pool).slice(0, CLOSEST_TO_CHOOSE_FROM), rng)
      .slice(0, WRONG_OPTIONS)
      .map(answerText);
    const options = shuffle([correct, ...wrong], rng);
    return {
      type: 'choice', cardId: card.id, subjectId: card.subjectId, options, correctIndex: options.indexOf(correct),
      prompt: wordCount(correct) <= MAX_HIDDEN_ANSWER_WORDS ? hideAnswer(card.front, correct) : card.front,
    };
  },

  grade(question, answer) {
    const correct = answer === question.correctIndex;
    return { points: correct ? 1 : 0, correct, expected: question.options[question.correctIndex] };
  },
};