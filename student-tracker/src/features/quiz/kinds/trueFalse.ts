import { answerText, blankAnswer, BLANK_MARK, isBlank, isList, MAX_ANSWER_CHARS } from '../cardShape';
import { distractorsFor } from '../distractors';
import { pick } from '../rng';
import type { QuestionKind, TrueFalseQuestion } from '../types';

const CLOSEST_TO_CHOOSE_FROM = 3;

export const trueFalseKind: QuestionKind<TrueFalseQuestion> = {
  type: 'truefalse',
  label: 'True or false',

  canMake(card, pool) {
    return !isList(card) && answerText(card).length <= MAX_ANSWER_CHARS && distractorsFor(card, pool).length >= 1;
  },

  make(card, pool, rng) {
    const isTrue = rng() < 0.5;
    const real = answerText(card);
    const claim = isTrue ? real : answerText(pick(distractorsFor(card, pool).slice(0, CLOSEST_TO_CHOOSE_FROM), rng));

    const statement = isBlank(card)
      ? card.front.split(BLANK_MARK).join(claim)
      : `${card.front}\n→ ${claim}`;
    return { type: 'truefalse', cardId: card.id, subjectId: card.subjectId, statement, isTrue, correction: isBlank(card) ? blankAnswer(card) : real };
  },

  grade(question, answer) {
    const correct = answer === question.isTrue;
    return {
      points: correct ? 1 : 0,
      correct,
      expected: question.isTrue ? 'True' : `False. The correct answer is: ${question.correction}`,
    };
  },
};