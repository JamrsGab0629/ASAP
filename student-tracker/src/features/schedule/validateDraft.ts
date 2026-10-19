import { parseTime } from '@/lib/dates';
import type { ClassDraft } from './types';

/** Returns an error message, or null when the draft is valid. */
export function validateDraft(draft: ClassDraft | null): string | null {
  if (!draft) return 'Pick a subject first.';
  if (parseTime(draft.end) <= parseTime(draft.start)) return 'End time must be after the start time.';
  if (draft.kind === 'regular' && draft.days.length === 0) return 'Pick at least one day.';
  return null;
}