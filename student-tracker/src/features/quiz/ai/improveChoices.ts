import { runSequentially, type Progress } from '@/features/flashcards/improve/batch';
import { shuffle } from '../rng';
import type { ChoiceQuestion, Question, Rng } from '../types';
import { cleanWrongAnswers } from './validate';

/** Something that can write wrong answers. The real one is the on-device model. A fake one is used in tests. */
export interface WrongAnswerWriter {
  /** Returns the raw text the model wrote. It is checked before the student sees it. */
  write(question: string, correct: string): Promise<string>;
}

const WRONG_OPTIONS = 3;

/** Swaps the wrong options for model-written ones that passed the checks. Any gaps are filled with the old ones, so there are always four options. */
async function improveOne(writer: WrongAnswerWriter, question: ChoiceQuestion, rng: Rng): Promise<ChoiceQuestion> {
  const correct = question.options[question.correctIndex];
  const old = question.options.filter((_, i) => i !== question.correctIndex);
  let written: string[];
  try {
    written = cleanWrongAnswers(correct, await writer.write(question.prompt, correct), [], question.prompt);
  } catch {
    return question;
  }
  if (written.length === 0) return question;

  const wrong = [...written, ...old].slice(0, WRONG_OPTIONS);
  const options = shuffle([correct, ...wrong], rng);
  return { ...question, options, correctIndex: options.indexOf(correct) };
}

/** Improves the multiple-choice questions one at a time. When stopped early, the rest keep their original options. */
export async function improveChoices(
  questions: Question[],
  writer: WrongAnswerWriter,
  rng: Rng,
  onProgress: (progress: Progress) => void,
  isCancelled: () => boolean,
): Promise<Question[]> {
  const targets = questions.flatMap((question, index) => (question.type === 'choice' ? [{ question, index }] : []));
  const improved = await runSequentially(targets, ({ question }) => improveOne(writer, question, rng), onProgress, isCancelled);
  const result = [...questions];
  improved.forEach((question, i) => {
    result[targets[i].index] = question;
  });
  return result;
}