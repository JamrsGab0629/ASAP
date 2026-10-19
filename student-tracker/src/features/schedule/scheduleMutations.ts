import type { SQLiteDatabase } from 'expo-sqlite';
import type { ClassDraft } from './types';

export async function addClass(db: SQLiteDatabase, draft: ClassDraft): Promise<void> {
  if (draft.kind === 'makeup') {
    await db.runAsync(
      `INSERT INTO schedules (subject_id, type, date, start, end, room) VALUES (?, 'makeup', ?, ?, ?, ?)`,
      draft.subjectId, draft.date, draft.start, draft.end, draft.room,
    );
    return;
  }
  await db.withTransactionAsync(async () => {
    for (const day of draft.days) {
      await db.runAsync(
        `INSERT INTO schedules (subject_id, type, day_of_week, start, end, room) VALUES (?, 'regular', ?, ?, ?, ?)`,
        draft.subjectId, day, draft.start, draft.end, draft.room,
      );
    }
  });
}

/** Skips one occurrence of a weekly class without touching the rest. */
export async function cancelOnDate(db: SQLiteDatabase, scheduleId: number, isoDate: string): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync(`DELETE FROM schedule_exceptions WHERE schedule_id = ? AND date = ?`, scheduleId, isoDate);
    await db.runAsync(
      `INSERT INTO schedule_exceptions (schedule_id, date, status) VALUES (?, ?, 'cancelled')`,
      scheduleId, isoDate,
    );
  });
}

export async function deleteSchedule(db: SQLiteDatabase, scheduleId: number): Promise<void> {
  await db.runAsync(`DELETE FROM schedules WHERE id = ?`, scheduleId);
}