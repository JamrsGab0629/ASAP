import type { SQLiteDatabase } from 'expo-sqlite';
import { getAllowanceFor, getLatestPlan, listEntriesIn } from './allowanceQueries';
import { ensureCurrentBudget } from './budgetPlan';
import { periodAt } from './period';
import { buildSummary, type PeriodSummary } from './summary';

/** null = the student hasn't set an allowance yet. offset 0 = this period, -1 = the one before. */
export async function loadPeriodSummary(db: SQLiteDatabase, now: Date, offset: number): Promise<PeriodSummary | null> {
  await ensureCurrentBudget(db, now);
  const plan = await getLatestPlan(db);
  if (!plan) return null;

  const period = periodAt(plan.periodType, now, offset);
  const [allowance, entries] = await Promise.all([
    getAllowanceFor(db, plan.periodType, period.start),
    listEntriesIn(db, period),
  ]);
  return buildSummary({ type: plan.periodType, period, allowance, entries, now, isCurrent: offset === 0 });
}