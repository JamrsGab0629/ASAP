/** The part of a flashcard the quiz needs. */
export type QuizCard = { id: number; subjectId: number; front: string; back: string };

export type QuestionType = 'choice' | 'identify' | 'enumerate' | 'truefalse';

type Base = { cardId: number; subjectId: number };

export type ChoiceQuestion = Base & { type: 'choice'; prompt: string; options: string[]; correctIndex: number };
export type IdentifyQuestion = Base & { type: 'identify'; prompt: string; answer: string };
export type EnumerateQuestion = Base & { type: 'enumerate'; prompt: string; items: string[] };
export type TrueFalseQuestion = Base & { type: 'truefalse'; statement: string; isTrue: boolean; correction: string };

export type Question = ChoiceQuestion | IdentifyQuestion | EnumerateQuestion | TrueFalseQuestion;

/** choice: option index. identify: typed text. enumerate: typed items. truefalse: the chosen side. */
export type Answer = number | string | string[] | boolean;

/** points is 0 to 1, so a partly right enumeration can earn part of a point. */
export type Grade = { points: number; correct: boolean; expected: string };

export type Rng = () => number;

/** One kind of question. To add a new kind, write one of these and add it to the list in kinds/index.ts. */
export interface QuestionKind<Q extends Question> {
  type: Q['type'];
  label: string;
  canMake(card: QuizCard, pool: QuizCard[]): boolean;
  make(card: QuizCard, pool: QuizCard[], rng: Rng): Q;
  grade(question: Q, answer: Answer): Grade;
}