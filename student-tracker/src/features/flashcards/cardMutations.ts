import type { SQLiteDatabase } from 'expo-sqlite';
import { toDueAt } from './dueAt';
import type { Outcome } from './scheduler';
import type { Card, CardDraft, Rating } from './types';

export async function addCard(db: SQLiteDatabase, draft: CardDraft, now: Date = new Date()): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO flashcards (subject_id, note_id, front, back, due_at) VALUES (?, ?, ?, ?, ?)`,
    draft.subjectId, draft.noteId ?? null, draft.front, draft.back, toDueAt(now),
  );
  return result.lastInsertRowId;
}

export async function updateCard(db: SQLiteDatabase, id: number, draft: CardDraft): Promise<void> {
  await db.runAsync(`UPDATE flashcards SET subject_id = ?, front = ?, back = ? WHERE id = ?`, draft.subjectId, draft.front, draft.back, id);
}

export async function deleteCard(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync(`DELETE FROM review_log WHERE card_id = ?`, id);
  await db.runAsync(`DELETE FROM flashcards WHERE id = ?`, id);
}

/** Saves the new schedule and records the answer, together or not at all. */
export async function applyReview(db: SQLiteDatabase, card: Card, rating: Rating, outcome: Outcome, now: Date): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `UPDATE flashcards SET stage = ?, interval_days = ?, ease = ?, reps = ?, lapses = ?, due_at = ? WHERE id = ?`,
      outcome.stage, outcome.intervalDays, outcome.ease, outcome.reps, outcome.lapses, toDueAt(outcome.dueAt), card.id,
    );
    await db.runAsync(
      `INSERT INTO review_log (card_id, rating, was_new, interval_days, reviewed_at) VALUES (?, ?, ?, ?, ?)`,
      card.id, rating, card.stage === 'new' ? 1 : 0, outcome.intervalDays, toDueAt(now),
    );
  });
}