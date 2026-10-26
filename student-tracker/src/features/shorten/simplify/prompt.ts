import type { ChatMessage } from '@/features/flashcards/improve/types';

const SYSTEM =
  "You shorten one sentence from a student's notes. Keep the meaning, every number and every key term. " +
  'Use only words that are already in the sentence. Cut filler and repeated ideas. Reply with the shorter sentence only.';

const EXAMPLES: [string, string][] = [
  [
    'In computer science, a stack is basically a kind of data structure that follows the last in, first out principle, which means the last item added is the first one removed.',
    'A stack is a data structure that follows last in, first out: the last item added is the first removed.',
  ],
  [
    'Photosynthesis is the process that is used by plants in order to convert light energy into chemical energy that is stored in glucose.',
    'Photosynthesis is the process plants use to convert light energy into chemical energy stored in glucose.',
  ],
];

export function buildSimplifyMessages(sentence: string): ChatMessage[] {
  return [
    { role: 'system', content: SYSTEM },
    ...EXAMPLES.flatMap(([input, output]): ChatMessage[] => [
      { role: 'user', content: input },
      { role: 'assistant', content: output },
    ]),
    { role: 'user', content: sentence },
  ];
}