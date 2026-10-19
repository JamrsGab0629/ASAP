import type { SQLiteDatabase } from 'expo-sqlite';
import type { DeadlineDraft } from './types';

export async function addDeadline(db: SQLiteDatabase, draft: DeadlineDraft): Promise<void> {
  await db.runAsync(
    `INSERT INTO deadlines (subject_id, title, due_date, priority) VALUES (?, ?, ?, ?)`,
    draft.subjectId, draft.title, draft.dueDate, draft.priority,
  );
}

export async function setDeadlineDone(db: SQLiteDatabase, id: number, done: boolean): Promise<void> {
  await db.runAsync(`UPDATE deadlines SET status = ? WHERE id = ?`, done ? 'done' : 'open', id);
}

export async function deleteDeadline(db: SQLiteDatabase, id: number): Promise<void> {
  await db.runAsync(`DELETE FROM deadlines WHERE id = ?`, id);
}