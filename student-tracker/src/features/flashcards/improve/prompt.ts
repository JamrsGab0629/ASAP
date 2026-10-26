import type { ChatMessage, ImproveInput } from './types';

const SYSTEM =
  'You write one clear exam question. Use only the given text. The answer must be stated in the text. ' +
  'Write the question only. Do not write the answer. Do not add anything else.';

/** Two short examples help a very small model copy the format. */
const EXAMPLES: ChatMessage[] = [
  {
    role: 'user',
    content: 'Text: A stack is a list where the last item added is the first one removed.\nAnswer: The last item added is the first one removed.',
  },
  { role: 'assistant', content: 'In a stack, which item is removed first?' },
  {
    role: 'user',
    content: 'Text: The CPU fetches an instruction, decodes it, then executes it.\nAnswer: Fetch, decode, execute.',
  },
  { role: 'assistant', content: 'What are the three steps the CPU repeats for each instruction?' },
];

export function buildMessages({ back, context }: ImproveInput): ChatMessage[] {
  return [
    { role: 'system', content: SYSTEM },
    ...EXAMPLES,
    { role: 'user', content: `Text: ${context}\nAnswer: ${back}` },
  ];
}