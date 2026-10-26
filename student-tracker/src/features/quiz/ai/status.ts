/** What the quiz setup screen shows while the model writes better wrong answers. */
export type PrepStatus =
  | { kind: 'idle' }
  | { kind: 'downloading'; percent: number }
  | { kind: 'working'; done: number; total: number }
  | { kind: 'failed'; message: string };

/** Everything the setup screen needs for the AI option. */
export type QuizAi = {
  enabled: boolean;
  onToggle: (on: boolean) => void;
  status: PrepStatus;
  onStop: () => void;
};