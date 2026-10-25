import { sameAnswer } from '../answerMatch';
import { isList, listItems, listTitle } from '../cardShape';
import type { EnumerateQuestion, QuestionKind } from '../types';

const MIN_ITEMS = 3;

export const enumerateKind: QuestionKind<EnumerateQuestion> = {
  type: 'enumerate',
  label: 'Enumeration',

  canMake(card) {
    return isList(card) && listItems(card).length >= MIN_ITEMS;
  },

  make(card) {
    const items = listItems(card);
    return {
      type: 'enumerate', cardId: card.id, subjectId: card.subjectId, items,
      prompt: `List the ${items.length} items under "${listTitle(card)}"`,
    };
  },

  /** Each expected item can be matched once, in any order. */
  grade(question, answer) {
    const given = Array.isArray(answer) ? answer.filter((item) => item.trim()) : [];
    const unused = [...given];
    let matched = 0;
    for (const item of question.items) {
      const at = unused.findIndex((g) => sameAnswer(item, g));
      if (at === -1) continue;
      unused.splice(at, 1);
      matched += 1;
    }
    return { points: matched / question.items.length, correct: matched === question.items.length, expected: question.items.join(', ') };
  },
};