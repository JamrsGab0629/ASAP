import type { SQLiteDatabase } from 'expo-sqlite';
import { getClassesForDate } from '@/features/schedule/classesForDate';
import { pickNextClass } from '@/features/schedule/nextClass';

/** The subject of the class happening right now, or null. */
export async function getOngoingSubjectId(db: SQLiteDatabase, now: Date): Promise<number | null> {
  const next = pickNextClass(await getClassesForDate(db, now), now);
  if (!next || next.status !== 'ongoing') return null;
  const row = await db.getFirstAsync<{ subject_id: number }>(
    `SELECT subject_id FROM schedules WHERE id = ?`,
    next.item.scheduleId,
  );
  return row?.subject_id ?? null;
}