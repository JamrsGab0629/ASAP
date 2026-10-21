import type { SQLiteDatabase } from 'expo-sqlite';
import { getAllowanceFor, getLatestPlan } from './allowanceQueries';
import { periodAt, type PeriodType } from './period';

async function insertBudget(db: SQLiteDatabase, type: PeriodType, today: Date, amount: number): Promise<void> {
  const { start, end } = periodAt(type, today, 0);
  await db.runAsync(
    `INSERT INTO budgets (period_type, start_date, end_date, amount, category) VALUES (?, ?, ?, ?, NULL)`,
    type, start, end, amount,
  );
}

/** Saves the allowance for the current period. It repeats for later periods. */
export async function setAllowance(db: SQLiteDatabase, type: PeriodType, amount: number, today: Date): Promise<void> {
  const { start } = periodAt(type, today, 0);
  await db.withTransactionAsync(async () => {
    await db.runAsync(`DELETE FROM budgets WHERE category IS NULL AND period_type = ? AND start_date = ?`, type, start);
    await insertBudget(db, type, today, amount);
  });
}

/** Starts the new week or month with the same allowance as before. */
export async function ensureCurrentBudget(db: SQLiteDatabase, today: Date): Promise<void> {
  const plan = await getLatestPlan(db);
  if (!plan) return;
  const { start } = periodAt(plan.periodType, today, 0);
  if ((await getAllowanceFor(db, plan.periodType, start)) !== null) return;
  await insertBudget(db, plan.periodType, today, plan.amount);
}