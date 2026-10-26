import { modelPath } from './modelFiles';
import { buildMessages } from './prompt';
import type { CardImprover, ImproveInput } from './types';

type LlamaModule = typeof import('llama.rn');
type Context = Awaited<ReturnType<LlamaModule['initLlama']>>;

const STOP_WORDS = ['</s>', '<|im_end|>', '<|end|>', '<|eot_id|>'];
const MAX_QUESTION_TOKENS = 48;

let loading: Promise<Context> | null = null;

async function startModel(): Promise<Context> {
  let llama: LlamaModule;
  try {
    // Loaded only when needed, so the app still opens in Expo Go, where this library does not exist.
    llama = await import('llama.rn');
  } catch {
    throw new Error('The on-device model only works in the development build of the app, not in Expo Go.');
  }
  try {
    return await llama.initLlama({ model: modelPath(), n_ctx: 1024, n_gpu_layers: 0 });
  } catch (error) {
    throw new Error(`The model could not start: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export const llamaImprover = {
  /** Loads the model into memory the first time, then reuses it. */
  load(): Promise<Context> {
    loading ??= startModel().catch((error) => {
      loading = null;
      throw error;
    });
    return loading;
  },

  async write(input: ImproveInput): Promise<string> {
    const context = await llamaImprover.load();
    const result = await context.completion({
      messages: buildMessages(input),
      n_predict: MAX_QUESTION_TOKENS,
      temperature: 0.3,
      stop: STOP_WORDS,
    });
    return result.text;
  },
} satisfies CardImprover & { load(): Promise<Context> };