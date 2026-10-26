import { llamaImprover } from '@/features/flashcards/improve/llamaImprover';
import { buildWrongAnswerMessages } from './prompt';
import type { WrongAnswerWriter } from './improveChoices';

const STOP_WORDS = ['</s>', '<|im_end|>', '<|end|>', '<|eot_id|>'];
const MAX_TOKENS = 120; // three answers of up to about 25 words

/** Uses the same loaded model as the other AI features, so it is not loaded twice. */
export const llamaWriter: WrongAnswerWriter = {
  async write(question, correct) {
    const context = await llamaImprover.load();
    const result = await context.completion({
      messages: buildWrongAnswerMessages(question, correct),
      n_predict: MAX_TOKENS,
      temperature: 0.7, // some variety, since the three answers should differ
      stop: STOP_WORDS,
    });
    return result.text;
  },
};