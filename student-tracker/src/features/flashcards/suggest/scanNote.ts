import type { SQLiteDatabase } from 'expo-sqlite';
import { getNote } from '@/features/notes/noteQueries';
import type { Note } from '@/features/notes/types';
import { suggestCards } from './suggestCards';
import type { Suggestion } from './types';

export type ScanResult = { note: Note; suggestions: Suggestion[] };

/** Reads a note, its highlights and the subject's existing cards, and suggests new cards. */
export async function scanNote(db: SQLiteDatabase, noteId: number): Promise<ScanResult | null> {
  const note = await getNote(db, noteId);
  if (!note) return null;

  const highlights = await db.getAllAsync<{ text: string }>(`SELECT text FROM note_highlights WHERE note_id = ?`, noteId);
  const existing = await db.getAllAsync<{ front: string }>(`SELECT front FROM flashcards WHERE subject_id = ?`, note.subjectId);

  const suggestions = suggestCards({
    body: note.body,
    highlights: highlights.map((h) => h.text),
    existingFronts: existing.map((c) => c.front),
  });
  return { note, suggestions };
}