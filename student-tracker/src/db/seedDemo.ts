import type { SQLiteDatabase } from 'expo-sqlite';
import { addDays, toISODate } from '@/lib/dates';

/** TEMPORARY: fills the database once so the dashboard has something to show. */
export async function seedDemoData(db: SQLiteDatabase, now = new Date()): Promise<void> {
  const existing = await db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM schedules');
  if ((existing?.n ?? 0) > 0) return;

  const today = toISODate(now);
  const monthStart = toISODate(new Date(now.getFullYear(), now.getMonth(), 1));
  const monthEnd = toISODate(new Date(now.getFullYear(), now.getMonth() + 1, 0));

  await db.withTransactionAsync(async () => {
    const ds = await db.runAsync(
      'INSERT INTO subjects (name, teacher, units, color) VALUES (?, ?, ?, ?)',
      'Data Structures', 'Prof. Reyes', 3, '#C49A2A'
    );
    const calc = await db.runAsync(
      'INSERT INTO subjects (name, teacher, units, color) VALUES (?, ?, ?, ?)',
      'Calculus II', 'Prof. Lim', 3, '#4A6FA5'
    );
    const dsId = ds.lastInsertRowId;
    const calcId = calc.lastInsertRowId;

    const classSql =
      'INSERT INTO schedules (subject_id, type, day_of_week, date, start, "end", room) VALUES (?, ?, ?, ?, ?, ?, ?)';
    await db.runAsync(classSql, calcId, 'regular', now.getDay(), null, '08:00', '09:30', 'Room 310');
    await db.runAsync(classSql, dsId, 'regular', now.getDay(), null, '13:00', '14:30', 'Room 204');
    await db.runAsync(classSql, dsId, 'makeup', null, today, '19:00', '20:00', 'Room 204');

    const deadlineSql =
      "INSERT INTO deadlines (subject_id, title, due_date, priority, status) VALUES (?, ?, ?, ?, 'open')";
    await db.runAsync(deadlineSql, dsId, 'Lab 4: Linked lists', `${toISODate(addDays(now, 1))}T23:59`, 'high');
    await db.runAsync(deadlineSql, calcId, 'Problem Set 6', `${toISODate(addDays(now, 2))}T17:00`, 'medium');
    await db.runAsync(deadlineSql, calcId, 'Reflection essay', `${toISODate(addDays(now, -1))}T12:00`, 'low');

    await db.runAsync(
      "INSERT INTO budgets (period_type, start_date, end_date, amount, category) VALUES ('month', ?, ?, 3000, NULL)",
      monthStart, monthEnd
    );
    const expenseSql = "INSERT INTO allowance_entries (amount, type, category, date) VALUES (?, 'expense', ?, ?)";
    await db.runAsync(expenseSql, 1500, 'Food', today);
    await db.runAsync(expenseSql, 780, 'Transport', today);
    await db.runAsync(expenseSql, 300, 'School', today);

    await db.runAsync(
      "INSERT INTO notes (subject_id, title, type, body, review_flag) VALUES (?, ?, 'text', ?, 1)",
      dsId, 'Big-O cheat sheet', 'Binary search runs in O(log n).'
    );
    const deck = await db.runAsync('INSERT INTO decks (subject_id, title) VALUES (?, ?)', dsId, 'Data Structures');
    const cardSql = 'INSERT INTO cards (deck_id, front, back) VALUES (?, ?, ?)';
    await db.runAsync(cardSql, deck.lastInsertRowId, 'Binary search time complexity?', 'O(log n)');
    await db.runAsync(cardSql, deck.lastInsertRowId, 'Stack order?', 'Last in, first out');
    await db.runAsync(cardSql, deck.lastInsertRowId, 'Queue order?', 'First in, first out');
  });
}