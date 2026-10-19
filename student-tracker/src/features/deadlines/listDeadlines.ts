import type { SQLiteDatabase } from 'expo-sqlite';
import type { DeadlineStatus } from './types';
import type { DueDeadline, Priority } from './upcomingDeadlines';

type Row = {
  id: number;
  title: string;
  due_date: string;
  priority: string;
  subjectName: string;
  subjectColor: string;
};

const ORDER: Record<DeadlineStatus, 'ASC' | 'DESC'> = { open: 'ASC', done: 'DESC' };

export async function listDeadlines(db: SQLiteDatabase, status: DeadlineStatus, now: Date): Promise<DueDeadline[]> {
  const rows = await db.getAllAsync<Row>(
    `SELECT d.id, d.title, d.due_date, d.priority,
            sub.name AS subjectName, sub.color AS subjectColor
     FROM deadlines d
     JOIN subjects sub ON sub.id = d.subject_id
     WHERE d.status = ?
     ORDER BY d.due_date ${ORDER[status]}`,
    status,
  );
  return rows.map((r) => {
    const dueAt = new Date(r.due_date);
    return {
      id: r.id,
      title: r.title,
      dueAt,
      priority: r.priority as Priority,
      subjectName: r.subjectName,
      subjectColor: r.subjectColor,
      isOverdue: status === 'open' && dueAt.getTime() < now.getTime(),
    };
  });
}