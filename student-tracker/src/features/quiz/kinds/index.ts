import type { Answer, Grade, Question, QuestionKind, QuestionType } from '../types';
import { choiceKind } from './choice';
import { enumerateKind } from './enumerate';
import { identifyKind } from './identify';
import { trueFalseKind } from './trueFalse';

/** In the order they are shown in the app. To add a new kind of question, add it here. */
export const KIND_LIST: QuestionKind<Question>[] = [choiceKind, identifyKind, enumerateKind, trueFalseKind];

export const KINDS = Object.fromEntries(KIND_LIST.map((kind) => [kind.type, kind])) as Record<QuestionType, QuestionKind<Question>>;

export const gradeAnswer = (question: Question, answer: Answer): Grade => KINDS[question.type].grade(question, answer);