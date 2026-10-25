import type { Answer } from '../types';

/** What every question view receives. */
export type ViewProps<Q> = {
  question: Q;
  /** The answer has been checked, so inputs are disabled and the right answer is shown */
  locked: boolean;
  onSubmit: (answer: Answer) => void;
};