import type { SQLiteDatabase } from 'expo-sqlite';
import { toPeriodType, type Period, type PeriodType } from './period';
import type { Entry } from './types';

export type Plan = { periodType: PeriodType; amount: number };

/** The most recently saved allowance. Its period type and amount repeat every period. */
export async function getLatestPlan(db: SQLiteDatabase): Promise<Plan | null> {
  const row = await db.getFirstAsync<{ period_type: string; amount: number }>(
    `SELECT period_type, amount FROM budgets WHERE category IS NULL ORDER BY id DESC LIMIT 1`,
  );
  return row ? { periodType: toPeriodType(row.period_type), amount: row.amount } : null;
}

export async function getAllowanceFor(db: SQLiteDatabase, type: PeriodType, startISO: string): Promise<number | null> {
  const row = await db.getFirstAsync<{ amount: number }>(
    `SELECT amount FROM budgets WHERE category IS NULL AND period_type = ? AND start_date = ? ORDER BY id DESC LIMIT 1`,
    type, startISO,
  );
  return row?.amount ?? null;
}

export function listEntriesIn(db: SQLiteDatabase, period: Period): Promise<Entry[]> {
  return db.getAllAsync<Entry>(
    `SELECT id, amount, type, category, substr(date, 1, 10) AS date, note
     FROM allowance_entries
     WHERE substr(date, 1, 10) >= ? AND substr(date, 1, 10) <= ?
     ORDER BY date DESC, id DESC`,
    period.start, period.end,
  );
}