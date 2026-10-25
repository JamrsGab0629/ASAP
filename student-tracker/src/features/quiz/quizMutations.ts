import type { SQLiteDatabase } from 'expo-sqlite';
import { toDueAt } from '@/features/flashcards/dueAt';

export type QuizResult = { subjectId: number | null; questionCount: number; points: number };

export async function saveQuizResult(db: SQLiteDatabase, result: QuizResult, now: Date = new Date()): Promise<void> {
  await db.runAsync(
    `INSERT INTO quiz_results (subject_id, taken_at, question_count, points) VALUES (?, ?, ?, ?)`,
    result.subjectId, toDueAt(now), result.questionCount, result.points,
  );
}

/** Makes studied cards due right now. Cards never studied are already available, so they are left alone. */
export async function makeCardsDue(db: SQLiteDatabase, cardIds: number[], now: Date = new Date()): Promise<void> {
  if (cardIds.length === 0) return;
  const marks = cardIds.map(() => '?').join(', ');
  await db.runAsync(`UPDATE flashcards SET due_at = ? WHERE stage != 'new' AND id IN (${marks})`, toDueAt(now), ...cardIds);
}