import type { DeadlineDraft } from './types';

export function validateDeadline(draft: DeadlineDraft | null): string | null {
  if (!draft) return 'Pick a subject first.';
  if (draft.title.length === 0) return 'Give the deadline a title.';
  return null;
}