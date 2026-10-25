import { KIND_LIST, KINDS } from './kinds';
import { pick, shuffle } from './rng';
import type { Question, QuestionType, QuizCard, Rng } from './types';

export type QuizConfig = { count: number; types: QuestionType[] };

const groupBySubject = (cards: QuizCard[]) => {
  const groups = new Map<number, QuizCard[]>();
  for (const card of cards) groups.set(card.subjectId, [...(groups.get(card.subjectId) ?? []), card]);
  return groups;
};

/** How many cards can make each kind of question, so the setup screen can switch off kinds that can't be made. */
export function availability(cards: QuizCard[]): Record<QuestionType, number> {
  const groups = groupBySubject(cards);
  const counts = Object.fromEntries(KIND_LIST.map((k) => [k.type, 0])) as Record<QuestionType, number>;
  for (const card of cards) {
    const pool = (groups.get(card.subjectId) ?? []).filter((c) => c.id !== card.id);
    for (const kind of KIND_LIST) if (kind.canMake(card, pool)) counts[kind.type] += 1;
  }
  return counts;
}

/** Builds a quiz. Each card is used once, and the chosen kinds are spread as evenly as the cards allow. */
export function buildQuiz(cards: QuizCard[], config: QuizConfig, rng: Rng): Question[] {
  const groups = groupBySubject(cards);
  const used = Object.fromEntries(KIND_LIST.map((k) => [k.type, 0])) as Record<QuestionType, number>;
  const questions: Question[] = [];

  for (const card of shuffle(cards, rng)) {
    if (questions.length >= config.count) break;
    const pool = (groups.get(card.subjectId) ?? []).filter((c) => c.id !== card.id);
    const eligible = config.types.filter((type) => KINDS[type].canMake(card, pool));
    if (eligible.length === 0) continue;

    const fewest = Math.min(...eligible.map((type) => used[type]));
    const type = pick(eligible.filter((t) => used[t] === fewest), rng);
    questions.push(KINDS[type].make(card, pool, rng));
    used[type] += 1;
  }
  return questions;
}

/** How many questions the chosen kinds could make at most, one per card. */
export function maxQuestions(cards: QuizCard[], types: QuestionType[]): number {
  const groups = groupBySubject(cards);
  return cards.filter((card) => {
    const pool = (groups.get(card.subjectId) ?? []).filter((c) => c.id !== card.id);
    return types.some((type) => KINDS[type].canMake(card, pool));
  }).length;
}