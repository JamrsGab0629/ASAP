import { addDays, formatShortDate, toISODate } from '@/lib/dates';

type TitleSource = { title: string; body: string };

const lines = (body: string) => body.split('\n').map((l) => l.trim()).filter(Boolean);

/** The typed title, else the first line, else a placeholder. */
export function noteTitle(note: TitleSource): string {
  const typed = note.title.trim();
  if (typed) return typed;
  const first = lines(note.body)[0];
  return first ? first.slice(0, 60) : 'Untitled note';
}

/** The first lines of the body, skipping the line already used as the title. */
export function notePreview(note: TitleSource, maxLines = 2): string {
  const rest = lines(note.body);
  if (!note.title.trim()) rest.shift();
  return rest.slice(0, maxLines).join(' ');
}

export function relativeDay(updatedAt: string, today: Date): string {
  const key = updatedAt.slice(0, 10);
  if (key === toISODate(today)) return 'Today';
  if (key === toISODate(addDays(today, -1))) return 'Yesterday';
  const [y, m, d] = key.split('-').map(Number);
  return formatShortDate(new Date(y, m - 1, d));
}