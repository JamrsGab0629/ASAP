import type { ComponentType } from 'react';
import type { Question, QuestionType } from '../types';
import { ChoiceView } from './ChoiceView';
import { EnumerateView } from './EnumerateView';
import { IdentifyView } from './IdentifyView';
import { TrueFalseView } from './TrueFalseView';
import type { ViewProps } from './ViewProps';

/** One screen per kind of question. To add a new kind, add its view here. */
export const QUESTION_VIEWS = {
  choice: ChoiceView,
  identify: IdentifyView,
  enumerate: EnumerateView,
  truefalse: TrueFalseView,
} as unknown as Record<QuestionType, ComponentType<ViewProps<Question>>>;

/** Typed answers can be right but worded differently, so the student may overrule the check. */
export const CAN_OVERRULE: QuestionType[] = ['identify', 'enumerate'];