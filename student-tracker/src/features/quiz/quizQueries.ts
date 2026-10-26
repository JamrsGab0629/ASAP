import type { SQLiteDatabase } from 'expo-sqlite';
import type { QuizCard } from './types';

/** Every card (or every card in one subject) that a quiz can use. */
export function loadQuizCards(db: SQLiteDatabase, subjectId: number | null): Promise<QuizCard[]> {
  return db.getAllAsync<QuizCard>(
    `SELECT c.id, c.subject_id AS subjectId, c.note_id AS noteId, c.front, c.back
     FROM flashcards c JOIN subjects s ON s.id = c.subject_id
     WHERE (? IS NULL OR c.subject_id = ?)
     ORDER BY c.id`,
    subjectId, subjectId,
  );
}