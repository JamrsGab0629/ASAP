import type { SQLiteDatabase } from 'expo-sqlite';

export type Priority = 'high' | 'medium' | 'low';

export type DueDeadline = {
  id: number;
  title: string;
  dueAt: Date;
  priority: Priority;
  subjectName: string;
  subjectColor: string;
  isOverdue: boolean;
};

type Row = {
  id: number;
  title: string;
  due_date: string;
  priority: string;
  subjectName: string;
  subjectColor: string;
};

export async function getUpcomingDeadlines(
  db: SQLiteDatabase,
  now: Date,
  limit = 5
): Promise<DueDeadline[]> {
  const rows = await db.getAllAsync<Row>(
    `SELECT d.id, d.title, d.due_date, d.priority,
            sub.name AS subjectName, sub.color AS subjectColor
     FROM deadlines d
     JOIN subjects sub ON sub.id = d.subject_id
     WHERE d.status = 'open'
     ORDER BY d.due_date ASC
     LIMIT ?`,
    limit
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
      isOverdue: dueAt.getTime() < now.getTime(),
    };
  });
}

/** Open deadlines due on or before an ISO date ('YYYY-MM-DD'), overdue ones included. */
export async function countOpenDueOnOrBefore(db: SQLiteDatabase, isoDate: string): Promise<number> {
  const row = await db.getFirstAsync<{ n: number }>(
    "SELECT COUNT(*) AS n FROM deadlines WHERE status = 'open' AND substr(due_date, 1, 10) <= ?",
    isoDate
  );
  return row?.n ?? 0;
}