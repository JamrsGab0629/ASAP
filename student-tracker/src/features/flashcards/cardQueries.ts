import type { SQLiteDatabase } from 'expo-sqlite';
import { toDueAt } from './dueAt';
import type { Card, DeckSummary } from './types';

const SELECT = `SELECT c.id, c.subject_id AS subjectId, c.note_id AS noteId, c.front, c.back, c.due_at AS dueAt,
  c.interval_days AS intervalDays, c.ease, c.reps, c.lapses, c.stage
  FROM flashcards c JOIN subjects s ON s.id = c.subject_id`;

/** Every subject, with how many cards are due and how many are new. */
export function listDeckSummaries(db: SQLiteDatabase, now: Date): Promise<DeckSummary[]> {
  return db.getAllAsync<DeckSummary>(
    `SELECT s.id AS subjectId, s.name AS name, s.color AS color,
       COUNT(c.id) AS total,
       COALESCE(SUM(CASE WHEN c.stage != 'new' AND c.due_at <= ? THEN 1 ELSE 0 END), 0) AS due,
       COALESCE(SUM(CASE WHEN c.stage = 'new' THEN 1 ELSE 0 END), 0) AS fresh
     FROM subjects s LEFT JOIN flashcards c ON c.subject_id = s.id
     GROUP BY s.id ORDER BY s.name`,
    toDueAt(now),
  );
}

export function listCards(db: SQLiteDatabase, subjectId: number): Promise<Card[]> {
  return db.getAllAsync<Card>(`${SELECT} WHERE c.subject_id = ? ORDER BY c.id DESC`, subjectId);
}

/** New cards the student has already started today. */
export async function countNewToday(db: SQLiteDatabase, dayKey: string): Promise<number> {
  const row = await db.getFirstAsync<{ n: number }>(
    `SELECT COUNT(*) AS n FROM review_log WHERE was_new = 1 AND substr(reviewed_at, 1, 10) = ?`,
    dayKey,
  );
  return row?.n ?? 0;
}

/** Cards to study now: everything due first (oldest first), then new cards up to the daily allowance. */
export async function listStudyCards(db: SQLiteDatabase, subjectId: number | null, now: Date, newAllowed: number): Promise<Card[]> {
  const due = await db.getAllAsync<Card>(
    `${SELECT} WHERE c.stage != 'new' AND c.due_at <= ? AND (? IS NULL OR c.subject_id = ?) ORDER BY c.due_at, c.id`,
    toDueAt(now), subjectId, subjectId,
  );
  if (newAllowed <= 0) return due;
  const fresh = await db.getAllAsync<Card>(
    `${SELECT} WHERE c.stage = 'new' AND (? IS NULL OR c.subject_id = ?) ORDER BY c.id LIMIT ?`,
    subjectId, subjectId, newAllowed,
  );
  return [...due, ...fresh];
}