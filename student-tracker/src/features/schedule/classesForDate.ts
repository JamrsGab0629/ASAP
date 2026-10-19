import type { SQLiteDatabase } from 'expo-sqlite';
import { toISODate } from '@/lib/dates';

export type ScheduledClass = {
  scheduleId: number;
  subjectName: string;
  subjectColor: string;
  teacher: string | null;
  room: string | null;
  start: string; // 'HH:MM'
  end: string; // 'HH:MM'
  isMakeup: boolean;
  isMoved: boolean;
};

type Row = {
  scheduleId: number;
  subjectName: string;
  subjectColor: string;
  teacher: string | null;
  type: string;
  startTime: string;
  endTime: string;
  room: string | null;
  exceptionStatus: string | null;
};

// day_of_week uses JavaScript's convention: 0 = Sunday ... 6 = Saturday.
const SQL = `
  SELECT s.id AS scheduleId,
         sub.name AS subjectName,
         sub.color AS subjectColor,
         sub.teacher AS teacher,
         s.type AS type,
         COALESCE(e.new_start, s.start) AS startTime,
         COALESCE(e.new_end, s."end") AS endTime,
         COALESCE(e.new_room, s.room) AS room,
         e.status AS exceptionStatus
  FROM schedules s
  JOIN subjects sub ON sub.id = s.subject_id
  LEFT JOIN schedule_exceptions e ON e.schedule_id = s.id AND e.date = ?
  WHERE ((s.type = 'regular' AND s.day_of_week = ?) OR (s.type = 'makeup' AND s.date = ?))
    AND (e.status IS NULL OR e.status = 'moved')
  ORDER BY startTime ASC`;

/** Classes that actually happen on a date: regular + makeup, minus cancelled/suspended, with moves applied. */
export async function getClassesForDate(db: SQLiteDatabase, date: Date): Promise<ScheduledClass[]> {
  const iso = toISODate(date);
  const rows = await db.getAllAsync<Row>(SQL, iso, date.getDay(), iso);
  return rows.map((r) => ({
    scheduleId: r.scheduleId,
    subjectName: r.subjectName,
    subjectColor: r.subjectColor,
    teacher: r.teacher,
    room: r.room,
    start: r.startTime,
    end: r.endTime,
    isMakeup: r.type === 'makeup',
    isMoved: r.exceptionStatus === 'moved',
  }));
}