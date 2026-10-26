import type { ChatMessage } from '@/features/flashcards/improve/types';

const SYSTEM =
  'You write wrong answer choices for a multiple-choice question. Write 3 believable but incorrect answers. ' +
  'They must be about the same topic, the same kind of thing and a similar length as the correct answer, and must not mean the same thing. ' +
  'Write one per line, with no numbers and no explanation.';

const EXAMPLES: { question: string; correct: string; wrong: string[] }[] = [
  {
    question: 'Which data structure follows last in, first out?',
    correct: 'Stack',
    wrong: ['Queue', 'Linked list', 'Binary tree'],
  },
  {
    question: 'What does the control unit of a CPU do?',
    correct: 'Directs the flow of instructions and data between components',
    wrong: [
      'Performs arithmetic and logic operations on data',
      'Stores frequently used data close to the processor',
      'Converts program code into machine language',
    ],
  },
];

const ask = (question: string, correct: string) => `Question: ${question}\nCorrect answer: ${correct}`;

export function buildWrongAnswerMessages(question: string, correct: string): ChatMessage[] {
  return [
    { role: 'system', content: SYSTEM },
    ...EXAMPLES.flatMap((e): ChatMessage[] => [
      { role: 'user', content: ask(e.question, e.correct) },
      { role: 'assistant', content: e.wrong.join('\n') },
    ]),
    { role: 'user', content: ask(question, correct) },
  ];
}