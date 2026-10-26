import { llamaImprover } from '@/features/flashcards/improve/llamaImprover';
import { buildSimplifyMessages } from './prompt';
import type { Simplifier } from './simplifySentence';

const STOP_WORDS = ['</s>', '<|im_end|>', '<|end|>', '<|eot_id|>'];
const MAX_SENTENCE_TOKENS = 110; // room for the longest sentence we send (60 words)

/** Uses the same loaded model as the flashcard features, so it is not loaded twice. */
export const llamaSimplifier: Simplifier = {
  async write(sentence) {
    const context = await llamaImprover.load();
    const result = await context.completion({
      messages: buildSimplifyMessages(sentence),
      n_predict: MAX_SENTENCE_TOKENS,
      temperature: 0.2,
      stop: STOP_WORDS,
    });
    return result.text;
  },
};